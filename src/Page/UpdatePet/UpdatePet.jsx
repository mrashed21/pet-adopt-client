/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import SkeletonCard from "../../Common/Skeleton/SkeletonCard";
import useAxiosSecure from "../../Hooks/UseAxiosSecure/useAxiosSecure";

const PET_CATEGORIES = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "rabbit", label: "Rabbit" },
  { value: "other", label: "Other" },
];

const UpdatePet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await axiosSecure.get(`/pets/${id}`);
        setPet(response.data);
        setError(null);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.response?.data?.message || "Error fetching pet details");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setPet((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle category change with react-select
  const handleCategoryChange = (selectedOption) => {
    setPet((prev) => ({
      ...prev,
      category: selectedOption ? selectedOption.value : "",
    }));
  };

  // Validate form data
  const validateForm = () => {
    if (!pet.name?.trim()) return "Pet name is required";
    if (pet.age < 0) return "Age cannot be negative";
    if (!pet.category?.trim()) return "Category is required";
    if (!pet.location?.trim()) return "Location is required";
    if (!pet.shortDescription?.trim()) return "Short description is required";
    if (pet.shortDescription.length > 150)
      return "Short description must be less than 150 characters";
    if (!pet.longDescription?.trim()) return "Long description is required";
    if (!pet.imageUrl?.trim()) return "Image URL is required";
    if (!pet.imageUrl.startsWith("http"))
      return "Please enter a valid image URL";
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setUpdating(true);
    setError(null);

    let imageUrl = pet.imageUrl;

    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "pet_adopt");
        const uploadResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dablesuiy/image/upload",
          formData
        );
        imageUrl = uploadResponse.data.secure_url;
      } catch (uploadError) {
        setError("Error uploading image.");
        setUpdating(false);
        return;
      }
    }

    // Update the pet data in the database
    const { _id, ...petData } = pet;
    try {
      const response = await axiosSecure.put(`/pets/${id}`, {
        ...petData,
        imageUrl,
        age: Number(pet.age),
      });
      console.log("Update response:", response.data);
      Swal.fire({
        title: "Pet updated successfully!",
        icon: "success",
        draggable: true,
      });
      navigate(-1);
    } catch (error) {
      console.error("Update error:", error.response?.data);
      setError(error.response?.data?.message || "Error updating pet");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <SkeletonCard />;
  if (!pet) return <div className="text-center mt-8">Pet not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Update Pet Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={pet.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Age:</label>
            <input
              type="number"
              name="age"
              value={pet.age}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category:</label>
            <Select
              name="category"
              value={PET_CATEGORIES.find((cat) => cat.value === pet.category)}
              onChange={handleCategoryChange}
              options={PET_CATEGORIES}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location:</label>
            <input
              type="text"
              name="location"
              value={pet.location}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Short Description:
          </label>
          <input
            type="text"
            name="shortDescription"
            value={pet.shortDescription}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength="150"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Long Description:
          </label>
          <textarea
            name="longDescription"
            value={pet.longDescription}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            rows="4"
          />
        </div>
        <div>
          <img className="w-44 h-44" src={pet.imageUrl} alt="" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Image Upload:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-4 justify-center mt-8">
          <button
            type="submit"
            disabled={updating}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition duration-200"
          >
            {updating ? "Updating..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePet;
