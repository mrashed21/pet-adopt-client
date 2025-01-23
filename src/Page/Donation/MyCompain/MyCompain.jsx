import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogHeader,
  Progress,
  Typography,
} from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TableSkeleton from "../../../Common/TaboleSkeleton/TableSkeleton";
import { AuthContext } from "../../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

const MyDonations = () => {
  const [selectedDonators, setSelectedDonators] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch donations using Tanstack Query
  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["donations", user.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/donations/user/${user.email}`);
      return response.data;
    },
  });

  // Mutation for pause/unpause
  const pauseMutation = useMutation({
    mutationFn: async ({ id, paused }) => {
      await axiosSecure.patch(`/donations/pause/${id}`, {
        paused: !paused,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["donations", user.email]);
    },
  });

  // Mutation for fetching donators
  const donatorsMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosSecure.get(`/donations/donators/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      setSelectedDonators(data);
      setShowModal(true);
    },
  });

  const handlePauseToggle = (id, paused) => {
    const action = paused ? "Unpause" : "Pause";

    Swal.fire({
      title: `Are you sure you want to ${action} this campaign?`,
      text: `You are about to ${action.toLowerCase()} this campaign.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        pauseMutation.mutate({ id, paused });
        Swal.fire(
          `${action}d!`,
          `The campaign has been ${action.toLowerCase()}d successfully.`,
          "success"
        );
      }
    });
  };

  const handleViewDonators = (id) => {
    donatorsMutation.mutate(id);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-donation/${id}`);
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <>
      <Helmet>
        <title>My - Compains</title>
      </Helmet>
      <Card className="h-full w-full max-w-7xl mx-auto">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                My Donation Campaigns
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {[
                  "Pet Name",
                  "Image",
                  "Max Donation",
                  "Progress",
                  "Actions",
                ].map((head) => (
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
              {donations.map((donation) => (
                <tr key={donation._id} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {donation.title}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <img
                      className="h-16 w-16 rounded-md"
                      src={donation.imageUrl}
                      alt=""
                    />
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      ${donation.goalAmount}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <div className="w-full">
                      <Progress
                        value={
                          (donation.raisedAmount / donation.goalAmount) * 100
                        }
                        color="blue"
                        className="h-2"
                      />
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mt-2 font-normal"
                      >
                        {(
                          (donation.raisedAmount / donation.goalAmount) *
                          100
                        ).toFixed(2)}
                        %
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={donation.paused ? "filled" : "outlined"}
                        color={donation.paused ? "blue" : "blue-gray"}
                        onClick={() =>
                          handlePauseToggle(donation._id, donation.paused)
                        }
                      >
                        {donation.paused ? "Unpause" : "Pause"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outlined"
                        color="amber"
                        onClick={() => handleEdit(donation._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="green"
                        onClick={() => handleViewDonators(donation._id)}
                      >
                        View Donators
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>

        <Dialog
          open={showModal}
          handler={() => setShowModal(false)}
          className="min-w-60%] md:min-w-[50%] lg:min-w-[40%]"
        >
          <DialogHeader>
            <Typography variant="h6" color="blue-gray">
              Donators
            </Typography>
          </DialogHeader>
          <DialogBody divider className="max-h-[400px] overflow-auto">
            {selectedDonators && selectedDonators.length > 0 ? (
              <div className="space-y-3">
                {selectedDonators.map((donator, index) => (
                  <Card key={index} className="p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <Typography variant="paragraph" color="blue-gray">
                        {donator.name || "Anonymous"}
                      </Typography>
                      <Typography variant="h6" color="green">
                        ${donator.amount}
                      </Typography>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Typography
                variant="paragraph"
                color="blue-gray"
                className="text-center py-4"
              >
                No donations yet.
              </Typography>
            )}
          </DialogBody>
        </Dialog>
      </Card>
    </>
  );
};

export default MyDonations;
