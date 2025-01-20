// import { Typography } from "@material-tailwind/react";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";

// const DonationDetails = () => {
//   const { id } = useParams();

//   // Function to fetch donation details
//   const fetchDonationDetails = async () => {
//     const response = await fetch(`http://localhost:5000/donations/${id}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch donation details");
//     }
//     return response.json();
//   };

//   // Use the object format for useQuery in React Query v5
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["donationDetails", id],
//     queryFn: fetchDonationDetails,
//   });

//   // Handle loading state
//   if (isLoading) return <div>Loading...</div>;

//   // Handle error state
//   if (error) return <div>Error: {error.message}</div>;

//   // Destructure the data object
//   const { title, description, goalAmount, raisedAmount, imageUrl } = data;

//   // Render the UI
//   return (
//     <div className="p-4">
//       <div
//         className="h-64 bg-cover bg-center"
//         style={{ backgroundImage: `url(${imageUrl})` }}
//       ></div>
//       <Typography variant="h3" className="mt-4">
//         {title}
//       </Typography>
//       <Typography className="mt-2 text-gray-600">
//         Goal: <span className="text-green-500 font-bold">${goalAmount}</span>
//       </Typography>
//       <Typography className="mt-2 text-gray-600">
//         Raised:{" "}
//         <span className="text-green-500 font-bold">${raisedAmount}</span>
//       </Typography>
//       <Typography className="mt-4">{description}</Typography>
//     </div>
//   );
// };

// export default DonationDetails;

import { Button, Typography } from "@material-tailwind/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import DonationModal from "../../DonMod/DonMod";
// import DonationModal from "./DonationModal";

const stripePromise = loadStripe(
  "pk_test_51Qj2fcLajU602OADcGNs4ghcmSV5jgk2t4lNpivlZG8b6eFXXuyeuc9YQe65FLQI1pv24UDNK2QIJuxWQBC21vDB00Jf55j8qO"
); // Replace with your Stripe public key

const DonationDetails = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);

  // Fetch donation details
  const fetchDonationDetails = async () => {
    const response = await fetch(`http://localhost:5000/donations/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch donation details");
    }
    return response.json();
  };

  const fetchRecommendedDonations = async () => {
    const response = await fetch(
      `http://localhost:5000/donations/recommended/${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch recommended donations");
    }
    return response.json();
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { title, description, goalAmount, raisedAmount, imageUrl } = data;

  return (
    <div className="p-4">
      <div
        className="h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <Typography variant="h3" className="mt-4">
        {title}
      </Typography>
      <Typography className="mt-2 text-gray-600">
        Goal: <span className="text-green-500 font-bold">${goalAmount}</span>
      </Typography>
      <Typography className="mt-2 text-gray-600">
        Raised:{" "}
        <span className="text-green-500 font-bold">${raisedAmount}</span>
      </Typography>
      <Typography className="mt-4">{description}</Typography>
      <Button onClick={() => setShowModal(true)} className="mt-6" color="green">
        Donate Now
      </Button>

      {showModal && (
        <Elements stripe={stripePromise}>
          <DonationModal donationId={id} onClose={() => setShowModal(false)} />
        </Elements>
      )}

      <Typography variant="h4" className="mt-10">
        Recommended Donations
      </Typography>
      {recommendedLoading && <div>Loading recommended donations...</div>}
      {recommendedError && (
        <div>Error loading recommendations: {recommendedError.message}</div>
      )}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {recommendedDonations?.length > 0 ? (
          recommendedDonations.map((campaign) => (
            <div key={campaign._id} className="p-4 border rounded">
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-40 object-cover rounded"
              />
              <Typography variant="h6" className="mt-2">
                {campaign.title}
              </Typography>
              <Typography className="text-gray-600">
                Goal: <span className="font-bold">${campaign.goalAmount}</span>
              </Typography>
              <Typography className="text-gray-600">
                Raised:{" "}
                <span className="font-bold">${campaign.raisedAmount}</span>
              </Typography>
            </div>
          ))
        ) : (
          <Typography className="text-gray-500">
            No recommended campaigns found.
          </Typography>
        )}
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {recommendedDonations?.length > 0 ? (
          recommendedDonations.map((campaign) => (
            <div key={campaign._id} className="p-4 border rounded">
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-40 object-cover rounded"
              />
              <Typography variant="h6" className="mt-2">
                {campaign.title}
              </Typography>
              <Typography className="text-gray-600">
                Goal: <span className="font-bold">${campaign.goalAmount}</span>
              </Typography>
              <Typography className="text-gray-600">
                Raised:{" "}
                <span className="font-bold">${campaign.raisedAmount}</span>
              </Typography>
              {/* Add View Details button */}
              <Button
                className="mt-4"
                color="blue"
                onClick={() => {
                  window.location.href = `/donations/${campaign._id}`;
                }}
              >
                View Details
              </Button>
            </div>
          ))
        ) : (
          <Typography className="text-gray-500">
            No recommended campaigns found.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default DonationDetails;
