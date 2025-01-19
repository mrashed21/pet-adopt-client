// import axios from "axios";
// import { ErrorMessage, Field, Form, Formik } from "formik";
// import { useContext, useState } from "react";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import * as Yup from "yup";

// import { AuthContext } from "../../../Context/Auth/AuthProvider";
// import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

// const AddDonation = () => {
//   const [uploading, setUploading] = useState(false);
//   const axiosSecure = useAxiosSecure();
//   const { user } = useContext(AuthContext);

//   const validationSchema = Yup.object({
//     title: Yup.string()
//       .required("Valid campaign title is required")
//       .trim()
//       .min(5, "Title must be at least 5 characters")
//       .max(100, "Title must not exceed 100 characters"),
//     shortDescription: Yup.string()
//       .required("Short description is required")
//       .trim()
//       .min(10, "Must be at least 10 characters"),
//     longDescription: Yup.string()
//       .required("Long description is required")
//       .min(20, "Must be at least 20 characters"),
//     goalAmount: Yup.number()
//       .required("Donation goal amount is required")
//       .min(1, "Goal amount must be greater than 0"),
//     lastDate: Yup.date()
//       .required("Last donation date is required")
//       .min(new Date(), "Last donation date cannot be in the past"),
//     petPicture: Yup.mixed().required("Pet picture is required"),
//   });

//   const handleSubmit = async (values, { resetForm, setSubmitting }) => {
//     try {
//       setUploading(true);

//       // Upload image to Cloudinary
//       const formData = new FormData();
//       formData.append("file", values.petPicture);
//       formData.append("upload_preset", "pet_adopt");

//       const { data: uploadData } = await axios.post(
//         "https://api.cloudinary.com/v1_1/dablesuiy/image/upload",
//         formData
//       );

//       if (!uploadData.secure_url) {
//         throw new Error("Image upload failed");
//       }

//       // Prepare data according to backend requirements
//       const data = {
//         title: values.title.trim(),
//         description: values.longDescription.trim(),
//         goalAmount: Number(values.goalAmount),
//         imageUrl: uploadData.secure_url,
//         userEmail: user?.email,
//         createdAt: new Date().toISOString(),
//       };

//       const response = await axiosSecure.post("/donations/add", data);

//       alert("Donation campaign created successfully!");
//       resetForm();
//     } catch (error) {
//       console.error("Error creating donation campaign:", error);

//       if (error.response?.data?.errors) {
//         alert(`Validation errors:\n${error.response.data.errors.join("\n")}`);
//       } else if (error.response?.data?.message) {
//         alert(`Error: ${error.response.data.message}`);
//       } else {
//         alert("Failed to create the campaign. Please try again.");
//       }
//     } finally {
//       setUploading(false);
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
//         <h1 className="text-3xl font-bold text-center mb-8 text-primary">
//           Create Donation Campaign
//         </h1>

//         <Formik
//           initialValues={{
//             title: "",
//             shortDescription: "",
//             longDescription: "",
//             goalAmount: "",
//             lastDate: "",
//             petPicture: "",
//           }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ setFieldValue, isSubmitting }) => (
//             <Form className="space-y-6">
//               <div>
//                 <label htmlFor="title">Campaign Title</label>
//                 <Field
//                   type="text"
//                   id="title"
//                   name="title"
//                   className="input input-bordered w-full mt-1"
//                 />
//                 <ErrorMessage
//                   name="title"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="shortDescription">Short Description</label>
//                 <Field
//                   type="text"
//                   id="shortDescription"
//                   name="shortDescription"
//                   className="input input-bordered w-full mt-1"
//                 />
//                 <ErrorMessage
//                   name="shortDescription"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="longDescription">Long Description</label>
//                 <ReactQuill
//                   id="longDescription"
//                   theme="snow"
//                   onChange={(value) => setFieldValue("longDescription", value)}
//                   className="mt-1"
//                 />
//                 <ErrorMessage
//                   name="longDescription"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="goalAmount">Goal Amount ($)</label>
//                 <Field
//                   type="number"
//                   id="goalAmount"
//                   name="goalAmount"
//                   className="input input-bordered w-full mt-1"
//                 />
//                 <ErrorMessage
//                   name="goalAmount"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="lastDate">Last Date</label>
//                 <Field
//                   type="date"
//                   id="lastDate"
//                   name="lastDate"
//                   className="input input-bordered w-full mt-1"
//                 />
//                 <ErrorMessage
//                   name="lastDate"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="petPicture">Pet Picture</label>
//                 <input
//                   type="file"
//                   id="petPicture"
//                   name="petPicture"
//                   accept="image/*"
//                   onChange={(e) =>
//                     setFieldValue("petPicture", e.target.files[0])
//                   }
//                   className="file-input file-input-bordered w-full mt-1"
//                 />
//                 <ErrorMessage
//                   name="petPicture"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className={`btn btn-primary w-full ${
//                   isSubmitting || uploading ? "loading" : ""
//                 }`}
//                 disabled={isSubmitting || uploading}
//               >
//                 {isSubmitting || uploading ? "Creating..." : "Create Campaign"}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default AddDonation;

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as Yup from "yup";

