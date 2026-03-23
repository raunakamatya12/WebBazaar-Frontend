"use client";

import { getPopularProducts } from "@/api/products";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiArrowRight, FiArrowLeft, FiStar } from "react-icons/fi";
// import { getPopularProducts } from "@/services/productService"; // adjust path

export default function TopRatedSlider() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch top 4 popular products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await getPopularProducts();
        console.log("API response:", res);
        setProducts(res.data.slice(0, 4));
      } catch (err) {
        setError("Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Auto slide change every 7s
  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [products]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  if (loading) return <p className="p-4 text-center">Loading products...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
  if (products.length === 0)
    return <p className="p-4 text-center">No products found.</p>;

  return (
    <section className="relative h-auto md:h-[600px] overflow-hidden bg-gray-100 dark:bg-gray-800">
      {products.map((product, index) => (
        <div
          key={product._id}
          className={`w-full py-12 md:py-0 transition-opacity duration-1000 flex items-center ${
            index === currentSlide
              ? "opacity-100"
              : "opacity-0 absolute top-0 left-0"
          }`}>
          <div className="container mx-auto mt-16 px-6">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Product Image */}
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md h-64 md:h-96 bg-white dark:bg-gray-700 rounded-xl shadow-lg  overflow-hidden">
                  <Image
                    src={product.imageUrls?.[0] || "/placeholder.png"}
                    alt={product.name}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover p-6 transform hover:scale-105 transition duration-500"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="md:w-1/2 text-center md:text-left">
                <span className="inline-block bg-[#016EB7] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  by <span className="font-semibold">{product.brand}</span>
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center md:justify-start mb-6">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${
                          i < Math.round(product.averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-500"
                        } w-5 h-5`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {product.averageRating.toFixed(1)} ({product.ratingsCount}{" "}
                    reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-[#016EB7] dark:text-blue-400">
                    RS. {product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-600 text-gray-800 dark:text-white p-3 rounded-full shadow-md transition duration-300 hidden md:block"
        aria-label="Previous slide">
        <FiArrowLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-600 text-gray-800 dark:text-white p-3 rounded-full shadow-md transition duration-300 hidden md:block"
        aria-label="Next slide">
        <FiArrowRight size={24} />
      </button>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition duration-300 ${
              index === currentSlide
                ? "bg-[#016EB7] w-6"
                : "bg-white/50 dark:bg-gray-500"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}