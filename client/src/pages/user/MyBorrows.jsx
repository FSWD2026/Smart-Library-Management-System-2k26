import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBorrows } from "../../redux/slices/borrowSlice";
import BorrowCard from "../../components/borrow/BorrowCard";
import Loader from "../../components/ui/Loader";

const MyBorrows = () => {
  const dispatch = useDispatch();
  const { myBorrows, loading } = useSelector((s) => s.borrows);

  useEffect(() => {
    dispatch(fetchMyBorrows());
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">My Borrows</h1>
      {myBorrows.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">📖</div>
          <p>No borrowed books yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBorrows.map((b) => (
            <BorrowCard key={b._id} borrow={b} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBorrows;
