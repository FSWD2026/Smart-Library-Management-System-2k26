import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleBook } from "../../redux/slices/bookSlice";
import { borrowBook } from "../../redux/slices/borrowSlice";
import API from "../../utils/axios";
import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import { FiStar, FiBookOpen, FiCalendar, FiTag } from "react-icons/fi";

const BookDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { book, loading } = useSelector((s) => s.books);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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

  const handleBorrow = () => {
    if (!isAuthenticated) return toast.error("Please login first");
    dispatch(borrowBook(id));
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/books/${id}/review`, { rating, comment });
      toast.success("Review added");
      setComment("");
      loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  if (loading || !book) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      {/* Book Info */}
      <div className="card flex flex-col md:flex-row gap-8 mb-8">
        <img
          src={book.cover?.url || "/default-book.png"}
          alt={book.title}
          className="w-full md:w-52 h-72 object-cover rounded-xl"
        />
        <div className="flex-1">
          <span className="inline-block bg-indigo-600/20 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/30 mb-3">
            {book.category}
          </span>
          <h1 className="text-3xl font-bold text-white mb-1">{book.title}</h1>
          <p className="text-gray-400 text-lg mb-4">{book.author}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1.5">
              <FiStar className="text-yellow-400 fill-yellow-400" />{" "}
              {book.avgRating || "No rating"}
            </div>
            <div className="flex items-center gap-1.5">
              <FiBookOpen className="text-indigo-400" /> {book.availableCopies}/
              {book.totalCopies} available
            </div>
            {book.publishedYear && (
              <div className="flex items-center gap-1.5">
                <FiCalendar className="text-purple-400" /> {book.publishedYear}
              </div>
            )}
          </div>

          {book.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
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
            <p className="text-gray-400 leading-relaxed mb-6">
              {book.description}
            </p>
          )}

          <button
            onClick={handleBorrow}
            disabled={book.availableCopies === 0}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {book.availableCopies === 0 ? "Not Available" : "Borrow Book"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold text-white mb-6">
          Reviews ({reviews.length})
        </h2>

        {isAuthenticated && (
          <form
            onSubmit={handleReview}
            className="mb-8 pb-8 border-b border-gray-800"
          >
            <p className="text-gray-300 font-medium mb-3">Leave a Review</p>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setRating(s)}>
                  <FiStar
                    className={`text-xl transition-colors ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                  />
                </button>
              ))}
            </div>
            <textarea
              className="input resize-none mb-3"
              rows={3}
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" className="btn-primary px-6">
              Submit Review
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No reviews yet. Be the first!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="flex gap-4 p-4 bg-gray-800/50 rounded-xl"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {r.user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-200">
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
                  <p className="text-gray-400 text-sm">{r.comment}</p>
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
