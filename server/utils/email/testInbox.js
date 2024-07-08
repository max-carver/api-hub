import net from "net";
import { resolveMxRecords } from "./resolveMxRecords";

export const testInbox = async (smtpHostname, emailInbox) => {
	return new Promise((resolve, reject) => {
		const result = {
			connectionSucceeded: false,
			inboxExists: false,
		};

		console.log(`Attempting to connect to SMTP server: ${smtpHostname}`);
		
		let ip;
		try {
				ip = await resolveDns(smtpHostname);
		} catch (err) {
				console.error(`DNS resolution failed for ${smtpHostname}:`, err);
				resolve({ ...result, error: "DNS resolution failed" });
				return;
		}
		
		const socket = net.createConnection({
			port: 587,
			host: ip,
			family: 4,
		});
		let currentStageName = "CHECK_CONNECTION_ESTABLISHED";

		const timeout = setTimeout(() => {
			socket.destroy();
			resolve({ ...result, error: "Operation timed out" });
		}, 60000);

		socket.on("connect", () => {
			console.log("Connected to:", smtpHostname);
			result.connectionSucceeded = true;
		});

		socket.on("data", (data) => {
			clearTimeout(timeout);
			const response = data.toString("utf-8");
			console.log("Received:", response);

			switch (currentStageName) {
				case "CHECK_CONNECTION_ESTABLISHED": {
					const command = `EHLO mail.example.org\r\n`;
					socket.write(command);
					currentStageName = "SEND_EHLO";
					break;
				}
				case "SEND_EHLO": {
					const command = `MAIL FROM:<name@example.org>\r\n`;
					socket.write(command);
					currentStageName = "SEND_MAIL_FROM";
					break;
				}
				case "SEND_MAIL_FROM": {
					const command = `RCPT TO:<${emailInbox}>\r\n`;
					socket.write(command);
					currentStageName = "SEND_RECIPIENT_TO";
					break;
				}
				case "SEND_RECIPIENT_TO": {
					if (response.startsWith("250")) {
						result.inboxExists = true;
					} else if (response.includes("550") || response.includes("5.1.1")) {
						result.inboxExists = false;
					}
					const command = `QUIT\r\n`;
					socket.write(command);
					socket.end();
					resolve(result);
					break;
				}
			}
		});

		socket.on("error", (err) => {
			console.error("Socket error:", err);
			clearTimeout(timeout);
			resolve({ ...result, error: err.message });
			return;
		});

		socket.on("close", () => {
			clearTimeout(timeout);
			resolve(result);
		});
	});
};
