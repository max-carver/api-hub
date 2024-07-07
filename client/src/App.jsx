import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import store from "./util/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import ProtectRoute from "./components/ProtectRoute";
import EmailValidatorPage from "./pages/EmailValidatorPage";

function App() {
	return (
		<Provider store={store}>
			<Router>
				<Navbar />
				<ToastContainer />
				<Routes>
					<Route index={true} path="/" element={<HomePage />} />
					{/* Protected Routes */}
					<Route path="" element={<ProtectRoute />}>
						<Route path="/profile" element={<ProfilePage />} />
						<Route path="/email-validator" element={<EmailValidatorPage />} />
					</Route>
					<Route path="/sign-in" element={<SignInPage />} />
					<Route path="/sign-up" element={<SignUpPage />} />
				</Routes>
			</Router>
		</Provider>
	);
}

export default App;
