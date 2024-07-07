import React from "react";

const Loader = () => {
	return (
		<div
			className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-sky-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-center flex justify-center"
			role="status"
		></div>
	);
};

const BigLoader = () => {
	return (
		<div
			className="h-24 w-24 animate-spin rounded-full border-8 border-solid border-sky-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-center flex justify-center"
			role="status"
		></div>
	);
};

export { Loader, BigLoader };
