"use client";

import { useEffect, useState } from "react";
import AuthUserPopup from "./AuthUserPopup";
import Image from "next/image";
import placeholder from "@/assets/images/product-placeholder.jpeg";

function AuthUser({ user }) {
  const [showPopup, setShowPopup] = useState(false);
  const [cacheKey, setCacheKey] = useState(Date.now());

  useEffect(() => {
    if (user?.profileImageUrl) {
      setCacheKey(Date.now());
    }
  }, [user?.profileImageUrl]);

  const profileImageUrl = user.profileImageUrl
    ? `${user.profileImageUrl.split("?")[0]}?t=${cacheKey}`
    : placeholder;

  return (
    <div className="relative">
      <button className="rounded-full border-2 border-primary p-0.5" onClick={() => setShowPopup(!showPopup)}>
        <Image
          key={profileImageUrl}
          src={profileImageUrl}
          alt="User profile picture"
          height={32}
          width={32}
          className="w-8 h-8 rounded-full object-cover"
          unoptimized={!!user.profileImageUrl}
        />
      </button>
      {showPopup && <AuthUserPopup user={user} setShowPopup={setShowPopup} />}
    </div>
  );
}

export default AuthUser;
