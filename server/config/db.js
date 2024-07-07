import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`Successfully connected to MongoDB: ${conn.connection.host}`);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
	}
};

export default connectToDB;
