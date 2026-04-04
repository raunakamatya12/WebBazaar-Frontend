"use client";

import { addToCart } from "@/redux/cart/cartSlice";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LOGIN_ROUTE } from "@/constants/routes";

function AddToCart({ product, className }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  function addProductToCart() {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to add items to cart", { autoClose: 750 });
      router.push(LOGIN_ROUTE);
      return;
    }

    // Allow adding to cart even if out of stock
    delete product.description;

    dispatch(addToCart(product));

    toast.success("Product added to cart successfully.", { autoClose: 750 });
  }

  return (
    <button
      onClick={addProductToCart}
      disabled={false}
      className={`rounded px-4 py-2 flex items-center justify-center bg-primary hover:opacity-90 text-white transition duration-300 ${className}`}
    >
      <MdOutlineAddShoppingCart className="w-4 h-4 me-2" />
      <span>Add to cart</span>
    </button>
  );
}

export default AddToCart;
