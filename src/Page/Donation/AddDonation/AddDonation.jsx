// import {
//   Button,
//   Card,
//   CardBody,
//   CardFooter,
//   Input,
//   Textarea,
//   Typography,
// } from "@material-tailwind/react";
// import axios from "axios";
// import { isValid, parseISO } from "date-fns";
// import { useState } from "react";
// import { useForm } from "react-hook-form";

// const AddDonation = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
//   const [petPicture, setPetPicture] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleFileChange = (e) => {
//     setPetPicture(e.target.files[0]);
//   };

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);

//     const formData = new FormData();
//     formData.append("file", petPicture);
//     formData.append("upload_preset", "pet_adopt");
//     let imageUrl;
//     try {
//       const res = await axios.post(
//         "https://api.cloudinary.com/v1_1/dablesuiy/image/upload",
//         formData
//       );
//       imageUrl = res.data.secure_url;
//     } catch (err) {
//       console.error("Image upload failed:", err);
//       setIsSubmitting(false);
//       return;
//     }

//     // Create the donation campaign
//     const donationCampaign = {
//       petPicture: imageUrl,
//       maxDonation: data.maxDonation,
//       lastDate: data.lastDate,
//       shortDescription: data.shortDescription,
//       longDescription: data.longDescription,
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       await axios.post(
//         "http://localhost:5000/donation-campaigns",
//         donationCampaign
//       );
//       setIsSubmitting(false);
//       alert("Donation campaign created successfully!");
//     } catch (err) {
//       console.error("Failed to create donation campaign:", err);
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <Card className="w-full max-w-lg p-6">
//         <CardBody>
//           <Typography
//             variant="h4"
//             color="blue-gray"
//             className="mb-4 text-center"
//           >
//             Create Donation Campaign
//           </Typography>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             {/* Pet Picture */}
//             <div className="mb-4">
//               <label
//                 htmlFor="pet-picture"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Pet Picture
//               </label>
//               <Input
//                 type="file"
//                 id="pet-picture"
//                 {...register("petPicture", {
//                   required: "Pet picture is required",
//                 })}
//                 onChange={handleFileChange}
//                 accept="image/*"
//               />
//               {errors.petPicture && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.petPicture.message}
//                 </p>
//               )}
//             </div>

//             {/* Maximum Donation */}
//             <div className="mb-4">
//               <label
//                 htmlFor="max-donation"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Maximum Donation Amount
//               </label>
//               <Input
//                 type="text"
//                 id="max-donation"
//                 {...register("maxDonation", {
//                   required: "Maximum donation amount is required",
//                   pattern: {
//                     value: /^[0-9]+$/,
//                     message: "Please enter a valid number",
//                   },
//                 })}
//               />
//               {errors.maxDonation && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.maxDonation.message}
//                 </p>
//               )}
//             </div>

//             {/* Last Date of Donation */}
//             <div className="mb-4">
//               <label
//                 htmlFor="last-date"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Last Date of Donation
//               </label>
//               <Input
//                 type="date"
//                 id="last-date"
//                 {...register("lastDate", {
//                   required: "Last date is required",
//                   validate: (value) => {
//                     const parsedDate = parseISO(value);
//                     return isValid(parsedDate) && parsedDate > new Date()
//                       ? true
//                       : "Please select a valid future date";
//                   },
//                 })}
//               />
//               {errors.lastDate && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.lastDate.message}
//                 </p>
//               )}
//             </div>

//             {/* Short Description */}
//             <div className="mb-4">
//               <label
//                 htmlFor="short-description"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Short Description
//               </label>
//               <Input
//                 type="text"
//                 id="short-description"
//                 {...register("shortDescription", {
//                   required: "Short description is required",
//                 })}
//               />
//               {errors.shortDescription && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.shortDescription.message}
//                 </p>
//               )}
//             </div>

//             {/* Long Description */}
//             <div className="mb-4">
//               <label
//                 htmlFor="long-description"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Long Description
//               </label>
//               <Textarea
//                 id="long-description"
//                 {...register("longDescription", {
//                   required: "Long description is required",
//                 })}
//               />
//               {errors.longDescription && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.longDescription.message}
//                 </p>
//               )}
//             </div>

//             <CardFooter>
//               <Button
//                 type="submit"
//                 fullWidth
//                 className="bg-blue-500 text-white"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting..." : "Create Campaign"}
//               </Button>
//             </CardFooter>
//           </form>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default AddDonation;
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useContext, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import * as Yup from "yup";

import { AuthContext } from "../../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

const AddDonation = () => {
  const [uploading, setUploading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Valid campaign title is required")
      .trim()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must not exceed 100 characters"),
    shortDescription: Yup.string()
      .required("Short description is required")
      .trim()
      .min(10, "Must be at least 10 characters"),
    longDescription: Yup.string()
      .required("Long description is required")
      .min(20, "Must be at least 20 characters"),
    goalAmount: Yup.number()
      .required("Donation goal amount is required")
      .min(1, "Goal amount must be greater than 0"),
    lastDate: Yup.date()
      .required("Last donation date is required")
      .min(new Date(), "Last donation date cannot be in the past"),
    petPicture: Yup.mixed().required("Pet picture is required"),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setUploading(true);

      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", values.petPicture);
      formData.append("upload_preset", "pet_adopt");

      const { data: uploadData } = await axios.post(
        "https://api.cloudinary.com/v1_1/dablesuiy/image/upload",
        formData
      );

      if (!uploadData.secure_url) {
        throw new Error("Image upload failed");
      }

      // Prepare data according to backend requirements
      const data = {
        title: values.title.trim(),
        description: values.longDescription.trim(),
        goalAmount: Number(values.goalAmount),
        imageUrl: uploadData.secure_url,
        userEmail: user?.email,
        createdAt: new Date().toISOString(),
      };

      const response = await axiosSecure.post("/donations/add", data);

      alert("Donation campaign created successfully!");
      resetForm();
    } catch (error) {
      console.error("Error creating donation campaign:", error);

      if (error.response?.data?.errors) {
        alert(`Validation errors:\n${error.response.data.errors.join("\n")}`);
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to create the campaign. Please try again.");
      }
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          Create Donation Campaign
        </h1>

        <Formik
          initialValues={{
            title: "",
            shortDescription: "",
            longDescription: "",
            goalAmount: "",
            lastDate: "",
            petPicture: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="title">Campaign Title</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="input input-bordered w-full mt-1"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="shortDescription">Short Description</label>
                <Field
                  type="text"
                  id="shortDescription"
                  name="shortDescription"
                  className="input input-bordered w-full mt-1"
                />
                <ErrorMessage
                  name="shortDescription"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="longDescription">Long Description</label>
                <ReactQuill
                  id="longDescription"
                  theme="snow"
                  onChange={(value) => setFieldValue("longDescription", value)}
                  className="mt-1"
                />
                <ErrorMessage
                  name="longDescription"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="goalAmount">Goal Amount ($)</label>
                <Field
                  type="number"
                  id="goalAmount"
                  name="goalAmount"
                  className="input input-bordered w-full mt-1"
                />
                <ErrorMessage
                  name="goalAmount"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="lastDate">Last Date</label>
                <Field
                  type="date"
                  id="lastDate"
                  name="lastDate"
                  className="input input-bordered w-full mt-1"
                />
                <ErrorMessage
                  name="lastDate"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="petPicture">Pet Picture</label>
                <input
                  type="file"
                  id="petPicture"
                  name="petPicture"
                  accept="image/*"
                  onChange={(e) =>
                    setFieldValue("petPicture", e.target.files[0])
                  }
                  className="file-input file-input-bordered w-full mt-1"
                />
                <ErrorMessage
                  name="petPicture"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  isSubmitting || uploading ? "loading" : ""
                }`}
                disabled={isSubmitting || uploading}
              >
                {isSubmitting || uploading ? "Creating..." : "Create Campaign"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddDonation;
