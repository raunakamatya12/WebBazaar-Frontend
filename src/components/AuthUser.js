"use client";

import { useState } from "react";
import AuthUserPopup from "./AuthUserPopup";
import Image from "next/image";
import placeholder from "@/assets/images/product-placeholder.jpeg";

function AuthUser({ user }) {
  const [showPopup, setShowPopup] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  // Add cache buster to profile image URL to ensure fresh image display
  const profileImageUrl = user.profileImageUrl ? `${user.profileImageUrl}?t=${Date.now()}` : placeholder;

  return (
    <div className="relative">
      <button className="rounded-full border-2 border-primary p-0.5" onClick={() => setShowPopup(!showPopup)}>
        <Image
          key={imageKey}
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
