import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    tripRecommendations : []
}

export const provideRecommendationsThunk = createAsyncThunk("/provide-recomm", async() => {
    try{
        const res = axiosInstance.get(`recomm/get-recomm`);
        toast.promise(res, {
            loading : 'Fetching Trips recommendations for you...',
            success : (data) => data?.data?.message,
            error : "Failed to fetch recommendations, please try again !!"
        });

        return (await res).data;

    }catch(err){
        console.error(`Error occurre while providing trips recommendations for the user : ${err}`);
    }
})



const recommSlice = createSlice({
    name : "recommendations",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(provideRecommendationsThunk.fulfilled, (state, action) => {
            state.tripRecommendations = action?.payload?.data;
            // console.log("res :--->", state?.tripRecommendations);
        })
        
    }
})


export default recommSlice.reducer;





