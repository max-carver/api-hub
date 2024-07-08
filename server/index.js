import express from "express";
import connectToDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import apiRoutes from "./routes/apiRoutes.js";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5000;

connectToDB();

app.use(express.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(cookieParser());
app.use(
	cors({
		origin: "https://pex-api-hub.onrender.com",
		credentials: true,
	})
);
// Routes
app.use("/api", userRoutes);
app.use("/api", apiRoutes);

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
