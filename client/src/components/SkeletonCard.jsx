export default function SkeletonCard() {
  return (
    <div className="w-40 flex-shrink-0">
      <div className="skeleton rounded-xl mb-3" style={{ height: '224px', width: '160px' }} />
      <div className="skeleton h-3 w-4/5 rounded mb-2" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  );
}
