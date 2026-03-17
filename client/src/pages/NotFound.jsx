import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-500 mb-4">404</h1>
        <p className="text-white text-xl font-semibold mb-2">Page Not Found</p>
        <p className="text-gray-500 text-sm mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/feed"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition"
        >
          Back to Feed
        </Link>
      </div>
    </div>
  );
};

export default NotFound;