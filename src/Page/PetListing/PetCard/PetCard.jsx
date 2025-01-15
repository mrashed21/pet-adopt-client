/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const PetCard = ({ pet }) => {
  return (
    <div className="border rounded-md shadow-md p-4">
      <img src={pet.imageUrl} alt={pet.name} className="w-full h-40 object-cover rounded-md" />
      <h2 className="text-lg font-bold mt-2">{pet.name}</h2>
      <p>Age: {pet.age}</p>
      <p>Location: {pet.location}</p>
      <Link
        to={`/pets/${pet._id}`}
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-center"
      >
        View Details
      </Link>
    </div>
  );
};

export default PetCard;
