// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   Typography,
// } from "@material-tailwind/react";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import axios from "axios";
// import React from "react";

// // API function to fetch donation campaigns
// const fetchDonations = async ({ pageParam = 1 }) => {
//   const { data } = await axios.get("http://localhost:5000/donations", {
//     params: { page: pageParam, limit: 9 }, // Fetch 9 donations per page
//   });
//   return data;
// };

// const DonationPage = () => {
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
//       return lastPage.donations?.length > 0 ? nextPage : undefined;
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
//     return <div className="text-center">Loading campaigns...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500">Error fetching campaigns!</div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {data.pages.map((page, pageIndex) =>
//           page.donations.map((donation, index) => {
//             const isLast =
//               pageIndex === data.pages.length - 1 &&
//               index === page.donations.length - 1;
//             return (
//               <Card
//                 key={donation._id}
//                 className="shadow-lg"
//                 ref={isLast ? lastDonationRef : null}
//               >
//                 <CardHeader
//                   floated={false}
//                   className="h-48"
//                   style={{
//                     backgroundImage: `url(${donation.imageUrl})`,
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                   }}
//                 ></CardHeader>
//                 <CardBody>
//                   <Typography variant="h5" className="mb-2 text-gray-800">
//                     {donation.title}
//                   </Typography>
//                   <Typography className="text-gray-600">
//                     Maximum Donation:{" "}
//                     <span className="text-green-500 font-bold">
//                       ${donation.goalAmount.$numberInt}
//                     </span>
//                   </Typography>
//                   <Typography className="text-gray-600">
//                     Donated Amount:{" "}
//                     <span className="text-green-500 font-bold">
//                       ${donation.raisedAmount.$numberInt}
//                     </span>
//                   </Typography>
//                   <div className="mt-4 text-center">
//                     <Button color="blue" ripple={true} size="md">
//                       View Details
//                     </Button>
//                   </div>
//                 </CardBody>
//               </Card>
//             );
//           })
//         )}
//       </div>
//       {isFetchingNextPage && (
//         <div className="text-center mt-4">
//           <Typography className="text-gray-600">
//             Loading more campaigns...
//           </Typography>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DonationPage;

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import SkeletonCard from "../../../Common/Skeleton/SkeletonCard";
import DonationCard from "../DonationCard/DonationCard";
// import DonationCard from "./DonationCard";
// import SkeletonCard from "./SkeletonCard";

// API function to fetch donation campaigns
const fetchDonations = async ({ pageParam = 1 }) => {
  const { data } = await axios.get("http://localhost:5000/donations", {
    params: { page: pageParam, limit: 9 }, // Fetch 9 donations per page
  });
  return data;
};

const DonationPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["donations"],
    queryFn: fetchDonations,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length + 1;
      return lastPage.donations.length > 0 ? nextPage : undefined;
    },
  });

  const observer = React.useRef();
  const lastDonationRef = React.useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.pages.map((page, pageIndex) =>
          page.donations.map((donation, index) => {
            const isLast =
              pageIndex === data.pages.length - 1 &&
              index === page.donations.length - 1;
            return (
              <div key={donation._id} ref={isLast ? lastDonationRef : null}>
                <DonationCard donation={donation} />
              </div>
            );
          })
        )}
      </div>
      {isFetchingNextPage && (
        <div className="text-center mt-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <SkeletonCard key={index} />
            ))}
        </div>
      )}
    </div>
  );
};

export default DonationPage;
