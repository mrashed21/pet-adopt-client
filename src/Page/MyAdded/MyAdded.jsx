/* eslint-disable react-hooks/exhaustive-deps */

import { Button, Card, Typography } from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useContext, useMemo, useState } from "react";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/Auth/AuthProvider";
import useAxiosSecure from "../../Hooks/UseAxiosSecure/useAxiosSecure";

const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-blue-gray-50 mb-4"></div>
    {[...Array(5)].map((_, idx) => (
      <div key={idx} className="h-20 bg-blue-gray-50/50 mb-2 rounded-md"></div>
    ))}
  </div>
);

const MyAdded = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [sorting, setSorting] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch Pets with Tanstack Query
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["pets", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/pet/me/${user.email}`);
      return response.data;
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (petId) => axiosSecure.delete(`/pets/${petId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["pets", user?.email]);
      Swal.fire("Deleted!", "Your pet has been deleted.", "success");
    },
    onError: (error) => {
      console.error("Error deleting pet:", error);
      Swal.fire("Error!", "Failed to delete pet.", "error");
    },
  });

  // Adopt Mutation
  const adoptMutation = useMutation({
    mutationFn: (petId) =>
      axiosSecure.patch(`/pets/${petId}`, { adopted: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(["pets", user?.email]);
      Swal.fire("Success!", "Pet marked as adopted.", "success");
    },
    onError: (error) => {
      console.error("Error marking pet as adopted:", error);
      Swal.fire("Error!", "Failed to mark as adopted.", "error");
    },
  });

  // Handle Update
  const handleUpdate = (id) => {
    navigate(`/dashboard/update-pet/${id}`);
  };

  // Handle Delete with SweetAlert2
  const handleDelete = (petId) => {
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

  // Handle Adopt with SweetAlert2
  const handleAdopt = (petId) => {
    Swal.fire({
      title: "Mark as Adopted?",
      text: "This action cannot be undone.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Adopt",
    }).then((result) => {
      if (result.isConfirmed) {
        adoptMutation.mutate(petId);
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "serial",
        header: "S/N",
        cell: (info) => (
          <Typography className="font-normal">{info.row.index + 1}</Typography>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: "Pet Name",
        cell: (info) => (
          <Typography className="font-normal">{info.getValue()}</Typography>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (info) => (
          <Typography className="font-normal capitalize">
            {info.getValue()}
          </Typography>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: (info) => (
          <div className="flex justify-center">
            <img
              src={info.getValue()}
              alt={info.row.original.name}
              className="h-16 w-16 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = "/api/placeholder/150/150";
              }}
            />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "adopted",
        header: "Adoption Status",
        cell: (info) => (
          <div
            className={`px-4 py-1 rounded-full text-center w-24 ${
              info.getValue()
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            <Typography className="font-medium text-sm">
              {info.getValue() ? "Adopted" : "Available"}
            </Typography>
          </div>
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="px-4 bg-blue-500"
              onClick={() => handleUpdate(row.original._id)}
            >
              Update
            </Button>
            <Button
              size="sm"
              className="px-4 bg-red-500"
              onClick={() => handleDelete(row.original._id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
            <Button
              size="sm"
              className="px-4"
              color={row.original.adopted ? "gray" : "green"}
              disabled={row.original.adopted || adoptMutation.isPending}
              onClick={() => handleAdopt(row.original._id)}
            >
              {row.original.adopted
                ? "Adopted"
                : adoptMutation.isPending
                ? "Processing..."
                : "Mark Adopted"}
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [deleteMutation.isPending, adoptMutation.isPending]
  );

  const table = useReactTable({
    data: pets,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card className="h-full w-full p-6 shadow-xl">
      <div className="mb-8">
        <Typography
          variant="h4"
          color="blue-gray"
          className="font-bold text-center"
        >
          My Added Pets
        </Typography>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : pets.length === 0 ? (
        <div className="text-center py-8">
          <Typography color="gray" className="text-lg">
            No pets added yet
          </Typography>
        </div>
      ) : (
        <>
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
                        {header.column.getCanSort() ? (
                          <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={header.column.getToggleSortingHandler()}
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
                            {header.column.getIsSorted() ? (
                              header.column.getIsSorted() === "asc" ? (
                                <FaArrowUpLong className="h-4 w-4" />
                              ) : (
                                <FaArrowDownLong className="h-4 w-4" />
                              )
                            ) : (
                              <div className="h-4 w-4" />
                            )}
                          </div>
                        ) : (
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
                        )}
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
                      <td key={cell.id} className="p-4">
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

          {/* Pagination Controls */}
          {pets.length > 10 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outlined"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Typography color="gray" className="font-normal">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </Typography>
              <Button
                variant="outlined"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default MyAdded;
