import Link from "next/link";
import React from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { logoutUser } from "@/redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { allowedAdminRoles } from "@/helpers/auth";
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";

function AuthUserPopup({ user, setShowPopup }) {
  const dispatch = useDispatch();

  const isAllowed = allowedAdminRoles(user?.roles);

  const router = useRouter();

  function logout() {
    dispatch(logoutUser());
    localStorage.removeItem("authToken");

    router.push(LOGIN_ROUTE);
  }

  return (
    <div
      className="absolute top-10 right-0 w-auto px-4 py-3 rounded-lg shadow-md bg-white whitespace-nowrap dark:bg-slate-700"
      onClick={() => setShowPopup(false)}
    >
      <h4 className="font-medium text-lg">Hi! {user.name}</h4>
      {isAllowed && (
        <Link
          href={DASHBOARD_ROUTE}
          className="bg-gray-200 dark:bg-slate-600 block text-black dark:text-white my-2 py-1 px-4 rounded-md w-full hover:bg-gray-300 dark:hover:bg-slate-500"
        >
          Dashboard
        </Link>
      )}
      <Link
        href="/profile"
        className="bg-gray-200 dark:bg-slate-600 block text-black dark:text-white my-2 py-1 px-4 rounded-md w-full hover:bg-gray-300 dark:hover:bg-slate-500"
      >
        Profile
      </Link>
      <button
        onClick={logout}
        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-md w-full flex items-center justify-between dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        <span>Logout</span>
        <IoLogOutOutline />
      </button>
    </div>
  );
}

export default AuthUserPopup;
