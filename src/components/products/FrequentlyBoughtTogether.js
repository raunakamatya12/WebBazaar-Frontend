"use client";

import AddToCart from "@/components/products/AddToCart";
import { getProductRecommendations } from "@/api/products";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function FrequentlyBoughtTogether({ productId, productName }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartProducts = useSelector((state) => state.cart.products);

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
          {productName
            ? `Customers who bought ${productName} also bought these products`
            : "Customers who bought this also bought these products"}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col gap-4 rounded-xl px-4 py-3 shadow-md transition-colors dark:bg-slate-800"
          >
            <div className="flex gap-5 items-center">
              <Link href={`/products/${product._id}`} className="h-16 w-16 flex-shrink-0">
                <Image
                  src={product.imageUrls?.[0] || "/placeholder.png"}
                  alt={product.name}
                  height={50}
                  width={50}
                  className="h-full w-full object-cover rounded-md"
                />
              </Link>
              <div className="flex-grow min-w-0">
                <Link href={`/products/${product._id}`}>
                  <h3 className="text-md text-gray-600 font-medium dark:text-white truncate">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                  Rs. {product.price}
                </p>
                {cartProducts.some((item) => item.id === product._id) && (
                  <span className="mt-2 inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-200">
                    In cart
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <AddToCart product={{ id: product._id, ...product }} className="flex-1" />
              <Link
                href={`/products/${product._id}`}
                className="flex-1 rounded px-4 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-slate-900"
              >
                View product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FrequentlyBoughtTogether;
