"use client";

import { getPopularProducts } from "@/api/products";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
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
    <section className="relative h-auto md:h-[700px] overflow-hidden bg-gray-100 dark:bg-gray-800">
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
              {/* Product Image - BIGGER */}
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-2xl h-80 md:h-[500px] bg-white dark:bg-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                  <Image
                    src={product.imageUrls?.[0] || "/placeholder.png"}
                    alt={product.name}
                    width={1200}
                    height={1200}
                    className="w-full h-full object-cover p-8 transform hover:scale-110 transition duration-500"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="md:w-1/2 text-center md:text-left">
                {/* Category - VIBRANT COLOR */}
                <span className="inline-block bg-gradient-to-r from-blue-300 to-cyan-400 text-white text-sm font-bold px-5 py-2 rounded-full mb-6 shadow-lg">
                  📦 {product.category}
                </span>
                
                {/* Product Name - CLEAR & BOLD */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* Stock Status - show only when in stock */}
                {product.stock > 0 && (
                  <div className="flex items-center gap-3 mb-6">
                    <span className="inline-block text-sm font-semibold px-4 py-2 rounded-full bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200">
                      ✓ In Stock ({product.stock})
                    </span>
                  </div>
                )}
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