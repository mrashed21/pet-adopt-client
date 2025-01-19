// const SendRequest = () => {
//   return <div>this is send request</div>;
// };

// export default SendRequest;
// import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Spinner
} from "@material-tailwind/react";
import { 
  FaCheck, 
  FaTimes, 
  FaSpinner 
} from 'react-icons/fa';
import axios from 'axios';

const AdoptionRequests = () => {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    fetchAdoptionRequests();
  }, []);

  const fetchAdoptionRequests = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await axios.get(`http://localhost:5000/adoptions/${userEmail}`, {
        withCredentials: true
      });
      setAdoptionRequests(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch adoption requests');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (adoptionId, petId, newStatus) => {
    setProcessingIds(prev => new Set(prev).add(adoptionId));
    try {
      await axios.patch(`http://localhost:5000/adoptions/${adoptionId}`, {
        status: newStatus
      }, {
        withCredentials: true
      });

      await axios.patch(`http://localhost:5000/pet/${petId}`, {
        adopted: newStatus === 'accepted' ? true : false
      }, {
        withCredentials: true
      });

      await fetchAdoptionRequests();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update adoption status');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(adoptionId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Adoption Requests
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Manage adoption requests for your pets
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {["Pet", "Requester", "Contact", "Status", "Actions"].map((head) => (
                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adoptionRequests.map((request, index) => {
              const isLast = index === adoptionRequests.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={request._id}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <img
                        src={request.petImage}
                        alt={request.petName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        {request.petName}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {request.userName}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                        {request.address}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {request.email}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                        {request.phoneNumber}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className={`w-max rounded-lg ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    } px-2 py-1`}>
                      <Typography variant="small" className="font-medium">
                        {request.status}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          color="green"
                          size="sm"
                          variant="filled"
                          className="flex items-center gap-2"
                          onClick={() => handleStatusUpdate(request._id, request.petId, 'accepted')}
                          disabled={processingIds.has(request._id)}
                        >
                          {processingIds.has(request._id) ? (
                            <FaSpinner className="h-4 w-4 animate-spin" />
                          ) : (
                            <FaCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          color="red"
                          size="sm"
                          variant="filled"
                          className="flex items-center gap-2"
                          onClick={() => handleStatusUpdate(request._id, request.petId, 'rejected')}
                          disabled={processingIds.has(request._id)}
                        >
                          {processingIds.has(request._id) ? (
                            <FaSpinner className="h-4 w-4 animate-spin" />
                          ) : (
                            <FaTimes className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {adoptionRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Typography>No adoption requests found</Typography>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default AdoptionRequests;