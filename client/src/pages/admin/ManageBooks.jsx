import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooks,
  deleteBook,
  addBook,
  updateBook,
} from "../../redux/slices/bookSlice";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

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

  useEffect(() => {
    dispatch(fetchBooks({ limit: 100 }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (cover) fd.append("cover", cover);

    if (editing) {
      await dispatch(updateBook({ id: editing, formData: fd }));
    } else {
      await dispatch(addBook(fd));
    }
    setShowForm(false);
    setForm(EMPTY);
    setEditing(null);
    dispatch(fetchBooks({ limit: 100 }));
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn || "",
      category: book.category,
      description: book.description || "",
      totalCopies: book.totalCopies,
      publisher: book.publisher || "",
      publishedYear: book.publishedYear || "",
      tags: book.tags?.join(",") || "",
    });
    setEditing(book._id);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Books</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm(EMPTY);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add Book
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editing ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {[
                { key: "title", placeholder: "Title", col: 2 },
                { key: "author", placeholder: "Author" },
                { key: "isbn", placeholder: "ISBN" },
                { key: "category", placeholder: "Category" },
                { key: "publisher", placeholder: "Publisher" },
                {
                  key: "totalCopies",
                  placeholder: "Total Copies",
                  type: "number",
                },
                {
                  key: "publishedYear",
                  placeholder: "Published Year",
                  type: "number",
                },
                { key: "tags", placeholder: "Tags (comma separated)" },
              ].map(({ key, placeholder, col, type }) => (
                <input
                  key={key}
                  className={`input ${col === 2 ? "col-span-2" : ""}`}
                  placeholder={placeholder}
                  type={type || "text"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={[
                    "title",
                    "author",
                    "category",
                    "totalCopies",
                  ].includes(key)}
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
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCover(e.target.files[0])}
                  className="text-gray-400 text-sm"
                />
              </div>
              <div className="col-span-2 flex gap-3 justify-end">
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

      {/* Books Table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {["Book", "Category", "Copies", "Rating", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left text-gray-400 font-medium px-6 py-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {books.map((book) => (
              <tr
                key={book._id}
                className="hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={book.cover?.url || "/default-book.png"}
                      alt=""
                      className="w-10 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-200 truncate max-w-[200px]">
                        {book.title}
                      </p>
                      <p className="text-gray-500 text-xs">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{book.category}</td>
                <td className="px-6 py-4 text-gray-400">
                  {book.availableCopies}/{book.totalCopies}
                </td>
                <td className="px-6 py-4 text-yellow-400">
                  {book.avgRating || "-"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="p-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-lg transition-colors"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteId(book._id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this book? This cannot be undone."
          onConfirm={() => {
            dispatch(deleteBook(deleteId));
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default ManageBooks;
