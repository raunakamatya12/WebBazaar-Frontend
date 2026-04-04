"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { getPopularProducts } from "@/api/products";
import Link from "next/link";
import AddToCart from "../products/AddToCart";
import BuyNow from "../products/BuyNow";

function BestProduct() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchTopProduct() {
      try {
        const res = await getPopularProducts();
        setProduct(res.data[0]); // take the top 1 best-rated product
      } catch (err) {
        console.error("Failed to fetch best product:", err);
      }
    }

    fetchTopProduct();
  }, []);

  if (!product) return null;

  const {
    _id,
    name,
    price,
    imageUrls,
    averageRating,
    ratingsCount,
    description,
    originalPrice,
  } = product;

  return (
    <section className="py-14 bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Our Best Seller
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
          The most loved product by our customers
        </p>

        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Image */}
          <div className="md:w-1/2 w-full">
            <Image
              src={imageUrls?.[0] || "/placeholder.png"}
              alt={name}
              width={600}
              height={400}
              className="rounded-xl shadow-lg w-full object-contain bg-white p-4"
            />
          </div>

          {/* Info */}
          <div className="md:w-1/2 w-full space-y-4">
            <div className="inline-block bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 text-xs px-3 py-1 rounded-full font-semibold">
              Best Seller
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {name}
            </h3>

            {/* Rating */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
              <span className="ml-2">
                {averageRating.toFixed(1)} ({ratingsCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-[#016EB7] dark:text-blue-400">
              ${price.toFixed(2)}
              {originalPrice && (
                <span className="ml-3 text-lg font-medium text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            {/* <p className="text-gray-600 dark:text-gray-300 text-sm">
              {description}
            </p> */}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {/* <button >
                Add to Cart
              </button> */}
              <AddToCart
                product={product}
                className={
                  "bg-[#016EB7] hover:bg-[#015a9b] text-white font-semibold py-2.5 px-6 rounded-full transition duration-300"
                }
              />
              <BuyNow
                product={product}
                className={
                  "bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-full transition duration-300"
                }
              />
              <Link
                href={`/products/${_id}`}
                className="border border-[#016EB7] hover:bg-[#016EB7] hover:text-white text-[#016EB7] dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white font-semibold py-2.5 px-6 rounded-full text-center transition duration-300">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BestProduct;
