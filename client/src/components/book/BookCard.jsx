import { Link } from "react-router-dom";
import { FiStar, FiBookOpen } from "react-icons/fi";

const BookCard = ({ book }) => (
  <Link to={`/books/${book._id}`} className="group block">
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 h-full flex flex-col">
      {/* Cover */}
      <div className="relative h-52 bg-gray-800 overflow-hidden shrink-0">
        <img
          src={book.cover?.url || "/default-book.png"}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "/default-book.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        <span className="absolute top-3 right-3 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {book.category}
        </span>
        {book.availableCopies === 0 && (
          <span className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Unavailable
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-100 truncate group-hover:text-indigo-400 transition-colors text-sm">
          {book.title}
        </h3>
        <p className="text-gray-500 text-xs mt-0.5 truncate">{book.author}</p>
        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-center gap-1 text-yellow-400">
            <FiStar className="fill-yellow-400" size={12} />
            <span className="text-xs font-medium">
              {book.avgRating > 0 ? book.avgRating : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <FiBookOpen size={12} />
            <span>
              {book.availableCopies}/{book.totalCopies}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default BookCard;
