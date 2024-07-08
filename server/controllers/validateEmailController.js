import User from "../models/UserModel.js";
import { resolveMxRecords } from "../utils/email/resolveMxRecords.js";
import { testInbox } from "../utils/email/testInbox.js";
import { verifyEmailFormat } from "../utils/email/verifyEmailFormat.js";

const checkApiKey = async (apiKey) => {
	try {
		const user = await User.findOne({ apiKey });
		return user !== null;
	} catch (err) {
		console.error("Error checking API Key", err);
		return false;
	}
};

const validateEmailController = async (req, res) => {
	try {
		const { email } = req.body;
		const apiKey = req.headers.apikey;

		if (!apiKey) {
			return res.status(401).json({ error: "API key is required" });
		}
		if (!email) {
			return res.status(400).json({ error: "Email is required" });
		}

		const validApiKey = await checkApiKey(apiKey);
		if (!validApiKey) {
			return res.status(401).json({ error: "Invalid API Key" });
		}

		const emailFormatIsValid = verifyEmailFormat(email);
		if (!emailFormatIsValid) {
			return res.status(400).json({ error: "Email format is invalid" });
		}

		const [, domain] = email.split("@");

		const mxRecords = await resolveMxRecords(domain);
		if (!mxRecords || mxRecords.length === 0) {
			return res.status(400).json({ error: "No MX records found for domain" });
		}

		const sortedMxRecords = mxRecords.sort((a, b) => a.priority - b.priority);

		let smtpResult = { connectionSucceeded: false, inboxExists: false };
		let hostIndex = 0;
		let maxAttempts = 5;
		let attempt = 0;

		while (hostIndex < sortedMxRecords.length && attempt < maxAttempts) {
			try {
				smtpResult = await testInbox(
					sortedMxRecords[hostIndex].exchange,
					email
				);

				if (smtpResult.error) {
					console.error(`Attempt ${attempt + 1} failed:`, smtpResult.error);
					hostIndex++;
					attempt++;
				} else if (smtpResult.connectionSucceeded) {
					break;
				}
			} catch (err) {
				console.error(`Attempt ${attempt + 1} failed:`, err);
				hostIndex++;
				attempt++;
			}
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		let valid = smtpResult.inboxExists ? true : false;

		return res.json({
			email,
			emailFormatValid: emailFormatIsValid,
			mxRecordsFound: true,
			smtpConnectionSucceeded: smtpResult.connectionSucceeded,
			inboxExists: smtpResult.inboxExists,
			isValid: valid,
			Error: smtpResult.error || null,
		});
	} catch (error) {
		console.error("Validation failed:", error);
		return res
			.status(500)
			.json({ error: "Validation failed", message: error.message });
	}
};

export default validateEmailController;
