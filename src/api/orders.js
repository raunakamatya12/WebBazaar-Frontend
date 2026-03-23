import api from "./api";
import { apriori, getAprioriSuggestions } from "./apriori";

// ─────────────────────────────────────────────────────────────────────────────
// STANDARD ORDER CRUD
// ─────────────────────────────────────────────────────────────────────────────

async function checkoutOrder(id, data) {
  return await api.put(`/api/orders/${id}/checkout`, data);
}

async function confirmOrder(id, data) {
  return await api.put(`/api/orders/${id}/confirm`, data);
}

async function createOrder(data) {
  return await api.post("/api/orders", data);
}

async function getOrders() {
  return await api.get("/api/orders");
}

async function getOrdersByUser(userId, status) {
  return await api.get(`/api/orders/user/${userId}?status=${status}`);
}

async function deleteOrder(id) {
  return await api.delete(`/api/orders/${id}`);
}

async function updateOrderStatus(id, data) {
  return await api.put(`/api/orders/${id}/status`, data);
}

const getOrderSummary = async () => await api.get("/api/orders/summary");

// ─────────────────────────────────────────────────────────────────────────────
// APRIORI ALGORITHM – "Frequently Bought Together"
// ─────────────────────────────────────────────────────────────────────────────

async function getFrequentlyBoughtTogether(cartProductIds, limit = 4, allOrders = null) {
  try {
    const response = await api.post(`/api/recommendations/apriori`, {
      cartItems: cartProductIds,
      limit,
    });
    return response.data;
  } catch (backendError) {
    if (allOrders && allOrders.length > 0) {
      console.warn("[Apriori] Backend unreachable – running client-side fallback.");

      const transactions = allOrders.map((order) =>
        (order.products ?? []).map((p) => p.productId ?? p._id ?? p.id)
      );

      const { rules } = apriori(transactions, 0.02, 0.3, 3);

      return getAprioriSuggestions(cartProductIds, rules, limit);
    }
    throw backendError;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN / ANALYTICS – Run Apriori over ALL historical orders
// ─────────────────────────────────────────────────────────────────────────────

async function runAprioriOnAllOrders(minSupport = 0.02, minConfidence = 0.3) {
  const { data: orders } = await getOrders();

  const transactions = orders.map((order) =>
    (order.products ?? []).map((p) => p.productId ?? p._id ?? p.id)
  );

  return apriori(transactions, minSupport, minConfidence);
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export {
  createOrder,
  getOrders,
  getOrdersByUser,
  checkoutOrder,
  confirmOrder,
  deleteOrder,
  updateOrderStatus,
  getOrderSummary,
  getFrequentlyBoughtTogether,   // ← NEW
  runAprioriOnAllOrders,         // ← NEW
};