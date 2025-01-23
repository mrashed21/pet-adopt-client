// /* eslint-disable no-unused-vars */
// import { Button, Typography } from "@material-tailwind/react";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { useQuery } from "@tanstack/react-query";
// import { format } from "date-fns";
// import { useContext, useState } from "react";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { useNavigate, useParams } from "react-router-dom";
// import { AuthContext } from "../../../../Context/Auth/AuthProvider";
// import useAxiosSecure from "../../../../Hooks/UseAxiosSecure/useAxiosSecure";
// import DonationModal from "../../DonMod/DonMod";

// const stripePromise = loadStripe(`${import.meta.env.VITE_Stripe_Key}`);

// const DonationDetails = () => {
//   const { id } = useParams();
//   const [showModal, setShowModal] = useState(false);
//   const axiosSecure = useAxiosSecure();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const handleNavigate = (id) => {
//     navigate(`/donations/${id}`);
//   };

//   const fetchDonationDetails = async () => {
//     const response = await axiosSecure.get(`/donations/${id}`);
//     return response.data;
//   };

//   const fetchRecommendedDonations = async () => {
//     const response = await axiosSecure.get(`/donations/recommended/${id}`);
//     return response.data;
//   };

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["donationDetails", id],
//     queryFn: fetchDonationDetails,
//   });

//   const {
//     data: recommendedDonations,
//     isLoading: recommendedLoading,
//     error: recommendedError,
//   } = useQuery({
//     queryKey: ["recommendedDonations", id],
//     queryFn: fetchRecommendedDonations,
//   });

//   if (error)
//     return (
//       <div>Error: Unable to load donation details. Please try again later.</div>
//     );

//   return (
//     <div className="p-4">
//       {isLoading ? (
//         <>
//           <Skeleton height={250} className="mb-4" />
//           <Skeleton height={30} width={200} />
//           <Skeleton height={20} width={150} className="mt-2" />
//           <Skeleton count={3} className="mt-4" />
//           <Skeleton height={50} width={150} className="mt-6" />
//         </>
//       ) : (
//         <>
//           <div
//             className={`h-64 bg-cover bg-center ${
//               data.paused ? "opacity-50" : ""
//             }`}
//             style={{ backgroundImage: `url(${data.imageUrl})` }}
//           ></div>
//           <Typography variant="h3" className="mt-4">
//             {data.title}
//           </Typography>
//           <Typography className="mt-2 text-gray-600">
//             Goal:{" "}
//             <span className="text-green-500 font-bold">${data.goalAmount}</span>
//           </Typography>
//           <Typography className="mt-2 text-gray-600">
//             Raised:{" "}
//             <span className="text-green-500 font-bold">
//               ${data.raisedAmount}
//             </span>
//           </Typography>
//           <Typography className="text-gray-600">
//             Start On: {format(new Date(data.createdAt), "PPP")}
//           </Typography>
//           <Typography className="text-gray-600">
//             Last Date: {format(new Date(data.lastDate), "PPP")}
//           </Typography>
//           <Typography className="mt-4">
//             {" "}
//             Description
//             <div
//               dangerouslySetInnerHTML={{ __html: data.shortDescription }}
//             ></div>
//           </Typography>
//           <Typography className="mt-4">
//             {" "}
//             Details
//             <div
//               dangerouslySetInnerHTML={{ __html: data.longDescription }}
//             ></div>
//           </Typography>
//           <Button
//             disabled={data.paused || new Date(data.lastDate) < new Date()}
//             onClick={() => {
//               if (user) {
//                 setShowModal(true);
//               } else {
//                 navigate("/login");
//               }
//             }}
//             className="mt-6"
//             color="green"
//           >
//             {data.paused
//               ? "Campaign Paused"
//               : new Date(data.lastDate) < new Date()
//               ? "Campaign Ended"
//               : "Donate Now"}
//           </Button>

//           {showModal && (
//             <Elements stripe={stripePromise}>
//               <DonationModal
//                 donationId={id}
//                 onClose={() => setShowModal(false)}
//               />
//             </Elements>
//           )}
//         </>
//       )}

