// src/components/ChatBox.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/api/chat";
import config from "@/config";

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

  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);



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



  const isProductQuery = (text) =>
    PRODUCT_KEYWORDS.some((kw) => text.toLowerCase().includes(kw));



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
              "Hello 👋 Welcome to Web Bazzar! How can I assist you today?",
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
              "You're welcome 😊 It's my pleasure to help! Let me know if you need anything else.",
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

        products = productData || [];
      }



      const data = await sendChatMessage(updatedMessages, products);



      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
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

        <div className="fixed bottom-24 right-6 w-[360px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">

          {/* Header */}
          <div className="bg-black text-white px-4 py-3 rounded-t-xl flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="text-lg">🛒</span>

              <span className="font-semibold text-sm">
                Web Bazzar Assistant
              </span>

            </div>

            <span className="w-2 h-2 rounded-full bg-green-400"></span>

          </div>



          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">

            {messages.map((msg, i) => (

              <div
                key={i}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-black text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                  }`}
                >

                  {msg.content}

                </div>

              </div>

            ))}



            {/* Loading dots */}
            {loading && (

              <div className="flex justify-start">

                <div className="bg-white border border-gray-200 text-gray-400 text-sm px-4 py-2 rounded-2xl flex gap-1">

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



          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white flex gap-2">

            <input
              className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm outline-none focus:border-black"
              placeholder="Search products or ask..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-900 text-white px-4 rounded-lg text-sm hover:bg-blue-800 disabled:opacity-40"
            >
              Send
            </button>

          </div>

        </div>

      )}
    </>
  );
}