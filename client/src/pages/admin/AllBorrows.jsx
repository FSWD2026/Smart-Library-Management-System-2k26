import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBorrows } from "../../redux/slices/borrowSlice";

const statusColors = {
  borrowed: "bg-blue-500/20 text-blue-400",
  returned: "bg-green-500/20 text-green-400",
  overdue: "bg-red-500/20 text-red-400",
};

const AllBorrows = () => {
  const dispatch = useDispatch();
  const { borrows } = useSelector((s) => s.borrows);
  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(fetchAllBorrows({ status, limit: 50 }));
  }, [status]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">All Borrows</h1>
        <select
          className="input w-44"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="borrowed">Borrowed</option>
          <option value="returned">Returned</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {["User", "Book", "Borrowed", "Due Date", "Status", "Fine"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-gray-400 font-medium px-6 py-4"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {borrows.map((b) => (
              <tr
                key={b._id}
                className="hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-300">{b.user?.name}</td>
                <td className="px-6 py-4 text-gray-300 max-w-[160px] truncate">
                  {b.book?.title}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {new Date(b.borrowedAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {new Date(b.dueDate).toLocaleDateString("en-IN")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[b.status]}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-red-400 font-medium">
                  {b.fine > 0 ? `₹${b.fine}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBorrows;
