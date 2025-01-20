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
import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { AuthContext } from "../../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

// Validation Schema using Yup
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
  petPicture: Yup.mixed().test(
    "file",
    "A pet picture is required if no current image exists",
    function (value) {
      const { parent } = this;
      return parent.imageUrl || value instanceof File;
    }
  ),
});

const UpdateDonation = () => {
  const { id } = useParams();
  const [uploading, setUploading] = useState(false);
  const [donationData, setDonationData] = useState(null);
  const [petPicture, setPetPicture] = useState(null);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const { data } = await axiosSecure.get(`/donations/${id}`);
        setDonationData(data);
      } catch (error) {
        console.error("Error fetching donation campaign data:", error);
        Swal.fire({
          title: "Error fetching donation data.",
          icon: "error",
          draggable: true,
        });
      }
    };

    fetchDonation();
  }, [id, axiosSecure]);

  const formik = useFormik({
    initialValues: {
      title: donationData?.title || "",
      shortDescription: donationData?.shortDescription || "",
      longDescription: donationData?.longDescription || "",
      goalAmount: donationData?.goalAmount || "",
      lastDate: donationData?.lastDate || "",
      petPicture: null,
      imageUrl: donationData?.imageUrl || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setUploading(true);
        let imageUrl = values.imageUrl;
        if (petPicture) {
          const formData = new FormData();
          formData.append("file", petPicture);
          formData.append(
            "upload_preset",
            `${import.meta.env.VITE_CLOUDINARY_PRESET}`
          );

          const { data: uploadData } = await axios.post(
            `https://api.cloudinary.com/v1_1/${
              import.meta.env.VITE_CLOUDINARY_NAME
            }/image/upload`,
            formData
          );

          if (uploadData?.secure_url) {
            imageUrl = uploadData.secure_url;
          }
        }
        const campaignData = {
          title: values.title.trim(),
          shortDescription: values.shortDescription.trim(),
          longDescription: values.longDescription.trim(),
          goalAmount: Number(values.goalAmount),
          lastDate: values.lastDate,
          imageUrl,
          userEmail: user?.email,
          updatedAt: new Date().toISOString(),
        };

        await axiosSecure.put(`/donations/update/${id}`, campaignData);
        Swal.fire({
          title: "Donation campaign updated successfully!",
          icon: "success",
          draggable: true,
        });

        resetForm();
      } catch (error) {
        console.error("Error updating donation campaign:", error);
        Swal.fire({
          title: "Error updating donation campaign.",
          icon: "error",
          draggable: true,
        });
      } finally {
        setUploading(false);
        setSubmitting(false);
      }
    },
  });

  if (!donationData) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Card className="max-w-4xl mx-auto p-8">
        <CardBody>
          <Typography
            variant="h3"
            color="blue-gray"
            className="mb-8 text-center"
          >
            Update Donation Campaign
          </Typography>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Campaign Title */}
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

            {/* Short Description */}
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

            {/* Long Description */}
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

            {/* Goal Amount */}
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

            {/* Last Date */}
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

            {/* Pet Picture */}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Pet Picture
              </Typography>
              <Input
                type="file"
                name="petPicture"
                onChange={(event) => {
                  setPetPicture(event.currentTarget.files[0]);
                }}
                accept="image/*"
                error={formik.touched.petPicture && formik.errors.petPicture}
              />
              {formik.touched.petPicture && formik.errors.petPicture && (
                <Typography color="red" className="mt-1 text-sm">
                  {formik.errors.petPicture}
                </Typography>
              )}
              {formik.values.imageUrl && (
                <img
                  src={formik.values.imageUrl}
                  alt="Current Pet"
                  className="mt-4 h-40 rounded"
                />
              )}
            </div>
          </form>
        </CardBody>
        <CardFooter className="pt-4">
          <Button
            type="submit"
            onClick={formik.handleSubmit}
            fullWidth
            disabled={uploading}
          >
            {uploading ? "Updating..." : "Update Campaign"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpdateDonation;
