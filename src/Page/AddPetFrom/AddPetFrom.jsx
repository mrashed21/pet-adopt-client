// // // const AddPetFrom = () => {
// // //   return <div>this is add pet form</div>;
// // // };

// // // export default AddPetFrom;

// // import axios from "axios";
// // import { Field, Form, Formik } from "formik";
// // import ReactQuill from "react-quill";
// // import "react-quill/dist/quill.snow.css";
// // import Select from "react-select";

// // const AddPetForm = () => {
// //   const petCategories = [
// //     { value: "dog", label: "Dog" },
// //     { value: "cat", label: "Cat" },
// //     { value: "bird", label: "Bird" },
// //     { value: "rabbit", label: "Rabbit" },
// //   ];

// //   const handleImageUpload = async (file) => {
// //     const formData = new FormData();
// //     formData.append("file", file);
// //     formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary preset

// //     const response = await axios.post(
// //       `https://api.cloudinary.com/v1_1/dablesuiy/image/upload`,
// //       formData
// //     );
// //     console.log(response.data.secure_url);
// //     // return ;
// //   };

// //   return (
// //     <Formik
// //       initialValues={{
// //         name: "",
// //         age: "",
// //         category: "",
// //         location: "",
// //         shortDescription: "",
// //         longDescription: "",
// //         image: null,
// //       }}
// //       onSubmit={async (values, { setSubmitting, setFieldError }) => {
// //         try {
// //           const imageUrl = await handleImageUpload(values.image);
// //           const petData = {
// //             ...values,
// //             imageUrl,
// //             adopted: false,
// //             createdAt: new Date(),
// //           };

// //           await axios.post("http://localhost:5000/pets/add", petData);
// //           alert("Pet added successfully!");
// //         } catch (error) {
// //           setFieldError("general", "Failed to add pet. Try again.");
// //         } finally {
// //           setSubmitting(false);
// //         }
// //       }}
// //     >
// //       {({ setFieldValue, isSubmitting, errors }) => (
// //         <Form>
// //           <div>
// //             <label>Pet Name:</label>
// //             <Field name="name" type="text" required />
// //           </div>
// //           <div>
// //             <label>Pet Age:</label>
// //             <Field name="age" type="number" required />
// //           </div>
// //           <div>
// //             <label>Category:</label>
// //             <Select
// //               options={petCategories}
// //               onChange={(option) => setFieldValue("category", option.value)}
// //             />
// //           </div>
// //           <div>
// //             <label>Location:</label>
// //             <Field name="location" type="text" required />
// //           </div>
// //           <div>
// //             <label>Short Description:</label>
// //             <Field name="shortDescription" type="text" required />
// //           </div>
// //           <div>
// //             <label>Long Description:</label>
// //             <ReactQuill
// //               onChange={(value) => setFieldValue("longDescription", value)}
// //             />
// //           </div>
// //           <div>
// //             <label>Pet Image:</label>
// //             <input
// //               type="file"
// //               accept="image/*"
// //               onChange={(event) =>
// //                 setFieldValue("image", event.currentTarget.files[0])
// //               }
// //               required
// //             />
// //           </div>
// //           {errors.general && <p>{errors.general}</p>}
// //           <button type="submit" disabled={isSubmitting}>
// //             Submit
// //           </button>
// //         </Form>
// //       )}
// //     </Formik>
// //   );
// // };

// // export default AddPetForm;

// import axios from "axios";
// import { Field, Form, Formik } from "formik";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import Select from "react-select";
// import * as Yup from "yup";

// const AddPetForm = () => {
//   const petCategories = [
//     { value: "dog", label: "Dog" },
//     { value: "cat", label: "Cat" },
//     { value: "bird", label: "Bird" },
//     { value: "rabbit", label: "Rabbit" },
//   ];

//   const handleImageUpload = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "pet_adopt"); // Replace with your Cloudinary preset

//     try {
//       const response = await axios.post(
//         "https://api.cloudinary.com/v1_1/dablesuiy/image/upload",
//         formData
//       );
//       console.log("Uploaded Image URL:", response.data);
//       return response.data.url;
//     } catch (error) {
//       console.error(
//         "Cloudinary upload error:",
//         error.response?.data || error.message
//       );
//       throw new Error("Image upload failed. Please try again.");
//     }
//   };

