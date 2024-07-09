import User from "../models/UserModel.js";
import { resolveMxRecords } from "../utils/email/resolveMxRecords.js";
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

		return res.json({
			email,
			emailFormatValid: emailFormatIsValid,
			mxRecordsFound: true,
		});
	} catch (error) {
		console.error("Validation failed:", error);
		return res
			.status(500)
			.json({ error: "Validation failed", message: error.message });
	}
};

export default validateEmailController;
