import { useState } from "react";
import { useSelector } from "react-redux";
import { useValidateEmailMutation } from "../slices/usersApiSlice.js";
import { toast } from "react-toastify";
import { BigLoader } from "../components/Loader.jsx";

const EmailValidatorPage = () => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [data, setData] = useState(null);

	const { userInfo } = useSelector((state) => state.auth);

	const [validateEmail, { isLoading }] = useValidateEmailMutation();

	const submitHandler = async (e) => {
		e.preventDefault();

		if (!email) {
			setError("Email missing");
			toast.error(error);
			return;
		}

		try {
			const res = await validateEmail({
				email,
				apiKey: userInfo.apiKey,
			}).unwrap();
			console.log(userInfo.apiKey);
			setData(res);
			console.log({ ...res });
			toast.success("Validated email");
		} catch (error) {
			console.error(error);
			toast.error(error?.data?.message || error?.data?.error);
		}
	};
	return (
		<div className="bg-stone-900 text-stone-50 flex-items-center justify-center px-16 fullHeight">
			<h1 className="text-4xl text-center font-semibold">
				Enter an email to check if it exists
			</h1>
			<form
				className="p-4 bg-zinc-950 text-zinc-950 w-1/2 mx-auto rounded-md mt-12"
				onSubmit={submitHandler}
			>
				<div className="flex flex-col items-center justify-center w-full">
					<div className="flex items-center justify-center w-full">
						<input
							type="email"
							id="email"
							name="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setError("");
							}}
							placeholder="Enter email address"
							className={`${
								error ? "border-red-700" : "border border-transparent"
							} bg-zinc-800 rounded-sm rounded-r-none p-2 text-zinc-50 outline-none transition-all duration-100 ease-in-out hover:bg-zinc-700 focus:bg-zinc-700 w-full border border-transparent`}
							disabled={isLoading}
						/>

						<button
							className="rounded-sm rounded-l-none bg-sky-600 text-zinc-50 py-2 px-4 hover:bg-sky-500 active:scale-95 transition-all duration-100 ease-in-out w-1/3 border border-transparent"
							disabled={isLoading}
							onClick={() => setData(null)}
						>
							Validate
						</button>
					</div>
					{error && (
						<p className="text-red-500 text-sm font-semibold text-center mt-3">
							{error}
						</p>
					)}
				</div>
			</form>
			<div className="flex items-center justify-center mt-5">
				{isLoading && <BigLoader />}
				{data && (
					<div className="border grid grid-cols-2 w-1/2 rounded-md">
						{/* Email format */}
						<p className="p-2 font-medium bg-zinc-50 text-zinc-950 text-center">
							Email Format
						</p>
						<p className="border-b p-2 text-center bg-zinc-850 text-zinc-50">
							{data.emailFormatValid ? "True" : "False"}
						</p>
						{/* Existing inbox */}
						<p className="p-2 font-medium bg-zinc-50 text-zinc-950 text-center">
							Existing inbox
						</p>
						<p className="border-b  p-2 text-center bg-zinc-850 text-zinc-50">
							{data.inboxExists ? "True" : "False"}
						</p>
						{/* MX Records */}
						<p className="p-2 font-medium bg-zinc-50 text-zinc-950 text-center">
							MX Records Found
						</p>
						<p className="border-b  p-2 text-center bg-zinc-850 text-zinc-50">
							{data.mxRecordsFound ? "True" : "False"}
						</p>
						{/* SMTP Connection */}
						<p className="p-2 font-medium bg-zinc-50 text-zinc-950 text-center">
							SMTP Connection
						</p>
						<p className="border-b  p-2 text-center bg-zinc-850 text-zinc-50">
							{data.smtpConnectionSucceeded ? "True" : "False"}
						</p>
						{/* Valid email */}
						<p
							className={`${
								data.isValid ? "text-green-500" : "text-red-500"
							} text-center p-2 flex items-center`}
						>
							{data.isValid ? "This email is valid" : "This email is invalid"}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default EmailValidatorPage;
