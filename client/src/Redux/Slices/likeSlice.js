import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance.js";

export const toggleMemoryLike = createAsyncThunk("/memory/all", async({ memoryId }) => {
    try{
        const res = axiosInstance.get(`like/toggle/m/${memoryId}`);
        toast.promise(res, {
            loading : 'Wait for a moment...',
            success : (data) => data?.data?.message,
            error : 'Failed to toggle like'
        });

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while toggling memory like : ${err}`);
    }
})

export const toggleCommentLike = createAsyncThunk("/memory/view", async({ commentId }) => {
    try{
        const res = axiosInstance.get(`like/toggle/c/${commentId}`);
        toast.promise(res, {
            loading : 'Wait for a moment',
            success : (data) => data?.data?.message,
            error : 'Failed to toggle comment like'
        });

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while toggling comment like : ${err}`);
    }
})


const LikeSlice = createSlice({
    name : 'like',
    initialState : {},
    reducers : {}
})


export default LikeSlice.reducer;
