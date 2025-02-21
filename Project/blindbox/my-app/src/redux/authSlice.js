// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userId: null,
    token: null,
    isLoggedIn: false,
    role: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { userId, token, role } = action.payload;
            state.userId = userId;
            state.token = token;
            state.role = role;
            state.isLoggedIn = true;
        },
        logoutUser: (state) => {
            state.userId = null;
            state.token = null;
            state.role = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
