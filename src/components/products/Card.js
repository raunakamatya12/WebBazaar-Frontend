"use client";

import Image from "next/image";
import placeholder from "@/assets/images/product-placeholder.jpeg";
import Link from "next/link";
import AddToCart from "./AddToCart";
import BuyNow from "./BuyNow";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";

function ProductCard({ product }) {
  const [fav, setFav] = useState(false);
  const { user } = useSelector((state) => state.auth || {});
  const router = useRouter();

  const handleFav = (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setFav((s) => !s);
  };

  return (
    <div className="group w-full h-full rounded-lg bg-white dark:bg-slate-800 dark:text-white border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 overflow-hidden">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative bg-gray-50 dark:bg-slate-700 overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
          <Image
            height={600}
            width={800}
            src={product.imageUrls?.[0] ?? placeholder}
            alt={product.name || "product"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-md bg-indigo-600 text-white">
              {product.category}
            </span>
          </div>

          <div className="absolute right-3 top-3">
            <button
              onClick={handleFav}
              className="inline-flex items-center justify-center p-2 rounded-full bg-white/90 dark:bg-slate-800/80 text-red-600 hover:scale-110 transition-transform"
              aria-label="Add to favorites"
            >
              {fav ? <BsHeartFill className="w-5 h-5" /> : <BsHeart className="w-5 h-5" />}
            </button>
          </div>

          <div className="absolute left-3 bottom-3">
            <span className="bg-white/90 dark:bg-slate-800/80 px-3 py-1 rounded-full font-semibold text-sm">Rs. {product.price}</span>
          </div>
        </div>

        <div className="px-4 py-3">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white line-clamp-2">{product.name}</h3>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">{product.rating || product.avgRating || "0"}</span>
              <span className="text-sm text-gray-500 dark:text-gray-300">{product.reviewsCount ? `(${product.reviewsCount})` : ""}</span>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-300">
              <div className="font-medium text-gray-800 dark:text-gray-100">{product.brand}</div>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 pt-2">
        <div className="flex gap-3">
          <AddToCart product={product} className="flex-1 !px-3 !py-2 text-sm rounded-md" />
          <BuyNow product={product} className="flex-1 !px-3 !py-2 text-sm rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
