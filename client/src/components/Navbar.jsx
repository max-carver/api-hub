import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useState } from "react";

import { useLogoutMutation } from "../slices/usersApiSlice";
import { clearCredentials } from "../slices/authSlice";

const Navbar = () => {
	const [profileMenu, setProfileMenu] = useState(false);
	const { userInfo } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [clearCredentialsApiCall] = useLogoutMutation();

	const logoutHandler = async () => {
		try {
			await clearCredentialsApiCall().unwrap();
			dispatch(clearCredentials());
			navigate("/");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<nav className="bg-stone-900 text-stone-50 flex items-center justify-between px-16 h-20">
			<NavLink to="/" className="font-bold text-3xl">
				PEX API
			</NavLink>

			<div className="flex items-center gap-2">
				<NavLink
					to="/email-validator"
					className={({ isActive }) =>
						`${
							isActive
								? "underline text-zinc-400"
								: "text-zinc-50 transition-all duration-200 ease-in-out hover:text-zinc-400"
						} `
					}
				>
					Email validation
				</NavLink>
			</div>

			<div className="flex items-center gap-6">
				{userInfo ? (
					<>
						<div
							className="cursor-pointer relative"
							onClick={() => setProfileMenu((prev) => !prev)}
						>
							<div className="flex items-center gap-0.5">
								<p>{userInfo.username}</p>
								<MdOutlineArrowDropDown
									size={26}
									className={`${
										profileMenu ? "rotate-180" : "rotate-0"
									} transition-all duration-300 ease-in-out`}
								/>
							</div>
							{profileMenu && (
								<div className="absolute top-8 bg-zinc-100 w-[8em] -left-8 rounded-sm text-zinc-950 flex flex-col items-center">
									<NavLink
										to="/profile"
										className="py-2 hover:bg-zinc-300 w-full text-center transition-all duration-100 ease-in-out"
									>
										Profile
									</NavLink>
									<button
										className="py-2 hover:bg-zinc-300 w-full text-center transition-all duration-100 ease-in-out"
										onClick={() => {
											logoutHandler();
										}}
									>
										Logout
									</button>
								</div>
							)}
						</div>
					</>
				) : (
					<>
						<NavLink
							to="/sign-in"
							className="font-semibold hover:text-sky-500 transition-all duration-300 ease-in-out"
						>
							Login
						</NavLink>
						<NavLink
							to="/sign-up"
							className="font-semibold bg-sky-500 hover:text-stone-950 py-1 px-6 hover: rounded-full transition-all duration-300 ease-in-out"
						>
							Register
						</NavLink>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
