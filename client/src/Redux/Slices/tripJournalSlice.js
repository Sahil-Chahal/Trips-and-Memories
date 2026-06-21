import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    usersJournals : [],
    contributors : [],
    journalsEntries : []
}

export const createTripJournalThunk = createAsyncThunk("/create", async(journalData, { dispatch }) => {
    try{
        const res = axiosInstance.post('trip-journal/create', {
            title : journalData.title, 
            description : journalData.description
        });
        toast.promise(res, {
            loading : 'Creating a new trip journal',
            success : (data) => data?.data?.message,
            error : "Failed to create a journal"
        })

        await dispatch(fetchUserTripJournalsThunk());

        return (await res).data;
    }catch(err){
        console.error(`Error occurred while creating trip journal : ${err}`);
    }
})



export const fetchUserTripJournalsThunk = createAsyncThunk("/fetch-my", async () => {
    try{
        const res = axiosInstance.get("trip-journal/fetch/my");
        toast.promise(res, {
            loading : 'Fetching user trip journals...',
            success : (data) => data?.data?.message,
            error : 'Error occurred while fetching your time journals !!'
        });

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while fetching user trip journals  : ${err}`);
    }
})

export const fetchTripJournalEntriesThunk = createAsyncThunk("/fetch-journal-entries", async({ journalId }) => {
    try{
        const res = axiosInstance.get(`trip-journal/get/journal-entries/${journalId}`);
        toast.promise(res, {
            loading : "Fetching trip journal entires...",
            success : (data) => data?.data?.message,
            error : "Failed to fetch the trip journal entries"
        });

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while fetching trip journal entries : ${err}`);
    }
})

export const fetchTripJournalDetailsThunk = createAsyncThunk("/fetch", async({ journalId }) => {
    try{    
        const res = axiosInstance.get(`trip-journal/get/${journalId}`);
        toast.promise(res, {
            loading : 'fetching a trip journal',
            success : (data) => data?.data?.message,
            error : 'Failed to get trip journal details !!'
        });
        console.log("res");

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while fetching a trip journal : ${err}`);
    }
})

export const addEntryToJournalThunk = createAsyncThunk("/add-entry", async({ journalId, formData}) => {
    try{
        const res = axiosInstance.post(`trip-journal/add-entry/${journalId}`, formData);
        toast.promise(res, {
            loading : 'Adding a new entry to journal...',
            success : (data) => data?.data?.message ,
            error : 'Failed to add a new entry to journal'
        });
        return (await res).data;

    }catch(err){
        console.error(err?.message || `Error occurred while adding an entry to trip journal : ${err}`);
    }
})

export const closeJournalThunk = createAsyncThunk("/close-journal", async({ journalId }, { dispatch }) => {
    try{
        const res = axiosInstance.get(`trip-journal/close/${journalId}`);
        toast.promise(res, {
            loading : 'closing this trip journal',
            success : (data) => data?.data?.message,
            error : "Failed to close this trip journal"
        });

        await dispatch(fetchUserTripJournalsThunk());
        
        return (await res).data;

    }catch(err){
        console.error(`Error occurred while closing trip journal : ${err}`);
    }
}) 

export const deleteJournalThunk = createAsyncThunk("/delete-journal", async({ journalId }, { dispatch }) => {
    try{
        const res = axiosInstance.delete(`trip-journal/d/${journalId}`);
        toast.promise(res, {
            loading : "Deleting the requested journal..",
            success : (data) => data?.data?.message,
            error : "Failed to delete the journal !!"
        });

        await dispatch(fetchUserTripJournalsThunk());

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while deleting the journal : ${err}`);
    }
})

export const manageContributorsThunk = createAsyncThunk("/manage-contributors", async({ journalId, contributors }) => {
    try{
        const res = axiosInstance.patch(`trip-journal/manage/contributors/${journalId}`, {contributors});
        toast.promise(res, {
            loading : 'Updating Contributors list..',
            success : (data) => data?.data?.message,
            error :'Failed to update the contributors list !!'
        });

        return (await res).data;

    }catch(err){
        console.error(`Error occurred while managing contributors : ${err}`);
    }
})

export const fetchJournalContributorsThunk = createAsyncThunk("/fetch-contributors", async({ journalId }) => {
    try{
        const res = axiosInstance.get(`trip-journal/get/c/${journalId}`);
        toast.promise(res, {
            loading : 'fetching contributors list...',
            success : (data) => data?.data?.message,
            error : "Failed to fetch the journal contributors !!"
        });

        return (await res).data;
    }catch(err){
        console.error(`Error occurred while fetching journal contributors : ${err}`);
    }
})

export const addContributorThunk = createAsyncThunk("/add-contributor", async({ journalId, friendId }) => {
    try{
        const res = axiosInstance.get(`trip-journal/add/j/${journalId}/c/${friendId}`);
        toast.promise(res, {
            loading : 'adding a new contributor ..',
            success : (data) => data?.data?.message,
            error : "failed to add a new contributor"
        })
        return (await res).data;
    }catch(err){
        console.error(`Error occurred while adding a new contributor : ${err}`);
    }
})

export const removeContributorThunk = createAsyncThunk("/remove-contributor", async({ journalId, friendId }) => {
    try{
        const res = axiosInstance.get(`trip-journal/remove/j/${journalId}/c/${friendId}`);
        toast.promise(res,{
            loading : 'removing a contributor...',
            success : (data) => data?.data?.message,
            error : "Failed to remove the contributor !!"
        });
        return (await res).data;
    }catch(err){
        console.error(`Error occurred while removing contributor : ${err}`);
    }
})

export const addTripStoryThunk = createAsyncThunk(`add-ai-trip-story`, async({journalId}, {dispatch}) => {
    try {
        const res = axiosInstance.get(`ai/create-story/${journalId}`);
        toast.promise(res, {
            loading : 'creating ai generated story ...',
            success : (data) => data?.data?.message,
            error : "Failed to create the trip story !!"
        });

        await dispatch(fetchTripJournalEntriesThunk({ journalId }));
    
        return (await res).data;
    } catch (err) {
        console.error(`Error occurred while creating an ai generated trip story : ${err}`);
    }
})

const tripJournalSlice = createSlice({
    name : "tripJournal",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchUserTripJournalsThunk.fulfilled, (state, action) => {
                state.usersJournals = action?.payload?.data;
                // console.log("redux : ", state.usersJournals);
            })
            .addCase( addContributorThunk.fulfilled, (state, action) => {
                state.contributors = action?.payload?.data;
            })
            .addCase( removeContributorThunk.fulfilled, (state, action) => {
                state.contributors = action?.payload?.data;
            })
            .addCase(fetchTripJournalEntriesThunk.fulfilled, (state, action) => {
                state.journalsEntries = action?.payload?.data;
            })
            .addCase(addEntryToJournalThunk.fulfilled, (state, action) => {
                state.journalsEntries = action?.payload?.data;
            })
            .addCase(closeJournalThunk.fulfilled, (state, action) => {
                const closedJournalId = action?.payload?.data?._id;
                const journal = state.usersJournals.find(journal => journal._id === closedJournalId);
                if (journal) {
                    journal.status = "closed";
                }
            })
            .addCase(deleteJournalThunk.fulfilled, (state, action) => {
                const journalId = action?.payload?.data?._id;
                const updatedJournals = state.usersJournals.filter((journal) => journal._id !== journalId);
                state.usersJournals = updatedJournals;
            })
            .addCase(fetchJournalContributorsThunk.fulfilled, (state, action) => {
                state.contributors = action?.payload?.data?.contributors;
            })
            
    }
})


export default tripJournalSlice.reducer;
