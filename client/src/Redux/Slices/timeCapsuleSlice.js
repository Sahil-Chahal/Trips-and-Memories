import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    usersTimeCapsules : []
}


export const createTimeCapsuleThunk = createAsyncThunk("/create/time-capsule", async(data) => {
    try{    
        console.log("Data : ", data);
        const res = axiosInstance.post(`time-capsule/create`, data);
        toast.promise(res, {
            loading : 'Creating time capsule...',
            success : (data) => data?.data?.message,
            error : "Failed to create a time capsule"
        })

        // dispatch(fetchUserTimeCapsulesThunk());

        return (await res).data;

    }catch(err){
        console.log(`Error occurred while creating a time capsule : ${err}`);;
    }
})

export const fetchUserTimeCapsulesThunk = createAsyncThunk("/fetch/time-capsules-user", async(data) => {
    try{
        const res = axiosInstance.get(`time-capsule/get/my`, data);
        toast.promise(res, {
            loading : 'Fetching your time capsules...',
            success : (data) => data?.data?.message,
            error : "Failed to fetch your time capsules !!"
        })

        return (await res).data;

    }catch(err){
        console.log(`Error occurred while fetching user time capsules : ${err}`);
    }
})

export const fetchTimeCapsuleDetailsThunk = createAsyncThunk("/fetch/time-capsule-details", async({ capsuleId }) => {
    try{
        const res = axiosInstance.get(`time-capsule/get/${capsuleId}`);
        toast.promise(res, {
            loading : 'Fetching time-capsule details ...',
            success : (data) => data?.data?.message,
            error : 'Failed to fetch time capsule details !!'
        })

        return (await res).data;

    }catch(err){
        console.log(`Error occurred while fetching time capsules details : ${err}`);
    }
})

export const deleteTimeCapsuleThunk = createAsyncThunk("/delete/time-capsule", async({ capsuleId }, { dispatch }) => {
    try{
        const res = axiosInstance.delete(`time-capsule/delete/${capsuleId}`);
        toast.promise(res, {
            loading : 'deleting the time capsule...',
            success : (data) => data?.data?.message,
            error : "Failed to delete the time capsule !!!"
        })

        await dispatch(fetchUserTimeCapsulesThunk());

        return (await res).data;

    }catch(err){
        console.log(`Error occurred while deleting the time capsule : ${err}`);
    }
})


const timeCapsuleSlice = createSlice({
    name : "timeCapsule",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase( fetchUserTimeCapsulesThunk.fulfilled, (state, action) => {
                state.usersTimeCapsules = action?.payload?.data;
                console.log("Fetched capsules : ", action?.payload?.data);
            })
    }
})


export default timeCapsuleSlice.reducer;

