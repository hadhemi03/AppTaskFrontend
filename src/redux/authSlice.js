// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

let parsedUser = null;
try {
  const storedUser = localStorage.getItem("user");
  parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch {
  parsedUser = null; // fallback in case of corrupted JSON
}

const initialState = {
  token: localStorage.getItem('token') || null,
  user: parsedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;

      state.token = token;
      state.user = user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },

    clearCredentials: (state) => {
      state.token = null;
      state.user = null;

      // Remove from localStorage when logging out
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { setCredentials, clearCredentials, updateUser } = authSlice.actions;

export const logoutUser = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    dispatch(clearCredentials());

    await axios.post(
      'http://localhost:8000/api/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export default authSlice.reducer;
