import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../redux/slices/bookSlice";
import BookCard from "../../components/book/BookCard";
import BookFilters from "../../components/book/BookFilters";
import Loader from "../../components/ui/Loader";

const SkeletonCard = () => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-52 bg-gray-800" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-800 rounded-lg w-3/4" />
      <div className="h-3 bg-gray-800 rounded-lg w-1/2" />
      <div className="h-3 bg-gray-800 rounded-lg w-1/3 mt-3" />
    </div>
  </div>
);

const BookList = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { books, pagination, loading } = useSelector((s) => s.books);

  const loadBooks = useCallback(() => {
    dispatch(
      fetchBooks({
        search,
        category: category === "All" ? "" : category,
        page,
        limit: 12,
      }),
    );
  }, [search, category, page, dispatch]);

  useEffect(() => {
    loadBooks();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    dispatch(
      fetchBooks({
        search,
        category: category === "All" ? "" : category,
        page: 1,
        limit: 12,
      }),
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-white mb-1">Browse Books</h1>
        <p className="text-gray-400">
          {pagination.total ?? 0} books available in our library
        </p>
      </div>

      <BookFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        onSearch={handleSearch}
      />

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl font-semibold text-gray-300 mb-2">
            No books found
          </p>
          <p className="text-gray-500">
            Try a different search term or category
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-12 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-outline py-2 px-4 text-sm disabled:opacity-40"
          >
            Prev
          </button>
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                page === i + 1
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="btn-outline py-2 px-4 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;
