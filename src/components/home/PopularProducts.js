"use client";

import Link from "next/link";
import ProductCard from "../products/Card";
import { PRODUCTS_ROUTE } from "@/constants/routes";
import { getPopularProducts } from "@/api/products";
import TopRatedProducts from "../products/TopRatedProducts";
import { useEffect, useState } from "react";

function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getPopularProducts();
        const productsData = response?.data || [];
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch popular products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-2">
          <div className="text-center">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-2">
        <div className="flex justify-between items-end mb-10">
          <TopRatedProducts />
        </div>
      </div>
    </section>
  );
}

export default PopularProducts;
