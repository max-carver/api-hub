import User from "../models/UserModel.js";
import { validateEmail } from "../utils/validateEmail.js";

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
		const response = await validateEmail(email);
		return res.json({
			...response,
		});
	} catch (error) {
		console.error("Validation failed:", error);
		return res
			.status(500)
			.json({ error: "Validation failed", message: error.message });
	}
};

export default validateEmailController;
