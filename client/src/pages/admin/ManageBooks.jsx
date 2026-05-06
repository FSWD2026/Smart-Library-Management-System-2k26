import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooks,
  deleteBook,
  addBook,
  updateBook,
} from "../../redux/slices/bookSlice";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Loader from "../../components/ui/Loader";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from "react-icons/fi";

const EMPTY = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  description: "",
  totalCopies: "",
  publisher: "",
  publishedYear: "",
  tags: "",
};

const ManageBooks = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((s) => s.books);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [cover, setCover] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchBooks({ limit: 100 }));
  }, []);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setForm(EMPTY);
    setCover(null);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn || "",
      category: book.category,
      description: book.description || "",
      totalCopies: book.totalCopies,
      publisher: book.publisher || "",
      publishedYear: book.publishedYear || "",
      tags: book.tags?.join(", ") || "",
    });
    setCover(null);
    setEditing(book._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "") fd.append(k, v);
    });
    if (cover) fd.append("cover", cover);

    let res;
    if (editing) {
      res = await dispatch(updateBook({ id: editing, formData: fd }));
    } else {
      res = await dispatch(addBook(fd));
    }

    if (res.meta.requestStatus === "fulfilled") {
      setShowForm(false);
      setForm(EMPTY);
      setEditing(null);
      dispatch(fetchBooks({ limit: 100 }));
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteBook(deleteId));
    setDeleteId(null);
  };

  const fields = [
    { key: "title", placeholder: "Book Title *", col: 2, required: true },
    { key: "author", placeholder: "Author *", required: true },
    { key: "isbn", placeholder: "ISBN" },
    { key: "category", placeholder: "Category *", required: true },
    { key: "publisher", placeholder: "Publisher" },
    {
      key: "totalCopies",
      placeholder: "Total Copies *",
      type: "number",
      required: true,
    },
    { key: "publishedYear", placeholder: "Published Year", type: "number" },
    { key: "tags", placeholder: "Tags (comma separated)" },
  ];

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Books</h1>
          <p className="text-gray-400 mt-1">{books.length} books total</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add New Book
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          className="input pl-11"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editing ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {fields.map(({ key, placeholder, col, type, required }) => (
                <input
                  key={key}
                  className={`input ${col === 2 ? "col-span-2" : ""}`}
                  placeholder={placeholder}
                  type={type || "text"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={required}
                />
              ))}

              <textarea
                className="input col-span-2 resize-none"
                rows={3}
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="col-span-2">
                <label className="text-gray-400 text-sm mb-2 block">
                  Cover Image {editing && "(leave empty to keep current)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCover(e.target.files[0])}
                  className="text-gray-400 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600/20 file:text-indigo-400 file:text-sm cursor-pointer"
                />
              </div>

              <div className="col-span-2 flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : editing ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading && books.length === 0 ? (
        <Loader fullScreen={false} />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-800/50">
                  {["Book", "Category", "Copies", "Rating", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-gray-400 font-medium px-5 py-4"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((book) => (
                  <tr
                    key={book._id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={book.cover?.url || "/default-book.png"}
                          alt=""
                          className="w-10 h-13 object-cover rounded-lg shrink-0"
                          onError={(e) => {
                            e.target.src = "/default-book.png";
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-200 truncate max-w-[180px]">
                            {book.title}
                          </p>
                          <p className="text-gray-500 text-xs truncate">
                            {book.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{book.category}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-medium ${book.availableCopies === 0 ? "text-red-400" : "text-green-400"}`}
                      >
                        {book.availableCopies}
                      </span>
                      <span className="text-gray-500">/{book.totalCopies}</span>
                    </td>
                    <td className="px-5 py-4 text-yellow-400">
                      {book.avgRating > 0 ? `⭐ ${book.avgRating}` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(book)}
                          className="p-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(book._id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <p>No books found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this book? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default ManageBooks;
