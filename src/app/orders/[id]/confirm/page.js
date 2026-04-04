"use client";

import { useParams } from "next/navigation";
import { getOrdersByUser } from "@/api/orders";
import { useSelector } from "react-redux";
import ConfirmOrder from "@/components/orders/Confirm";
import { useEffect, useState } from "react";
import Link from "next/link";

function OrderConfirmPage() {
  const params = useParams();
  const orderId = params.id;
  const { user } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        if (!user) {
          setError("Please login to view order details");
          return;
        }

        // Fetch all user orders and find the specific one
        const response = await getOrdersByUser(user._id, "pending");
        const foundOrder = response.data.find((o) => o._id === orderId);

        if (!foundOrder) {
          setError("Order not found");
        } else {
          setOrder(foundOrder);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <p className="text-center text-red-600">{error}</p>
        <div className="text-center mt-4">
          <Link href="/orders" className="text-blue-600 hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-6 py-8">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Order not found
        </p>
        <div className="text-center mt-4">
          <Link href="/orders" className="text-blue-600 hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Order Confirmation
        </h1>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.product?.name || "Product"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="text-lg font-semibold text-[#016EB7] dark:text-blue-400">
                  Rs. {(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              Rs. {order.totalPrice?.toFixed(2) || "0.00"}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700 dark:text-gray-300">Shipping:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              Free
            </span>
          </div>
          <hr className="my-4 border-gray-300 dark:border-gray-600" />
          <div className="flex justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Total:
            </span>
            <span className="text-lg font-bold text-[#016EB7] dark:text-blue-400">
              Rs. {order.totalPrice?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Select Payment Method
          </h2>
          <ConfirmOrder order={order} />
        </div>

        {/* Order Status */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
            <span className="font-semibold">Status:</span>{" "}
            {order.status?.toUpperCase() || "PENDING"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmPage;
