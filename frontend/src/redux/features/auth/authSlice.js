import { createSlice } from "@reduxjs/toolkit";

let storedName;



try {
  const localStorageValue = localStorage.getItem("firstName");
  storedName = localStorageValue || "";
  
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
      
    },
  },
});

export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectuserID = (state) => state.auth._id;
export default authSlice.reducer;
