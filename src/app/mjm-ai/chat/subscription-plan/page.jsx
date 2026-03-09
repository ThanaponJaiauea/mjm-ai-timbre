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
import { getPaymentByUserId, getSubscription } from "../../../../api/payment";

export default function SubscriptionPlan() {
  const user = useAuthStore((state) => state.user);
  const [selectPrice, setSelectPrice] = useState(null);

  const [confirmedPlan, setConfirmedPlan] = useState(null);

  const [openModel, setOpenModel] = useState(false);

  // data api
  const [historyData, setHistoryData] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const [subLoading, setSubLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);

  const handleConfirm = () => {
    setConfirmedPlan(selectPrice);
    setOpenModel(false);
    setSelectPrice(null);
  };

  const fetchHistory = async () => {
    try {
      const res = await getPaymentByUserId();
      setHistoryData(res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await getSubscription();
      setSubscription(res.data.data);
    } catch {
      setSubscription(null);
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchSubscription();
  }, []);

  const startPolling = () => {
    setIsPolling(true);
    const interval = setInterval(async () => {
      const data = await fetchHistory();
      const hasPending = data?.some((item) => item.status === "PENDING");
      if (!hasPending) {
        clearInterval(interval);
        setIsPolling(false);
        fetchSubscription();
      }
    }, 5000);

    setTimeout(
      () => {
        clearInterval(interval);
        setIsPolling(false);
      },
      5 * 60 * 1000,
    );
  };

  const isSubscriptionActive =
    subscription?.status === "APPROVED" &&
    subscription?.nextBillingDate &&
    new Date(subscription.nextBillingDate) > new Date();

  return (
    <div className="w-[95%] max-w-[1200px] m-auto py-10 text-white">
      {/* TOP : Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Subscription</h1>
          <p className="text-[#8F8F8F] text-sm mt-1">
            Manage payments & history.
          </p>
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
              subscriptionPlan={confirmedPlan?.subscriptionPlan}
              onBack={() => setConfirmedPlan(null)}
              onSuccess={() => {
                fetchHistory();
                startPolling();
              }}
            />
          ) : (
            <Box_payment_method
              isSubscriptionActive={isSubscriptionActive}
              onSelectPrice={(price) => {
                setSelectPrice(price);
                setOpenModel(true);
              }}
            />
          )}
          <Box_current_subscription
            subscription={subscription}
            loading={subLoading}
          />
        </div>

        {/* Right : Transaction History */}
        <Box_transaction_history data={historyData} />
      </div>

      {openModel && selectPrice && (
        <Model_popUp
          PriceData={selectPrice}
          onClose={() => setOpenModel(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
