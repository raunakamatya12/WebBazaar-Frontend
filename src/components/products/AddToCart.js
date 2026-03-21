"use client";

import { addToCart } from "@/redux/cart/cartSlice";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function AddToCart({ product, className }) {
  const dispatch = useDispatch();

  function addProductToCart() {
    if (product.stock <= 0) {
      toast.error("Product is out of stock.", { autoClose: 750 });
      return;
    }

    delete product.description;

    dispatch(addToCart(product));

    toast.success("Product added to cart successfully.", { autoClose: 750 });
  }

  return (
    <button
      onClick={addProductToCart}
      disabled={product.stock <= 0}
      className={`rounded px-4 py-2 flex items-center justify-center bg-primary hover:opacity-90 text-white disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      <MdOutlineAddShoppingCart className="w-4 h-4 me-2" />
      <span> {product.stock <= 0 ? "Out of Stock" : "Add to cart"}</span>
    </button>
  );
}

export default AddToCart;
