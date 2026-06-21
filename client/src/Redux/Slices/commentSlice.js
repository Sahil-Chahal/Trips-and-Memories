import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance.js";

export const createCommentThunk = createAsyncThunk(
    "/memory/view",
    async ({ memoryId, content }, { dispatch }) => {
        try {
            const res = axiosInstance.post(`comment/add/${memoryId}`, { content });
            toast.promise(res, {
            loading: 'Creating a new comment...',
            success: (data) => data?.data?.message,
            error: "Failed to create a new comment, please try again later..."
            });
    
            const result = await res;
            dispatch(fetchAllCommentsThunk({ memoryId }));  // Refetch comments after adding
    
            return result.data;
        } catch (err) {
            console.error(`Error occurred while creating a new comment: ${err}`);
        }
    }
);


export const deleteCommentThunk = createAsyncThunk(
    "comments/delete",
    async ({ commentId, memoryId }, { dispatch, rejectWithValue }) => {
        try {

            const res =  axiosInstance.delete(`comment/delete/${commentId}`);
    
            toast.promise(res, {
                loading : "Deleting your comment..",
                success : (data) => data?.data?.message,
                error : "comment not deleted"
            })
    
            await dispatch(fetchAllCommentsThunk({ memoryId }));
    
            return (await res).data;
        } catch (err) {
            console.error(`Error deleting comment: ${err}`);
            return rejectWithValue(err.response?.data || "Failed to delete comment");
        }
    }
);


export const fetchAllCommentsThunk = createAsyncThunk("comments/fetchAll", async ({ memoryId }) => {
    try {
        const res = await axiosInstance.get(`comment/fetch/${memoryId}`);
        toast.dismiss();
        toast.success("Fetched comments successfully.");
        return res.data;
    } catch (err) {
        toast.error("Failed to fetch comments, please try again later...");
        console.error(`Error fetching comments: ${err}`);
    }
});


const commentSlice = createSlice({
    name: "comments",
    initialState: {
        comments: [],
        memoryId: null,
    },
    reducers: {
        setMemoryId: (state, action) => {
            state.memoryId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCommentsThunk.fulfilled, (state, action) => {
                state.comments = action.payload.data || [];
            })
            .addCase(deleteCommentThunk.fulfilled, (state, action) => {
                const deletedCommentId = action.meta.arg.commentId;
                // Filter out the deleted comment from the comments list in the state
                state.comments = state.comments.filter(comment => comment._id !== deletedCommentId);
            });
    },
});

export const { setMemoryId } = commentSlice.actions;
export default commentSlice.reducer;
