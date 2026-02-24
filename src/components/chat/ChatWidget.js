"use client";

import React, { useState } from "react";
import { sendChatMessage } from "../../api/chat";

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((m) => [...m, { from: "user", text: userText }]);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await sendChatMessage(userText);
      setMessages((m) => [...m, { from: "assistant", text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { from: "assistant", text: "Error: " + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, maxWidth: 600 }}>
      <div style={{ maxHeight: 300, overflow: "auto", marginBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <strong style={{ color: m.from === "user" ? "#0b5" : "#05f" }}>{m.from}:</strong>{" "}
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about products, orders, or site help..."
          style={{ flex: 1, padding: 8 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button onClick={handleSend} disabled={loading} style={{ padding: "8px 12px" }}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
