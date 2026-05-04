import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axios";
import toast from "react-hot-toast";

export const fetchBooks = createAsyncThunk("books/fetchAll", async (params) => {
  const res = await API.get("/books", { params });
  return res.data;
});

export const fetchSingleBook = createAsyncThunk(
  "books/fetchOne",
  async (id) => {
    const res = await API.get(`/books/${id}`);
    return res.data;
  },
);

export const addBook = createAsyncThunk(
  "books/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/books/admin/add", formData);
      toast.success("Book added successfully");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateBook = createAsyncThunk(
  "books/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/books/admin/${id}`, formData);
      toast.success("Book updated");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteBook = createAsyncThunk(
  "books/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/books/admin/${id}`);
      toast.success("Book deleted");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
      return rejectWithValue(err.response?.data);
    }
  },
);

const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    book: null,
    pagination: {},
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (s, a) => {
        s.loading = false;
        s.books = a.payload.books;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchBooks.rejected, (s) => {
        s.loading = false;
      })

      .addCase(fetchSingleBook.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchSingleBook.fulfilled, (s, a) => {
        s.loading = false;
        s.book = a.payload.book;
      })

      .addCase(deleteBook.fulfilled, (s, a) => {
        s.books = s.books.filter((b) => b._id !== a.payload);
      });
  },
});

export default bookSlice.reducer;
