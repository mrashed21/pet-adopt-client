// /* eslint-disable react/prop-types */
// import { useContext, useState } from "react";
// import { AuthContext } from "../../../Context/Auth/AuthProvider";

// const PetDetails = ({ pet }) => {
//   const [showModal, setShowModal] = useState(false);
//   const { user } = useContext(AuthContext);
//   //    const user = { name: "John Doe", email: "johndoe@example.com" }; // Mock user
//   console.log(pet);
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
//       });
//   };

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

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../Context/Auth/AuthProvider";

const PetDetails = () => {
  const { id } = useParams(); // Get pet ID from URL params
  const [pet, setPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch pet details by ID from the backend
    fetch(`http://localhost:5000/pets/${id}`)
      .then((res) => res.json())
      .then((data) => setPet(data))
      .catch((err) => console.error("Failed to fetch pet details:", err));
  }, [id]);

  const handleAdopt = (e) => {
    e.preventDefault();
    const adoptionData = {
      petId: pet._id,
      petName: pet.name,
      petImage: pet.imageUrl,
      userName: user.name,
      email: user.email,
      phoneNumber: e.target.phoneNumber.value,
      address: e.target.address.value,
    };

    fetch("/adoption-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adoptionData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          alert("Adoption request submitted!");
          setShowModal(false);
        }
      })
      .catch((err) => console.error("Failed to submit adoption request:", err));
  };

  if (!pet) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <img
        src={pet?.imageUrl}
        alt={pet?.name}
        className="w-full h-64 object-cover rounded-md"
      />
      <h1 className="text-2xl font-bold mt-4">{pet?.name}</h1>
      <p>Age: {pet?.age}</p>
      <p>Location: {pet?.location}</p>
      <p>{pet?.longDescription}</p>
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
      >
        Adopt
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">{`Adopt ${pet?.name}`}</h2>
            <form onSubmit={handleAdopt}>
              <input
                type="text"
                value={user?.name}
                disabled
                className="block w-full border mb-2 px-2 py-1 rounded-md"
              />
              <input
                type="email"
                value={user?.email}
                disabled
                className="block w-full border mb-2 px-2 py-1 rounded-md"
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                required
                className="block w-full border mb-2 px-2 py-1 rounded-md"
              />
              <textarea
                name="address"
                placeholder="Address"
                required
                className="block w-full border mb-2 px-2 py-1 rounded-md"
              ></textarea>
              <button
                type="submit"
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 block w-full bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetails;
