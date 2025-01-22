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
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

const UpdateDonation = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();
  const navigate = useNavigate();

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
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      shortDescription: "",
      longDescription: "",
      goalAmount: "",
      lastDate: "",
      petPicture: null,
      imageUrl: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setUploading(true);
        let finalImageUrl = values.imageUrl;
        if (values.petPicture) {
          const formData = new FormData();
          formData.append("file", values.petPicture);
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
          if (!uploadData.secure_url) {
            throw new Error("Image upload failed");
          }
          finalImageUrl = uploadData.secure_url;
        }

        const campaignData = {
          title: values.title.trim(),
          shortDescription: values.shortDescription.trim(),
          longDescription: values.longDescription.trim(),
          goalAmount: Number(values.goalAmount),
          imageUrl: finalImageUrl,
          lastDate: values.lastDate,
          updatedAt: new Date().toISOString(),
        };

        await axiosSecure.patch(`/donations/update/${id}`, campaignData);

        Swal.fire({
          title: "Donation campaign updated successfully!",
          icon: "success",
          draggable: true,
        });

        navigate(-1);
      } catch (error) {
        console.error("Error updating donation campaign:", error);
        Swal.fire({
          title: "Error!",
          text:
            error.response?.data?.message || "Failed to update the campaign",
          icon: "error",
        });
      } finally {
        setUploading(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const response = await axiosSecure.get(`/donations/${id}`);
        const donation = response.data;

        formik.setValues({
          title: donation.title,
          shortDescription: donation.shortDescription,
          longDescription: donation.longDescription,
          goalAmount: donation.goalAmount,
          lastDate: donation.lastDate,
          imageUrl: donation.imageUrl,
          petPicture: null,
        });
      } catch (error) {
        console.error("Error fetching donation:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch donation details",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

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
                Current Image
              </Typography>
              <img
                src={formik.values.imageUrl}
                alt="Current pet"
                className="w-32 h-32 object-cover rounded-lg mb-4"
              />

              <Typography variant="h6" color="blue-gray" className="mb-2">
                Update Pet Picture
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
              />
            </div>

            <CardFooter className="pt-6">
              <Button
                type="submit"
                fullWidth
                disabled={formik.isSubmitting || uploading}
                className="bg-blue-500"
              >
                {formik.isSubmitting || uploading
                  ? "Updating..."
                  : "Update Campaign"}
              </Button>
            </CardFooter>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default UpdateDonation;
