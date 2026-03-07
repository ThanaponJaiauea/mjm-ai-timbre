/** @format */
"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { UserMenu } from "../../../../components/auth/user-menu";
import Box_payment_method from "../../../../components/subscription-plan/box_payment_method";
import Box_current_subscription from "../../../../components/subscription-plan/box_current_subscription";
import Box_transaction_history from "../../../../components/subscription-plan/box_transaction_history";
import { useState, useEffect } from "react";
import Model_popUp from "../../../../components/modal/model_popUp";
import PaymentMethodDetail from "../../../../components/subscription-plan/paymentMethodDetail";
import { getPaymentByUserId } from "../../../../api/createPayment";

export default function SubscriptionPlan() {
  const user = useAuthStore(state => state.user);
  const [selectPrice, setSelectPrice] = useState(null);

  const [confirmedPlan, setConfirmedPlan] = useState(null);

  const [openModel, setOpenModel] = useState(false);
  const [historyData, setHistoryData] = useState(null);

  const handleConfirm = () => {
    setConfirmedPlan(selectPrice);
    setOpenModel(false);
    setSelectPrice(null);
  };

  const fetchHistory = async () => {
    try {
      const res = await getPaymentByUserId();
      setHistoryData(res.data.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="w-[95%] max-w-[1200px] m-auto py-10 text-white">
      {/* TOP : Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Subscription</h1>
          <p className="text-[#8F8F8F] text-sm mt-1">Manage payments & history.</p>
        </div>
        {user && <UserMenu />}
      </div>

      {/* BOTTOM : Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left */}
        <div className="md:col-span-6 flex flex-col gap-6">
          {confirmedPlan ? (
            <PaymentMethodDetail
              price={confirmedPlan?.price}
              subscription={confirmedPlan?.subscription}
              onBack={() => setConfirmedPlan(null)}
              onSuccess={fetchHistory}
            />
          ) : (
            <Box_payment_method
              onSelectPrice={price => {
                setSelectPrice(price);
                setOpenModel(true);
              }}
            />
          )}
          <Box_current_subscription />
        </div>

        {/* Right : Transaction History */}
        <Box_transaction_history data={historyData} />
      </div>

      {openModel && selectPrice && (
        <Model_popUp PriceData={selectPrice} onClose={() => setOpenModel(false)} onConfirm={handleConfirm} />
      )}
    </div>
  );
}
