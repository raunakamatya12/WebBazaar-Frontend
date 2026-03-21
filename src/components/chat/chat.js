// src/api/chat.js

export async function sendChatMessage(messages, products = []) {

  const systemPrompt =
    products.length > 0
      ? `You are a helpful shopping assistant for Web Bazzar. Use this product data: ${JSON.stringify(products)}`
      : `You are a helpful shopping assistant for Web Bazzar.`;

  const formattedMessages = messages.map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: String(msg.content),
  }));

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      max_tokens: 500,
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedMessages,
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq ${response.status}: ${err}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content;
  if (!reply) throw new Error("Empty response.");
  return { reply };
}