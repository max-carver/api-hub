import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import apiRoutes from "./routes/apiRoutes.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectToDB();

app.use(express.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./APIDocumentation"));
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
// Routes
app.use("/", userRoutes);
app.use("/api", apiRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
