import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleBook } from "../../redux/slices/bookSlice";
import { borrowBook } from "../../redux/slices/borrowSlice";
import API from "../../utils/axios";
import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import {
  FiStar,
  FiBookOpen,
  FiCalendar,
  FiTag,
  FiArrowLeft,
  FiUser,
  FiTrash2,
} from "react-icons/fi";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { book, bookLoading } = useSelector((s) => s.books);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleBook(id));
    loadReviews();
  }, [id]);

  const loadReviews = async () => {
    try {
      const res = await API.get(`/books/${id}/reviews`);
      setReviews(res.data.reviews);
    } catch {}
  };

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to borrow books");
      navigate("/login");
      return;
    }
    dispatch(borrowBook(id));
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await API.post(`/books/${id}/review`, { rating, comment });
      toast.success("Review submitted successfully!");
      setComment("");
      setRating(5);
      loadReviews();
      dispatch(fetchSingleBook(id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`/books/${id}/review/${reviewId}`);
      toast.success("Review deleted");
      loadReviews();
      dispatch(fetchSingleBook(id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  if (bookLoading) return <Loader />;
  if (!book)
    return (
      <div className="text-center py-24 text-gray-500">
        <p className="text-5xl mb-4">📚</p>
        <p>Book not found</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Books
      </button>

      {/* Book Info Card */}
      <div className="card flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-52 shrink-0">
          <img
            src={book.cover?.url || "/default-book.png"}
            alt={book.title}
            className="w-full h-72 md:h-full object-cover rounded-2xl shadow-xl"
            onError={(e) => {
              e.target.src = "/default-book.png";
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-3">
            <span className="badge bg-indigo-600/20 text-indigo-400 border-indigo-500/30">
              {book.category}
            </span>
            {book.availableCopies === 0 && (
              <span className="badge bg-red-500/20 text-red-400 border-red-500/30">
                Unavailable
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
          <p className="text-gray-400 text-lg mb-1">by {book.author}</p>
          {book.publisher && (
            <p className="text-gray-500 text-sm mb-4">
              {book.publisher}
              {book.publishedYear ? ` · ${book.publishedYear}` : ""}
            </p>
          )}

          <div className="flex flex-wrap gap-5 text-sm mb-5">
            <div className="flex items-center gap-1.5">
              <FiStar className="text-yellow-400 fill-yellow-400" />
              <span className="text-gray-300 font-medium">
                {book.avgRating > 0 ? book.avgRating : "No ratings yet"}
              </span>
              <span className="text-gray-500">({reviews.length} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <FiBookOpen className="text-indigo-400" />
              <span>
                {book.availableCopies} of {book.totalCopies} available
              </span>
            </div>
          </div>

          {book.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {book.tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-full"
                >
                  <FiTag size={10} /> {t}
                </span>
              ))}
            </div>
          )}

          {book.description && (
            <p className="text-gray-400 leading-relaxed mb-6 text-sm">
              {book.description}
            </p>
          )}

          <button
            onClick={handleBorrow}
            disabled={book.availableCopies === 0}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {book.availableCopies === 0 ? "Not Available" : "Borrow This Book"}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6">
          Reviews ({reviews.length})
        </h2>

        {/* Add Review Form */}
        {isAuthenticated && (
          <form
            onSubmit={handleReview}
            className="mb-8 pb-8 border-b border-gray-800"
          >
            <p className="text-gray-300 font-medium mb-3">Write a Review</p>

            {/* Star Rating */}
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoveredStar(s)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(s)}
                >
                  <FiStar
                    size={24}
                    className={`transition-colors ${
                      s <= (hoveredStar || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              ))}
              <span className="text-gray-400 text-sm ml-2 self-center">
                {rating}/5
              </span>
            </div>

            <textarea
              className="input resize-none mb-3"
              rows={3}
              placeholder="Share your thoughts about this book..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary px-6"
              disabled={reviewLoading}
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">⭐</div>
            <p className="text-gray-400">No reviews yet.</p>
            {isAuthenticated && (
              <p className="text-gray-500 text-sm">Be the first to review!</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="flex gap-4 p-4 bg-gray-800/50 rounded-2xl"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
                  {r.user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-200 text-sm">
                        {r.user?.name}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={12}
                            className={
                              i < r.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    {user?._id === r.user?._id && (
                      <button
                        onClick={() => handleDeleteReview(r._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete review"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                  {r.comment && (
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {r.comment}
                    </p>
                  )}
                  <p className="text-gray-600 text-xs mt-1">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
