import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axios";
import toast from "react-hot-toast";

export const fetchBooks = createAsyncThunk("books/fetchAll", async (params) => {
  const res = await API.get("/books", { params });
  return res.data;
});

export const fetchSingleBook = createAsyncThunk(
  "books/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/books/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
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
      toast.error(err.response?.data?.message || "Failed to add book");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateBook = createAsyncThunk(
  "books/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/books/admin/${id}`, formData);
      toast.success("Book updated successfully");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update book");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteBook = createAsyncThunk(
  "books/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/books/admin/${id}`);
      toast.success("Book deleted successfully");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete book");
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
    bookLoading: false,
  },
  reducers: {
    clearBook: (state) => {
      state.book = null;
    },
  },
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
        s.bookLoading = true;
        s.book = null;
      })
      .addCase(fetchSingleBook.fulfilled, (s, a) => {
        s.bookLoading = false;
        s.book = a.payload.book;
      })
      .addCase(fetchSingleBook.rejected, (s) => {
        s.bookLoading = false;
      })

      .addCase(addBook.pending, (s) => {
        s.loading = true;
      })
      .addCase(addBook.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(addBook.rejected, (s) => {
        s.loading = false;
      })

      .addCase(updateBook.pending, (s) => {
        s.loading = true;
      })
      .addCase(updateBook.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(updateBook.rejected, (s) => {
        s.loading = false;
      })

      .addCase(deleteBook.fulfilled, (s, a) => {
        s.books = s.books.filter((b) => b._id !== a.payload);
      });
  },
});

export const { clearBook } = bookSlice.actions;
export default bookSlice.reducer;
