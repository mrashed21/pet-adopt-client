import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonators, setSelectedDonators] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(`/admin/donation`);
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle pause/unpause donation
  const handlePauseToggle = async (id, paused) => {
    try {
      await axiosSecure.patch(`/donations/pause/${id}`, {
        paused: !paused,
      });
      fetchDonations();
    } catch (error) {
      console.error("Error updating pause state:", error.message);
    }
  };

  const handleViewDonators = async (id) => {
    try {
      const response = await axiosSecure.get(`/donations/donators/${id}`);
      setSelectedDonators(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching donators:", error.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-donation/${id}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Donation Campaigns</h1>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2">Pet Name</th>
            <th className="border border-gray-200 px-4 py-2">Max Donation</th>
            <th className="border border-gray-200 px-4 py-2">Progress</th>
            <th className="border border-gray-200 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation._id}>
              <td className="border border-gray-200 px-4 py-2">
                {donation.title}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                ${donation.goalAmount}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                <div className="w-full bg-gray-200 rounded">
                  <div
                    className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-1 rounded"
                    style={{
                      width: `${
                        (donation.raisedAmount / donation.goalAmount) * 100
                      }%`,
                    }}
                  >
                    {(
                      (donation.raisedAmount / donation.goalAmount) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                </div>
              </td>
              <td className="border border-gray-200 px-4 py-2 space-x-2">
                <button
                  className={`px-3 py-1 rounded ${
                    donation.paused ? "bg-green-500" : "bg-gray-500"
                  } text-white`}
                  onClick={() =>
                    handlePauseToggle(donation._id, donation.paused)
                  }
                >
                  {donation.paused ? "Unpause" : "Pause"}
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(donation._id)}
                >
                  Edit
                </button>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => handleViewDonators(donation._id)}
                >
                  View Donators
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Donators</h2>
            <ul>
              {selectedDonators && selectedDonators.length > 0 ? (
                selectedDonators.map((donator, index) => (
                  <li key={index} className="mb-2">
                    {donator.name || "Anonymous"} - ${donator.amount}
                  </li>
                ))
              ) : (
                <li>No donations yet.</li>
              )}
            </ul>
            <button
              className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDonations;
