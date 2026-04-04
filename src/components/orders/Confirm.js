"use client";

import KhaltiPayment from "./KhaltiPayment";
import EsewaPayment from "./EsewaPayment";
import CashOnDelivery from "./CashOnDelivery";

function ConfirmOrder({ order }) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="font-semibold text-sm text-gray-600 dark:text-gray-300 flex items-center">
        Choose Payment:
      </div>
      <CashOnDelivery order={order} />
      <KhaltiPayment order={order} />
      <EsewaPayment order={order} />
    </div>
  );
}

export default ConfirmOrder;
