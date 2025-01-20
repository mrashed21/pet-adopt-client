import { Button, Typography } from "@material-tailwind/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../../../Hooks/UseAxiosSecure/useAxiosSecure";
import DonationModal from "../../DonMod/DonMod";

const stripePromise = loadStripe(
  "pk_test_51Qj2fcLajU602OADcGNs4ghcmSV5jgk2t4lNpivlZG8b6eFXXuyeuc9YQe65FLQI1pv24UDNK2QIJuxWQBC21vDB00Jf55j8qO"
);

const DonationDetails = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
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

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      {isLoading ? (
        <>
          <Skeleton height={250} className="mb-4" />
          <Skeleton height={30} width={200} />
          <Skeleton height={20} width={150} className="mt-2" />
          <Skeleton count={3} className="mt-4" />
          <Skeleton height={50} width={150} className="mt-6" />
        </>
      ) : (
        <>
          <div
            className="h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.imageUrl})` }}
          ></div>
          <Typography variant="h3" className="mt-4">
            {data.title}
          </Typography>
          <Typography className="mt-2 text-gray-600">
            Goal:{" "}
            <span className="text-green-500 font-bold">${data.goalAmount}</span>
          </Typography>
          <Typography className="mt-2 text-gray-600">
            Raised:{" "}
            <span className="text-green-500 font-bold">
              ${data.raisedAmount}
            </span>
          </Typography>
          <Typography className="mt-4">
            <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
          </Typography>
          <Button
            disabled={data.paused === true}
            onClick={() => setShowModal(true)}
            className="mt-6"
            color="green"
          >
            Donate Now
          </Button>

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

      <Typography variant="h4" className="mt-10">
        Recommended Donations
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {recommendedLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-4 border rounded">
                <Skeleton height={160} />
                <Skeleton height={20} className="mt-2" />
                <Skeleton height={20} width={100} className="mt-2" />
                <Skeleton height={20} width={120} className="mt-2" />
                <Skeleton height={40} width={100} className="mt-4" />
              </div>
            ))
          : recommendedDonations?.length > 0
          ? recommendedDonations.map((campaign) => (
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
                  Goal:{" "}
                  <span className="font-bold">${campaign.goalAmount}</span>
                </Typography>
                <Typography className="text-gray-600">
                  Raised:{" "}
                  <span className="font-bold">${campaign.raisedAmount}</span>
                </Typography>
                <Button
                  className="mt-4"
                  color="blue"
                  onClick={() => {
                    handleNavigate(campaign._id);
                  }}
                >
                  View Details
                </Button>
              </div>
            ))
          : !recommendedLoading && (
              <Typography className="text-gray-500">
                No recommended campaigns found.
              </Typography>
            )}
      </div>
    </div>
  );
};

export default DonationDetails;
