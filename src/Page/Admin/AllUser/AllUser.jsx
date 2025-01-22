/* eslint-disable no-unused-vars */
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import useAxiosPublic from "../../../Hooks/PublikAxios/PublicAxios";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosPublic.get("/admin/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle "Make Admin" button click
  const makeAdmin = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/admin/users/${userId}`, {
        role: "admin",
      });
      alert("User has been made admin successfully!");
      // Update the UI without re-fetching the entire list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: "admin" } : user
        )
      );
    } catch (error) {
      console.error("Error making user admin:", error);
    }
  };

  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      {
        accessorKey: "photoURL",
        header: "Profile Picture",
        cell: (info) => (
          <img
            src={info.getValue() || "https://via.placeholder.com/40"}
            alt="User"
            style={{ width: "40px", borderRadius: "50%" }}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() =>
              updateRole(
                row.original._id,
                row.original.role === "admin" ? "user" : "admin"
              )
            }
            className={`px-4 py-2 rounded ${
              row.original.role === "admin"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {row.original.role === "admin" ? "Remove Admin" : "Make Admin"}
          </button>
        ),
      },
    ],
    []
  );

  const updateRole = async (userId, role) => {
    try {
      await axios.put(`http://localhost:5000/admin/users/${userId}`, { role });
      alert(
        role === "admin"
          ? "User has been made admin successfully!"
          : "Admin role has been removed!"
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role } : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // Create table instance
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          <p>Total Users: {users.length}</p>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border p-2 text-left"
                      colSpan={header.colSpan}
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
                <tr key={row.id} className="hover:bg-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border p-2 text-left">
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

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Previous
            </button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUser;
