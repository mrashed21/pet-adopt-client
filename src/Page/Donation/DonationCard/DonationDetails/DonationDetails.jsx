import { Typography } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const DonationDetails = () => {
  const { id } = useParams();

  // Function to fetch donation details
  const fetchDonationDetails = async () => {
    const response = await fetch(`http://localhost:5000/donations/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch donation details");
    }
    return response.json();
  };

  // Use the object format for useQuery in React Query v5
  const { data, isLoading, error } = useQuery({
    queryKey: ["donationDetails", id],
    queryFn: fetchDonationDetails,
  });

  // Handle loading state
  if (isLoading) return <div>Loading...</div>;

  // Handle error state
  if (error) return <div>Error: {error.message}</div>;

  // Destructure the data object
  const { title, description, goalAmount, raisedAmount, imageUrl } = data;

  // Render the UI
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
    </div>
  );
};

export default DonationDetails;
