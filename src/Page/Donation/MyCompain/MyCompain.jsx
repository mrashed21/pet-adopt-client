// import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../../Context/Auth/AuthProvider";
// import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

// const MyDonations = () => {
//   const [donations, setDonations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDonators, setSelectedDonators] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const { user } = useContext(AuthContext);
//   const axiosSecure = useAxiosSecure();
//   const navigate = useNavigate();
//   useEffect(() => {
//     fetchDonations();
//   }, []);

//   const fetchDonations = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosSecure.get(`/donations/user/${user.email}`);
//       setDonations(response.data);
//     } catch (error) {
//       console.error("Error fetching donations:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle pause/unpause donation
//   const handlePauseToggle = async (id, paused) => {
//     try {
//       await axiosSecure.patch(`/donations/pause/${id}`, {
//         paused: !paused,
//       });
//       fetchDonations();
//     } catch (error) {
//       console.error("Error updating pause state:", error.message);
//     }
//   };

//   const handleViewDonators = async (id) => {
//     try {
//       const response = await axiosSecure.get(`/donations/donators/${id}`);
//       setSelectedDonators(response.data);
//       setShowModal(true);
//     } catch (error) {
//       console.error("Error fetching donators:", error.message);
//     }
//   };

//   const handleEdit = (id) => {
//     navigate(`/dashboard/edit-donation/${id}`);
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">My Donation Campaigns</h1>
//       <table className="min-w-full border-collapse border border-gray-200">
//         <thead>
//           <tr>
//             <th className="border border-gray-200 px-4 py-2">Pet Name</th>
//             <th className="border border-gray-200 px-4 py-2">Max Donation</th>
//             <th className="border border-gray-200 px-4 py-2">Progress</th>
//             <th className="border border-gray-200 px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {donations.map((donation) => (
//             <tr key={donation._id}>
//               <td className="border border-gray-200 px-4 py-2">
//                 {donation.title}
//               </td>
//               <td className="border border-gray-200 px-4 py-2">
//                 ${donation.goalAmount}
//               </td>
//               <td className="border border-gray-200 px-4 py-2">
//                 <div className="w-full bg-gray-200 rounded">
//                   <div
//                     className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-1 rounded"
//                     style={{
//                       width: `${
//                         (donation.raisedAmount / donation.goalAmount) * 100
//                       }%`,
//                     }}
//                   >
//                     {(
//                       (donation.raisedAmount / donation.goalAmount) *
//                       100
//                     ).toFixed(2)}
//                     %
//                   </div>
//                 </div>
//               </td>
//               <td className="border border-gray-200 px-4 py-2 space-x-2">
//                 <button
//                   className={`px-3 py-1 rounded ${
//                     donation.paused ? "bg-green-500" : "bg-gray-500"
//                   } text-white`}
//                   onClick={() =>
//                     handlePauseToggle(donation._id, donation.paused)
//                   }
//                 >
//                   {donation.paused ? "Unpause" : "Pause"}
//                 </button>
//                 <button
//                   className="bg-yellow-500 text-white px-3 py-1 rounded"
//                   onClick={() => handleEdit(donation._id)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="bg-green-500 text-white px-3 py-1 rounded"
//                   onClick={() => handleViewDonators(donation._id)}
//                 >
//                   View Donators
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showModal && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg">
//             <h2 className="text-xl font-bold mb-4">Donators</h2>
//             <ul>
//               {selectedDonators && selectedDonators.length > 0 ? (
//                 selectedDonators.map((donator, index) => (
//                   <li key={index} className="mb-2">
//                     {donator.name || "Anonymous"} - ${donator.amount}
//                   </li>
//                 ))
//               ) : (
//                 <li>No donations yet.</li>
//               )}
//             </ul>
//             <button
//               className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
//               onClick={() => setShowModal(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyDonations;

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogHeader,
  Progress,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    pauseMutation.mutate({ id, paused });
  };

  const handleViewDonators = (id) => {
    donatorsMutation.mutate(id);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-donation/${id}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
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
              {["Pet Name", "Image", "Max Donation", "Progress", "Actions"].map(
                (head) => (
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
                )
              )}
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
                  <img className="h-16 w-16 rounded-md" src={donation.imageUrl} alt="" />
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
  );
};

export default MyDonations;
