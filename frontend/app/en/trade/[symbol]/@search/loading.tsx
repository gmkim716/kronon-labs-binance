export default function SearchLoading() {
  return (
    <div className="p-4">
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}