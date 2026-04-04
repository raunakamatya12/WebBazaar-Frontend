"use client";

import { useSelector } from "react-redux";
import RatingStar from "./RatingStar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductRatingClient({
  productId,
  ratings = [],
  onRateSuccess,
}) {
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id || user?.id;

  const [canRate, setCanRate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchCanRate = async () => {
      try {
        setLoading(true);

        // Use environment variable for API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(
          `${apiUrl}/api/products/${productId}/can-rate`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`, // if you use token
            },
          }
        );

        setCanRate(res.data.canRate);
      } catch (err) {
        console.error("Can rate check error:", err);
        setCanRate(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCanRate();
  }, [userId, productId, user?.token]);

  // Find user's rating
  const userRating = ratings?.find(
    (r) => (typeof r.user === "object" ? r.user._id : r.user) === userId
  );

  if (loading) return <p>Checking if you can rate...</p>;

  return (
    <div className="mt-4">
      {userRating ? (
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
          ⭐ You have rated this product {userRating.value} star
          {userRating.value > 1 ? "s" : ""}
        </p>
      ) : canRate ? (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            You haven’t rated this product yet.
          </p>
          <RatingStar
            productId={productId}
            initialRating={0}
            alreadyRated={false}
            MaxRating={5}
            onSubmitSuccess={onRateSuccess}
          />
        </>
      ) : (
        <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded mb-2">
          📦 You can only rate products you have purchased and received.
        </p>
      )}
    </div>
  );
}
