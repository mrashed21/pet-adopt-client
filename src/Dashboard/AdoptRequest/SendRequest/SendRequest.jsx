
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

const TABLE_HEAD = [
  "Pet Image",
  "Pet Name",
  "Adoption Date",
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
      const response = await axiosSecure.get(`/adoptions/send/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  const deleteAdoptionRequest = useMutation({
    mutationFn: async (adoptionId) => {
      const response = await axiosSecure.delete(`/adoptions/${adoptionId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adoptions", user?.email]);
      Swal.fire(
        "Deleted!",
        "The adoption request has been deleted.",
        "success"
      );
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Failed to delete request.",
        "error"
      );
    },
  });

  const handleReject = (adoptionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAdoptionRequest.mutate(adoptionId);
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
                    {/* Pet Image */}
                    <td className="p-4">
                      <img
                        src={adoption.petImage}
                        alt={adoption.petName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    {/* Pet Name */}
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {adoption.petName}
                      </Typography>
                    </td>
                    {/* Adoption Date */}
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {new Date(adoption.adoptionDate).toLocaleDateString()}
                      </Typography>
                    </td>
                    {/* Status */}
                    <td className="p-4">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${
                          adoption.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : adoption.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {adoption.status}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          color="red"
                          size="sm"
                          onClick={() => handleReject(adoption._id)}
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
