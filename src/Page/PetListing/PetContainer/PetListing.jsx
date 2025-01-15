// import { useInfiniteQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { useState } from "react";
// import { useInView } from "react-intersection-observer";

// const PetListing = () => {
//   const [searchName, setSearchName] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");

//   // Fetch function for pets
//   const fetchPets = async ({ pageParam = 1 }) => {
//     const { data } = await axios.get("http://localhost:5000/pets", {
//       params: {
//         page: pageParam,
//         limit: 6,
//         name: searchName,
//         category: selectedCategory,
//       },
//     });
//     return data;
//   };

//   // Infinite Query with the correct v5 syntax
//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
//     useInfiniteQuery({
//       queryKey: ["pets", { searchName, selectedCategory }],
//       queryFn: fetchPets,
//       getNextPageParam: (lastPage, pages) => {
//         if (pages.length < lastPage.totalPages) {
//           return pages.length + 1; // Next page number
//         }
//         return undefined;
//       },
//     });

//   const { ref } = useInView({
//     onChange: (inView) => {
//       if (inView && hasNextPage) {
//         fetchNextPage();
//       }
//     },
//   });

//   const categories = ["Dog", "Cat", "Bird", "Rabbit", "Other"];

//   return (
//     <div className="container mx-auto p-4">
//       {/* Filters */}
//       <div className="flex items-center gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//           className="border p-2 rounded w-1/3"
//         />
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="">All Categories</option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat.toLowerCase()}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Pet Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {data?.pages.map((page) =>
//           page.pets.map((pet) => (
//             <div key={pet._id} className="border rounded shadow p-4">
//               <img
//                 src={pet.imageUrl}
//                 alt={pet.name}
//                 className="w-full h-48 object-cover rounded"
//               />
//               <h2 className="text-xl font-bold mt-2">{pet.name}</h2>
//               <p>Age: {pet.age}</p>
//               <p>Location: {pet.location}</p>
//               <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
//                 View Details
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Loader for Infinite Scroll */}
//       <div ref={ref} className="text-center py-4">
//         {isFetchingNextPage && <p>Loading more pets...</p>}
//         {!hasNextPage && <p>No more pets to show</p>}
//       </div>
//     </div>
//   );
// };

// export default PetListing;import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { useEffect, useState } from "react";
import PetCard from "../PetCard/PetCard";

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
      <div className="flex gap-4 mb-4">
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
          {/* 
          { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "bird", label: "Bird" },
    { value: "rabbit", label: "Rabbit" },
    { value: "other", label: "Other" },
      */}
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
