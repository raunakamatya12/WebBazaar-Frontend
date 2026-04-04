import { getProducts } from "@/api/products";
import Image from "next/image";
import Link from "next/link";

async function RelatedProducts({ category, currentProductId }) {
  const response = await getProducts({ category });

  const products = response.data;

  return (
    <section>
      <h2 className="text-xl font-medium mb-3 dark:text-white">
        Related products
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {products
          .filter((product) => product.id != currentProductId)
          .map((product, index) =>
            index < 4 ? (
              <Link
                href={product.id}
                key={index}
                className="flex gap-5 items-center px-4 py-3 rounded-xl shadow-md hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-900"
              >
                <div className="h-16 w-16">
                  <Image
                    src={product.imageUrls[0]}
                    alt=""
                    height={50}
                    width={50}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                <div>
                  <h3 className="text-md text-gray-600 font-medium dark:text-white">
                    {product.name}
                  </h3>
                  <div className="flex gap-2 pt-2">
                    <span className="bg-gradient-to-r from-blue-300 to-cyan-400 text-white text-xs font-bold px-2.5 py-1 rounded-sm shadow-md">
                      📦 {product.category}
                    </span>
                    <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-sm">
                      {product?.brand}
                    </span>
                  </div>
                </div>
              </Link>
            ) : null
          )}
      </div>
    </section>
  );
}

export default RelatedProducts;