import Swal from "sweetalert2";
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

  const formik = useFormik({
    initialValues: {
      title: "",
      shortDescription: "",
      longDescription: "",
      goalAmount: "",
      lastDate: "",
      petPicture: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
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

        // Prepare data for backend
        const campaignData = {
          title: values.title.trim(),
          description: values.longDescription.trim(),
          goalAmount: Number(values.goalAmount),
          imageUrl: uploadData.secure_url,
          userEmail: user?.email,
          createdAt: new Date().toISOString(),
        };

        await axiosSecure.post("/donations/add", campaignData);
        Swal.fire({
          title: "Donation campaign created successfully!",
          icon: "success",
          draggable: true,
        });

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
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Card className="max-w-4xl mx-auto p-8">
        <CardBody>
          <Typography
            variant="h3"
            color="blue-gray"
            className="mb-8 text-center"
          >
            Create Donation Campaign
          </Typography>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Campaign Title
              </Typography>
              <Input
                type="text"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                error={formik.touched.title && formik.errors.title}
              />
              {formik.touched.title && formik.errors.title && (
                <Typography color="red" className="mt-1 text-sm">
                  {formik.errors.title}
                </Typography>
              )}
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Short Description
              </Typography>
              <Input
                type="text"
                name="shortDescription"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.shortDescription}
                error={
                  formik.touched.shortDescription &&
                  formik.errors.shortDescription
                }
              />
              {formik.touched.shortDescription &&
                formik.errors.shortDescription && (
                  <Typography color="red" className="mt-1 text-sm">
                    {formik.errors.shortDescription}
                  </Typography>
                )}
            </div>

            <div className="pb-7">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Long Description
              </Typography>
              <ReactQuill
                theme="snow"
                value={formik.values.longDescription}
                onChange={(value) =>
                  formik.setFieldValue("longDescription", value)
                }
                className="bg-white h-52"
              />
              {formik.touched.longDescription &&
                formik.errors.longDescription && (
                  <Typography color="red" className="mt-1 text-sm">
                    {formik.errors.longDescription}
                  </Typography>
                )}
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Goal Amount ($)
              </Typography>
              <Input
                type="number"
                name="goalAmount"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.goalAmount}
                error={formik.touched.goalAmount && formik.errors.goalAmount}
              />
              {formik.touched.goalAmount && formik.errors.goalAmount && (
                <Typography color="red" className="mt-1 text-sm">
                  {formik.errors.goalAmount}
                </Typography>
              )}
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Last Date
              </Typography>
              <Input
                type="date"
                name="lastDate"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastDate}
                error={formik.touched.lastDate && formik.errors.lastDate}
              />
              {formik.touched.lastDate && formik.errors.lastDate && (
                <Typography color="red" className="mt-1 text-sm">
                  {formik.errors.lastDate}
                </Typography>
              )}
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Pet Picture
              </Typography>
              <Input
                type="file"
                name="petPicture"
                onChange={(event) => {
                  formik.setFieldValue(
                    "petPicture",
                    event.currentTarget.files[0]
                  );
                }}
                accept="image/*"
                error={formik.touched.petPicture && formik.errors.petPicture}
              />
              {formik.touched.petPicture && formik.errors.petPicture && (
                <Typography color="red" className="mt-1 text-sm">
                  {formik.errors.petPicture}
                </Typography>
              )}
            </div>

            <CardFooter className="pt-6">
              <Button
                type="submit"
                fullWidth
                disabled={formik.isSubmitting || uploading}
                className="bg-blue-500"
              >
                {formik.isSubmitting || uploading
                  ? "Creating..."
                  : "Create Campaign"}
              </Button>
            </CardFooter>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddDonation;
