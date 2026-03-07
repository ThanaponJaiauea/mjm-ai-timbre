"use client";

const data = [
  { label: "Plan Name:", value: "No data" },
  { label: "Status:", value: "No data" },
  { label: "Active Billing Date:", value: "Date - Month - Year" },
  { label: "Next Billing Date:", value: "Date - Month - Year" },
  { label: "Price per month / year :", value: "No data" },
];

export default function Box_current_subscription() {
  return (
    <div className="bg-[#242327] border border-white/5 rounded-[30px] p-8">
      <h3 className="text-lg mb-6 text-white font-medium">Current Subscription</h3>

      <div className="space-y-4">
        {data?.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
            <label className="text-[#8F8F8F] text-sm w-full sm:w-48 shrink-0">{item.label}</label>

            <input
              type="text"
              value={item.value}
              readOnly
              tabIndex={-1}
              className="w-full bg-[#1A1A1A] border border-white/5 py-2.5 px-4 rounded-xl text-center text-sm text-[#555] outline-none cursor-default"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          type="button"
          className="px-10 py-2.5 rounded-full border border-white/10 text-[#8F8F8F] text-sm hover:bg-white/5 hover:text-white transition-all active:scale-95"
        >
          Cancel Subscription
        </button>
      </div>
    </div>
  );
}
