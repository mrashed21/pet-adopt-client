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
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TableSkeleton from "../../Common/TaboleSkeleton/TableSkeleton";
import { AuthContext } from "../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../Hooks/UseAxiosSecure/useAxiosSecure";

const MyAdded = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);

  // Fetch pets data with adoption requests
  const { data: pets = [], isLoading } = useQuery({
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

  // Delete mutation
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

  // Adoption mutation
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
        accessorKey: "serialNumber",
        header: "Serial No.",
        cell: (info) => (
          <Typography variant="small" color="blue-gray" className="font-normal">
            {info.row.index + 1}
          </Typography>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div
            className="cursor-pointer flex items-center gap-2"
            onClick={() => column.toggleSorting()}
          >
            Pet Name
            {column.getIsSorted() === "asc"
              ? " ↑"
              : column.getIsSorted() === "desc"
              ? " ↓"
              : ""}
          </div>
        ),
        cell: (info) => (
          <Typography variant="small" color="blue-gray" className="font-normal">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <div
            className="cursor-pointer flex items-center gap-2"
            onClick={() => column.toggleSorting()}
          >
            Category
            {column.getIsSorted() === "asc"
              ? " ↑"
              : column.getIsSorted() === "desc"
              ? " ↓"
              : ""}
          </div>
        ),
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
              className="h-16 w-20  rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = "/api/placeholder/150/150";
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "adopted",
        header: ({ column }) => (
          <div
            className="cursor-pointer flex items-center gap-2"
            onClick={() => column.toggleSorting()}
          >
            Status
            {column.getIsSorted() === "asc"
              ? " ↑"
              : column.getIsSorted() === "desc"
              ? " ↓"
              : ""}
          </div>
        ),
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
                }
              `}
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
          const hasPendingRequests = pet.adoptionRequests?.some(
            (r) => r.status === "pending"
          );
          const pendingRequest = pet.adoptionRequests?.find(
            (r) => r.status === "pending"
          );

          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                color="blue"
                className="px-4"
                onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
                disabled={isAdopted || hasPendingRequests}
              >
                Update
              </Button>

              <Button
                size="sm"
                color="red"
                className="px-4"
                onClick={() => handleDelete(pet._id)}
                disabled={deleteMutation.isPending || hasPendingRequests}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>

              <Button
                size="sm"
                color="green"
                className="px-4"
                onClick={() =>
                  pendingRequest
                    ? handleAdoption(pet._id, pendingRequest._id, "accepted")
                    : null
                }
                disabled={
                  adoptionMutation.isPending ||
                  isAdopted ||
                  !hasPendingRequests ||
                  pet.status === "Available"
                }
              >
                Adopt
              </Button>
            </div>
          );
        },
      },
    ],
    [deleteMutation.isPending, adoptionMutation.isPending]
  );

  // Table configuration
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

  // Loading state
  if (isLoading) {
    return <TableSkeleton />;
  }

  // Error state
  // if (isError) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <Typography color="red" variant="h6">
  //         Error: {error.message}
  //       </Typography>
  //     </div>
  //   );
  // }

  // Main render
  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>My Added Pets</title>
      </Helmet>
      <Typography variant="h4" className="my-4 text-center">
        My Added Pets
      </Typography>

      {isLoading ? (
        <TableSkeleton />
      ) : pets.length === 0 ? (
        <Typography variant="h4" className="text-center mt-20 text-gray-500">
          No data found
        </Typography>
      ) : (
        <Card>
          <CardBody>
            <table className="table-auto w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-2 text-left bg-gray-100"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
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
      )}
    </div>
  );
};

export default MyAdded;
