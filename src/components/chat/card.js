"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { sendMessage } from "~/app/actions";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isModelThinking, startTransition] = useTransition(); // fixed useTransition

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setHistory((prev) => [...prev, userMessage]);
    setInput("");

    try {
      startTransition(async () => {
        const responseMessage = await sendMessage(input, [...history, userMessage]);
        const chatMessage = {
          role: "model",
          text: responseMessage || ""
        };
        setHistory((prev) => [...prev, chatMessage]);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const renderMessage = (text) => (
    <ReactMarkdown>{text}</ReactMarkdown>
  );

  return (
    <Card className="max-w-lg mx-auto mt-10 shadow-lg">
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2 h-64 overflow-y-auto bg-muted rounded p-3">
          {history.length === 0 && (
            <span className="text-muted-foreground text-sm">
              Start the conversation...
            </span>
          )}
          {history.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {renderMessage(msg.text)}
              </div>
            </div>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSend();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isModelThinking}
            className="flex-1"
          />
          <Button type="submit" disabled={isModelThinking || !input.trim()}>
            {isModelThinking ? "Thinking..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Chat;