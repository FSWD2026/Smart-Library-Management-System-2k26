import { FiSearch } from "react-icons/fi";

const CATEGORIES = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Biography",
  "Self Help",
  "Technology",
  "Fantasy",
  "Mystery",
];

const BookFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  onSearch,
}) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-slide-up">
    <div className="relative flex-1">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        placeholder="Search books, authors..."
        className="input pl-11"
      />
    </div>
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="input sm:w-44"
    >
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
    <button onClick={onSearch} className="btn-primary">
      Search
    </button>
  </div>
);

export default BookFilters;
