"use client";

import Link from "next/link";
import PasswordField from "@/components/auth/PasswordField";
import Spinner from "@/components/Spinner";
import { EMAIL_REGEX, USERNAME_REGEX } from "@/constants/regex";
import { HOME_ROUTE, LOGIN_ROUTE } from "@/constants/routes";
import { registerUser } from "@/redux/auth/authActions";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/redux/auth/authSlice";
import { ROLE_USER } from "@/constants/roles";

function RegisterPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const password = watch("password");

  const { user, error, loading } = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch = useDispatch();

  function submitForm(data) {
    dispatch(
      registerUser({
        address: {
          city: data.city,
          province: data.province,
        },
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        roles: [ROLE_USER],
      })
    );
  }

  useEffect(() => {
    if (user) return router.push(HOME_ROUTE);

    if (error)
      toast.error(error, {
        autoClose: 750,
        onClose: () => dispatch(logoutUser()),
      });
  }, [user, error, router, dispatch]);

  return (
    <section>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-5">
        Create an account
      </h1>
      <form
        className="space-y-4 md:space-y-6"
        onSubmit={handleSubmit(submitForm)}>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your name
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="John doe"
            {...register("name", {
              required: "Name is required.",
              pattern: {
                value: USERNAME_REGEX,
                message: "Invalid Name.",
              },
            })}
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Phone number
          </label>
          <input
            type="number"
            id="phone"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="9876543210"
            {...register("phone", {
              required: "Phone is required.",
            })}
          />
          <p className="text-red-500 text-sm">{errors.phone?.message}</p>
        </div>
        <div>
          <label
            htmlFor="city"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Address city
          </label>
          <input
            type="text"
            id="city"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Kathmandu"
            {...register("city", {
              required: "Address city is required.",
            })}
          />
          <p className="text-red-500 text-sm">{errors.city?.message}</p>
        </div>
        <div>
          <label
            htmlFor="province"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Province
          </label>
          <select
            id="province"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("province", {
              required: "Province is required.",
            })}
            defaultValue="">
            <option value="" disabled>
              Select province
            </option>
            <option value="Bagmati">Bagmati</option>
            <option value="Gandaki">Gandaki</option>
            <option value="Karnali">Karnali</option>
            <option value="Koshi">Koshi</option>
            <option value="Lumbini">Lumbini</option>
            <option value="Madhesh">Madhesh</option>
            <option value="Sudurpashchim">Sudurpashchim</option>
          </select>
          <p className="text-red-500 text-sm">{errors.province?.message}</p>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
        <div>
          <label
            htmlFor="confirm-password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Confirm password
          </label>
          <PasswordField
            id="confirm-password"
            {...register("confirmPassword", {
              required: "Confirm password is required.",
              validate: (value) => {
                return value == password || "Passwords do not match.";
              },
            })}
          />
          <p className="text-red-500 text-sm">
            {errors.confirmPassword?.message}
          </p>
        </div>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input id="terms" type="checkbox" className="w-4 h-4" />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="terms"
              className="font-light text-gray-700 dark:text-gray-300">
              I accept the{" "}
              <a className="font-medium text-primary hover:underline" href="#">
                Terms and Conditions
              </a>
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full text-white bg-primary hover:opacity-90 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-80">
          <span>Create an account</span>
          {loading && <Spinner className="h-5 w-5 ml-2" />}
        </button>
        <p className="text-sm font-light text-gray-700 dark:text-gray-300">
          Already have an account?
          <Link
            href={LOGIN_ROUTE}
            className="font-medium text-primary hover:underline ml-2">
            Login here
          </Link>
        </p>
      </form>
    </section>
  );
}

export default RegisterPage;
