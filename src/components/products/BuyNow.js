"use client";

import { createOrder } from "@/api/orders";
import { MdOutlineShoppingBag } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LOGIN_ROUTE } from "@/constants/routes";
import { useState } from "react";

function BuyNow({ product, className }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  async function handleBuyNow() {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to buy products", { autoClose: 750 });
      router.push(LOGIN_ROUTE);
      return;
    }

    if (product.stock <= 0) {
      toast.error("Product is out of stock.", { autoClose: 750 });
      return;
    }

    try {
      setLoading(true);
      
      // Create an order with the single product and all details
      const orderData = {
        orderItems: [
          {
            product: product.id || product._id,
            quantity: 1,
            price: product.price,
            name: product.name,
            brand: product.brand,
            category: product.category,
            imageUrl: product.imageUrls?.[0],
          },
        ],
        totalPrice: product.price,
      };

      const response = await createOrder(orderData);
      const orderId = response.data?._id || response?.data?.data?._id;

      toast.success("Order created! Proceeding to payment...", { 
        autoClose: 750 
      });

      // Redirect to order confirmation/payment page
      router.push(`/orders/${orderId}/confirm`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(
        error?.response?.data?.message || "Failed to create order. Please try again.",
        { autoClose: 750 }
      );
    } finally {
      setLoading(false);
    }
  }

  // Don't show button if out of stock
  if (product.stock <= 0) {
    return null;
  }

  return (
    <button
      onClick={handleBuyNow}
      disabled={loading}
      type="button"
      className={`rounded px-4 py-2 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 ${
        className || ""
      }`}
    >
      <MdOutlineShoppingBag className="w-4 h-4 me-2" />
      <span>{loading ? "Processing..." : "Buy Now"}</span>
    </button>
  );
}

export default BuyNow;
