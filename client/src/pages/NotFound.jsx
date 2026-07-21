import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found</p>
      <Link to="/" className="mt-6 rounded bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;