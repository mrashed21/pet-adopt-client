import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { useEffect, useState } from "react";
import PetCard from "../PetCard/PetCard";
import { Typography } from "@material-tailwind/react";

const PetListing = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { ref, inView } = useInView();

  const fetchPets = async ({ pageParam = 1 }) => {
    const response = await fetch(
      `http://localhost:5000/pets?name=${search}&category=${category}&page=${pageParam}&limit=9`
    );
    return response.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["pets", { search, category }],
      queryFn: fetchPets,
      getNextPageParam: (lastPage, allPages) => {
        const currentCount = allPages.flatMap((page) => page.pets).length;
        return currentCount < lastPage.totalCount
          ? allPages.length + 1
          : undefined;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="p-4">
      <Typography variant="h2" className="text-center my-4">Available Pet For Adoption</Typography>
      <div className="flex gap-4 justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="bird">Bird</option>
          <option value="rabbit">Rabbit</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.pages.flatMap((page) =>
          page.pets.map((pet) => <PetCard key={pet._id} pet={pet} />)
        )}
      </div>
      <div ref={ref} className="h-10 flex justify-center items-center">
        {isFetchingNextPage
          ? "Loading more pets..."
          : hasNextPage
          ? "Scroll to load more"
          : "No more pets"}
      </div>
    </div>
  );
};

export default PetListing;
