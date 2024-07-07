import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const protectRoute = async (req, res, next) => {
	let token;

	token = req.cookies.jwt;
	if (token) {
		try {
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decodedToken.userId).select("-password");
			next();
		} catch (error) {
			res.status(401).json({ error: "Unauthorized, invalid token" });
		}
	} else {
		res.status(401).json({ error: "Unauthorized, no token" });
	}
};
