// import { useInfiniteQuery } from "@tanstack/react-query";
// import React from "react";
// import { Helmet } from "react-helmet-async";
// import SkeletonCard from "../../../Common/Skeleton/SkeletonCard";
// import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";
// import DonationCard from "../../Donation/DonationCard/DonationCard";

// const RecentCompain = () => {
//   const axiosSecure = useAxiosSecure();
//   const fetchDonations = async ({ pageParam = 1 }) => {
//     const { data } = await axiosSecure.get("/donations", {
//       params: { page: pageParam, limit: 9 },
//     });
//     return data;
//   };
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     error,
//   } = useInfiniteQuery({
//     queryKey: ["donations"],
//     queryFn: fetchDonations,
//     getNextPageParam: (lastPage, pages) => {
//       const nextPage = pages.length + 1;
//       return lastPage.donations.length > 0 ? nextPage : undefined;
//     },
//   });

//   const observer = React.useRef();
//   const lastDonationRef = React.useCallback(
//     (node) => {
//       if (isFetchingNextPage) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasNextPage) {
//           fetchNextPage();
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [isFetchingNextPage, hasNextPage, fetchNextPage]
//   );

//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//         {Array(6)
//           .fill(0)
//           .map((_, index) => (
//             <SkeletonCard key={index} />
//           ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500">Error fetching campaigns!</div>
//     );
//   }

//   return (
//     <div className="  p-6">
//       <Helmet>
//         <title>Donations</title>
//       </Helmet>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {data.pages.map((page, pageIndex) =>
//           page.donations.map((donation, index) => {
//             const isLast =
//               pageIndex === data.pages.length - 1 &&
//               index === page.donations.length - 1;
//             return (
//               <div key={donation._id} ref={isLast ? lastDonationRef : null}>
//                 <DonationCard donation={donation} />
//               </div>
//             );
//           })
//         )}
//       </div>
//       {isFetchingNextPage && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//           {Array(6)
//             .fill(0)
//             .map((_, index) => (
//               <SkeletonCard key={index} />
//             ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecentCompain;
import { Typography } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import SkeletonCard from "../../../Common/Skeleton/SkeletonCard";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";
import DonationCard from "../../Donation/DonationCard/DonationCard";

const RecentCompain = () => {
  const axiosSecure = useAxiosSecure();

  const fetchDonations = async () => {
    const { data } = await axiosSecure.get("/donations", {
      params: { page: 1, limit: 6 },
    });
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["donations"],
    queryFn: fetchDonations,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <SkeletonCard key={index} />
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error fetching campaigns!</div>
    );
  }

  return (
    <div className="p-6">
      <Typography
        variant="h2"
        className="text-3xl font-bold text-center my-6 dark:text-white"
        data-aos="fade-up"
      >
        Recent Compains
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.donations.map((donation) => (
          <div key={donation._id}>
            <DonationCard donation={donation} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCompain;
