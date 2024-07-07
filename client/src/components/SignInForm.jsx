import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { Loader } from "./Loader";

const SignInForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [login, { isLoading }] = useLoginMutation();

	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		if (userInfo) {
			navigate("/");
		}
	}, [navigate, userInfo]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await login({ email, password }).unwrap();
			dispatch(setCredentials({ ...res }));
			navigate("/");
		} catch (err) {
			toast.error(err?.data?.error);
		}
	};
	return (
		<form
			className="bg-stone-800 p-8 flex flex-col rounded-lg border-stone-950 shadow-lg w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto gap-5 text-stone-50 "
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col items-center gap-1">
				<h2 className="text-3xl font-bold">Login</h2>
				<p className="text-stone-400 font-lg text-center">
					Welcome back. Sign in with your details
				</p>
			</div>

			<div className="flex flex-col gap-2">
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
			</div>

			<div className="flex flex-col items-center gap-0.5">
				{isLoading && <Loader />}

				<button
					type="submit"
					className="bg-stone-900 text-stone-50 p-2 rounded-lg hover:bg-stone-950 transition-all duration-300 ease-in-out active:scale-95 mt-4 w-full"
					disabled={isLoading}
				>
					{isLoading ? "Loading..." : "Login"}
				</button>

				<p className="text-sm text-stone-500 text-center mt-2">
					Don't have an account?{" "}
					<NavLink to="/sign-up" className="font-semibold underline">
						Create one
					</NavLink>
				</p>
			</div>
		</form>
	);
};

export default SignInForm;
