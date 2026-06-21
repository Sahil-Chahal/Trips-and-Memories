import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    usersData: [],
    friendsList : [],
    totalPages: 1,
    searchQuery : "",
    refreshKey: 0,
    pendingRequests : []
};

export const sendFriendRequestThunk = createAsyncThunk("/friends/add/send", async ({ recipientId }, { dispatch, getState }) => {
        try {
            console.log("sending friend request....");
            const res =  axiosInstance.get(`friends/request/${recipientId}`);
            toast.promise(res, {
                loading: "Sending friend request...",
                success: (data) => data?.data?.message,
                error: "Failed to send friend request !!"
            });


            const { searchQuery } = getState().friendship;
            if (searchQuery) {
                await dispatch(fetchSearchedUserThunk({ page: 1, limit: 10, query: searchQuery }));
            }

            toast.dismiss();
            return res.data;

        } catch (err) {
            console.error(`Error occurred while sending a friend request : ${err}`);
        }
    }
);

export const cancelFriendRequestThunk = createAsyncThunk("/friends/cancel/send", async ({ requestId }, { dispatch, getState }) => {
        try {
            const res =  axiosInstance.delete(`friends/request/cancel/${requestId}`);
            toast.promise(res, {
                loading: 'Cancelling the friend request...',
                success: (data) => data?.data?.message,
                error: "Failed to cancel the friend request"
            });

            const { searchQuery } = getState().friendship;
            if (searchQuery) {
                dispatch(fetchSearchedUserThunk({ page: 1, limit: 10, query: searchQuery }));
            }
            toast.dismiss();

            return res.data;
        } catch (err) {
            console.error(`Error occurred while cancelling the friend request : ${err}`);
        }
    }
);

export const acceptFriendRequestThunk = createAsyncThunk("/friends/accept", async({ requestId }, { dispatch, getState }) => {
    try{
        console.log("Here is the requestId : ", requestId );
        const res = await axiosInstance.get(`friends/accept/${requestId}`);
        // toast.promise(res, {
        //     loading : 'Updating friends list',
        //     success : (data) => data?.data?.message,
        //     error : "Failed to accept the friend request",
        // });

        const { searchQuery } = getState().friendship;
        if(searchQuery){
            dispatch(fetchSearchedUserThunk({ query : searchQuery}));
        }

        dispatch(fetchAllFriendsThunks());
        dispatch(fetchPendingRequestsThunk());
        return res.data;
    }catch(err){
        console.error(`Error occurred while accepting the friend request : ${err}`);
    }
})

export const declineFriendRequestThunk = createAsyncThunk("/friends/decline", async({ requestId }, { dispatch, getState }) => {
    try{
        const res =  axiosInstance.get(`friends/decline/${requestId}`);
        toast.promise(res, {
            loading : 'Declining the friend request',
            success : (data) => data?.data?.message,
            error : "Failed to delcine the friend request"
        });

        const { searchQuery } = getState().friendship;
        if(searchQuery){
            await dispatch(fetchSearchedUserThunk({ query : searchQuery }));
        }
        
        dispatch(fetchPendingRequestsThunk());
        toast.dismiss();

        return res.data;

    }catch(err){
        console.error(`Error occurred while declining the friend request : ${err}`);
    }
})

export const fetchPendingRequestsThunk = createAsyncThunk("/friends-pending", async () => {
    try{
        const res = axiosInstance.get(`friends/requests-pending`);
        console.log("this is called");
        toast.promise(res, {
            loading : 'fetching pending requests...',
            success : (data) => data?.data?.message,
            error : "Failed to fetch pending requests"
        });
        // console.log("Awaited res data : ", (await res).data.data);
        return (await res).data.data;

    }catch(err){
        console.error(`Error occurred while fetching all pending requests : ${err}`);
    }
})

export const removeFriendThunk = createAsyncThunk("/friends-remove/", async({ friendId }, { dispatch, getState }) => {
    try {
        const res = axiosInstance.delete(`friends/remove/${friendId}`);
        toast.promise(res, {
            loading: "Removing friend from friends list...",
            success: (data) => data?.data?.message,
            error: "Failed to remove friend from friends list",
        });

        const { searchQuery } = getState().friendship;

        dispatch(fetchSearchedUserThunk({ page : 1, limit : 10, query : searchQuery}));
        

        await dispatch(fetchAllFriendsThunks());
        dispatch(friendShipSlice.actions.incrementRefreshKey());

        return res.data;
    } catch (err) {
        console.error(`Error occurred while removing friend from friends list: ${err}`);
    }
});

export const fetchAllFriendsThunks = createAsyncThunk("/friends-list", async() => {
    try{
        const res = axiosInstance.get("friends/list");
        toast.promise(res, {
            loading : "fetching all friends...",
            success : (data) => data?.data?.message,
            error : "Failed to fetch all friends"
        })

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while fetching all friends : ${err}`);
    }
})

export const fetchSearchedUserThunk = createAsyncThunk("/friends-search", async({ query }) => {
    try{
        const res = axiosInstance.get(`friends/search-query?query=${query}`);
        // toast.promise(res, {
        //     loading : "Searching for user...",
        //     success : (data) => data?.data?.message,
        //     error : "Failed to search for user !!"
        // })
        return (await res).data;
    }catch(err){
        console.error(`Error occurred while fetching searched user : ${err}`);
    }
})

const friendShipSlice = createSlice({
    name: "friendship",
    initialState,
    reducers: {
        clearUsersData: (state) => {
            state.usersData = [];
        },
        incrementRefreshKey: (state) => {
            state.refreshKey += 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchedUserThunk.fulfilled, (state, action) => {
                state.usersData = action?.payload?.data?.searchedUser;
                state.totalPages = action?.payload?.data?.totalPages;
                state.searchQuery = action?.meta?.arg?.query;
            })
            .addCase(fetchAllFriendsThunks.fulfilled, (state, action) => {
                state.friendsList = action?.payload?.data?.friends
            })
            .addCase(fetchPendingRequestsThunk.fulfilled, (state, action) => {
                state.pendingRequests = action?.payload?.pendingRequests;
                // console.log("State : ", state.pendingRequests);
            })
    },
});



export const { clearUsersData } = friendShipSlice.actions;
export default friendShipSlice.reducer;