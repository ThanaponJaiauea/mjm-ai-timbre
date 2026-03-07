"use client";

import { useState, useRef } from "react";
import { createPayment } from "../../api/createPayment";

export default function PaymentMethodDetail({ price, onBack, subscription, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload your payment slip first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("price", String(price).replace(/,/g, ""));
    formData.append("subscription", subscription);

    try {
      const data = await createPayment(formData);
      console.log("Success:", data);

      if (onSuccess) {
        onSuccess();
      }

      setFile(null);
      onBack();
    } catch (err) {
      console.error("Error submitting payment:", err.response?.data || err.message);
      alert("Failed to submit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#242327] border border-white/5 rounded-[30px] p-8">
      <button onClick={onBack} className="text-[#8F8F8F] text-sm mb-4 hover:text-white">
        ← Back to plans
      </button>

      <h3 className="text-lg font-medium text-white">Payment Method</h3>

      <p className="text-sm text-[#8F8F8F] mt-2">
        Please transfer the total amount of <span className="text-purple-400 font-bold text-lg">{price}</span> THB to
        the company bank account below. After payment, upload your payment slip for verification. Activation may take
        1-24 hours after approval.
      </p>

      <div className="mt-6 space-y-2 bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
        <p className="text-sm">
          <span className="text-[#8F8F8F]">Company Name:</span> Yojoies Technology Co.,Ltd.
        </p>
        <p className="text-sm">
          <span className="text-[#8F8F8F]">Bank Name:</span> SCB
        </p>
        <p className="text-sm">
          <span className="text-[#8F8F8F]">Account Name:</span> Yojoies Technology Co.,Ltd.
        </p>
        <p className="text-sm">
          <span className="text-[#8F8F8F]">Account Number:</span> 1234567890
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />

      {/* Upload Area */}
      <div
        onClick={() => !loading && fileInputRef.current.click()}
        className={`mt-6 border-2 border-dashed ${file ? "border-purple-500" : "border-white/10"} rounded-2xl p-8 flex flex-col items-center justify-center hover:border-purple-500/50 transition-colors ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        {file ? (
          <div className="text-center">
            <p className="text-purple-400 text-sm font-medium truncate max-w-[200px]">{file.name}</p>
            <p className="text-[10px] text-[#8F8F8F] mt-1">Click to change file</p>
          </div>
        ) : (
          <>
            <p className="text-[#8F8F8F] text-sm">Upload your payment slip</p>
            <p className="text-[10px] text-[#555] mt-1">Compatible file types: JPG, PNG</p>
          </>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full mt-6 py-3 rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
          loading ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"
        }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
}
