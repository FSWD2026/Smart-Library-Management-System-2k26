import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axios";
import toast from "react-hot-toast";

export const borrowBook = createAsyncThunk(
  "borrows/borrow",
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await API.post(`/borrow/${bookId}`);
      toast.success("Book borrowed successfully! Due in 14 days.");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to borrow");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const returnBook = createAsyncThunk(
  "borrows/return",
  async (borrowId, { rejectWithValue }) => {
    try {
      const res = await API.put(`/borrow/return/${borrowId}`);
      if (res.data.fine > 0) {
        toast.success(`Book returned! Fine: ₹${res.data.fine}`);
      } else {
        toast.success("Book returned successfully!");
      }
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to return");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchMyBorrows = createAsyncThunk(
  "borrows/myBorrows",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/borrow/my");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchAllBorrows = createAsyncThunk(
  "borrows/allBorrows",
  async (params, { rejectWithValue }) => {
    try {
      const res = await API.get("/borrow/admin/all", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const borrowSlice = createSlice({
  name: "borrows",
  initialState: {
    borrows: [],
    myBorrows: [],
    pagination: {},
    loading: false,
    myLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBorrows.pending, (s) => {
        s.myLoading = true;
      })
      .addCase(fetchMyBorrows.fulfilled, (s, a) => {
        s.myLoading = false;
        s.myBorrows = a.payload.borrows;
      })
      .addCase(fetchMyBorrows.rejected, (s) => {
        s.myLoading = false;
      })

      .addCase(fetchAllBorrows.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchAllBorrows.fulfilled, (s, a) => {
        s.loading = false;
        s.borrows = a.payload.borrows;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchAllBorrows.rejected, (s) => {
        s.loading = false;
      })

      .addCase(borrowBook.fulfilled, (s) => {
        s.loading = false;
      })

      .addCase(returnBook.fulfilled, (s, a) => {
        s.myBorrows = s.myBorrows.map((b) =>
          b._id === a.payload.borrow._id ? a.payload.borrow : b,
        );
      });
  },
});

export default borrowSlice.reducer;