//   return (
//     <Formik
//       initialValues={{
//         name: "",
//         age: "",
//         category: "",
//         location: "",
//         shortDescription: "",
//         longDescription: "",
//         image: null,
//       }}
//       validationSchema={Yup.object({
//         name: Yup.string().required("Pet name is required"),
//         age: Yup.number().required("Pet age is required").positive().integer(),
//         category: Yup.string().required("Pet category is required"),
//         location: Yup.string().required("Location is required"),
//         shortDescription: Yup.string().required(
//           "Short description is required"
//         ),
//         longDescription: Yup.string().required("Long description is required"),
//         image: Yup.mixed().required("Pet image is required"),
//       })}
//       onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
//         try {
//           const imageUrl = await handleImageUpload(values.image);
//           const petData = {
//             ...values,
//             image: imageUrl, // Use the uploaded image URL
//             adopted: false,
//             createdAt: new Date(),
//           };

//           await axios.post("http://localhost:5000/pets/add", petData);
//           alert("Pet added successfully!");
//           resetForm(); // Reset the form on successful submission
//         } catch (error) {
//           console.error("Error adding pet:", error.message);
//           setFieldError("general", "Failed to add pet. Please try again.");
//         } finally {
//           setSubmitting(false);
//         }
//       }}
//     >
//       {({ setFieldValue, isSubmitting, errors, touched }) => (
//         <Form>
//           <div>
//             <label>Pet Name:</label>
//             <Field name="name" type="text" />
//             {touched.name && errors.name && (
//               <div className="error">{errors.name}</div>
//             )}
//           </div>

//           <div>
//             <label>Pet Age:</label>
//             <Field name="age" type="number" />
//             {touched.age && errors.age && (
//               <div className="error">{errors.age}</div>
//             )}
//           </div>

//           <div>
//             <label>Category:</label>
//             <Select
//               options={petCategories}
//               onChange={(option) => setFieldValue("category", option.value)}
//             />
//             {touched.category && errors.category && (
//               <div className="error">{errors.category}</div>
//             )}
//           </div>

//           <div>
//             <label>Location:</label>
//             <Field name="location" type="text" />
//             {touched.location && errors.location && (
//               <div className="error">{errors.location}</div>
//             )}
//           </div>

//           <div>
//             <label>Short Description:</label>
//             <Field name="shortDescription" type="text" />
//             {touched.shortDescription && errors.shortDescription && (
//               <div className="error">{errors.shortDescription}</div>
//             )}
//           </div>

//           <div>
//             <label>Long Description:</label>
//             <ReactQuill
//               onChange={(value) => setFieldValue("longDescription", value)}
//             />
//             {touched.longDescription && errors.longDescription && (
//               <div className="error">{errors.longDescription}</div>
//             )}
//           </div>

//           <div>
//             <label>Pet Image:</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(event) =>
//                 setFieldValue("image", event.currentTarget.files[0])
//               }
//             />
//             {touched.image && errors.image && (
//               <div className="error">{errors.image}</div>
//             )}
//           </div>

//           {errors.general && <div className="error">{errors.general}</div>}

//           <button type="submit" disabled={isSubmitting}>
//             Submit
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default AddPetForm;

// import axios from "axios";
// import { ErrorMessage, Field, Form, Formik } from "formik";
// import { useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import Select from "react-select";
// import * as Yup from "yup";

// const AddPetForm = () => {
//   const [longDescription, setLongDescription] = useState("");

//   // Options for pet categories
//   const petCategories = [
//     { value: "dog", label: "Dog" },
//     { value: "cat", label: "Cat" },
//     { value: "bird", label: "Bird" },
//     { value: "rabbit", label: "Rabbit" },
//     { value: "other", label: "Other" },
//   ];

//   // Cloudinary API configuration
//   const uploadImage = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "pet_adopt"); // Replace with your Cloudinary preset
//     const response = await axios.post(
//       "https://api.cloudinary.com/v1_1/dablesuiy/image/upload", // Replace with your Cloudinary URL
//       formData
//     );
//     return response.data.secure_url; // Returns the uploaded image URL
//   };

