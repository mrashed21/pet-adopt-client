// import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useContext } from "react";
// import Swal from "sweetalert2";
// import TableSkeleton from "../../../Common/TaboleSkeleton/TableSkeleton";
// import { AuthContext } from "../../../Context/Auth/AuthProvider";
// import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

// const TABLE_HEAD = [
//   "Pet Image",
//   "Pet Name",
//   "Adoption Date",
//   "Status",
//   "Actions",
// ];

// const SendRequest = () => {
//   const { user } = useContext(AuthContext);
//   const axiosSecure = useAxiosSecure();
//   const queryClient = useQueryClient();
//   const {
//     data: adoptions = [],
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["adoptions", user?.email],
//     queryFn: async () => {
//       const response = await axiosSecure.get(`/adoptions/send/${user?.email}`);
//       return response.data;
//     },
//     enabled: !!user?.email,
//   });

//   const handleReject = (adoptionId, petId) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to undo this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, Reject it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axiosSecure.patch(`/pet-reject/${petId}`, { adopted: false });
//           await axiosSecure.delete(`/adoptions/${adoptionId}`);
//           queryClient.invalidateQueries(["adoptions", user?.email]);
//           Swal.fire(
//             "Rejected!",
//             "The adoption request has been rejected.",
//             "success"
//           );
//         } catch (error) {
//           Swal.fire(
//             "Error!",
//             error.response?.data?.message || "Failed to process the rejection.",
//             "error"
//           );
//         }
//       }
//     });
//   };
//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <TableSkeleton />
//       </div>
//     );
//   }
//   if (isError) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <Typography color="red" variant="h6">
//           Error: {error?.message}
//         </Typography>
//       </div>
//     );
//   }
//   if (!adoptions.length) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <Typography variant="h6" className="text-center">
//           No Information found.
//         </Typography>
//       </div>
//     );
//   }
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Card className="h-full w-full">
//         <CardBody>
//           <Typography variant="h5" color="blue-gray" className="mb-6">
//             Adoption Requests for Your Pets
//           </Typography>
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-max table-auto text-left">
//               <thead>
//                 <tr>
//                   {TABLE_HEAD.map((head) => (
//                     <th
//                       key={head}
//                       className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
//                     >
//                       <Typography
//                         variant="small"
//                         color="blue-gray"
//                         className="font-normal leading-none opacity-70"
//                       >
//                         {head}
//                       </Typography>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {adoptions.map((adoption) => (
//                   <tr key={adoption._id} className="even:bg-blue-gray-50/50">
//                     {/* Pet Image */}
//                     <td className="p-4">
//                       <img
//                         src={adoption.petImage}
//                         alt={adoption.petName}
//                         className="w-16 h-16 object-cover rounded-lg"
//                       />
//                     </td>
//                     {/* Pet Name */}
//                     <td className="p-4">
//                       <Typography variant="small" color="blue-gray">
//                         {adoption.petName}
//                       </Typography>
//                     </td>
//                     {/* Adoption Date */}
//                     <td className="p-4">
//                       <Typography variant="small" color="blue-gray">
//                         {new Date(adoption.adoptionDate).toLocaleDateString()}
//                       </Typography>
//                     </td>
//                     {/* Status */}
//                     <td className="p-4">
//                       <div
//                         className={`px-2 py-1 rounded-full text-xs font-semibold inline-block capitalize ${
//                           adoption.status === "accepted"
//                             ? "bg-green-100 text-green-800"
//                             : adoption.status === "rejected"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-blue-100 text-blue-800"
//                         }`}
//                       >
//                         {adoption.status}
//                       </div>
//                     </td>
//                     {/* Actions */}
//                     <td className="p-4">
//                       <div className="flex gap-2">
//                         <Button
//                           color="red"
//                           size="sm"
//                           onClick={() =>
//                             handleReject(adoption._id, adoption.petId)
//                           }
//                           disabled={adoption.status !== "pending"}
//                         >
//                           Reject
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default SendRequest;
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import TableSkeleton from "../../../Common/TaboleSkeleton/TableSkeleton";
import { AuthContext } from "../../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";
import { Helmet } from "react-helmet-async";

const TABLE_HEAD = [
  "Pet Image",
  "Pet Name",
  "Adoption Date",
  "Status",
  "Actions",
];

const SendRequest = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const handleReject = (adoptionId, petId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
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
            error.response?.data?.message || "Failed to process the rejection.",
            "error"
          );
        }
      }
    });
  };

  const totalPages = Math.ceil(adoptions.length / itemsPerPage);
  const paginatedData = adoptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <TableSkeleton />
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
        <Typography variant="h6" className="text-center">
          No Information found.
        </Typography>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
              <title>Requests - Send</title>
            </Helmet>
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
                {paginatedData.map((adoption) => (
                  <tr key={adoption._id} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <img
                        src={adoption.petImage}
                        alt={adoption.petName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {adoption.petName}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {new Date(adoption.adoptionDate).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-semibold inline-block capitalize ${
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
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          color="red"
                          size="sm"
                          onClick={() =>
                            handleReject(adoption._id, adoption.petId)
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
          {adoptions.length > itemsPerPage && ( // Hide pagination if length < 10
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Typography variant="small" className="px-2">
                Page {currentPage} of {totalPages}
              </Typography>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SendRequest;
