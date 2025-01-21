

import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../Hooks/UseAxiosSecure/useAxiosSecure";

const MyAdded = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);

  // Queries
  const {
    data: pets = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pets", user?.email],
    queryFn: async () => {
      const [petsResponse, adoptionsResponse] = await Promise.all([
        axiosSecure.get(`/pet/me/${user.email}`),
        axiosSecure.get(`/adoptions/${user.email}`),
      ]);

      const petsWithAdoptions = petsResponse.data.map((pet) => ({
        ...pet,
        adoptionRequests: adoptionsResponse.data.filter(
          (a) => a.petId === pet._id
        ),
      }));

      return petsWithAdoptions;
    },
    enabled: !!user?.email,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async (petId) => {
      const adoptions =
        pets.find((p) => p._id === petId)?.adoptionRequests || [];
      const pendingAdoptions = adoptions.filter((a) => a.status === "pending");

      if (pendingAdoptions.length > 0) {
        throw new Error("Cannot delete pet with pending adoption requests");
      }

      return axiosSecure.delete(`/pets/${petId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pets", user?.email]);
      Swal.fire("Success", "Pet successfully deleted", "success");
    },
    onError: (error) => {
      Swal.fire("Error", error.message || "Failed to delete pet", "error");
    },
  });

  const adoptionMutation = useMutation({
    mutationFn: async ({ petId, adoptionId, status }) => {
      if (status === "accepted") {
        await axiosSecure.patch(`/pets/${petId}`, { adopted: true });
        return axiosSecure.patch(`/adoptions/${adoptionId}`, { status });
      } else {
        await axiosSecure.patch(`/pet-reject/${petId}`, { adopted: false });
        return axiosSecure.delete(`/adoptions/${adoptionId}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pets", user?.email]);
      Swal.fire("Success", "Adoption status updated successfully", "success");
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error.message || "Failed to update adoption status",
        "error"
      );
    },
  });

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Pet Name",
        cell: (info) => (
          <Typography variant="small" color="blue-gray" className="font-normal">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (info) => (
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal capitalize"
          >
            {info.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <img
              src={row.original.imageUrl}
              alt={row.original.name}
              className="h-16 w-16 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = "/api/placeholder/150/150";
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "adopted",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.adopted;
          const hasPendingRequests = row.original.adoptionRequests?.some(
            (r) => r.status === "pending"
          );

          return (
            <div
              className={`
              px-4 py-1 rounded-full text-center w-24
              ${
                status === true
                  ? "bg-green-100 text-green-800"
                  : hasPendingRequests
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              <Typography className="font-medium text-sm">
                {status === true
                  ? "Adopted"
                  : hasPendingRequests
                  ? "Pending"
                  : "Available"}
              </Typography>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const pet = row.original;
          const isAdopted = pet.adopted === true;
          const pendingRequest = pet.adoptionRequests?.find(
            (r) => r.status === "pending"
          );

          if (pendingRequest) {
            return (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="green"
                  className="px-4"
                  onClick={() =>
                    handleAdoption(pet._id, pendingRequest._id, "accepted")
                  }
                  disabled={adoptionMutation.isPending}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  color="orange"
                  className="px-4"
                  onClick={() =>
                    handleAdoption(pet._id, pendingRequest._id, "rejected")
                  }
                  disabled={adoptionMutation.isPending}
                >
                  Reject
                </Button>
              </div>
            );
          }

          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                color="blue"
                className="px-4"
                onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
                disabled={isAdopted}
              >
                Update
              </Button>

              <Button
                size="sm"
                color="red"
                className="px-4"
                onClick={() => handleDelete(pet._id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          );
        },
      },
    ],
    [deleteMutation.isPending, adoptionMutation.isPending]
  );

  const table = useReactTable({
    data: pets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  // Event handlers
  const handleDelete = (petId) => {
    const pet = pets.find((p) => p._id === petId);
    if (pet.adoptionRequests?.some((r) => r.status === "pending")) {
      Swal.fire(
        "Error",
        "Cannot delete pet with pending adoption requests",
        "error"
      );
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(petId);
      }
    });
  };

  const handleAdoption = (petId, adoptionId, status) => {
    Swal.fire({
      title: `Are you sure you want to ${status} this request?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "accepted" ? "#10B981" : "#F97316",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${status} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        adoptionMutation.mutate({ petId, adoptionId, status });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Typography variant="h6" color="blue-gray">
          Loading...
        </Typography>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Typography color="red" variant="h6">
          Error: {error.message}
        </Typography>
      </div>
    );
  }

  return (
    <Card className="h-full w-full">
      <CardBody>
        <Typography
          variant="h4"
          color="blue-gray"
          className="mb-6 font-bold text-center"
        >
          Pet Management
        </Typography>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-4 border-b border-blue-gray-50"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pets.length > 10 && (
          <div className="flex items-center justify-between gap-4 mt-4">
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <Typography color="gray" className="font-normal">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </Typography>
            </div>
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default MyAdded;
