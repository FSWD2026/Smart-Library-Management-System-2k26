import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axios";
import toast from "react-hot-toast";

export const borrowBook = createAsyncThunk(
  "borrows/borrow",
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await API.post(`/borrow/${bookId}`);
      toast.success("Book borrowed successfully");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const returnBook = createAsyncThunk(
  "borrows/return",
  async (borrowId, { rejectWithValue }) => {
    try {
      const res = await API.put(`/borrow/return/${borrowId}`);
      toast.success(
        res.data.fine > 0
          ? `Returned! Fine: ₹${res.data.fine}`
          : "Book returned",
      );
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchMyBorrows = createAsyncThunk(
  "borrows/myBorrows",
  async () => {
    const res = await API.get("/borrow/my");
    return res.data;
  },
);

export const fetchAllBorrows = createAsyncThunk(
  "borrows/allBorrows",
  async (params) => {
    const res = await API.get("/borrow/admin/all", { params });
    return res.data;
  },
);

const borrowSlice = createSlice({
  name: "borrows",
  initialState: {
    borrows: [],
    myBorrows: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBorrows.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchMyBorrows.fulfilled, (s, a) => {
        s.loading = false;
        s.myBorrows = a.payload.borrows;
      })
      .addCase(fetchAllBorrows.fulfilled, (s, a) => {
        s.borrows = a.payload.borrows;
      })
      .addCase(returnBook.fulfilled, (s, a) => {
        s.myBorrows = s.myBorrows.map((b) =>
          b._id === a.payload.borrow._id ? a.payload.borrow : b,
        );
      });
  },
});

export default borrowSlice.reducer;
