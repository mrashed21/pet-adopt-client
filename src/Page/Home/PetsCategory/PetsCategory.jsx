import { Card, CardBody, Typography } from "@material-tailwind/react";
import React from "react";

const categories = [
  { name: "Cats", img: "https://via.placeholder.com/150?text=Cats" },
  { name: "Dogs", img: "https://via.placeholder.com/150?text=Dogs" },
  { name: "Rabbits", img: "https://via.placeholder.com/150?text=Rabbits" },
  { name: "Fish", img: "https://via.placeholder.com/150?text=Fish" },
  { name: "Birds", img: "https://via.placeholder.com/150?text=Birds" },
];

const PetsCategory = () => {
  return (
    <section className="py-10 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <Typography
          variant="h2"
          color="blue-gray"
          className="text-center text-3xl font-bold mb-8"
        >
          Pets Categories
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardBody className="flex flex-col items-center text-center">
                <img
                  src={category.img}
                  alt={category.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="font-medium"
                >
                  {category.name}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetsCategory;
