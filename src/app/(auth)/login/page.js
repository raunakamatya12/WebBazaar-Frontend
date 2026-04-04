"use client";

import Link from "next/link";
import Spinner from "@/components/Spinner";
import { EMAIL_REGEX } from "@/constants/regex";
import { HOME_ROUTE, REGISTER_ROUTE, DASHBOARD_ROUTE } from "@/constants/routes";
import { loginUser } from "@/redux/auth/authActions";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import PasswordField from "@/components/auth/PasswordField";
import { allowedAdminRoles } from "@/helpers/auth";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user, error, loading } = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch = useDispatch();

  function submitForm(data) {
    dispatch(loginUser(data));
  }

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (allowedAdminRoles(user?.roles)) {
        router.push(DASHBOARD_ROUTE);
      } else {
        router.push(HOME_ROUTE);
      }
    }

    if (error)
      toast.error(error, {
        autoClose: 750,
      });
  }, [user, error, router]);

  return (
    <section>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-5">
        Sign in to your account
      </h1>
      
      {/* Simplified: removed extra role description text for cleaner login UI */}

      <form
        className="space-y-4 md:space-y-6"
        onSubmit={handleSubmit(submitForm)}
      >
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@company.com"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: EMAIL_REGEX,
                message: "Invalid email address.",
              },
            })}
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>
        <div className="relative">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <PasswordField
            id="password"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password length must be greater than 6.",
              },
            })}
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="remember" type="checkbox" className="w-4 h-4" />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="remember"
                className="text-gray-500 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full text-white bg-primary hover:opacity-90 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-80"
        >
          <span>Sign in</span>
          {loading && <Spinner className="h-5 w-5 ml-2" />}
        </button>
        <p className="text-sm font-light text-gray-700 dark:text-gray-300">
          Don’t have an account yet?
          <Link
            href={REGISTER_ROUTE}
            className="font-medium text-primary hover:underline ml-2"
          >
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
