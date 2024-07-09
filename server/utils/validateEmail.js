import emailValidator from "deep-email-validator";

export const validateEmail = async (email) => {
	try {
		const res = await emailValidator.validate(email);
		const results = {};

		for (let validator in res.validators) {
			results[validator] = res.validators[validator].valid;
		}

		return results;
	} catch (error) {
		console.error("Email validation error:", error);
		throw error;
	}
};
