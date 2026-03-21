"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function LoadMoreProducts({ productCount }) {
  const [currentLimit, setCurrentLimit] = useState(5);

  const router = useRouter();

  function loadMore() {
    setCurrentLimit(currentLimit + 5);

    router.push(`?limit=${currentLimit + 5}`);
  }

  return (
    <div className="flex justify-center">
      <button
        onClick={loadMore}
        disabled={productCount < currentLimit}
        className={`rounded-full px-6 py-2 flex items-center justify-center border transition focus:outline-none focus:ring-2 focus:ring-primary/40
          bg-white text-black dark:bg-slate-900 dark:text-white
          border-gray-200 dark:border-slate-700
          hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        Load More
      </button>
    </div>
  );
}

export default LoadMoreProducts;
