"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineShoppingCart } from "react-icons/hi";
import {
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdMenu,
  MdClose,
} from "react-icons/md";

import AuthUser from "./AuthUser";
import Navlink from "./Navlink";
import logo from "@/assets/images/logo.png";
import navLinks from "@/constants/navLinks.";
import { LIGHT_THEME } from "@/constants/theme";
import { CART_ROUTE, LOGIN_ROUTE } from "@/constants/routes";
import { toggleTheme } from "@/redux/userPreference/userPreferenceSlice";

function Header() {
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.userPreference);
  const { products } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow dark:bg-slate-800 dark:text-white">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {/* <Image src={logo} alt="Logo" width={40} height={40} /> */}
          <span className="text-2xl font-bold">WebBazaar</span>
        </Link>

        {/* Center: Nav Links (hidden on mobile) */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map(
            (navLink, index) =>
              (user || !navLink.isAuth) && (
                <Navlink navLink={navLink} key={index} />
              )
          )}
        </ul>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 text-xl"
            title={
              theme === LIGHT_THEME ? "Switch to dark" : "Switch to light"
            }>
            {theme === LIGHT_THEME ? (
              <MdOutlineDarkMode />
            ) : (
              <MdOutlineLightMode />
            )}
          </button>

          {/* Cart */}
          <Link href={CART_ROUTE} className="relative p-2 text-xl">
            <HiOutlineShoppingCart />
            {products.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {products.length}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <AuthUser user={user} />
          ) : (
            <Link
              href={LOGIN_ROUTE}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-2xl p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu">
            {isOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
          <ul className="flex flex-col gap-3 mt-2">
            {navLinks.map(
              (navLink, index) =>
                (user || !navLink.isAuth) && (
                  <Navlink navLink={navLink} key={index} />
                )
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
