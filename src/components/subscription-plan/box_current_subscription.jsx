"use client";

import dayjs from "dayjs";

export default function Box_current_subscription({ subscription, loading }) {
  const formatDate = (dateStr) =>
    dateStr ? dayjs(dateStr).format("DD MMM YYYY") : "—";

  const data = [
    {
      label: "Plan Name:",
      value: subscription?.planName
        ? `${subscription.planName} Plans`
        : "No data",
    },
    { label: "Status:", value: subscription?.status ?? "No data" },
    { label: "Billing Cycle:", value: subscription?.billingCycle ?? "No data" },
    {
      label: "Active Billing Date:",
      value: formatDate(subscription?.activeBillingDate),
    },
    {
      label: "Next Billing Date:",
      value: formatDate(subscription?.nextBillingDate),
    },
    {
      label: "Price:",
      value: subscription?.priceSnapshot
        ? `${Number(subscription.priceSnapshot).toLocaleString()} THB`
        : "No data",
    },
  ];

  return (
    <div className="bg-[#242327] border border-white/5 rounded-[30px] p-8">
      <h3 className="text-lg mb-6 text-white font-medium">
        Current Subscription
      </h3>

      {loading ? (
        <p className="text-[#555] text-sm">Loading...</p>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0"
            >
              <label className="text-[#8F8F8F] text-sm w-full sm:w-48 shrink-0">
                {item.label}
              </label>
              <div
                className={`w-full bg-[#1A1A1A] border border-white/5 py-2.5 px-4 rounded-xl text-center text-sm outline-none cursor-default ${
                  subscription
                    ? "bg-clip-text text-transparent font-medium"
                    : "text-[#555]"
                }`}
                style={
                  subscription
                    ? {
                        backgroundImage:
                          "linear-gradient(to right, #E759FF, #6174FF)",
                      }
                    : {}
                }
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
