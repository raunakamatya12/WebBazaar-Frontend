"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { rateProduct } from "@/api/products";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LOGIN_ROUTE } from "@/constants/routes";
import axios from "axios";
import config from "@/config";

function FinalStars({ productId }) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [canRate, setCanRate] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  // Check if user can rate (has purchased this product)
  useEffect(() => {
    if (!user?.id) {
      setCheckingPermission(false);
      return;
    }

    const checkCanRate = async () => {
      try {
        setCheckingPermission(true);
        const res = await axios.get(
          `${config.apiUrl}/api/products/${productId}/can-rate`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setCanRate(res.data.canRate);
      } catch (err) {
        console.error("Can rate check error:", err);
        setCanRate(false);
      } finally {
        setCheckingPermission(false);
      }
    };

    checkCanRate();
  }, [user?.id, productId, user?.token]);

  const handleHover = (value) => {
    if (canRate) setTempRating(value);
  };

  const handleResetHover = () => {
    setTempRating(0);
  };

  const handleSelectRating = (value) => {
    if (!user) {
      toast.error("Please login to rate this product");
      router.push(LOGIN_ROUTE);
      return;
    }
    if (!canRate) {
      toast.error("You can only rate products you have purchased and received.");
      return;
    }
    setRating(value);
  };

  const handleSubmitRating = async () => {
    if (!rating) {
      toast.error("Please select a rating first");
      return;
    }

    if (!user) {
      toast.error("Please login to submit a rating");
      router.push(LOGIN_ROUTE);
      return;
    }

    if (!canRate) {
      toast.error("You can only rate products you have purchased and received.");
      return;
    }

    setLoading(true);
    try {
      await rateProduct(productId, rating);
      toast.success("✅ Rating submitted successfully!");
      setRating(0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  if (checkingPermission) {
    return <span className="text-xs text-gray-400">Checking...</span>;
  }

  if (!user) {
    return <span className="text-xs text-gray-500">Login to rate</span>;
  }

  if (!canRate) {
    return <span className="text-xs text-amber-600 dark:text-amber-400">Buy to rate</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleSelectRating(star)}
            onMouseEnter={() => handleHover(star)}
            onMouseLeave={handleResetHover}
            disabled={loading}
            className="hover:scale-125 transition-transform">
            <span
              className={
                star <= (tempRating || rating)
                  ? "text-yellow-400 text-2xl"
                  : "text-gray-400 text-2xl"
              }>
              ★
            </span>
          </button>
        ))}
      </div>
      {rating > 0 && (
        <button
          onClick={handleSubmitRating}
          disabled={loading}
          className="ml-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
          {loading ? "Submitting..." : "Submit Rating"}
        </button>
      )}
    </div>
  );
}

export default FinalStars;
