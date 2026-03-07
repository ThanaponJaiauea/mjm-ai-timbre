"use client";

import { useState } from "react";

export default function Box_transaction_history({ data }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="md:col-span-6 bg-[#242327] border border-white/5 rounded-[30px] p-8 flex flex-col">
      <h3 className="text-lg mb-6">Transaction History</h3>

      {data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#8F8F8F] text-sm border-b border-white/5">
                <th className="pb-4 font-normal">Date Time</th>
                <th className="pb-4 font-normal">Subscription</th>
                <th className="pb-4 font-normal">Amount</th>
                <th className="pb-4 font-normal">Status</th>
                <th className="pb-4 font-normal text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.map(item => (
                <tr key={item.id} className="border-b border-white/5 last:border-none">
                  <td className="py-4 text-white/80">{new Date(item.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="py-4 text-white/80">{item.subscription} Plans</td>
                  <td className="py-4 text-white/80">{item.amount}</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "APPROVED"
                          ? "text-green-400"
                          : item.status === "PENDING"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <button
                      onClick={() => setSelectedImage(item.slipImage)}
                      className="text-[#8F8F8F] hover:text-white transition-colors cursor-pointer"
                    >
                      📎
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-50">
          <div className="w-32 h-32 bg-gradient-to-b from-white/10 to-transparent rounded-full mb-4 blur-xl" />
          <p className="text-white font-medium">No Transaction Data</p>
          <p className="text-[#8F8F8F] text-xs mt-1 text-center">
            There are currently no transaction records available.
          </p>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-lg w-full bg-[#1A1A1A] p-4 rounded-2xl max-h-[80vh] flex flex-col">
            <button
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold z-10 hover:scale-110 transition-transform"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            <div className="overflow-y-auto">
              <img src={selectedImage} alt="Payment Slip" className="w-full h-auto rounded-lg object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
