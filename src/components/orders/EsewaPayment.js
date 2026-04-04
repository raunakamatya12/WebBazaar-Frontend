"use client";

import Spinner from "../Spinner";
import config from "@/config";
import { checkoutOrderEsewa } from "@/api/orders";
import { toast } from "react-toastify";
import { useState } from "react";
import { MdPayment } from "react-icons/md";

function EsewaPayment({ order }) {
  const [loading, setLoading] = useState(false);

  function initiatePayment() {
    const orderId = order._id;

    setLoading(true);

    checkoutOrderEsewa(orderId, {
      returnUrl: `${config.appUrl}/orders/${orderId}/payment?gateway=esewa`,
      websiteUrl: config.appUrl,
    })
      .then((response) => {
        const data = response.data;

        // Create a form and submit it to Esewa
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.esewaUrl;

        Object.entries(data.payload).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to initiate Esewa payment", {
          autoClose: 750,
        });
        setLoading(false);
      });
  }

  return (
    <button
      onClick={initiatePayment}
      type="button"
      disabled={loading}
      className="flex items-center gap-2 focus:outline-none text-white bg-[#60BB46] hover:opacity-90 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-80"
    >
      Pay Via Esewa
      {loading ? (
        <Spinner className="h-5 w-5" />
      ) : (
        <MdPayment className="h-5 w-5" />
      )}
    </button>
  );
}

export default EsewaPayment;
