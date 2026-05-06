import { FiSearch, FiX } from "react-icons/fi";

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
  <div className="flex flex-col sm:flex-row gap-3 mb-8">
    <div className="relative flex-1">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        placeholder="Search books, authors, tags..."
        className="input pl-11 pr-10"
      />
      {search && (
        <button
          onClick={() => {
            setSearch("");
            onSearch();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
        >
          <FiX />
        </button>
      )}
    </div>
    <select
      value={category}
      onChange={(e) => {
        setCategory(e.target.value);
        onSearch();
      }}
      className="input sm:w-44 cursor-pointer"
    >
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
    <button onClick={onSearch} className="btn-primary px-6">
      Search
    </button>
  </div>
);

export default BookFilters;
