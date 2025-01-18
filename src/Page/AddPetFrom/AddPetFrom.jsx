import axios from "axios";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { AuthContext } from "../../Context/Auth/AuthProvider";

// Constants
const PET_CATEGORIES = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "rabbit", label: "Rabbit" },
  { value: "other", label: "Other" },
];

const QUILL_MODULES = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dablesuiy/image/upload";
const API_ENDPOINT = "http://localhost:5000/pets/add";

const AddPetForm = () => {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const [longDescription, setLongDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const stripHtmlAndNormalize = (html) => {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return (temp.textContent || temp.innerText).trim().replace(/\s+/g, " ");
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "pet_adopt");

      const { data } = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Validate image
      const petImageFile = data.petImage[0];
      if (!petImageFile) {
        setError("petImage", {
          type: "manual",
          message: "Pet image is required",
        });
        return;
      }

      // Validate description
      if (!longDescription) {
        setError("longDescription", {
          type: "manual",
          message: "Long description is required",
        });
        return;
      }

      // Upload image and prepare data
      const imageUrl = await uploadImage(petImageFile);
      if (!imageUrl) {
        setError("petImage", {
          type: "manual",
          message: "Failed to upload pet image",
        });
        return;
      }

      const petData = {
        name: data.petName,
        age: parseInt(data.petAge, 10),
        category: data.petCategory?.value,
        location: data.petLocation,
        shortDescription: data.shortDescription,
        longDescription: stripHtmlAndNormalize(longDescription),
        imageUrl,
        userEmail: user?.email,
      };

      const { data: responseData } = await axios.post(API_ENDPOINT, petData);

      if (responseData.message === "Pet added successfully") {
        reset();
        setLongDescription("");
        alert("Pet added successfully!");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setError("general", {
        type: "manual",
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 space-y-6"
    >
      {/* Pet Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Pet Image</label>
        <input
          type="file"
          accept="image/*"
          {...register("petImage", { required: "Pet image is required" })}
          className="block w-full border rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.petImage && (
          <div className="text-red-500 text-sm">{errors.petImage.message}</div>
        )}
      </div>

      {/* Pet Information Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Pet Name</label>
          <input
            type="text"
            {...register("petName", { required: "Pet name is required" })}
            className="block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.petName && (
            <div className="text-red-500 text-sm">{errors.petName.message}</div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Pet Age</label>
          <input
            type="number"
            {...register("petAge", {
              required: "Pet age is required",
              min: { value: 0, message: "Age must be positive" },
              valueAsNumber: true,
            })}
            className="block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.petAge && (
            <div className="text-red-500 text-sm">{errors.petAge.message}</div>
          )}
        </div>
      </div>

      {/* Category and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Pet Category</label>
          <Controller
            name="petCategory"
            control={control}
            rules={{ required: "Pet category is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={PET_CATEGORIES}
                placeholder="Select a category"
                className="basic-single"
                classNamePrefix="select"
              />
            )}
          />
          {errors.petCategory && (
            <div className="text-red-500 text-sm">
              {errors.petCategory.message}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Pet Location</label>
          <input
            type="text"
            {...register("petLocation", {
              required: "Pet location is required",
            })}
            className="block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.petLocation && (
            <div className="text-red-500 text-sm">
              {errors.petLocation.message}
            </div>
          )}
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Short Description</label>
        <input
          type="text"
          {...register("shortDescription", {
            required: "Short description is required",
            maxLength: {
              value: 150,
              message: "Maximum 150 characters allowed",
            },
          })}
          className="block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
        {errors.shortDescription && (
          <div className="text-red-500 text-sm">
            {errors.shortDescription.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Long Description</label>
        <ReactQuill
          value={longDescription}
          onChange={setLongDescription}
          modules={QUILL_MODULES}
          className="h-48 bg-white"
        />
        {errors.longDescription && (
          <div className="text-red-500 text-sm">
            {errors.longDescription.message}
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.general && (
        <div className="text-red-500 text-sm p-3 border border-red-300 rounded bg-red-50">
          {errors.general.message}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${
          isSubmitting || uploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting || uploading}
      >
        {uploading
          ? "Uploading..."
          : isSubmitting
          ? "Adding Pet..."
          : "Add Pet"}
      </button>
    </form>
  );
};

export default AddPetForm;
