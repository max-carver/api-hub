import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { Loader } from "./Loader";

const SignInForm = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [register, { isLoading }] = useRegisterMutation();

	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		if (userInfo) {
			navigate("/");
		}
	}, [navigate, userInfo]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
		} else {
			try {
				const res = await register({ username, email, password }).unwrap();
				dispatch(setCredentials({ ...res }));
				navigate("/");
			} catch (err) {
				toast.error(err?.data?.error);
			}
		}
	};
	return (
		<form
			className="bg-stone-800 p-8 flex flex-col rounded-lg border-stone-950 shadow-lg w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto gap-5 text-stone-50 "
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col items-center gap-1">
				<h2 className="text-3xl font-bold">Register</h2>
				<p className="text-stone-400 font-lg text-center">
					Create a new account
				</p>
			</div>
			<div className="flex flex-col gap-2">
				{/* Name */}
				<div className="flex flex-col gap-0.5">
					<label htmlFor="username" className="font-semibold">
						Name
					</label>
					<input
						type="text"
						id="username"
						name="username"
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						placeholder="Enter your name"
						className="rounded-lg p-2 outline-none bg-stone-700 border border-transparent transition-all duration-300 ease-in-out hover:bg-stone-500 focus:ring-1 focus:ring-stone-300"
						required
						disabled={isLoading}
					/>
				</div>

				{/* Email address */}
				<div className="flex flex-col gap-0.5">
					<label htmlFor="email" className="font-semibold">
						Email address
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						placeholder="Enter your email address"
						className="rounded-lg p-2 outline-none bg-stone-700 border border-transparent transition-all duration-300 ease-in-out hover:bg-stone-500 focus:ring-1 focus:ring-stone-300"
						required
						disabled={isLoading}
					/>
				</div>

				{/* Password */}
				<div className="flex flex-col gap-0.5">
					<label htmlFor="password" className="font-semibold">
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						placeholder="Enter your password"
						className="rounded-lg p-2 outline-none bg-stone-700 border border-transparent transition-all duration-300 ease-in-out hover:bg-stone-500 focus:ring-1 focus:ring-stone-300"
						required
						disabled={isLoading}
					/>
				</div>

				{/* Confirm Password */}
				<div className="flex flex-col gap-0.5">
					<label htmlFor="confirmPassword" className="font-semibold">
						Confirm password
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						value={confirmPassword}
						onChange={(e) => {
							setConfirmPassword(e.target.value);
						}}
						placeholder="Confirm your password"
						className="rounded-lg p-2 outline-none bg-stone-700 border border-transparent transition-all duration-300 ease-in-out hover:bg-stone-500 focus:ring-1 focus:ring-stone-300"
						required
						disabled={isLoading}
					/>
				</div>
			</div>
			<div className="flex flex-col items-center gap-0.5">
				{isLoading && <Loader />}

				<button
					type="submit"
					className="bg-stone-900 text-stone-50 p-2 rounded-lg hover:bg-stone-950 transition-all duration-300 ease-in-out active:scale-95 mt-4 w-full"
					disabled={isLoading}
				>
					{isLoading ? "Loading..." : "Register"}
				</button>

				<p className="text-sm text-stone-500 text-center mt-2">
					Already have an account?{" "}
					<NavLink to="/sign-in" className="font-semibold underline">
						Login
					</NavLink>
				</p>
			</div>
		</form>
	);
};

export default SignInForm;
