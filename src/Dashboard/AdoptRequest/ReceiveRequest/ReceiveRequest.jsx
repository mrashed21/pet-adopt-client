import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

const TABLE_HEAD = [
  "Pet Name",
  "Requester Name",
  "Email",
  "Phone",
  "Location",
  "Status",
  "Actions",
];

const ReceiveRequest = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: adoptions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adoptions", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/adoptions/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  const updateAdoptionRequest = useMutation({
    mutationFn: async ({ adoptionId, status }) => {
      const response = await axiosSecure.patch(`/adoptions/${adoptionId}`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adoptions", user?.email]);
    },
    onError: (error) => {
      console.error("Error updating adoption request:", error);
    },
  });

  const handleAction = (adoptionId, status, petId) => {
    // Determine message for confirmation based on status
    const actionMessage =
      status === "accepted" ? "Accept this request?" : "Reject this request?";

    Swal.fire({
      title: `Are you sure you want to ${status}?`,
      text: `You won't be able to undo this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${status} it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (status === "accepted") {
          // Update the adoption request status to accepted
          try {
            await updateAdoptionRequest.mutateAsync({ adoptionId, status });
            Swal.fire(
              "Accepted!",
              "The adoption request has been accepted.",
              "success"
            );
          } catch (error) {
            Swal.fire(
              "Error!",
              error.response?.data?.message ||
                "Failed to process the acceptance.",
              "error"
            );
          }
        } else if (status === "rejected") {
          // Handle rejection (update pet status and delete adoption request)
          try {
            await axiosSecure.patch(`/pet-reject/${petId}`, { adopted: false });
            await axiosSecure.delete(`/adoptions/${adoptionId}`);
            queryClient.invalidateQueries(["adoptions", user?.email]);
            Swal.fire(
              "Rejected!",
              "The adoption request has been rejected.",
              "success"
            );
          } catch (error) {
            Swal.fire(
              "Error!",
              error.response?.data?.message ||
                "Failed to process the rejection.",
              "error"
            );
          }
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Typography variant="h6">Loading adoption requests...</Typography>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Typography color="red" variant="h6">
          Error: {error?.message}
        </Typography>
      </div>
    );
  }

  if (!adoptions.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Typography variant="h6">No adoption requests found.</Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="h-full w-full">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-6">
            Adoption Requests for Your Pets
          </Typography>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adoptions.map((adoption) => (
                  <tr key={adoption._id} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {adoption.petName}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {adoption.adopterName}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {adoption.adopterEmail}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {adoption.phoneNumber}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {adoption.address}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <div
                        className={`
                        px-2 py-1 rounded-full text-xs font-semibold inline-block
                        ${
                          adoption.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : adoption.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      `}
                      >
                        {adoption.status}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          color="green"
                          size="sm"
                          onClick={() =>
                            handleAction(
                              adoption._id,
                              "accepted",
                              adoption.petId
                            )
                          }
                          disabled={adoption.status !== "pending"}
                        >
                          Accept
                        </Button>
                        <Button
                          color="red"
                          size="sm"
                          onClick={() =>
                            handleAction(
                              adoption._id,
                              "rejected",
                              adoption.petId
                            )
                          }
                          disabled={adoption.status !== "pending"}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ReceiveRequest;
