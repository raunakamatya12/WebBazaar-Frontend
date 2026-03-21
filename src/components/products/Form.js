"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createProduct, updateProduct } from "@/api/products";
import { IoCloudUploadOutline } from "react-icons/io5";
import Spinner from "../Spinner";
import Image from "next/image";
import { PRODUCT_NAME_REGEX } from "@/constants/regex";

function ProductForm({ id, product, categories }) {
  const [loading, setLoading] = useState(false);
  const [localImageUrls, setLocalImageUrls] = useState([]);
  const [productImages, setProductImages] = useState([]);

  const { register, handleSubmit, reset } = useForm({
    values: product,
  });

  function prepareData(data) {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("brand", data.brand);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("stock", data.stock);

    if (data.description) {
      formData.append("description", data.description);
    }

    if (productImages.length > 0) {
      productImages.map((image) => {
        formData.append("images", image);
      });
    }

    return formData;

  }

  async function submitForm(data) {
    setLoading(true);

    const formData = prepareData(data);

    try {
    
      if (product) {
        await updateProduct(id, formData);

        toast.success("Product updated successfully", { autoClose: 750 });

        return;
      }

      await createProduct(formData);
      console.log(formData)

      reset();
      toast.success("Product added successfully", { autoClose: 750 });
    } catch (error) {
      toast.error(error.response.data, { autoClose: 750 });
    } finally {
      setLoading(false);
      setLocalImageUrls([]);
      setProductImages([]);
    }
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Type product name"
            required
            {...register("name", {
              required: "Name is required.",
              pattern: {
                value: PRODUCT_NAME_REGEX,
                message: "Invalid Product Name",
              },
            })}
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="brand"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Product brand"
            required
            {...register("brand")}
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Category
          </label>
          <input
            type="text"
            id="category"
            list="categories"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Product category"
            required
            {...register("category")}
          />
          <datalist id="categories">
            {categories?.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </datalist>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="price"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Price
          </label>
          <input
            type="number"
            id="price"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Rs. 2999"
            required
            {...register("price")}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="stock"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="10"
            required
            min="0"
            {...register("stock")}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Description
          </label>
          <textarea
            id="description"
            rows={6}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Your description here"
            {...register("description")}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="images"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <IoCloudUploadOutline className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG
              </p>
            </div>
            <input
              id="images"
              name="images"
              type="file"
              className="hidden"
              multiple
              accept=".png,.jpg,.jpeg"
              onChange={(e) => {
                const files = [];
                const urls = [];

                Array.from(e.target.files).map((file) => {
                  files.push(file);
                  urls.push(URL.createObjectURL(file));
                });

                setLocalImageUrls(urls);
                setProductImages(files);
              }}
            />
          </label>
          {localImageUrls.length > 0 && (
            <div className="flex items-center gap-3 py-3">
              {localImageUrls.map((url, index) => (
                <Image
                  src={url}
                  key={index}
                  alt="asdf"
                  height={200}
                  width={200}
                  className="h-16 w-auto bg-slate-200 dark:bg-slate-700 p-1 rounded-md"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:opacity-80 disabled:opacity-80"
        disabled={loading}>
        {product ? "Edit product" : "Add product"}
        {loading && <Spinner className="ml-2 h-4 w-4" />}
      </button>
    </form>
  );
}

export default ProductForm;
