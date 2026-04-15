export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative w-20 h-20">
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
        
        {/* Spinning circle */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 border-r-red-600 animate-spin"></div>
        
        {/* Loading text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-sm font-bold mt-20">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
