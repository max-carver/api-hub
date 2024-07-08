import net from "net";

export const testInbox = async (smtpHostname, emailInbox) => {
	return new Promise((resolve, reject) => {
		const result = {
			connectionSucceeded: false,
			inboxExists: false,
		};

		const socket = net.createConnection({
			port: 25,
			host: smtpHostname,
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
				case "STARTTLS": {
					// Upgrade to TLS
					const tlsSocket = tls.connect({
						socket: socket,
						host: smtpHostname,
					});
					socket = tlsSocket;
					const command = `EHLO mail.example.org\r\n`;
					socket.write(command);
					currentStageName = "SEND_EHLO_AFTER_STARTTLS";
					break;
				}
				case "SEND_EHLO_AFTER_STARTTLS": {
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
