import emailValidator from "deep-email-validator";

export const validateEmail = async (email) => {
	let res = await emailValidator.validate(email);
	console.log(res);
	return res;
};
