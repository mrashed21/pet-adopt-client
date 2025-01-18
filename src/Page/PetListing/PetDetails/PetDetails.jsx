
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../Context/Auth/AuthProvider";

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

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
      userName: user.displayName,
      email: user.email,
      phoneNumber: e.target.phoneNumber.value,
      address: e.target.address.value,
    };

    try {
      const response = await fetch("http://localhost:5000/adopt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adoptionData),
      });

      const data = await response.json();
      
      if (data.message) {
        alert("Adoption request submitted successfully!");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Failed to submit adoption request:", error);
      alert("Failed to submit adoption request");
    } finally {
      setLoading(false);
    }
  };

  if (!pet) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Pet Details Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={pet.imageUrl}
          alt={pet.name}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Adopt
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600"><span className="font-semibold">Age:</span> {pet.age} years</p>
              <p className="text-gray-600"><span className="font-semibold">Location:</span> {pet.location}</p>
            </div>
            <div>
              <p className="text-gray-600"><span className="font-semibold">Category:</span> {pet.category}</p>
            </div>
          </div>
          <p className="text-gray-700 whitespace-pre-line">{pet.longDescription}</p>
        </div>
      </div>

      {/* Adoption Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Adopt {pet.name}</h2>
            
            <form onSubmit={handleAdopt} className="space-y-4">
              {/* Pet Information (Display Only) */}
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-sm text-gray-600">Pet ID: {pet._id}</p>
                <p className="text-sm text-gray-600">Pet Name: {pet.name}</p>
              </div>

              {/* User Information */}
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                  placeholder="Enter your address"
                ></textarea>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetails;
