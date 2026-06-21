import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance.js";




export const createMemoryThunk = createAsyncThunk("/memory/create-memory", async(data) => {
    try{
        const res = axiosInstance.post("memory/create", data);
        toast.promise(res, {
            loading : 'Creating a new memory...',
            success : (data) => data?.data?.message,
            error : "Failed to create a new memory, please try again later !!"
        })

        return ( await res).data;
    }catch(err){
        console.error(`Error occurred while creating a new memory : ${err}`);
    }
})

export const fetchPersonalMemoriesThunk = createAsyncThunk("/memory/my", async({page, limit}) => {
    try{
        const res = axiosInstance.get(`memory/my?limit=${limit}&page=${page}`);
        toast.promise(res, {
            loading : 'Fetching Personal Memories',
            success : (data) => data?.data?.message,
            error : "Failed to fetch personal memories"
        })

        return (await res).data;
    }catch(err){
        console.log(`Error occurred while fetching Personal Memories : ${err}`);
    }
})

export const fetchSearchMemoriesThunk = createAsyncThunk("/memory/all", async({ query, page, limit}) => {
    try{
        const res = axiosInstance.get(`memory/search?query=${query}&page=${page}&limit=${limit}`);
        toast.promise(res, {
            loading : 'fetching memories based on search query...',
            success : (data) => data?.data?.message,
            error : "Failed to search for memories !!"
        })
        
        return (await res).data;

    }catch(err){
        console.error(`Error occurred while fetching search memories : ${err}`);
    }
})

export const viewMemoryThunk = createAsyncThunk("/memory/view-memory/:memoryId", async({memoryId}) => {
    try{
        const res = axiosInstance.get(`memory/view/${memoryId}`);
        toast.promise(res, {
            loading : 'remembering memory...',
            success : (data) => data?.data?.message,
            error : "Failed to remember the memory..."
        });

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while viewing a memory : ${err}`);
    }
})

export const fetchAllMemoriesThunk = createAsyncThunk("/memory/all", async({page, limit}) => {
    try{
        const res = axiosInstance.get(`memory/all?limit=${limit}&page=${page}`);
        toast.promise(res, {
            loading : 'Fetching all memories',
            success : (data) => data?.data?.message,
            error : "Failed to fetch all memories"
        })

        return (await res).data;
    }catch(err){
        console.error(`Error occurred while fetching all memories : ${err}`);
    }
})

export const deleteMemoryThunk = createAsyncThunk("/memory/delete/:memoryId", async({ memoryId }) => {
    try{
        const res = axiosInstance.delete(`memory/delete/${memoryId}`);
        toast.promise(res, {
            loading : 'Forgetting the memory..',
            success : (data) => data?.data?.message,
            error : "Failed to forget the memory"
        })

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while deleting the memory : ${err}`);
    }
})

export const updateMemoryDetailsThunk = createAsyncThunk("/memory/update-details/:memoryId", async({ memoryId, formData }) => {
    try{
        const res = axiosInstance.post(`memory/update/${memoryId}`, formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        toast.promise(res, {
            loading : 'Updating the memory...',
            success : (data) => data?.data?.message,
            error : "Failed to update the details of the memory.."
        })

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while updating the memory details : ${err}`);
    }
})

export const updateThumbnailThunk = createAsyncThunk("/memory/update-thumbnail/:memoryId", async({ memoryId, formData}) => {
    try{
        const res = axiosInstance.patch(`memory/update-thumbnail/${memoryId}`, formData);
        toast.promise(res, {
            loading : 'Updating the memory thumbnail...',
            success : (data) => data?.data?.message,
            error : "Failed to update the thumbnail ..."
        })

        return (await res).data;
    }catch(err){
        console.error(`Error occurred while updating the thumbnail : ${err}`);
    }
})

export const fetchAuthorMemoriesThunk = createAsyncThunk("/author/:authorId", async({ authorId }) => {
    try{
        const res = axiosInstance.get(`memory/get/${authorId}`);
        toast.promise(res, {
            loading : 'Fetching author memories...',
            success : (data) => data?.data?.message,
            error : 'Failed to fetch the author memories'
        })

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while fetching memories for particular author : ${err}`);
    }
})


const memorySlice = createSlice({
    name : 'memory',
    initialState : {},
    reducers : {},
})




export default memorySlice.reducer;
