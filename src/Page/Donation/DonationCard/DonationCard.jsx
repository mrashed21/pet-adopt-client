/* eslint-disable react/prop-types */
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";


const DonationCard = ({ donation }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader
        floated={false}
        className="h-48"
        style={{
          backgroundImage: `url(${donation.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></CardHeader>
      <CardBody>
        <Typography variant="h5" className="mb-2 text-gray-800">
          {donation.title}
        </Typography>
        <Typography className="text-gray-600">
          Maximum Donation:{" "}
          <span className="text-green-500 font-bold">
            ${donation.goalAmount}
          </span>
        </Typography>
        <Typography className="text-gray-600">
          Donated Amount:{" "}
          <span className="text-green-500 font-bold">
            ${donation.raisedAmount}
          </span>
        </Typography>
        <div className="mt-4 text-center">
          <Button color="blue" ripple={true} size="md">
            View Details
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default DonationCard;
