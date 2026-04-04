"use client";

import { getPersonalizedRecommendations } from "@/api/products";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function PersonalizedRecommendations() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // If user is not logged in, skip calling the API
      if (!user) {
        setProducts([]);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getPersonalizedRecommendations(6);
        setProducts(response.data?.data || []);
        setError(null);
      } catch (err) {
        // If unauthorized, just hide the section without treating as an error
        if (err?.response?.status === 401) {
          setProducts([]);
          setError(null);
        } else {
          console.error("Error fetching personalized recommendations:", err);
          setError("Failed to load recommendations");
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Recommended For You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Silently fail
  }

  if (!products || products.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        👤 Recommended For You
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Based on products you've liked and your browsing history
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link
            href={`/products/${product._id}`}
            key={product._id}
            className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={product.imageUrls?.[0] || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {product.brand}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  Rs. {product.price}
                </span>
                <span className="text-xs bg-gradient-to-r from-blue-300 to-cyan-400 text-white font-bold px-2 py-1 rounded shadow-md">
                  📦 {product.category}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default PersonalizedRecommendations;
