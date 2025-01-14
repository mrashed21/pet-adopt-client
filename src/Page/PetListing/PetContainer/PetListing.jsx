import {
  Button,
  Card,
  CardBody,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";

const fetchPets = async ({ pageParam = 1, queryKey }) => {
  const [_, filters] = queryKey;
  const { search, category } = filters;
  const response = await axios.get("/services", {
    params: {
      page: pageParam,
      search,
      category,
    },
  });
  return response.data;
};

const PetListing = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(["pets", { search, category }], fetchPets, {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <div className="w-11/12 mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            label="Search by Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow"
          />
          <Select
            label="Filter by Category"
            value={category}
            onChange={(value) => setCategory(value)}
          >
            <Option value="">All</Option>
            <Option value="Cats">Cats</Option>
            <Option value="Dogs">Dogs</Option>
            <Option value="Rabbit">Rabbit</Option>
            <Option value="Fish">Fish</Option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.pages.map((page) =>
            page.pets.map((pet) => (
              <Card key={pet.id} className="shadow-lg">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardBody>
                  <Typography variant="h5" className="font-bold">
                    {pet.name}
                  </Typography>
                  <Typography className="mt-2">Age: {pet.age} years</Typography>
                  <Typography className="mt-1 text-gray-600 dark:text-gray-400">
                    Location: {pet.location}
                  </Typography>
                  <Button color="blue" className="mt-4">
                    View Details
                  </Button>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {isFetchingNextPage && (
          <div className="text-center mt-6">
            <Typography>Loading more pets...</Typography>
          </div>
        )}
        <div ref={ref}></div>
      </div>
    </section>
  );
};

export default PetListing;
