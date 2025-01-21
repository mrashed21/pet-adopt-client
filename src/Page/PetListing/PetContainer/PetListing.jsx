import { Typography } from "@material-tailwind/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import SkeletonCard from "../../../Common/Skeleton/SkeletonCard";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";
import PetCard from "../PetCard/PetCard";

const PetListing = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { ref, inView } = useInView();
  const axiosSecure = useAxiosSecure();

  const fetchPets = async ({ pageParam = 1 }) => {
    const response = await axiosSecure.get(
      `/pets?name=${search}&category=${category}&page=${pageParam}&limit=9`
    );
    return response.data;
  };
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
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
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="p-4">
      <Typography variant="h2" className="text-center my-4 font-bold">
        Available Pets for Adoption
      </Typography>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/4"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/4"
        >
          <option value="">All Categories</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="bird">Bird</option>
          <option value="rabbit">Rabbit</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isFetching && !data
          ? Array.from({ length: 9 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : data?.pages?.flatMap((page) =>
              page?.pets?.map((pet) => <PetCard key={pet._id} pet={pet} />)
            )}
      </div>

      {/* Infinite Scroll Indicator */}
      <div ref={ref} className="h-10 flex justify-center items-center">
        {isFetchingNextPage &&
          Array.from({ length: 9 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
      </div>
    </div>
  );
};

export default PetListing;
