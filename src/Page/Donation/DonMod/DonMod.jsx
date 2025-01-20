/* eslint-disable react/prop-types */
import { Button } from "@material-tailwind/react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

const DonationModal = ({ donationId, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDonation = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    try {
      const cardElement = elements.getElement(CardElement);
      const paymentMethod = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
      if (paymentMethod.error) {
        setError(paymentMethod.error.message);
        setLoading(false);
        return;
      }
      const response = await axiosSecure.post(
        `/donations/${donationId}/donate`,
        {
          amount: parseFloat(amount),
          paymentMethodId: paymentMethod.paymentMethod.id,
          donorEmail: user?.email || "guest@example.com",
          donorName: user?.displayName || "Guest",
        }
      );
      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to process donation");
      }
      Swal.fire({
        title: "Donation successful!",
        icon: "success",
        confirmButtonText: "Okay",
      });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold">Make a Donation</h2>
        <input
          type="number"
          placeholder="Enter amount"
          className="mt-4 p-2 border rounded w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="mt-4">
          <CardElement />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="mr-4"
            color="gray"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDonation}
            color="green"
            disabled={!stripe || loading}
          >
            {loading ? "Processing..." : "Donate"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