//       <Typography variant="h4" className="mt-10">
//         Recommended Donations
//       </Typography>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//         {recommendedLoading
//           ? Array.from({ length: 3 }).map((_, idx) => (
//               <div key={idx} className="p-4 border rounded">
//                 <Skeleton height={160} />
//                 <Skeleton height={20} className="mt-2" />
//                 <Skeleton height={20} width={100} className="mt-2" />
//                 <Skeleton height={20} width={120} className="mt-2" />
//                 <Skeleton height={40} width={100} className="mt-4" />
//               </div>
//             ))
//           : recommendedDonations?.length > 0
//           ? recommendedDonations.map((campaign) => (
//               <div key={campaign._id} className="p-4 border rounded">
//                 <img
//                   src={campaign.imageUrl}
//                   alt={campaign.title}
//                   className="w-full h-40 object-cover rounded"
//                 />
//                 <Typography variant="h6" className="mt-2">
//                   {campaign.title}
//                 </Typography>
//                 <Typography className="text-gray-600">
//                   Goal:{" "}
//                   <span className="font-bold">${campaign.goalAmount}</span>
//                 </Typography>
//                 <Typography className="text-gray-600">
//                   Raised:{" "}
//                   <span className="font-bold">${campaign.raisedAmount}</span>
//                 </Typography>

//                 <Button
//                   className="mt-4"
//                   color="blue"
//                   onClick={() => {
//                     handleNavigate(campaign._id);
//                   }}
//                 >
//                   View Details
//                 </Button>
//               </div>
//             ))
//           : !recommendedLoading && (
//               <Typography className="text-gray-500">
//                 No recommended campaigns found.
//               </Typography>
//             )}
//       </div>
//     </div>
//   );
// };

// export default DonationDetails;

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../../../Hooks/UseAxiosSecure/useAxiosSecure";
import DonationModal from "../../DonMod/DonMod";

const stripePromise = loadStripe(`${import.meta.env.VITE_Stripe_Key}`);

