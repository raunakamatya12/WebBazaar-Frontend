"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import ChatBox from "@/components/chat/ChatBox";

function MainLayout({ children }) {
  const { theme } = useSelector((state) => state.userPreference);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    // Apply initial theme on mount
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div>
      {children}
      {/* <ChatBox /> */}
      <ToastContainer />
    </div>
  );
}

export default MainLayout;
