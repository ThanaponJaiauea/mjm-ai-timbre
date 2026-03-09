"use client";

import Card_price from "./card_prices";

export default function Box_payment_method({
  onSelectPrice,
  isSubscriptionActive,
}) {
  return (
    <div className="bg-[#242327] border border-white/5 rounded-[30px] p-8">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white">Payment Method</h3>
        <p className="text-xs text-[#8F8F8F] mt-1 leading-relaxed">
          Choose a plan and pay via bank transfer. Subscription will be
          activated after payment verification.
        </p>

        {/* ✅ แสดง warning เมื่อ active อยู่ */}
        {isSubscriptionActive && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs">
            You already have an active subscription. You can purchase again
            after it expires.
          </div>
        )}

        <p className="text-xs text-[#8F8F8F] font-bold mt-6 uppercase tracking-wider">
          Subscription Plans
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
        <Card_price
          text1="Monthly"
          text2="month"
          price="299"
          text3="Flexible monthly access to the VST plugin."
          disabled={isSubscriptionActive}
          onClick={() =>
            !isSubscriptionActive &&
            onSelectPrice({ price: "299", subscriptionPlan: "Monthly" })
          }
        />
        <Card_price
          text1="Annual"
          text2="year"
          price="2,900"
          text3="Best value for long-term users."
          save={true}
          disabled={isSubscriptionActive}
          onClick={() =>
            !isSubscriptionActive &&
            onSelectPrice({ price: "2,900", subscriptionPlan: " Annual" })
          }
        />
      </div>
    </div>
  );
}
