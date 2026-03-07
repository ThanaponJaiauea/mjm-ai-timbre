"use client";

import Card_price from "./card_prices";

export default function Box_payment_method({ onSelectPrice }) {
  return (
    <div className="bg-[#242327] border border-white/5 rounded-[30px] p-8">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white">Payment Method</h3>
        <p className="text-xs text-[#8F8F8F] mt-1 leading-relaxed">
          Choose a plan and pay via bank transfer. Subscription will be activated after payment verification.
        </p>
        <p className="text-xs text-[#8F8F8F] font-bold mt-6 uppercase tracking-wider">Subscription Plans</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
        <Card_price
          text1="Monthly"
          text2="month"
          price="299"
          text3="Flexible monthly access to the VST plugin."
          onClick={() => onSelectPrice({ price: "299", subscription: "Monthly" })}
        />
        <Card_price
          text1="Annual"
          text2="year"
          price="2,900"
          text3="Best value for long-term users."
          save={true}
          onClick={() => onSelectPrice({ price: "2,900", subscription: " Annual" })}
        />
      </div>
    </div>
  );
}
