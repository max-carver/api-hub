import { promises } from "dns";
import { promisify } from "util";

const dnsResolve = promisify(dns.resolve);

export const resolveMxRecords = async (hostname) => {
	try {
		const addresses = await dnsResolve(hostname);
		return addresses[0];
	} catch (err) {
		console.error(err);
		throw new Error(`DNS resolution failed for ${hostname}: ${err.message}`);
	}
};
