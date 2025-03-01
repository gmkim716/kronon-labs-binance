export default function OrderBookLoading() {
  return (
    <div className="p-4">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}