import User from "../models/UserModel.js";
import { resolveMxRecords } from "../utils/email/resolveMxRecords.js";
import { testInbox } from "../utils/email/testInbox.js";
import { verifyEmailFormat } from "../utils/email/verifyEmailFormat.js";

const apiKeyCache = new Map();
const mxRecordCache = new Map();

const checkApiKey = async (apiKey) => {
	if (apiKeyCache.has(apiKey)) return apiKeyCache.get(apiKey);

	try {
		const user = await User.findOne({ apiKey });
		const isValid = user !== null;
		apiKeyCache.set(apiKey, isValid);
		return isValid;
	} catch (err) {
		console.error("Error checking API Key", err);
		return false;
	}
};

const validateEmailController = async (req, res) => {
	const startTime = Date.now();
	const TIMEOUT = 30000; // 30 seconds timeout

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

		// const [, domain] = email.split("@");

		// let mxRecords;
		// if (mxRecordCache.has(domain)) {
		// 	mxRecords = mxRecordCache.get(domain);
		// } else {
		// 	mxRecords = await resolveMxRecords(domain);
		// 	if (mxRecords && mxRecords.length > 0) {
		// 		mxRecordCache.set(domain, mxRecords);
		// 	}
		// }

		// if (!mxRecords || mxRecords.length === 0) {
		// 	return res.status(400).json({ error: "No MX records found for domain" });
		// }

		// const sortedMxRecords = mxRecords.sort((a, b) => a.priority - b.priority);

		// const testResults = await Promise.allSettled(
		// 	sortedMxRecords
		// 		.slice(0, 3)
		// 		.map((record) => testInbox(record.exchange, email))
		// );

		// const successfulResult = testResults.find(
		// 	(result) =>
		// 		result.status === "fulfilled" && result.value.connectionSucceeded
		// );

		// const smtpResult = successfulResult
		// 	? successfulResult.value
		// 	: { connectionSucceeded: false, inboxExists: false };

		// if (Date.now() - startTime > TIMEOUT) {
		// 	throw new Error("Request timed out");
		// }

		// return res.json({
		// 	email,
		// 	emailFormatValid: emailFormatIsValid,
		// 	mxRecordsFound: true,
		// 	smtpConnectionSucceeded: smtpResult.connectionSucceeded,
		// 	inboxExists: smtpResult.inboxExists,
		// 	isValid: smtpResult.inboxExists,
		// 	error: smtpResult.error || null,
		// });
		if (verifyEmailFormat()) {
			res.status(200).json({ success: "Email is valid" });
		}
	} catch (error) {
		console.error("Validation failed:", error);
		return res
			.status(500)
			.json({ error: "Validation failed", message: error.message });
	}
};

export default validateEmailController;
