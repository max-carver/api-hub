import User from "../models/UserModel.js";
import generateApiKey from "../utils/generateApiKey.js";
import generateToken from "../utils/generateToken.js";

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Missing field(s)" });
		}
		const user = await User.findOne({ email });

		if (user && (await user.matchPassword(password))) {
			generateToken(res, user._id);
			return res.status(201).json({
				id: user._id,
				username: user.username,
				email: user.email,
				apiKey: user.apiKey,
			});
		} else {
			res.status(401).json({ error: "Invalid credentials" });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const registerUser = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		if (!username || !email || !password) {
			return res.status(400).json({ error: "Missing field(s)" });
		}

		const existingUser = await User.findOne({ $or: [{ email }, { username }] });

		if (existingUser) {
			if (existingUser.email === email) {
				return res.status(400).json({ error: "Email already in use" });
			}
			if (existingUser.username === username) {
				return res.status(400).json({ error: "Username already in use" });
			}
		}

		const apiKey = generateApiKey();
		const user = await User.create({ username, email, password, apiKey });

		if (user) {
			generateToken(res, user.id);
			return res.status(201).json({
				id: user._id,
				username: user.username,
				email: user.email,
				apiKey: user.apiKey,
			});
		} else {
			return res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logoutUser = async (req, res) => {
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
	});

	res.status(200).json({ message: "User logged out" });
};

export const getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (user) {
			res.status(200).json({
				id: user.id,
				username: user.username,
				email: user.email,
				apiKey: user.apiKey,
			});
		} else {
			res.status(404).json({ error: "User not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		if (user) {
			user.username = req.body.username || user.username;
			user.email = req.body.email || user.email;

			if (req.body.password) {
				user.password = req.body.password;
			}

			if (req.body.regenerateApiKey) {
				user.apiKey = generateApiKey();
			}

			const updatedUser = await user.save();
			res.status(200).json({
				id: updatedUser.id,
				username: updatedUser.username,
				email: updatedUser.email,
				apiKey: updatedUser.apiKey,
			});
		} else {
			res.status(404).json({ error: "User not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
