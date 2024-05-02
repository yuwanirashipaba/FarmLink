import { createSlice } from '@reduxjs/toolkit';

let storedName;

try {
  // Attempt to retrieve the firstName from localStorage and parse it if it exists
  const localStorageValue = localStorage.getItem('firstName');
  storedName = localStorageValue || '';
} catch (error) {
  console.error("Error parsing 'firstName' from localStorage:", error);
  storedName = '';
}

const initialState = {
  isLoggedIn: false,
  name: storedName, // This represents the name retrieved from localStorage
  user: {
    name: '',
    email: '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      // Store the name in localStorage to maintain state across sessions
      localStorage.setItem('firstName', JSON.stringify(action.payload)); // Ensure localStorage key matches getItem
      state.name = action.payload;
    },
    SET_USER(state, action) {
      // Update the user object directly with provided name and email
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

// Selectors
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectName = (state) => state.auth.name;

export default authSlice.reducer;