//   // Form validation schema
//   const validationSchema = Yup.object({
//     petName: Yup.string().required("Pet name is required"),
//     petAge: Yup.string().required("Pet age is required"),
//     petCategory: Yup.object().required("Pet category is required"),
//     petLocation: Yup.string().required("Pet location is required"),
//     shortDescription: Yup.string()
//       .max(150, "Short description should be less than 150 characters")
//       .required("Short description is required"),
//   });

//   return (
//     <Formik
//       initialValues={{
//         petImage: null,
//         petName: "",
//         petAge: "",
//         petCategory: null,
//         petLocation: "",
//         shortDescription: "",
//       }}
//       validationSchema={validationSchema}
//       onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {
//         try {
//           setSubmitting(true);
//           const petImage = await uploadImage(values.petImage);

//           const petData = {
//             petImage,
//             petName: values.petName,
//             petAge: values.petAge,
//             petCategory: values.petCategory.value,
//             petLocation: values.petLocation,
//             shortDescription: values.shortDescription,
//             longDescription,
//             dateAdded: new Date().toISOString(),
//             adopted: false,
//           };

//           // Send data to the backend
//           await axios.post("http://localhost:5000/pets/add", petData); // Replace with your backend API endpoint
//           resetForm();
//           setLongDescription("");
//           alert("Pet added successfully!");
//         } catch (error) {
//           console.error(error);
//           setFieldError("general", "Something went wrong. Please try again.");
//         } finally {
//           setSubmitting(false);
//         }
//       }}
//     >
//       {({ setFieldValue, isSubmitting, errors }) => (
//         <Form className="space-y-4">
//           {/* Pet Image */}
//           <div>
//             <label>Pet Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(event) =>
//                 setFieldValue("petImage", event.target.files[0])
//               }
//               className="block w-full"
//             />
//             <ErrorMessage
//               name="petImage"
//               component="div"
//               className="text-red-500 text-sm"
//             />
//           </div>

//           {/* Pet Name */}
//           <div>
//             <label>Pet Name</label>
//             <Field name="petName" type="text" className="block w-full" />
//             <ErrorMessage
//               name="petName"
//               component="div"
//               className="text-red-500 text-sm"
//             />
//           </div>

//           {/* Pet Age */}
//           <div>
//             <label>Pet Age</label>
//             <Field name="petAge" type="text" className="block w-full" />
//             <ErrorMessage
//               name="petAge"
//               component="div"
//               className="text-red-500 text-sm"
//             />
//           </div>

//           {/* Pet Category */}
//           <div>
//             <label>Pet Category</label>
//             <Select
//               options={petCategories}
//               onChange={(selectedOption) =>
//                 setFieldValue("petCategory", selectedOption)
//               }
//               placeholder="Select a category"
//             />
//             <ErrorMessage
//               name="petCategory"
//               component="div"
//               className="text-red-500 text-sm"
//             />
//           </div>

//           {/* Pet Location */}
//           <div>
//             <label>Pet Location</label>
//             <Field name="petLocation" type="text" className="block w-full" />
//             <ErrorMessage
//               name="petLocation"
//               component="div"
//               className="text-red-500 text-sm"
//             />
//           </div>

//           {/* Short Description */}
//           <div>
//             <label>Short Description</label>
//             <Field
//               name="shortDescription"
//               type="text"
//               className="block w-full"
//             />
//             <ErrorMessage
//               name="shortDescription"
//               component="div"
//               className="text-red-500 text-sm"
//             />
//           </div>

//           {/* Long Description */}
//           <div>
//             <label>Long Description</label>
//             <ReactQuill value={longDescription} onChange={setLongDescription} />
//           </div>

//           {/* General Error */}
//           {errors.general && (
//             <div className="text-red-500 text-sm">{errors.general}</div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Submitting..." : "Add Pet"}
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default AddPetForm;import React, { useState } from "react";import React, { useState } from "react";

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

      const petData = {
        name: data.petName,
        age: parseInt(data.petAge, 10),
        category: data.petCategory?.value,
        location: data.petLocation,
        shortDescription: data.shortDescription,
        longDescription: longDescription,
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