const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-stone-800 p-6 rounded-lg max-w-sm">
				<h3 className="text-xl font-bold mb-4">{title}</h3>
				<p className="mb-4">{message}</p>
				<div className="flex justify-end space-x-4">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-stone-700 rounded hover:bg-stone-600"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationDialog;
