import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBorrows } from "../../redux/slices/borrowSlice";
import BorrowCard from "../../components/borrow/BorrowCard";
import Loader from "../../components/ui/Loader";

const MyBorrows = () => {
  const dispatch = useDispatch();
  const { myBorrows, myLoading } = useSelector((s) => s.borrows);

  useEffect(() => {
    dispatch(fetchMyBorrows());
  }, []);

  const active = myBorrows.filter((b) => b.status !== "returned");
  const history = myBorrows.filter((b) => b.status === "returned");

  if (myLoading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Borrows</h1>
        <p className="text-gray-400 mt-1">
          {active.length} active · {history.length} returned
        </p>
      </div>

      {myBorrows.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📖</div>
          <p className="text-xl font-semibold text-gray-300 mb-2">
            No borrowed books
          </p>
          <p className="text-gray-500">
            Start exploring our collection and borrow your first book!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                Active Borrows ({active.length})
              </h2>
              <div className="space-y-4">
                {active.map((b) => (
                  <BorrowCard key={b._id} borrow={b} />
                ))}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                Return History ({history.length})
              </h2>
              <div className="space-y-4">
                {history.map((b) => (
                  <BorrowCard key={b._id} borrow={b} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBorrows;
