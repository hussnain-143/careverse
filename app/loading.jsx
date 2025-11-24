export default function Loading({ message }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[rgb(120,195,235)] via-[rgb(150,177,225)] to-[rgb(180,159,216)] flex flex-col items-center justify-center min-h-screen z-50">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-[rgb(55,0,231)]/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[rgb(55,0,231)] border-r-[rgb(75,20,255)] animate-spin"></div>
      </div>
      {message && (
        <p className="text-sm font-semibold text-gray-900 mt-4">{message}</p>
      )}
    </div>
  );
}
