"use client";
import { useEffect, useState } from "react";
import { getPopularProducts } from "@/api/products";
import Image from "next/image";
import Link from "next/link";
import AddToCart from "./AddToCart";

export default function TopRatedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchTop() {
      try {
        const res = await getPopularProducts();
        if (res.data && Array.isArray(res.data)) {
          const validProducts = res.data.filter(product =>
            product.name && product.price && product.category
          );
          setProducts(validProducts.slice(0, 4));
        }
      } catch (error) {
        console.error("❌ Failed to load top-rated products:", error.message);
      }
    }
    fetchTop();
  }, []);

  if (!products.length) return null;

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-3xl font-extrabold tracking-wide text-gray-800 dark:text-white mb-8">
        Top Rated Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300">
            {/* Zoom effect container */}
            <div className="overflow-hidden group">
              <Image
                src={product.imageUrls?.[0] || "/assets/images/product-placeholder.jpeg"}
                alt={product.name}
                width={300}
                height={220}
                className="w-full h-52 object-cover transition-transform duration-300 transform group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "/assets/images/product-placeholder.jpeg";
                }}
              />
            </div>

            <div className="p-5">
              <Link
                href={`/products/${product._id}`}
                className="text-lg font-semibold text-blue-700 dark:text-blue-400 hover:underline line-clamp-1">
                {product.name}
              </Link>

              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex justify-between items-center">
                <span>⭐ {product.averageRating ?? "0.0"} / 5</span>
                <span>{product.ratingsCount ?? 0} reviews</span>
              </div>

              <div className="mt-5">
                <AddToCart product={product} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
