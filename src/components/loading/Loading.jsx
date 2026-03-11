export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4 text-white">
      <div className="w-12 h-12 border-4 border-[#E759FF] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 animate-pulse">Loading Library...</p>
    </div>
  );
}
