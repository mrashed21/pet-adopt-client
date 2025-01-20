/* eslint-disable react/prop-types */
import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@material-tailwind/react";

const DonationModal = ({ donationId, onClose }) => {
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

      const response = await fetch(`http://localhost:5000/donations/${donationId}/donate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethodId: paymentMethod.paymentMethod.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to process donation");
      }

      alert("Donation successful!");
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred");
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
