import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="text-center animate-slide-up">
      <p className="text-9xl font-black text-gray-800 mb-4">404</p>
      <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-gray-400 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary px-8 py-3">
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFound;
