import { validate } from "deep-email-validator";

export const validEmail = async (email) => {
	const response = await validate(email);
	return response;
};
