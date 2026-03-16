"use client";

import { useState, useRef } from "react";
import { createPayment } from "../../api/payment";
import {
  icon_upload,
  icon_file_image,
  icon_remove,
} from "../../../public/index";
import Image from "next/image";

// ── compress รูปให้ < 1MB ก่อน upload ──
const compressImage = (file, maxSizeKB = 900) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");

        // ย่อขนาดถ้ารูปใหญ่เกิน 1920px
        const MAX_DIM = 1920;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);

        // ลด quality จนขนาด < maxSizeKB
        let quality = 0.85;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (blob.size <= maxSizeKB * 1024 || quality <= 0.1) {
                const compressed = new File(
                  [blob],
                  file.name.replace(/\.[^.]+$/, ".jpg"),
                  {
                    type: "image/jpeg",
                  },
                );
                resolve(compressed);
              } else {
                quality = Math.max(0.1, quality - 0.1);
                tryCompress();
              }
            },
            "image/jpeg",
            quality,
          );
        };

        tryCompress();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export default function PaymentMethodDetail({
  price,
  onBack,
  subscriptionPlan,
  onSuccess, 
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("กรุณาอัปโหลดเฉพาะไฟล์รูปภาพ (PNG, JPG, WEBP) เท่านั้นครับ");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // ── compress ก่อน upload ──
      const compressed = await compressImage(file);

      const formData = new FormData();
      formData.append("image", compressed);
      formData.append("price", String(price).replace(/,/g, ""));
      formData.append("subscriptionPlan", subscriptionPlan);

      const data = await createPayment(formData);
      console.log("Success:", data);

      setFile(null);
      onSuccess?.();
      onBack();
    } catch (err) {
      console.error(
        "Error submitting payment:",
        err.response?.data || err.message,
      );
      alert("Failed to submit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !file || loading;

  return (
    <div className="bg-[#242327] border border-white/5 rounded-[30px] p-8">
      <button
        onClick={onBack}
        className="text-[#8F8F8F] text-sm mb-4 hover:text-white"
      >
        ← Back to plans
      </button>

      <h3 className="text-lg font-medium text-white">Payment Method</h3>

      <p className="text-sm text-[#8F8F8F] mt-2">
        Please transfer the total amount of{" "}
        <span className="text-purple-400 font-bold text-lg">{price}</span> THB
        to the company bank account below. After payment, upload your payment
        slip for verification. Activation may take 1-24 hours after approval.
      </p>

      <div className="mt-6 space-y-2 bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
        <p className="text-sm">
          <span className="text-[#8F8F8F]">Company Name:</span> Yojoies
          Technology Co.,Ltd.
        </p>
        <p className="text-sm">
          <span className="text-[#8F8F8F]">Bank Name:</span> SCB
        </p>
        <p className="text-sm">
          <span className="text-[#8F8F8F]">Account Name:</span> Yojoies
          Technology Co.,Ltd.
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
      />

      <div
        onClick={() => !loading && fileInputRef.current.click()}
        className={`mt-6 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors
          ${file ? "border-purple-500" : "border-white/10 hover:border-purple-500/50"}
          ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        {file ? (
          <div className="w-full flex items-center justify-around">
            <div className="flex items-center gap-4 w-full">
              <Image
                src={icon_file_image}
                width={26}
                height={26}
                alt="file icon"
              />
              <p className="text-purple-400 text-sm font-medium truncate max-w-[300px]">
                Payment Slip: {file.name}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                fileInputRef.current.value = "";
              }}
              className="w-[10%] flex items-center justify-end cursor-pointer"
            >
              <Image
                src={icon_remove}
                width={18}
                height={18}
                alt="remove icon"
              />
            </button>
          </div>
        ) : (
          <>
            <Image src={icon_upload} width={30} height={30} alt="upload icon" />
            <p className="text-[#8F8F8F] text-sm mt-1">
              Upload your payment slip
            </p>
            <p className="text-[10px] text-[#555] mt-1">
              Compatible file types: JPG, PNG, WEBP
            </p>
          </>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className={`w-full mt-6 py-3 rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-2
          ${isSubmitDisabled ? "bg-gray-600/50 text-gray-400 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"}`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
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
