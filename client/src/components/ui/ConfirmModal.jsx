const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
    <div className="card max-w-sm w-full mx-4 animate-scale-in">
      <h3 className="text-lg font-semibold text-gray-100 mb-2">
        Confirm Action
      </h3>
      <p className="text-gray-400 mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-outline flex-1">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 active:scale-95"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
