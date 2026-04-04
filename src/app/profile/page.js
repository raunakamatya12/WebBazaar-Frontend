"use client";

import Spinner from "@/components/Spinner";
import { EMAIL_REGEX } from "@/constants/regex";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/api/users";
import { toast } from "react-toastify";
import { updateUserData } from "@/redux/auth/authSlice";
import ProfileImage from "@/components/profile/Image";
import { useRouter } from "next/navigation";
import { LOGIN_ROUTE } from "@/constants/routes";

function ProfilePage() {
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    if (user == null) router.push(LOGIN_ROUTE);
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    values: user
      ? {
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.address.city,
          province: user.address.province,
          street: user.address.street,
        }
      : null,
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.address.city,
        province: user.address.province,
        street: user.address.street,
      });
    }
  }, [user, reset]);

  function submitForm(data) {
    setLoading(true);
    updateUser(user.id, {
      name: data.name,
      phone: data.phone,
      address: {
        street: data.street,
        city: data.city,
        province: data.province,
      },
    })
      .then(() => {
        dispatch(
          updateUserData({
            ...user,
            name: data.name,
            phone: data.phone,
            address: {
              ...user.address,
              street: data.street,
              city: data.city,
              province: data.province,
            },
          })
        );

        toast.success("Profile updated successfully.", { autoClose: 750 });
      })
      .catch((error) => toast.error(error.response.data, { autoClose: 750 }))
      .finally(() => setLoading(false));
  }

  if (!user)
    return (
      <div className="flex justify-center w-full">
        <Spinner className="h-10 w-10" />
      </div>
    );

  return (
    <section className="mx-auto md:w-2/3 lg:w-1/2">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-5">
        Account
      </h1>

      <ProfileImage user={user} />

      <form
        className="space-y-4 md:space-y-6"
        onSubmit={handleSubmit(submitForm)}
      >
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your name
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="John doe"
            {...register("name", {
              required: "Name is required.",
            })}
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:text-gray-500 disabled:bg-gray-100 dark:disabled:text-gray-300 dark:disabled:bg-gray-600"
            placeholder="name@company.com"
            disabled
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
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone number
          </label>
          <input
            type="tel"
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
            htmlFor="street"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Street
          </label>
          <input
            type="text"
            id="street"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Baneshwor"
            {...register("street")}
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            City
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
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Province
          </label>
          <select
            id="province"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("province", {
              required: "Province is required.",
            })}
            defaultValue=""
          >
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

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-80 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <span>Update profile</span>
          {loading && <Spinner className="h-5 w-5 ml-2" />}
        </button>
      </form>
    </section>
  );
}

export default ProfilePage;
