import { createSlice } from "@reduxjs/toolkit";

let storedName;

try {
  const localStorageValue = localStorage.getItem("firstName");

  // Check if the value is not null or undefined before parsing
  storedName = localStorageValue ? JSON.parse(localStorageValue) : "";
} catch (error) {
  console.error("Error parsing 'name' from localStorage:", error);
  storedName = "";
}

const initialState = {
  isLoggedIn: false,
  name: storedName,
  user: {
    name: "",
    email: "",
    // Remove unused fields like photo, bio
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload;
    },
    SET_USER(state, action) {
      const { name, email } = action.payload;
      state.user.name = name;
      state.user.email = email;
      // Remove setting of unused fields like phone, bio
    },
  },
});

export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
