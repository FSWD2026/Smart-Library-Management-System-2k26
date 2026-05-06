import { useDispatch } from "react-redux";
import { returnBook } from "../../redux/slices/borrowSlice";
import {
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

const statusConfig = {
  borrowed: {
    class: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    icon: FiClock,
    label: "Borrowed",
  },
  returned: {
    class: "bg-green-500/10 text-green-400 border-green-500/30",
    icon: FiCheckCircle,
    label: "Returned",
  },
  overdue: {
    class: "bg-red-500/10 text-red-400 border-red-500/30",
    icon: FiAlertCircle,
    label: "Overdue",
  },
};

const BorrowCard = ({ borrow }) => {
  const dispatch = useDispatch();
  const config = statusConfig[borrow.status] || statusConfig.borrowed;
  const StatusIcon = config.icon;

  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const isOverdue =
    borrow.status !== "returned" && new Date() > new Date(borrow.dueDate);

  return (
    <div className="card flex flex-col sm:flex-row gap-4 hover:border-gray-700 transition-colors animate-slide-up">
      <img
        src={borrow.book?.cover?.url || "/default-book.png"}
        alt={borrow.book?.title}
        className="w-full sm:w-20 h-28 object-cover rounded-xl shrink-0"
        onError={(e) => {
          e.target.src = "/default-book.png";
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-100 truncate">
              {borrow.book?.title}
            </h3>
            <p className="text-gray-500 text-sm">{borrow.book?.author}</p>
          </div>
          <span
            className={`badge flex items-center gap-1.5 shrink-0 ${config.class}`}
          >
            <StatusIcon size={12} />
            {config.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1.5">
            <FiCalendar className="text-indigo-400" size={12} />
            Borrowed: {fmt(borrow.borrowedAt)}
          </span>
          <span
            className={`flex items-center gap-1.5 ${isOverdue ? "text-red-400" : ""}`}
          >
            <FiCalendar
              className={isOverdue ? "text-red-400" : "text-purple-400"}
              size={12}
            />
            Due: {fmt(borrow.dueDate)}
          </span>
          {borrow.returnedAt && (
            <span className="flex items-center gap-1.5 text-green-400">
              <FiCheckCircle size={12} />
              Returned: {fmt(borrow.returnedAt)}
            </span>
          )}
        </div>

        {borrow.fine > 0 && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-3 w-fit">
            <FiAlertCircle className="text-red-400" size={14} />
            <span className="text-red-400 text-sm font-semibold">
              Fine: ₹{borrow.fine}
            </span>
          </div>
        )}

        {borrow.status !== "returned" && (
          <button
            onClick={() => dispatch(returnBook(borrow._id))}
            className="btn-outline py-1.5 px-4 text-xs"
          >
            Return Book
          </button>
        )}
      </div>
    </div>
  );
};

export default BorrowCard;
