import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Not Found</h2>
        <p className="text-gray-600 mb-8">
          Looks like that Pokemon's not in our Pokedex yet!
        </p>
        <Link
          href="/"
          className="bg-blue-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors min-w-[140px] flex items-center justify-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
} 