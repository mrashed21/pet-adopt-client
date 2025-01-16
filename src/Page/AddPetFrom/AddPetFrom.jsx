
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

const AddPetForm = () => {
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

  const petCategories = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "bird", label: "Bird" },
    { value: "rabbit", label: "Rabbit" },
    { value: "other", label: "Other" },
  ];

  // Function to strip HTML tags and normalize content
  const stripHtmlAndNormalize = (html) => {
    if (!html) return "";
    
    // Create a temporary div to hold the HTML content
    const temp = document.createElement("div");
    temp.innerHTML = html;
    
    // Get text content and normalize whitespace
    const text = temp.textContent || temp.innerText;
    return text.trim().replace(/\s+/g, " ");
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "pet_adopt");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dablesuiy/image/upload",
        formData
      );
      setUploading(false);
      return response.data.secure_url;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed.");
    }
  };

  const onSubmit = async (data) => {
    try {
      const petImageFile = data.petImage[0];
      if (!petImageFile) {
        setError("petImage", {
          type: "manual",
          message: "Pet image is required.",
        });
        return;
      }

      const imageUrl = await uploadImage(petImageFile);

      if (!imageUrl) {
        setError("petImage", {
          type: "manual",
          message: "Failed to upload pet image.",
        });
        return;
      }

      if (!longDescription) {
        setError("longDescription", {
          type: "manual",
          message: "Long description is required.",
        });
        return;
      }

      // Strip HTML tags from long description
      const cleanedLongDescription = stripHtmlAndNormalize(longDescription);

      const petData = {
        name: data.petName,
        age: parseInt(data.petAge, 10),
        category: data.petCategory?.value,
        location: data.petLocation,
        shortDescription: data.shortDescription,
        longDescription: cleanedLongDescription, // Use cleaned description
        imageUrl,
      };

      const response = await axios.post("http://localhost:5000/pets/add", petData);
      
      if (response.data.message === "Pet added successfully") {
        reset();
        setLongDescription("");
        alert("Pet added successfully!");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      setError("general", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  // Custom Quill modules to control formatting options
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Pet Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Pet Image</label>
        <input
          type="file"
          accept="image/*"
          {...register("petImage", { required: "Pet image is required" })}
          className="block w-full border rounded-md px-3 py-2"
        />
        {errors.petImage && (
          <div className="text-red-500 text-sm">{errors.petImage.message}</div>
        )}
      </div>

      {/* Pet Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Pet Name</label>
        <input
          type="text"
          {...register("petName", { required: "Pet name is required" })}
          className="block w-full border rounded-md px-3 py-2"
        />
        {errors.petName && (
          <div className="text-red-500 text-sm">{errors.petName.message}</div>
        )}
      </div>

      {/* Pet Age */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Pet Age</label>
        <input
          type="number"
          {...register("petAge", {
            required: "Pet age is required",
            min: { value: 0, message: "Age must be positive" },
            valueAsNumber: true,
          })}
          className="block w-full border rounded-md px-3 py-2"
        />
        {errors.petAge && (
          <div className="text-red-500 text-sm">{errors.petAge.message}</div>
        )}
      </div>

      {/* Pet Category */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Pet Category</label>
        <Controller
          name="petCategory"
          control={control}
          rules={{ required: "Pet category is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={petCategories}
              placeholder="Select a category"
              className="basic-single"
            />
          )}
        />
        {errors.petCategory && (
          <div className="text-red-500 text-sm">{errors.petCategory.message}</div>
        )}
      </div>

      {/* Pet Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Pet Location</label>
        <input
          type="text"
          {...register("petLocation", { required: "Pet location is required" })}
          className="block w-full border rounded-md px-3 py-2"
        />
        {errors.petLocation && (
          <div className="text-red-500 text-sm">{errors.petLocation.message}</div>
        )}
      </div>

      {/* Short Description */}
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
          className="block w-full border rounded-md px-3 py-2"
        />
        {errors.shortDescription && (
          <div className="text-red-500 text-sm">
            {errors.shortDescription.message}
          </div>
        )}
      </div>

      {/* Long Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Long Description</label>
        <ReactQuill
          value={longDescription}
          onChange={setLongDescription}
          modules={quillModules}
          className="h-48"
        />
        {errors.longDescription && (
          <div className="text-red-500 text-sm">
            {errors.longDescription.message}
          </div>
        )}
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="text-red-500 text-sm p-3 border border-red-300 rounded">
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
        {uploading ? "Uploading..." : isSubmitting ? "Adding Pet..." : "Add Pet"}
      </button>
    </form>
  );
};

export default AddPetForm;