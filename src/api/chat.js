import config from "../config";

export async function sendChatMessage(messages, products = []) {
  // Extract the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  if (!lastUserMessage) throw new Error("No user message found");

  const res = await fetch(`${config.apiUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: lastUserMessage.content,
      products: products // Send products if available
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    // Pass through the backend error message
    throw new Error(errorData.error || "AI request failed");
  }

  return res.json();
}