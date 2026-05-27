"use client";
import Link from "next/link";
import OrderCard from "@/components/orders/Card";
import {
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_DELIVERED,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_SHIPPED,
} from "@/constants/orderStatus";
import { getOrdersByUser } from "@/api/orders";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { LuClockAlert } from "react-icons/lu";
import { FaCheckCircle, FaShippingFast } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import Spinner from "@/components/Spinner";

const orderStatuses = [
  {
    status: ORDER_STATUS_PENDING,
    label: "Pending",
    icon: <LuClockAlert className="w-4 h-4" />,
  },
  {
    status: ORDER_STATUS_CONFIRMED,
    label: "Confirmed",
    icon: <IoShieldCheckmark className="w-4 h-4" />,
  },
  {
    status: ORDER_STATUS_SHIPPED,
    label: "Shipped",
    icon: <FaShippingFast className="w-4 h-4" />,
  },
  {
    status: ORDER_STATUS_DELIVERED,
    label: "Delivered",
    icon: <FaCheckCircle className="w-4 h-4" />,
  },
];

function OrdersPage() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const { user } = useSelector((state) => state.auth);

  const searchParams = useSearchParams();

  const status = searchParams.get("status");

  useEffect(() => {
    setLoading(true);

    // default to showing confirmed orders for users (confirmed and delivered tabs available)
    getOrdersByUser(user?.id, status ?? ORDER_STATUS_CONFIRMED)
      .then((response) => setOrders(response.data))
      .catch((error) => toast.error(error.response.data, { autoClose: 750 }))
      .finally(() => setLoading(false));
  }, [user?.id, status]);

  return (
    <section className="max-w-screen-xl container mx-auto px-4 py-10">
      <div className="border-b border-gray-200 dark:border-gray-500">
        <ul className="flex flex-wrap font-medium text-center">
          {orderStatuses.map((orderStatus, index) => (
            <li className="me-2" key={index}>
              <Link
                href={`?status=${orderStatus.status}`}
                className={`${
                  status == orderStatus.status
                    ? "text-primary dark:text-white"
                    : "text-gray-700 dark:text-gray-400"
                } inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-blue-500 dark:hover:text-gray-300`}
              >
                {orderStatus.icon}
                <span className="ml-2">{orderStatus.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-10 w-10" />
        </div>
      ) : orders.length == 0 ? (
        <p>No order items.</p>
      ) : (
        orders?.map((order, index) => <OrderCard key={index} order={order} />)
      )}
    </section>
  );
}

export default OrdersPage;
