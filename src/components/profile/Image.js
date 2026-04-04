import Image from "next/image";
import Spinner from "../Spinner";
import placeholder from "@/assets/images/product-placeholder.jpeg";
import { PiUpload } from "react-icons/pi";
import { toast } from "react-toastify";
import { updateUserData } from "@/redux/auth/authSlice";
import { uploadProfileImage } from "@/api/users";
import { useDispatch } from "react-redux";
import { useState } from "react";

function ProfileImage({ user }) {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const dispatch = useDispatch();

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // Create preview URL for immediate display
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function updateImage() {
    if (!profileImage) {
      toast.error("Please select an image first", { autoClose: 750 });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", profileImage);

    uploadProfileImage(formData)
      .then((response) => {
        console.log("Upload response:", response);
        // Response is already wrapped by axios, so we access the data directly
        const responseData = response?.data || response;
        const imageUrl = responseData?.profileImageUrl;
        
        if (!imageUrl) {
          console.error("Response data:", responseData);
          throw new Error("No image URL in response");
        }

        // Add cache buster to ensure fresh image display
        const imageUrlWithCache = `${imageUrl}?t=${Date.now()}`;

        // Update Redux with new profile image
        dispatch(
          updateUserData({
            ...user,
            profileImageUrl: imageUrlWithCache,
          })
        );

        // Force re-render by clearing preview
        setTimeout(() => {
          setPreviewUrl(null);
          setProfileImage(null);
        }, 100);

        toast.success("Profile image updated successfully!", {
          autoClose: 750,
        });
      })
      .catch((error) => {
        console.error("Upload error details:", error.response?.data || error.message);
        toast.error(
          error?.response?.data?.message || error?.message || "Failed to upload image", 
          { autoClose: 750 }
        );
        // Reset on error
        setProfileImage(null);
        setPreviewUrl(null);
      })
      .finally(() => {
        setLoading(false);
        // Clear is now handled in the promise chains above
      });
  }

  return (
    <div className="py-5 flex items-center gap-5">
      <div className="relative">
        <Image
          key={previewUrl || user.profileImageUrl}
          src={previewUrl || user.profileImageUrl || placeholder}
          alt="Profile picture"
          height={128}
          width={128}
          unoptimized={!!(previewUrl || user.profileImageUrl)}
          priority
          className="w-32 h-32 rounded-full border-4 p-1 border-primary object-cover"
        />
        {previewUrl && (
          <div className="absolute inset-0 rounded-full border-4 border-green-500 bg-green-500/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">Preview</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-3">
        <div>
          <label
            htmlFor="profile-image"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Choose Image
          </label>
          <input
            type="file"
            id="profile-image"
            className="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
            accept=".png,.jpg,.jpeg,.webp"
            onChange={handleFileSelect}
            disabled={loading}
          />
          {profileImage && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              ✓ {profileImage.name}
            </p>
          )}
        </div>

        <button
          onClick={updateImage}
          type="button"
          disabled={!profileImage || loading}
          className="text-white bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <Spinner className="h-5 w-5 me-2" />
              Uploading...
            </>
          ) : (
            <>
              <PiUpload className="h-5 w-5 me-2" />
              Upload image
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProfileImage;
