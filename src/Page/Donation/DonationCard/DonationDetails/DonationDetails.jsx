
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "@material-tailwind/react";

const fetchDonationDetails = async (id) => {
  const response = await fetch(`http://localhost:5000/donations/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch donation details");
  }
  return response.json();
};

const DonationDetails = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery(["donationDetails", id], () =>
    fetchDonationDetails(id)
  );

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
        Raised: <span className="text-green-500 font-bold">${raisedAmount}</span>
      </Typography>
      <Typography className="mt-4">{description}</Typography>
    </div>
  );
};

export default DonationDetails;
