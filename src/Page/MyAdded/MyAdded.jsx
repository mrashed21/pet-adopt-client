import { Button, Card, Typography } from "@material-tailwind/react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/Auth/AuthProvider";

const MyAddedPets = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const navigate = useNavigate();

  // Fetch Pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/pet/me/${user.email}`
        );
        setPets(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pets:", error);
        setLoading(false);
      }
    };
    fetchPets();
  }, [user.email]);

  // Handle Update
  const handleUpdate = (id) => {
    navigate(`/dashboard/update-pet/${id}`);
  };

  // Handle Delete with SweetAlert2
  const handleDelete = async (petId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/pets/${petId}`);
          setPets((prev) => prev.filter((pet) => pet._id !== petId));
          Swal.fire("Deleted!", "Your pet has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting pet:", error);
          Swal.fire("Error!", "Failed to delete pet.", "error");
        }
      }
    });
  };

  // Handle Adopt with SweetAlert2
  const handleAdopt = async (petId) => {
    Swal.fire({
      title: "Mark as Adopted?",
      text: "This action cannot be undone.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Adopt",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`http://localhost:5000/pet/${petId}`, {
            adopted: true,
          });
          setPets((prev) =>
            prev.map((pet) =>
              pet._id === petId ? { ...pet, adopted: true } : pet
            )
          );
          Swal.fire("Success!", "Pet marked as adopted.", "success");
        } catch (error) {
          console.error("Error marking pet as adopted:", error);
          Swal.fire("Error!", "Failed to mark as adopted.", "error");
        }
      }
    });
  };

  // Table Columns with proper sorting
  const columns = useMemo(
    () => [
      {
        accessorKey: "serial",
        header: "S/N",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: "Pet Name",
        enableSorting: true,
      },
      {
        accessorKey: "category",
        header: "Category",
        enableSorting: true,
      },
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: (info) => (
          <img
            src={info.getValue()}
            alt={info.row.original.name}
            className="h-16 w-16 object-cover rounded-md"
            onError={(e) => {
              e.target.src = "https://placeholder.com/150";
            }}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "adopted",
        header: "Adoption Status",
        cell: (info) => (info.getValue() ? "Adopted" : "Not Adopted"),
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              color="blue"
              size="sm"
              onClick={() => handleUpdate(row.original._id)}
            >
              Update
            </Button>
            <Button
              color="red"
              size="sm"
              onClick={() => handleDelete(row.original._id)}
            >
              Delete
            </Button>
            <Button
              color="green"
              size="sm"
              disabled={row.original.adopted}
              onClick={() => handleAdopt(row.original._id)}
            >
              {row.original.adopted ? "Adopted" : "Mark as Adopted"}
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  // Table instance with proper sorting configuration
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography>Loading...</Typography>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <Typography variant="h4" className="font-bold mb-4">
        My Added Pets
      </Typography>
      <div className="overflow-x-auto">
        <table className="w-full border border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`border px-4 py-2 ${
                      header.column.getCanSort()
                        ? "cursor-pointer hover:bg-gray-50"
                        : ""
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center justify-between">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <span className="ml-2">
                          {header.column.getIsSorted()
                            ? header.column.getIsSorted() === "asc"
                              ? " ↑"
                              : " ↓"
                            : " ↕"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pets.length > 10 && (
        <div className="flex items-center gap-2 justify-center mt-4">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2"
          >
            Previous
          </Button>
          <Typography className="mx-2">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </Typography>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2"
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MyAddedPets;
