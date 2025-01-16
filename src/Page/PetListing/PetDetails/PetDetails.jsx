// import { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { AuthContext } from "../../../Context/Auth/AuthProvider";

// const PetDetails = () => {
//   const { id } = useParams(); // Get pet ID from URL params
//   const [pet, setPet] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     // Fetch pet details by ID from the backend
//     fetch(`http://localhost:5000/pets/${id}`)
//       .then((res) => res.json())
//       .then((data) => setPet(data))
//       .catch((err) => console.error("Failed to fetch pet details:", err));
//   }, [id]);

//   const handleAdopt = (e) => {
//     e.preventDefault();
//     const adoptionData = {
//       petId: pet._id,
//       petName: pet.name,
//       petImage: pet.imageUrl,
//       userName: user.name,
//       email: user.email,
//       phoneNumber: e.target.phoneNumber.value,
//       address: e.target.address.value,
//     };

//     fetch("/adoption-requests", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(adoptionData),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.result) {
//           alert("Adoption request submitted!");
//           setShowModal(false);
//         }
//       })
//       .catch((err) => console.error("Failed to submit adoption request:", err));
//   };

//   if (!pet) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <img
//         src={pet?.imageUrl}
//         alt={pet?.name}
//         className="w-full h-64 object-cover rounded-md"
//       />
//       <h1 className="text-2xl font-bold mt-4">{pet?.name}</h1>
//       <p>Age: {pet?.age}</p>
//       <p>Location: {pet?.location}</p>
//       <p>{pet?.longDescription}</p>
//       <button
//         onClick={() => setShowModal(true)}
//         className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
//       >
//         Adopt
//       </button>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-md shadow-lg">
//             <h2 className="text-lg font-bold mb-4">{`Adopt ${pet?.name}`}</h2>
//             <form onSubmit={handleAdopt}>
//               <input
//                 type="text"
//                 value={user?.name}
//                 disabled
//                 className="block w-full border mb-2 px-2 py-1 rounded-md"
//               />
//               <input
//                 type="email"
//                 value={user?.email}
//                 disabled
//                 className="block w-full border mb-2 px-2 py-1 rounded-md"
//               />
//               <input
//                 type="tel"
//                 name="phoneNumber"
//                 placeholder="Phone Number"
//                 required
//                 className="block w-full border mb-2 px-2 py-1 rounded-md"
//               />
//               <textarea
//                 name="address"
//                 placeholder="Address"
//                 required
//                 className="block w-full border mb-2 px-2 py-1 rounded-md"
//               ></textarea>
//               <button
//                 type="submit"
//                 className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md"
//               >
//                 Submit
//               </button>
//             </form>
//             <button
//               onClick={() => setShowModal(false)}
//               className="mt-2 block w-full bg-red-600 text-white px-4 py-2 rounded-md"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PetDetails;

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../Context/Auth/AuthProvider";

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  console.log(user?.name);
  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    fetch(`http://localhost:5000/pets/${id}`)
      .then((res) => res.json())
      .then((data) => setPet(data))
      .catch((err) => console.error("Failed to fetch pet details:", err));
  }, [id]);

  const handleAdopt = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adoptionData = {
      petId: pet._id,
      petName: pet.name,
      petImage: pet.imageUrl,
      userName: user.name,
      email: user.email,
      phoneNumber: e.target.phoneNumber.value,
      address: e.target.address.value,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/adopt",
        adoptionData
      );

      if (response.data.result) {
        alert("Adoption request submitted successfully!");
        handleOpen();
      }
    } catch (error) {
      console.error("Failed to submit adoption request:", error);
      alert("Failed to submit adoption request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!pet) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardHeader floated={false} className="relative h-96 bg-blue-gray-50">
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        </CardHeader>

        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Typography variant="h2" color="blue-gray" className="mb-2">
                {pet.name}
              </Typography>
              <Typography
                variant="paragraph"
                color="gray"
                className="font-medium"
              >
                {pet.category}
              </Typography>
            </div>
            <Button
              size="lg"
              color="green"
              onClick={handleOpen}
              className="flex items-center gap-2"
            >
              Adopt Now
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Typography variant="h6" color="blue-gray">
                Age
              </Typography>
              <Typography color="gray">{pet.age} years</Typography>
            </div>
            <div className="space-y-2">
              <Typography variant="h6" color="blue-gray">
                Location
              </Typography>
              <Typography color="gray">{pet.location}</Typography>
            </div>
          </div>

          <div className="space-y-2">
            <Typography variant="h6" color="blue-gray">
              About {pet.name}
            </Typography>
            <Typography color="gray" className="whitespace-pre-line">
              {pet.longDescription}
            </Typography>
          </div>
        </CardBody>
      </Card>

      {/* Adoption Form Dialog */}
      <Dialog
        open={open}
        handler={handleOpen}
        size="md"
        className="overflow-y-auto"
      >
        <form onSubmit={handleAdopt}>
          <DialogHeader>Adopt {pet.name}</DialogHeader>
          <DialogBody divider className="space-y-4">
            {/* Pet Information Display */}
            <Card className="bg-blue-gray-50 p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Pet Information
              </Typography>
              <Typography color="gray">ID: {pet._id}</Typography>
              <Typography color="gray">Name: {pet.name}</Typography>
            </Card>

            {/* User Information Form */}
            <div className="space-y-4">
              <Input
                type="text"
                label="Name"
                value={user?.displayName}
                disabled
                containerProps={{ className: "min-w-full" }}
              />
              <Input
                type="email"
                label="Email"
                value={user?.email}
                disabled
                containerProps={{ className: "min-w-full" }}
              />
              <Input
                type="tel"
                label="Phone Number"
                name="phoneNumber"
                required
                containerProps={{ className: "min-w-full" }}
              />
              <Textarea
                label="Address"
                name="address"
                required
                className="min-h-[100px]"
              />
            </div>
          </DialogBody>
          <DialogFooter className="space-x-2">
            <Button variant="outlined" color="red" onClick={handleOpen}>
              Cancel
            </Button>
            <Button type="submit" color="green" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default PetDetails;
