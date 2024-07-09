import EmailValidator from "email-deep-validator";

const emailValidator = new EmailValidator();

export const validEmail = async (email) => {
	const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(
		email
	);
	return {
		wellFormed,
		validDomain,
		validMailbox,
	};
};
