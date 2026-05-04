import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../redux/slices/bookSlice";
import BookCard from "../../components/book/BookCard";
import BookFilters from "../../components/book/BookFilters";
import Loader from "../../components/ui/Loader";

const BookList = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { books, pagination, loading } = useSelector((s) => s.books);

  const loadBooks = () => {
    dispatch(
      fetchBooks({
        search,
        category: category === "All" ? "" : category,
        page,
        limit: 12,
      }),
    );
  };

  useEffect(() => {
    loadBooks();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-white mb-1">Browse Books</h1>
        <p className="text-gray-400">{pagination.total || 0} books available</p>
      </div>

      <BookFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        onSearch={() => {
          setPage(1);
          loadBooks();
        }}
      />

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-900 rounded-2xl h-72 animate-pulse border border-gray-800"
            />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-lg">No books found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-semibold transition-all ${page === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
