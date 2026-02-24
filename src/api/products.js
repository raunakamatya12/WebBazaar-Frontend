// import api from "./api";
// import axios from "axios";
// import config from "@/config";
// import getFormattedParams from "@/helpers/formatSearchParams";

// // ✅ Create a new product
// async function createProduct(data) {
//   return await api.post(`/api/products`, data);
// }

// // ✅ Delete product
// async function deleteProduct(id) {
//   return await api.delete(`/api/products/${id}`);
// }

// // ✅ Get products with search
// async function getProducts(searchParams) {
//   const query = getFormattedParams(searchParams);
//   return await axios.get(`${config.apiUrl}/api/products?${query}`);
// }

// // ✅ Get products added by user
// async function getProductByUser() {
//   return await api.get(`/api/products/users`);
// }

// // ✅ Get product by ID
// async function getProductById(id) {
//   return await axios.get(`${config.apiUrl}/api/products/${id}`);
// }

// // ✅ Get all brands
// async function getBrands() {
//   return await axios.get(`${config.apiUrl}/api/products/brands`);
// }

// // ✅ Get all categories
// async function getCategories() {
//   return await axios.get(`${config.apiUrl}/api/products/categories`);
// }

// // ✅ Update product
// async function updateProduct(id, data) {
//   return await api.put(`/api/products/${id}`, data);
// }

// // ✅ Submit product rating
// async function rateProduct(productId, value) {
//   return await api.post(`/api/products/${productId}/rate`, { value });
// }

// // ✅ Get popular products (new)
// async function getPopularProducts() {
//   return await axios.get(`${config.apiUrl}/api/products/popular`);
// }

// // 👇 Export all
// export {
//   createProduct,
//   deleteProduct,
//   getBrands,
//   getCategories,
//   getProductById,
//   getProductByUser,
//   getProducts,
//   updateProduct,
//   rateProduct,
//   getPopularProducts,
// };
import api from "./api";
import axios from "axios";
import config from "@/config";
import getFormattedParams from "@/helpers/formatSearchParams";

// ✅ Create a new product
async function createProduct(data) {
  console.log(data);
  return await api.post(`/api/products`, data);
}

// ✅ Delete product
async function deleteProduct(id) {
  return await api.delete(`/api/products/${id}`);
}

// ✅ Get products with search (enhanced)
async function getProducts(searchParams) {
  const query = getFormattedParams(searchParams);
  return await axios.get(`${config.apiUrl}/api/products?${query}`);
}

// ✅ Advanced search with filters
async function searchProducts(searchParams) {
  const query = getFormattedParams(searchParams);
  return await axios.get(`${config.apiUrl}/api/products/search?${query}`);
}

// ✅ Get search suggestions
async function getSearchSuggestions(query) {
  return await axios.get(
    `${config.apiUrl}/api/products/suggestions?query=${encodeURIComponent(
      query
    )}`
  );
}

// ✅ Get trending searches
async function getTrendingSearches() {
  return await axios.get(`${config.apiUrl}/api/products/trending`);
}

// ✅ Get product recommendations
async function getProductRecommendations(productId, limit = 4) {
  return await axios.get(
    `${config.apiUrl}/api/products/${productId}/recommendations?limit=${limit}`
  );
}

// ✅ Get products added by user
async function getProductByUser() {
  return await api.get(`/api/products/users`);
}

// ✅ Get product by ID
async function getProductById(id) {
  return await axios.get(`${config.apiUrl}/api/products/${id}`);
}

// ✅ Get all brands
async function getBrands() {
  return await axios.get(`${config.apiUrl}/api/products/brands`);
}

// ✅ Get all categories
async function getCategories() {
  return await axios.get(`${config.apiUrl}/api/products/categories`);
}

// ✅ Update product
async function updateProduct(id, data) {
  return await api.put(`/api/products/${id}`, data);
}

// ✅ Submit product rating
async function rateProduct(productId, value) {
  return await api.post(`/api/products/${productId}/rate`, { value });
}

// ✅ Get popular products
async function getPopularProducts() {
  return await axios.get(`${config.apiUrl}/api/products/popular`);
}

// 👇 Export all
export {
  createProduct,
  deleteProduct,
  getBrands,
  getCategories,
  getProductById,
  getProductByUser,
  getProducts,
  searchProducts,
  getSearchSuggestions,
  getTrendingSearches,
  getProductRecommendations,
  updateProduct,
  rateProduct,
  getPopularProducts,
};
