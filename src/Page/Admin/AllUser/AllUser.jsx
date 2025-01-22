import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import Swal from "sweetalert2";
import TableSkeleton from "../../../Common/TaboleSkeleton/TableSkeleton";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";

const AllUser = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch users using Tanstack Query
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosSecure.get("/admin/users");
      return response.data;
    },
  });

  // Mutation for updating user role with optimistic updates
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const response = await axiosSecure.put(`/admin/users/${userId}`, {
        role,
      });
      return response.data;
    },
    // Add optimistic update
    onMutate: async ({ userId, role }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(["users"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["users"], (old) => {
        return old.map((user) => {
          if (user._id === userId) {
            return { ...user, role };
          }
          return user;
        });
      });

      return { previousUsers };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(["users"], context.previousUsers);
      Swal.fire({
        title: "Error!",
        text: "Failed to update user role.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const updateRole = async (userId, currentRole, userName) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const action =
      currentRole === "admin" ? "remove admin role from" : "make admin";

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You want to ${action} ${userName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        await updateRoleMutation.mutateAsync({ userId, role: newRole });
        Swal.fire({
          title: "Updated!",
          text: `${userName} has been ${
            currentRole === "admin" ? "removed from" : "made"
          } admin.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "photoURL",
        header: "Profile Picture",
        cell: (info) => (
          <Avatar
            src={info.getValue()}
            alt="User"
            size="md"
            className="border border-blue-gray-50 bg-blue-gray-50/50"
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => (
          <Typography variant="small" color="blue-gray" className="font-normal">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <Typography variant="small" color="blue-gray" className="font-normal">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant={row.original.role === "admin" ? "outlined" : "filled"}
            color={row.original.role === "admin" ? "red" : "blue"}
            onClick={() =>
              updateRole(row.original._id, row.original.role, row.original.name)
            }
            className="px-4 py-2"
          >
            {row.original.role === "admin" ? "Remove Admin" : "Make Admin"}
          </Button>
        ),
      },
    ],
    []
  );

  // Create table instance
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <Card className="h-full w-full max-w-7xl mx-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              All Users
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Total Users: {users.length}
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="even:bg-blue-gray-50/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      {users.length > 10 && (
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Typography color="gray" className="font-normal">
              Page{" "}
              <strong className="text-blue-gray-900">
                {table.getState().pagination.pageIndex + 1}
              </strong>{" "}
              of{" "}
              <strong className="text-blue-gray-900">
                {table.getPageCount()}
              </strong>
            </Typography>
          </div>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AllUser;