const DonationDetails = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const handleNavigate = (id) => {
    navigate(`/donations/${id}`);
  };

  const fetchDonationDetails = async () => {
    const response = await axiosSecure.get(`/donations/${id}`);
    return response.data;
  };

  const fetchRecommendedDonations = async () => {
    const response = await axiosSecure.get(`/donations/recommended/${id}`);
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["donationDetails", id],
    queryFn: fetchDonationDetails,
  });

  const {
    data: recommendedDonations,
    isLoading: recommendedLoading,
    error: recommendedError,
  } = useQuery({
    queryKey: ["recommendedDonations", id],
    queryFn: fetchRecommendedDonations,
  });

  if (error)
    return (
      <div className="p-4 text-red-500 dark:text-red-300">
        Error: Unable to load donation details. Please try again later.
      </div>
    );

  return (
    <div className="p-4 bg-white dark:bg-gray-900 ">
      <Helmet>
        <title>Donation - Details</title>
      </Helmet>
      {isLoading ? (
        <>
          <Skeleton height={250} className="mb-4 dark:bg-gray-700" />
          <Skeleton height={30} width={200} className="dark:bg-gray-700" />
          <Skeleton height={20} width={150} className="mt-2 dark:bg-gray-700" />
          <Skeleton count={3} className="mt-4 dark:bg-gray-700" />
          <Skeleton height={50} width={150} className="mt-6 dark:bg-gray-700" />
        </>
      ) : (
        <>
          <Card className="w-full max-w-[85rem] mx-auto shadow-lg dark:bg-gray-800 dark:border dark:border-gray-700">
            <CardHeader
              floated={false}
              className={`h-96 ${data.paused ? "opacity-50" : ""}`}
              style={{
                backgroundImage: `url(${data.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <CardBody>
              <div className="flex justify-between items-center">
                <Typography
                  variant="h3"
                  color="blue-gray"
                  className="mb-4 dark:text-white"
                >
                  {data.title}
                </Typography>
                <Button
                  disabled={data.paused || new Date(data.lastDate) < new Date()}
                  onClick={() => {
                    if (user) {
                      setShowModal(true);
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="mt-6"
                  color="blue"
                >
                  {data.paused
                    ? "Campaign Paused"
                    : new Date(data.lastDate) < new Date()
                    ? "Campaign Ended"
                    : "Donate Now"}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Typography color="gray" className="dark:text-gray-300">
                  Goal:{" "}
                  <span className="dark:text-red-400 font-bold">
                    ${data.goalAmount}
                  </span>
                </Typography>
                <Typography color="gray" className="dark:text-gray-300">
                  Raised:{" "}
                  <span className="dark:text-red-400 font-bold">
                    ${data.raisedAmount}
                  </span>
                </Typography>
                <Typography color="gray" className="dark:text-gray-300">
                  Start On: {format(new Date(data.createdAt), "PPP")}
                </Typography>
                <Typography color="gray" className="dark:text-gray-300">
                  Last Date: {format(new Date(data.lastDate), "PPP")}
                </Typography>
              </div>

              <Typography className="mb-4 dark:text-gray-200">
                Description
                <div
                  className="mt-2 text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: data.shortDescription }}
                ></div>
              </Typography>

              <Typography className="mb-4 dark:text-gray-200">
                Details
                <div
                  className="mt-2 text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: data.longDescription }}
                ></div>
              </Typography>
            </CardBody>

            {/* <CardFooter>
              <Button
                disabled={data.paused || new Date(data.lastDate) < new Date()}
                onClick={() => {
                  if (user) {
                    setShowModal(true);
                  } else {
                    navigate("/login");
                  }
                }}
                color="green"
                fullWidth
              >
                {data.paused
                  ? "Campaign Paused"
                  : new Date(data.lastDate) < new Date()
                  ? "Campaign Ended"
                  : "Donate Now"}
              </Button>
            </CardFooter> */}
          </Card>

          {showModal && (
            <Elements stripe={stripePromise}>
              <DonationModal
                donationId={id}
                onClose={() => setShowModal(false)}
              />
            </Elements>
          )}
        </>
      )}

      <Typography
        variant="h4"
        color="blue-gray"
        className="mt-10 dark:text-white"
      >
        Recommended Donations
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {recommendedLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Card
                key={idx}
                className="dark:bg-gray-800 dark:border dark:border-gray-700"
              >
                <Skeleton height={160} className="dark:bg-gray-700" />
                <CardBody>
                  <Skeleton height={20} className="mb-2 dark:bg-gray-700" />
                  <Skeleton
                    height={20}
                    width={100}
                    className="mb-2 dark:bg-gray-700"
                  />
                  <Skeleton
                    height={20}
                    width={120}
                    className="mb-2 dark:bg-gray-700"
                  />
                  <Skeleton
                    height={40}
                    width={100}
                    className="dark:bg-gray-700"
                  />
                </CardBody>
              </Card>
            ))
          : recommendedDonations?.length > 0
          ? recommendedDonations.map((campaign) => (
              <Card
                key={campaign._id}
                className="dark:bg-gray-800 dark:border dark:border-gray-700"
              >
                <CardHeader floated={false} className="h-40">
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                </CardHeader>
                <CardBody>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="mb-2 dark:text-white"
                  >
                    {campaign.title}
                  </Typography>
                  <Typography color="gray" className="mb-2 dark:text-gray-300">
                    Goal:{" "}
                    <span className="font-bold">${campaign.goalAmount}</span>
                  </Typography>
                  <Typography color="gray" className="mb-2 dark:text-gray-300">
                    Raised:{" "}
                    <span className="font-bold">${campaign.raisedAmount}</span>
                  </Typography>
                </CardBody>
                <CardFooter>
                  <Button
                    color="blue"
                    fullWidth
                    onClick={() => {
                      handleNavigate(campaign._id);
                    }}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          : !recommendedLoading && (
              <Typography
                color="gray"
                className="col-span-full text-center dark:text-gray-400"
              >
                No recommended campaigns found.
              </Typography>
            )}
      </div>
    </div>
  );
};

export default DonationDetails;
