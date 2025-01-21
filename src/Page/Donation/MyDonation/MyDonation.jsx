import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import  { useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

const MyDonations = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const {
    data: donations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myDonations", user.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/my-donations/${user.email}`);
      return response.data;
    },
  });

  const refundMutation = useMutation({
    mutationFn: async ({ id, amount }) => {
      const response = await axiosSecure.post(`/donations/refund/${id}`, {
        userEmail: user.email,
        amount,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myDonations"] });
    },
  });

  const handleRefund = (id, amount) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to request a refund!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Refund it!",
    }).then((result) => {
      if (result.isConfirmed) {
        refundMutation.mutate({ id, amount });
        Swal.fire(
          "Refund Successful!",
          "Your Money has been Refunded.",
          "success"
        );
      }
    });
  };

  if (isLoading) {
    return (
      <p className="text-lg font-medium text-gray-700">Loading donations...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-lg font-medium text-red-600">
        Failed to load donations.
      </p>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">My Donations</h2>
        </div>

        <div className="p-6">
          {donations.length === 0 ? (
            <p className="text-gray-600">No donations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Pet Image
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Pet Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Donated Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map((donation) =>
                    donation.donators.map((donator, index) => (
                      <tr
                        key={`${donation._id}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={donation.imageUrl}
                            alt={donation.title}
                            className="h-16 w-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {donation.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${donator.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleRefund(donation._id, donator.amount)
                            }
                            disabled={refundMutation.isPending}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Ask for Refund
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDonations;
