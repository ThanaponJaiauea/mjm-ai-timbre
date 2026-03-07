"use client";

export default function Model_popUp({ PriceData, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#1A1A1A] border border-white/10 w-full max-w-md rounded-[30px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-semibold text-white mb-2">Confirm Subscription</h2>
        <p className="text-[#8F8F8F] text-sm mb-6">
          You are about to subscribe to the <span className="text-white font-medium">{PriceData.name}</span>.
        </p>

        <div className="bg-[#242327] rounded-2xl p-4 mb-8 flex justify-between items-center">
          <span className="text-[#8F8F8F]">Total amount:</span>
          <span className="text-xl font-bold text-white">{PriceData.price} THB</span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full cursor-pointer py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full font-medium transition-all active:scale-95"
          >
            Confirm and Pay
          </button>

          <button
            onClick={onClose}
            className="w-full cursor-pointer py-3 text-[#8F8F8F] hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
