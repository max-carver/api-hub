import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const connectToDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`Successfully connected to MongoDB: ${conn.connection.host}`);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
	}
};

export default connectToDB;
