export default function ScanPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Check In</h1>
        <p className="text-gray-600">
          Scan a QR code or enter a host code to see their glass collection.
        </p>
      </div>
    </div>
  );
}
