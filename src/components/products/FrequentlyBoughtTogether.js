"use client";

import { getProductRecommendations } from "@/api/products";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function FrequentlyBoughtTogether({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await getProductRecommendations(productId, 4);
        setProducts(response.data?.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching Apriori recommendations:", err);
        setError("Failed to load frequently bought together products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRecommendations();
    }
  }, [productId]);

  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="text-xl font-medium mb-3 dark:text-white">
          Frequently Bought Together
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Silently fail if no recommendations
  }

  if (!products || products.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-medium dark:text-white">
          🛍️ Frequently Bought Together
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Customers who bought this also bought these products
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {products.map((product) => (
          <Link
            href={`/products/${product._id}`}
            key={product._id}
            className="flex gap-5 items-center px-4 py-3 rounded-xl shadow-md hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
          >
            <div className="h-16 w-16 flex-shrink-0">
              <Image
                src={product.imageUrls?.[0] || "/placeholder.png"}
                alt={product.name}
                height={50}
                width={50}
                className="h-full w-full object-cover rounded-md"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-md text-gray-600 font-medium dark:text-white">
                {product.name}
              </h3>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                Rs. {product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FrequentlyBoughtTogether;
