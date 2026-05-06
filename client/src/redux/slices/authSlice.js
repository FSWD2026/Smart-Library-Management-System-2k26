import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axios";
import toast from "react-hot-toast";

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/register", data);
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/verify", data);
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/login", data);
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/logout");
      toast.success("Logged out successfully");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const getMyProfile = createAsyncThunk(
  "auth/getMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/user/me");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    profileLoading: true,
    otpSent: false,
  },
  reducers: {
    resetOtpSent: (state) => {
      state.otpSent = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (s) => {
        s.loading = true;
      })
      .addCase(register.fulfilled, (s) => {
        s.loading = false;
        s.otpSent = true;
      })
      .addCase(register.rejected, (s) => {
        s.loading = false;
      })

      // verifyOTP
      .addCase(verifyOTP.pending, (s) => {
        s.loading = true;
      })
      .addCase(verifyOTP.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.isAuthenticated = true;
      })
      .addCase(verifyOTP.rejected, (s) => {
        s.loading = false;
      })

      // login
      .addCase(login.pending, (s) => {
        s.loading = true;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.isAuthenticated = true;
      })
      .addCase(login.rejected, (s) => {
        s.loading = false;
      })

      // logout
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.isAuthenticated = false;
      })

      // getMyProfile
      .addCase(getMyProfile.pending, (s) => {
        s.profileLoading = true;
      })
      .addCase(getMyProfile.fulfilled, (s, a) => {
        s.profileLoading = false;
        s.user = a.payload.user;
        s.isAuthenticated = true;
      })
      .addCase(getMyProfile.rejected, (s) => {
        s.profileLoading = false;
        s.user = null;
        s.isAuthenticated = false;
      });
  },
});

export const { resetOtpSent } = authSlice.actions;
export default authSlice.reducer;
