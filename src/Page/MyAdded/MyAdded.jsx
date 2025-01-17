import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@material-tailwind/react";
import { useReactTable } from "@tanstack/react-table";
import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../Context/Auth/AuthProvider";

const MyAddedPets = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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

  const handleDelete = async () => {
    if (!petToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/pet/${petToDelete}`);
      setPets((prev) => prev.filter((pet) => pet._id !== petToDelete));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const handleAdopt = async (petId) => {
    try {
      await axios.patch(`http://localhost:5000/pet/${petId}`, {
        adopted: true,
      });
      setPets((prev) =>
        prev.map((pet) => (pet._id === petId ? { ...pet, adopted: true } : pet))
      );
    } catch (error) {
      console.error("Error marking pet as adopted:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "serial",
        header: "S/N",
        cell: (info) => info.row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Pet Name",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: (info) => (
          <img
            src={info.getValue()}
            alt={info.row.original.name}
            className="h-16 w-16 object-cover rounded-md"
          />
        ),
      },
      {
        accessorKey: "adopted",
        header: "Adoption Status",
        cell: (info) => (info.getValue() ? "Adopted" : "Not Adopted"),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              color="blue"
              size="sm"
              onClick={() =>
                (window.location.href = `/update-pet/${row.original._id}`)
              }
            >
              Update
            </Button>
            <Button
              color="red"
              size="sm"
              onClick={() => {
                setPetToDelete(row.original._id);
                setIsDeleteModalOpen(true);
              }}
            >
              Delete
            </Button>
            <Button
              color="green"
              size="sm"
              disabled={row.original.adopted}
              onClick={() => handleAdopt(row.original._id)}
            >
              Adopted
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: pets,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(pets.length / pageSize),
    state: {
      pageIndex,
      pageSize,
    },
    onPaginationChange: ({ pageIndex, pageSize }) => {
      setPageIndex(pageIndex);
      setPageSize(pageSize);
    },
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Added Pets</h1>
      <table className="w-full border border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id || column.accessorKey}
                className="border px-4 py-2"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-4 py-2">
                  {cell.renderCell()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isDeleteModalOpen && (
        <Modal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <ModalHeader>Delete Pet</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this pet?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="red" onClick={handleDelete} className="mr-2">
              Yes
            </Button>
            <Button color="blue" onClick={() => setIsDeleteModalOpen(false)}>
              No
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default MyAddedPets;
