import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBorrows } from "../../redux/slices/borrowSlice";
import Loader from "../../components/ui/Loader";

const statusConfig = {
  borrowed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  returned: "bg-green-500/10 text-green-400 border-green-500/30",
  overdue: "bg-red-500/10 text-red-400 border-red-500/30",
};

const AllBorrows = () => {
  const dispatch = useDispatch();
  const { borrows, loading } = useSelector((s) => s.borrows);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllBorrows({ status, page, limit: 20 }));
  }, [status, page]);

  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading && borrows.length === 0) return <Loader fullScreen={false} />;

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">All Borrows</h1>
          <p className="text-gray-400 mt-1">
            Track all book borrowing activity
          </p>
        </div>
        <select
          className="input w-44"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="borrowed">Borrowed</option>
          <option value="returned">Returned</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                {[
                  "User",
                  "Book",
                  "Borrowed On",
                  "Due Date",
                  "Status",
                  "Fine",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-gray-400 font-medium px-5 py-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {borrows.map((b) => (
                <tr
                  key={b._id}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-gray-200 font-medium">
                        {b.user?.name}
                      </p>
                      <p className="text-gray-500 text-xs">{b.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-300 max-w-[160px]">
                    <p className="truncate">{b.book?.title}</p>
                    <p className="text-gray-500 text-xs truncate">
                      {b.book?.author}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {fmt(b.borrowedAt)}
                  </td>
                  <td
                    className={`px-5 py-4 text-xs font-medium ${
                      b.status !== "returned" &&
                      new Date() > new Date(b.dueDate)
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {fmt(b.dueDate)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`badge capitalize ${statusConfig[b.status] || ""}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {b.fine > 0 ? (
                      <span className="text-red-400 font-semibold">
                        ₹{b.fine}
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {borrows.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p>No borrow records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBorrows;
