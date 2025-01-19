const SkeletonCard = () => {
  return (
    <div className="animate-pulse shadow-lg bg-white p-4 rounded-lg">
      <div className="h-48 bg-gray-300 rounded-md"></div>
      <div className="mt-4">
        <div className="h-4 bg-gray-300 rounded-md w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded-md w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded-md w-1/3"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
