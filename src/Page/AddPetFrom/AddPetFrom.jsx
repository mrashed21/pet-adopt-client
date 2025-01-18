import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { AuthContext } from "../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../Hooks/UseAxiosSecure/useAxiosSecure";

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
const AddPetForm = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [longDescription, setLongDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file) => {
    if (!file) return null;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "pet_adopt");
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dablesuiy/image/upload",
        formData
      );
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };
  const validationSchema = Yup.object({
    petName: Yup.string().required("Pet name is required"),
    petAge: Yup.string()
      .required("Pet age is required")
      .matches(/^\d+$/, "Age must be a number"),
    petCategory: Yup.object().required("Pet category is required"),
    petLocation: Yup.string().required("Pet location is required"),
    shortDescription: Yup.string()
      .required("Short description is required")
      .max(150, "Maximum 150 characters allowed"),
    petImage: Yup.mixed().required("Pet image is required"),
  });
  const onSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => {
    try {
      const petImageFile = values.petImage;
      const imageUrl = await uploadImage(petImageFile);
      if (!imageUrl) {
        setFieldError("petImage", "Failed to upload pet image");
        return;
      }
      const petData = {
        name: values.petName,
        age: parseInt(values.petAge, 10),
        category: values.petCategory?.value,
        location: values.petLocation,
        shortDescription: values.shortDescription,
        longDescription,
        imageUrl,
        userEmail: user?.email,
      };
      const { data: responseData } = await axiosSecure.post(
        "/pets/add",
        petData
      );
      if (responseData.message === "Pet added successfully") {
        resetForm();
        setLongDescription("");
        Swal.fire({
          title: "Pet added successfully!",
          icon: "success",
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setFieldError(
        "general",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={{
        petName: "",
        petAge: "",
        petCategory: null,
        petLocation: "",
        shortDescription: "",
        petImage: null,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow rounded-lg">
          {/* Pet Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Pet Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setFieldValue("petImage", event.currentTarget.files[0])
              }
              className="block w-full border rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <ErrorMessage
              name="petImage"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Pet Information Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Pet Name</label>
              <Field
                type="text"
                name="petName"
                className="block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="petName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Pet Age</label>
              <Field
                type="text"
                name="petAge"
                className="block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="petAge"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          {/* Category and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Pet Category</label>
              <Select
                name="petCategory"
                options={PET_CATEGORIES}
                onChange={(option) => setFieldValue("petCategory", option)}
                placeholder="Select a category"
                className="basic-single"
                classNamePrefix="select"
              />
              <ErrorMessage
                name="petCategory"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Pet Location</label>
              <Field
                type="text"
                name="petLocation"
                className="block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="petLocation"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Short Description
            </label>
            <Field
              type="text"
              name="shortDescription"
              className="block w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <ErrorMessage
              name="shortDescription"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="space-y-2 pb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long Description
            </label>
            <div className="">
              <ReactQuill
                value={longDescription}
                onChange={setLongDescription}
                modules={QUILL_MODULES}
                className="h-52"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="">
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isSubmitting || uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting || uploading}
            >
              {uploading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Uploading...</span>
                </span>
              ) : isSubmitting ? (
                "Adding Pet..."
              ) : (
                "Add Pet"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddPetForm;
