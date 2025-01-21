const TableSkeleton = () => {
  const rows = 5;
  const columns = 5;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <th
                key={colIndex}
                className="p-4 border-b border-gray-300 bg-gray-200 animate-pulse"
              >
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="even:bg-gray-100">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td
                  key={colIndex}
                  className="p-4 border-b border-gray-300 animate-pulse"
                >
                  <div className="h-4 w-full bg-gray-300 rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
