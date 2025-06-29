import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axiosConfig'

export const registerUser = createAsyncThunk(
    'auth/register',
    async ( userData, {rejectWithValue}) => {
        try{
            const res = await axios.post('/auth/register', userData)
            return res.data
        } catch (err){
            if (err.response && err.response.data && err.response.data.message){
                return rejectWithValue(err.response.data.message)
            }
            return rejectWithValue(err.msg)
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials) => {
        const { data } = await axios.post('/auth/login', credentials)
        return data //{user,token}
    }
)

const token = localStorage.getItem('token')
const user = token ? JSON.parse(localStorage.getItem('user')) : null
const role = localStorage.getItem('role') || null

const initialState ={
    user,
    token,
    role,
    isLoading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state){
            state.user = null;
            state.token = null;
            state.role = null;
            localStorage.clear();
            delete axios.defaults.headers.common['Authorization'];
        },
    },
            extraReducers: builder => {
            builder
                //Register
                .addCase(registerUser.pending, state => {
                    state.isLoading = true
                    state.error = null
                })
                .addCase(registerUser.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.user = action.payload.user
                    state.token = action.payload.token
                    state.role = action.payload.role
                    localStorage.setItem('token', action.payload.token)
                    localStorage.setItem('user', JSON.stringify(action.payload.user))
                    localStorage.setItem('role', action.payload.role)
                    axios.defaults.headers.common['Authorization'] =
                        `Bearer ${action.payload.token}`
                })
                .addCase(registerUser.rejected, (state, action) => {
                    state.isLoading = false
                    state.error = action.payload
                })
                //Login
                .addCase(loginUser.pending, state => {
                    state.isLoading = true
                    state.error = null
                })
                .addCase(loginUser.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.user = action.payload.user
                    state.token = action.payload.token
                    state.role = action.payload.role
                    localStorage.setItem('token', action.payload.token)
                    localStorage.setItem('user', JSON.stringify(action.payload.user))
                    localStorage.setItem('role', action.payload.role)
                    axios.defaults.headers.common['Authorization'] =
                    `Bearer ${action.payload.token}`
                    console.log('🔥 auth payload:', action.payload);
                })
                .addCase(loginUser.rejected, (state, action) => {
                    state.isLoading = false
                    state.error = action.error.message
                })
        }
})

export const { logout } = authSlice.actions
export default authSlice.reducer