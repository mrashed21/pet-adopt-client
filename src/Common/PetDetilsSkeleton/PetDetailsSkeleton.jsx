/* eslint-disable react/prop-types */

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

const PetDetailsSkeleton = () => (
  <Card className="max-w-4xl mx-auto overflow-hidden animate-pulse">
    <div className="h-96 relative">
      <Skeleton height="100%" />
    </div>
    <CardBody className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="w-2/3">
          <Skeleton height={40} width="80%" className="mb-2" />
          <Skeleton height={24} width={100} />
        </div>
        <Skeleton height={48} width={120} />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton height={24} width="60%" className="mb-2" />
            <Skeleton height={20} width="80%" />
          </div>
        ))}
      </div>

      <Skeleton height={24} width={120} className="mb-4" />
      <Skeleton count={3} height={20} className="mb-4" />

      <Skeleton height={24} width={120} className="mb-4" />
      <Skeleton count={5} height={20} />
    </CardBody>
  </Card>
);

const PetDetailsError = ({ message }) => (
  <Card className="max-w-4xl mx-auto p-8 text-center">
    <Typography variant="h5" color="red" className="mb-2">
      Error Loading Pet Details
    </Typography>
    <Typography color="gray">{message || "Please try again later"}</Typography>
    <Button
      color="blue"
      className="mt-4"
      onClick={() => window.location.reload()}
    >
      Retry
    </Button>
  </Card>
);

const PetDetails = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const {
    data: pet,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/pets/${id}`);
      return response.data;
    },
  });

  // const handleAdopt = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const adoptionData = {
  //     petId: pet._id,
  //     petName: pet.name,
  //     petImage: pet.imageUrl,
  //     userName: user.displayName,
  //     email: user.email,
  //     phoneNumber: e.target.phoneNumber.value,
  //     address: e.target.address.value,
  //   };

  //   try {
  //     const response = await axiosSecure.post("/adopt", adoptionData);

  //     const data = await response.data();

  //     if (data.message) {
  //       alert("Adoption request submitted successfully!");
  //       setShowModal(false);
  //     }
  //   } catch (error) {
  //     console.error("Failed to submit adoption request:", error);
  //     alert("Failed to submit adoption request");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleAdopt = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. First update pet status to pending
      const updateResponse = await axiosSecure.patch(`/pets/${pet._id}`, {
        adopted: "pending",
      });

      if (!updateResponse.data.success) {
        throw new Error("Failed to update pet status");
      }

      // 2. Create adoption request with all required information
      const adoptionData = {
        // Pet Information
        petId: pet._id,
        petName: pet.name,
        petImage: pet.imageUrl,
        petAge: pet.age,
        petCategory: pet.category,
        petLocation: pet.location,

        // Adopter Information
        adopterName: user.displayName,
        adopterEmail: user.email,
        phoneNumber: e.target.phoneNumber.value,
        address: e.target.address,
        status: "pending",
        adoptionDate: new Date(),
      };

      const adoptionResponse = await axiosSecure.post(
        "/adoptions",
        adoptionData
      );

      if (adoptionResponse.data.success) {
        alert("Adoption request submitted successfully!");
        setShowModal(false);
        // Optionally refresh the page or update the UI
        window.location.reload();
      }
    } catch (error) {
      console.error("Adoption request failed:", error);
      alert(
        error.response?.data?.message || "Failed to submit adoption request"
      );

      // If adoption request fails, try to revert pet status
      try {
        await axiosSecure.patch(`/pets/${pet._id}`, {
          adopted: false,
        });
      } catch (rollbackError) {
        console.error("Failed to rollback pet status:", rollbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PetDetailsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PetDetailsError message={error.message} />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PetDetailsError message="Pet not found" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardHeader floated={false} className="relative h-96">
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        </CardHeader>
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2">
                {pet.name}{" "}
                <Typography
                  as="span"
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  Added on: {format(new Date(pet.createdAt), "PPP")}
                </Typography>
              </Typography>
              <Chip
                value={pet.adopted ? "Pending" : "Available"}
                color={pet.adopted ? "green" : "blue"}
                className="capitalize w-fit"
              />
            </div>
            <Button
              onClick={() => setShowModal(true)}
              disabled={pet.adopted}
              color={pet.adopted ? "gray" : "blue"}
              size="lg"
            >
              {pet.adopted ? "Pending" : "Adopt Now"}
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Age
              </Typography>
              <Typography color="gray">{pet.age} years</Typography>
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Location
              </Typography>
              <Typography color="gray">{pet.location}</Typography>
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Category
              </Typography>
              <Typography color="gray" className="capitalize">
                {pet.category}
              </Typography>
            </div>
          </div>

          <Typography variant="h6" color="blue-gray" className="mb-2">
            Description
          </Typography>
          <Typography
            color="gray"
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: pet.shortDescription }}
          />

          <Typography variant="h6" color="blue-gray" className="my-2">
            Details
          </Typography>
          <Typography
            color="gray"
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: pet.longDescription }}
          />
        </CardBody>
      </Card>

      <Dialog open={showModal} handler={() => setShowModal(false)} size="md">
        <form onSubmit={handleAdopt}>
          <DialogHeader>Adopt {pet.name}</DialogHeader>
          <DialogBody divider className="overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              <Card className="p-4 bg-blue-gray-50">
                <Typography variant="small" color="gray" className="mb-2">
                  Pet ID: {pet._id}
                </Typography>
                <Typography variant="small" color="gray">
                  Pet Name: {pet.name}
                </Typography>
              </Card>

              <Input
                label="Name"
                value={user?.displayName || ""}
                disabled
                containerProps={{ className: "mb-4" }}
              />
              <Input
                type="email"
                label="Email"
                value={user?.email || ""}
                disabled
                containerProps={{ className: "mb-4" }}
              />
              <Input
                type="tel"
                label="Phone Number"
                name="phoneNumber"
                required
                containerProps={{ className: "mb-4" }}
              />
              <Textarea label="Address" name="address" required rows={3} />
            </div>
          </DialogBody>
          <DialogFooter className="space-x-4">
            <Button
              variant="outlined"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Adoption Request"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default PetDetails;