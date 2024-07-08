import { promises } from "dns";

export const resolveMxRecords = async (domain) => {
	try {
		return await promises.resolveMx(domain);
	} catch (err) {
		console.error(err);
		return [];
	}
};
