import { useDispatch } from "react-redux";
import { returnBook } from "../../redux/slices/borrowSlice";
import { FiBookOpen, FiCalendar, FiAlertCircle } from "react-icons/fi";

const statusColors = {
  borrowed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  returned: "bg-green-500/20 text-green-400 border-green-500/30",
  overdue: "bg-red-500/20 text-red-400 border-red-500/30",
};

const BorrowCard = ({ borrow }) => {
  const dispatch = useDispatch();

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="card flex flex-col sm:flex-row gap-4 animate-slide-up hover:border-indigo-500/30 transition-colors">
      <img
        src={borrow.book?.cover?.url || "/default-book.png"}
        alt={borrow.book?.title}
        className="w-full sm:w-20 h-28 sm:h-28 object-cover rounded-xl"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3 className="font-semibold text-gray-100">
              {borrow.book?.title}
            </h3>
            <p className="text-gray-500 text-sm">{borrow.book?.author}</p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusColors[borrow.status]}`}
          >
            {borrow.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <FiCalendar className="text-indigo-400" />
            Borrowed: {formatDate(borrow.borrowedAt)}
          </div>
          <div className="flex items-center gap-1.5">
            <FiCalendar className="text-purple-400" />
            Due: {formatDate(borrow.dueDate)}
          </div>
          {borrow.fine > 0 && (
            <div className="flex items-center gap-1.5 text-red-400">
              <FiAlertCircle />
              Fine: ₹{borrow.fine}
            </div>
          )}
        </div>

        {borrow.status !== "returned" && (
          <button
            onClick={() => dispatch(returnBook(borrow._id))}
            className="mt-3 btn-outline py-1.5 px-4 text-sm"
          >
            Return Book
          </button>
        )}
      </div>
    </div>
  );
};

export default BorrowCard;
