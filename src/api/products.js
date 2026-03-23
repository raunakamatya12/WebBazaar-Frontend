import api from "./api";
import axios from "axios";
import config from "@/config";
import getFormattedParams from "@/helpers/formatSearchParams";
import { userBasedCollaborativeFilter } from "./collaborativeFilter";

// ─────────────────────────────────────────────────────────────────────────────
// STANDARD PRODUCT CRUD
// ─────────────────────────────────────────────────────────────────────────────

async function createProduct(data) {
  console.log(data);
  return await api.post(`/api/products`, data);
}

async function deleteProduct(id) {
  return await api.delete(`/api/products/${id}`);
}

async function getProducts(searchParams) {
  const query = getFormattedParams(searchParams);
  return await axios.get(`${config.apiUrl}/api/products?${query}`);
}

async function searchProducts(searchParams) {
  const query = getFormattedParams(searchParams);
  return await axios.get(`${config.apiUrl}/api/products/search?${query}`);
}

async function getSearchSuggestions(query) {
  return await axios.get(
    `${config.apiUrl}/api/products/suggestions?query=${encodeURIComponent(query)}`
  );
}

async function getTrendingSearches() {
  return await axios.get(`${config.apiUrl}/api/products/trending`);
}

async function getProductByUser() {
  return await api.get(`/api/products/users`);
}

async function getProductById(id) {
  return await axios.get(`${config.apiUrl}/api/products/${id}`);
}

async function getBrands() {
  return await axios.get(`${config.apiUrl}/api/products/brands`);
}

async function getCategories() {
  return await axios.get(`${config.apiUrl}/api/products/categories`);
}

async function updateProduct(id, data) {
  return await api.put(`/api/products/${id}`, data);
}

async function rateProduct(productId, value) {
  return await api.post(`/api/products/${productId}/rate`, { value });
}

async function getPopularProducts() {
  return await axios.get(`${config.apiUrl}/api/products/popular`);
}

async function getProductRecommendations(productId, limit = 4) {
  return await axios.get(
    `${config.apiUrl}/api/products/${productId}/recommendations?limit=${limit}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ✅  USER-BASED COLLABORATIVE FILTERING  –  "Recommended For You"
// ─────────────────────────────────────────────────────────────────────────────
//
// Tries the backend first.  If the backend is unavailable, runs the pure-JS
// algorithm from collaborativeFilter.js directly in the browser / server action.
//
// BACKEND ENDPOINT NEEDED:
//   GET /api/recommendations/collaborative/:userId?limit=8
//   → returns Product[]
//
// COMPONENT USAGE:
//   import { getPersonalisedRecommendations } from "@/services/products";
//   const recs = await getPersonalisedRecommendations(user._id, 8);
//   // with client-side fallback:
//   const recs = await getPersonalisedRecommendations(user._id, 8, ratingsArray);

/**
 * @param {string}   userId
 * @param {number}   [limit=8]
 * @param {Object[]} [allRatings]  Optional fallback: [{ userId, productId, rating }]
 * @returns {Promise<Product[]>}
 */
async function getPersonalisedRecommendations(
  userId,
  limit = 8,
  allRatings = null
) {
  try {
    const response = await api.get(
      `/api/recommendations/collaborative/${userId}?limit=${limit}`
    );
    return response.data;
  } catch (backendError) {
    if (allRatings && allRatings.length > 0) {
      console.warn(
        "[CollaborativeFilter] Backend unreachable – running client-side fallback."
      );
      const recommendedIds = userBasedCollaborativeFilter(
        userId,
        allRatings,
        5,
        limit
      );
      if (recommendedIds.length === 0) return [];
      const products = await Promise.all(
        recommendedIds.map((id) =>
          getProductById(id).then((r) => r.data).catch(() => null)
        )
      );
      return products.filter(Boolean);
    }
    throw backendError;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

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
  getPersonalisedRecommendations,   // ← NEW  (Collaborative Filtering)
  updateProduct,
  rateProduct,
  getPopularProducts,
};