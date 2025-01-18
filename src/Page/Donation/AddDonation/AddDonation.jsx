import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { isValid, parseISO } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AddDonation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [petPicture, setPetPicture] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setPetPicture(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", petPicture);
    formData.append("upload_preset", "pet_adopt");
    let imageUrl;
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dablesuiy/image/upload",
        formData
      );
      imageUrl = res.data.secure_url;
    } catch (err) {
      console.error("Image upload failed:", err);
      setIsSubmitting(false);
      return;
    }

    // Create the donation campaign
    const donationCampaign = {
      petPicture: imageUrl,
      maxDonation: data.maxDonation,
      lastDate: data.lastDate,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(
        "http://localhost:5000/donation-campaigns",
        donationCampaign
      );
      setIsSubmitting(false);
      alert("Donation campaign created successfully!");
    } catch (err) {
      console.error("Failed to create donation campaign:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-6">
        <CardBody>
          <Typography
            variant="h4"
            color="blue-gray"
            className="mb-4 text-center"
          >
            Create Donation Campaign
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Pet Picture */}
            <div className="mb-4">
              <label
                htmlFor="pet-picture"
                className="block text-sm font-medium text-gray-700"
              >
                Pet Picture
              </label>
              <Input
                type="file"
                id="pet-picture"
                {...register("petPicture", {
                  required: "Pet picture is required",
                })}
                onChange={handleFileChange}
                accept="image/*"
              />
              {errors.petPicture && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.petPicture.message}
                </p>
              )}
            </div>

            {/* Maximum Donation */}
            <div className="mb-4">
              <label
                htmlFor="max-donation"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Donation Amount
              </label>
              <Input
                type="text"
                id="max-donation"
                {...register("maxDonation", {
                  required: "Maximum donation amount is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter a valid number",
                  },
                })}
              />
              {errors.maxDonation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.maxDonation.message}
                </p>
              )}
            </div>

            {/* Last Date of Donation */}
            <div className="mb-4">
              <label
                htmlFor="last-date"
                className="block text-sm font-medium text-gray-700"
              >
                Last Date of Donation
              </label>
              <Input
                type="date"
                id="last-date"
                {...register("lastDate", {
                  required: "Last date is required",
                  validate: (value) => {
                    const parsedDate = parseISO(value);
                    return isValid(parsedDate) && parsedDate > new Date()
                      ? true
                      : "Please select a valid future date";
                  },
                })}
              />
              {errors.lastDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastDate.message}
                </p>
              )}
            </div>

            {/* Short Description */}
            <div className="mb-4">
              <label
                htmlFor="short-description"
                className="block text-sm font-medium text-gray-700"
              >
                Short Description
              </label>
              <Input
                type="text"
                id="short-description"
                {...register("shortDescription", {
                  required: "Short description is required",
                })}
              />
              {errors.shortDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            {/* Long Description */}
            <div className="mb-4">
              <label
                htmlFor="long-description"
                className="block text-sm font-medium text-gray-700"
              >
                Long Description
              </label>
              <Textarea
                id="long-description"
                {...register("longDescription", {
                  required: "Long description is required",
                })}
              />
              {errors.longDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.longDescription.message}
                </p>
              )}
            </div>

            <CardFooter>
              <Button
                type="submit"
                fullWidth
                className="bg-blue-500 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Create Campaign"}
              </Button>
            </CardFooter>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddDonation;
