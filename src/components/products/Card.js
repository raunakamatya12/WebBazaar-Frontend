import Image from "next/image";

import placeholder from "@/assets/images/product-placeholder.jpeg";
import Link from "next/link";
import AddToCart from "./AddToCart";

function ProductCard({ product }) {
  return (
    <div className="w-full h-full rounded-xl shadow-md pb-6 grid grid-rows-[auto_1fr_auto] bg-white dark:bg-slate-800 dark:text-white">
      <Link href={`/products/${product.id}`}>
        <div className="flex justify-center min-h-30">
          <Image
            height={500}
            width={500}
            src={product.imageUrls[0] ?? placeholder}
            alt="img"
            className="w-full max-h-40 rounded-t-xl object-cover "
          />
        </div>
      </Link>
      <div className="py-4 px-5">
        <div className="mb-2">
          <span className="bg-blue-100 text-primary text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
            {product.category}
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ">
            {product?.brand}
          </span>
        </div>
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
        </Link>
        <p className="py-2 text-lg">Rs. {product.price}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
        </p>
      </div>
      <div className="px-4">
        <AddToCart product={product} className="w-full" />
      </div>
    </div>
  );
}

export default ProductCard;
