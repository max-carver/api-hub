import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { Loader } from "../components/Loader";
import { AiFillCopy } from "react-icons/ai";
import ConfirmationDialog from "../components/ConfirmationDialog";

const ProfilePage = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [apiKey, setApiKey] = useState("");
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const dispatch = useDispatch();

	const { userInfo } = useSelector((state) => state.auth);

	const [updateProfile, { isLoading }] = useUpdateUserMutation();

	const regenerateApiKey = async () => {
		try {
			const res = await updateProfile({ regenerateApiKey: true }).unwrap();
			dispatch(setCredentials({ ...res }));
			setApiKey(res.apiKey);
			toast.success("New API Key generated");
			setShowConfirmDialog(false);
		} catch (err) {
			toast.error(err?.data?.error || err.error);
		}
	};

	useEffect(() => {
		setUsername(userInfo.username);
		setEmail(userInfo.email);
		setApiKey(userInfo.apiKey);
	}, [userInfo]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
		} else {
			try {
				const res = await updateProfile({
					id: userInfo.id,
					username,
					email,
					password,
				}).unwrap();
				dispatch(setCredentials({ ...res }));
				toast.success("Profile updated");
			} catch (err) {
				toast.error(err.data.error);
			}
		}
	};

	return (
		<div className="bg-stone-900 text-stone-50 flex-items-center justify-center px-16 fullHeight ">
			<form
				className="bg-stone-800 p-8 flex flex-col rounded-lg border-stone-950 shadow-lg w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto gap-5 text-stone-50 "
				onSubmit={handleSubmit}
			>
				<div className="flex flex-col items-center gap-1">
					<h2 className="text-3xl font-bold">Update profile</h2>
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
							disabled={isLoading}
						/>
					</div>
					{/* Display API Key */}
					<div className="flex flex-col gap-0.5 mt-4">
						<div className="flex items-center justify-between gap-2">
							<p>API Key</p>
							<p
								className="text-sky-300 text-xs cursor-pointer"
								onClick={() => {
									setShowConfirmDialog(true);
								}}
							>
								Regenerate key
							</p>
						</div>
						<div className="flex items-center gap-2 w-full">
							<input
								type="text"
								value={apiKey}
								readOnly
								className="rounded-lg p-2 pr-4 outline-none bg-stone-700 border border-transparent w-full"
							/>
							<AiFillCopy
								size={30}
								className="cursor-pointer text-zinc-400"
								onClick={() => {
									navigator.clipboard.writeText(apiKey).then(() => {
										toast.success("API Key copied to clipboard");
									});
								}}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center gap-0.5">
					{isLoading && <Loader />}

					<button
						type="submit"
						className="bg-stone-900 text-stone-50 p-2 rounded-lg hover:bg-stone-950 transition-all duration-300 ease-in-out active:scale-95 mt-4 w-full"
					>
						Update
					</button>
				</div>
			</form>
			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onClose={() => setShowConfirmDialog(false)}
				onConfirm={regenerateApiKey}
				title="Warning"
				message="Regenerating your API key may cause other third-party services to stop working. Are you sure you want to proceed?"
			/>
		</div>
	);
};

export default ProfilePage;
