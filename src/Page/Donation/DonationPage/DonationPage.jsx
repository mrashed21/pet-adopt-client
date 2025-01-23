import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { Helmet } from "react-helmet-async";
import SkeletonCard from "../../../Common/Skeleton/SkeletonCard";
import useAxiosSecure from "../../../Hooks/UseAxiosSecure/useAxiosSecure";
import DonationCard from "../DonationCard/DonationCard";

const DonationPage = () => {
  const axiosSecure = useAxiosSecure();
  const fetchDonations = async ({ pageParam = 1 }) => {
    const { data } = await axiosSecure.get("/donations", {
      params: { page: pageParam, limit: 9 },
    });
    return data;
  };
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
    <div className="min-h-screen  p-6">
      <Helmet>
        <title>Donations</title>
      </Helmet>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {Array(6)
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
