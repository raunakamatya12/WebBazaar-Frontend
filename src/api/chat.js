import config from "../config";

export async function sendChatMessage(messagesOrText, products = []) {
  let messageText;

  // Support both array-based conversation (ChatBox) and plain string (ChatWidget)
  if (Array.isArray(messagesOrText)) {
    const lastUserMessage = messagesOrText
      .filter((m) => m.role === "user")
      .pop();

    if (!lastUserMessage) throw new Error("No user message found");
    messageText = lastUserMessage.content;
  } else if (typeof messagesOrText === "string") {
    const trimmed = messagesOrText.trim();
    if (!trimmed) throw new Error("Message is empty");
    messageText = trimmed;
  } else {
    throw new Error("Invalid message format");
  }

  const res = await fetch(`${config.apiUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: messageText,
      products, // Send products if available
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    // Pass through the backend error message
    throw new Error(errorData.error || "AI request failed");
  }

  return res.json();
}