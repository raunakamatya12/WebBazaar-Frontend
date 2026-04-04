"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { LOGIN_ROUTE } from "@/constants/routes";

function AddToFavorite() {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleFavoriteClick = () => {
    if (!user) {
      toast.error("Please login to add items to favorites", { autoClose: 750 });
      router.push(LOGIN_ROUTE);
      return;
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={handleFavoriteClick}
      className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
    >
      {isFavorite ? (
        <BsHeartFill className="w-5 h-5 -ms-2 me-2 text-red-600" />
      ) : (
        <BsHeart className="w-5 h-5 -ms-2 me-2 text-red-600" />
      )}
      Add to favorites
    </button>
  );
}

export default AddToFavorite;
