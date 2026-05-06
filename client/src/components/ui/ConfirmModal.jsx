const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="card max-w-sm w-full animate-scale-in">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-100 mb-2">
          Confirm Action
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-outline flex-1 py-2">
          Cancel
        </button>
        <button onClick={onConfirm} className="btn-danger flex-1 py-2">
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
