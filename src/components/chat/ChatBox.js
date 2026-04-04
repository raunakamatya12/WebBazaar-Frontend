// src/components/ChatBox.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/api/chat";
import config from "@/config";
import Link from "next/link";
import Image from "next/image";

export default function ChatBox() {

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome to Web Bazzar 🛒 How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [allProducts, setAllProducts] = useState([]);

  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load all products on mount for suggestions
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setAllProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchAllProducts();
  }, []);

  // PRODUCT KEYWORDS
  const PRODUCT_KEYWORDS = [
    "product","price","buy","show","about","laptop","mobile","phone",
    "tablet","headphone","watch","camera","gaming","accessory",
    "bike","under","cost","item","shop","stock","available",
    "offer","deal","discount","cheap","expensive","mac","book",
    "iphone","android","computer","notebook","smartphone",
    "charger","case","audio","dslr","console","rating","rated","best"
  ];

  const GREETINGS = ["hi","hello","hey","good morning","good evening"];
  const THANKS = ["thanks","thank you","thx","ty"];
  const CATEGORIES = ["laptop", "mobile", "tablet", "headphone", "watch", "camera", "gaming", "accessory"];

  const isProductQuery = (text) =>
    PRODUCT_KEYWORDS.some((kw) => text.toLowerCase().includes(kw));

  // Extract products from message content
  const extractProductsFromResponse = (response) => {
    const productMatches = response.match(/\$\d+/g) || [];
    return productMatches.length > 0;
  };

  // Get category-based product suggestions
  const getSuggestedProducts = (category) => {
    const categoryLower = category.toLowerCase();
    return allProducts.filter(p => 
      p.category && p.category.toLowerCase().includes(categoryLower)
    ).slice(0, 3);
  };

  const sendMessage = async () => {

    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const now = Date.now();

    if (now - lastRequestTime < 2000) {
      setError("Please wait a moment before sending another message.");
      return;
    }

    setLastRequestTime(now);

    const lower = trimmed.toLowerCase();

    const userMessage = { role: "user", content: trimmed };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {

      // Greeting response
      if (GREETINGS.some((g) => lower.includes(g))) {

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Hello 👋 Welcome to Web Bazzar! How can I assist you today? You can ask me about products, prices, or browse by category like laptops, mobiles, headphones, and more!",
            type: "greeting",
          },
        ]);

        setLoading(false);
        return;
      }

      // Thank you response
      if (THANKS.some((t) => lower.includes(t))) {

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "You're welcome 😊 It's my pleasure to help! Feel free to ask about our products anytime. Would you like to explore any specific category?",
            type: "thanks",
          },
        ]);

        setLoading(false);
        return;
      }

      let products = [];

      if (isProductQuery(trimmed)) {

        const productRes = await fetch(`${config.apiUrl}/api/products`);

        if (!productRes.ok) throw new Error("Failed to fetch products.");

        const productData = await productRes.json();

        products = Array.isArray(productData) ? productData : [];
      }

      const data = await sendChatMessage(updatedMessages, products);

      // Check if response mentions products and extract them
      let suggestedProducts = [];
      for (const category of CATEGORIES) {
        if (data.reply.toLowerCase().includes(category)) {
          suggestedProducts = getSuggestedProducts(category);
          break;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          products: suggestedProducts.length > 0 ? suggestedProducts : undefined,
          type: "product_response",
        },
      ]);

    } catch (err) {

      console.error(err);

      setError(err.message || "Something went wrong. Please try again.");

    } finally {

      setLoading(false);

    }

  };

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      sendMessage();

    }

  };

  // Quick category suggestion button
  const suggestCategory = (category) => {
    setInput(`Show me ${category}s`);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 bg-blue-900 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-800 transition"
      >
        {isOpen ? "✕" : "🛒"}
      </button>

      {/* Chat Window */}
      {isOpen && (

        <div className="fixed bottom-24 right-6 w-[420px] h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-4 rounded-t-xl flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="text-lg">🛒</span>

              <div>
                <span className="font-semibold text-sm block">
                  Web Bazzar Assistant
                </span>
                <span className="text-xs opacity-90">Always here to help</span>
              </div>

            </div>

            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>

          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

            {messages.map((msg, i) => (

              <div key={i}>
                <div
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-blue-900 text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-300 rounded-bl-sm shadow-sm"
                    }`}
                  >

                    {msg.content}

                  </div>

                </div>

                {/* Product Cards Display */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {msg.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="bg-white border border-gray-200 rounded-lg p-2 hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex gap-2">
                          {product.imageUrls?.[0] && (
                            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                              <Image
                                src={product.imageUrls[0]}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                                sizes="64px"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-600">{product.category}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="font-bold text-blue-600">
                                Rs. {product.price}
                              </p>
                              {product.stock > 0 && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                  In Stock
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

              </div>

            ))}

            {/* Loading dots */}
            {loading && (

              <div className="flex justify-start">

                <div className="bg-white border border-gray-300 text-gray-400 text-sm px-4 py-2 rounded-2xl flex gap-1 shadow-sm">

                  <span className="animate-bounce">●</span>

                  <span className="animate-bounce [animation-delay:0.15s]">
                    ●
                  </span>

                  <span className="animate-bounce [animation-delay:0.3s]">
                    ●
                  </span>

                </div>

              </div>

            )}

            {/* Error */}
            {error && (

              <div className="text-xs text-red-500 text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">

                ⚠️ {error}

              </div>

            )}

            <div ref={bottomRef} />

          </div>

          {/* Quick Category Suggestions */}
          {!loading && messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-600 mb-2">Quick browse:</p>
              <div className="flex gap-2 flex-wrap">
                {["laptop", "mobile", "headphone", "watch"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => suggestCategory(cat)}
                    className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded-full hover:bg-blue-200 transition"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl flex gap-2">

            <input
              className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm text-gray-900 outline-none focus:border-blue-500 placeholder-gray-400"
              placeholder="Search or ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 disabled:opacity-40 transition"
            >
              {loading ? "..." : "Send"}
            </button>

          </div>

        </div>

      )}
    </>
  );
}