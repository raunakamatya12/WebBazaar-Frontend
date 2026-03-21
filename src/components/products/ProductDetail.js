"use client";
import { useSelector } from "react-redux";
import RatingStar from "@/components/products/RatingStar";
import FinalStars from "@/components/products/FinalStars";
import AddToCart from "@/components/products/AddToCart";
import AddToFavorite from "@/components/products/AddToFavorite";
import ProductDescription from "@/components/products/Description";
import ImagePreview from "@/components/products/Preview";
import Link from "next/link";
import { PRODUCTS_ROUTE } from "@/constants/routes";
import BackButton from "@/components/BackButton";

export default function ProductDetails({ product }) {
  const { user } = useSelector((state) => state.auth);
  const productId = product._id;

  console.log("🔍 user._id:", user?._id);
  console.log("🔍 product.ratings:", product?.ratings);
  const userRating =
    product?.ratings?.find((r) => {
      const ratedUserId =
        typeof r.user === "object" && r.user !== null
          ? r.user.$oid // use $oid here, because your DB stores user id as { $oid: "string" }
          : r.user;

      return ratedUserId === user?._id || ratedUserId === user?.id;
    }) || null;

  return (
    <>
      <div className="pb-5">
        <BackButton />
      </div>
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
        <ImagePreview imageUrls={product.imageUrls} />
        <div className="mt-6 sm:mt-8 lg:mt-0">
          <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${
            product.stock > 0 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </span>
          <h1 className="text-xl mt-2 font-semibold text-gray-900 sm:text-2xl dark:text-white">
            {product.name}
          </h1>
          <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
            <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
              Rs. {product.price}
            </p>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <FinalStars productId={productId} />
              <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                (5.0)
              </p>
              <span className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                5 Reviews
              </span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {product?.brand && (
              <Link
                href={`${PRODUCTS_ROUTE}?brands=${product?.brand}`}
                className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-5 py-1 rounded-sm dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
                {product.brand}
              </Link>
            )}
            <Link
              href={`${PRODUCTS_ROUTE}?category=${product?.category}`}
              className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-5 py-1 rounded-sm dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">
              {product.category}
            </Link>
          </div>
          <div className="mt-6 gap-2 sm:gap-4 sm:items-center flex flex-col sm:flex-row sm:mt-8">
            <AddToFavorite />
            <AddToCart product={{ id: productId, ...product }} />
          </div>
          <div>
            {console.log("userRating:", userRating)}
            <RatingStar
              productId={productId}
              initialRating={userRating?.value || 0}
              alreadyRated={!!userRating}
              MaxRating={5}
            />
          </div>
          <hr className="my-6 border-gray-200 dark:border-gray-800" />
        </div>
      </div>
      <ProductDescription description={product?.description} />
    </>
  );
}
