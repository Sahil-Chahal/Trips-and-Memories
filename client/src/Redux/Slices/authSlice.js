import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance.js";
import toast from "react-hot-toast";



const updateLocalStorage = (user) => {
    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", user?.role);
};


const toastHandler = (promise, loadingMsg, successMsg, errorMsg) => {
    return toast.promise(promise, {
        loading: loadingMsg,
        success: (data) => data?.data?.message || successMsg,
        error: errorMsg,
    });
};

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    userRole: localStorage.getItem("userRole") !== undefined ? localStorage.getItem("userRole") : "",
    userData: JSON.parse(localStorage.getItem("userData")) !== undefined ? JSON.parse(localStorage.getItem("userData")) : {},
};


export const createUserAccount = createAsyncThunk("/auth/register", async (data) => {
    try {
        const res = axiosInstance.post("users/register", data);
        toastHandler(res, "Creating your account..", "Account created successfully!", "Failed to create a new account!");
        return (await res).data;
    } catch (err) {
        console.error(`Error occurred in creating new account: ${err}`);
    }
});

export const authenticateUser = createAsyncThunk("/auth/login", async (data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.post("users/login", data);
        toastHandler(res, "Authenticating your credentials...", "Login successful!", "Failed to authenticate the credentials!");
        return (await res).data;
    } catch (err) {
        console.error(`Error occurred while authenticating the user: ${err}`);
        return rejectWithValue(err.response.data);
    }
});

export const logoutUserAccount = createAsyncThunk("/auth/logout", async () => {
    try {
        const res = axiosInstance.get("users/logout");
        toastHandler(res, "Logging out...", "Successfully logged out!", "Failed to log out!");
        return (await res).data;
    } catch (err) {
        console.error(`Error occurred while logging out the user: ${err}`);
    }
});

export const forgotPasswordThunk = createAsyncThunk("/auth/forgot-password", async (data) => {
    try {
        const res = axiosInstance.post("users/reset", data);
        toastHandler(res, "Sending reset token...", "Reset token sent!", "Email not registered or an error occurred!");
        return (await res).data;
    } catch (err) {
        console.error(`Error occurred while forgetting password: ${err}`);
    }
});

export const resetPasswordThunk = createAsyncThunk("/auth/reset-password", async (data) => {
    try {
        const res = axiosInstance.post(`users/reset/${data.resetToken}`, { password: data.password });
        toastHandler(res, "Updating your password...", "Password updated successfully!", "Failed to update the password!");
        return (await res).data;
    } catch (err) {
        console.error(`Error occurred while resetting the password: ${err}`);
    }
});

export const fetchMyProfile = createAsyncThunk("/user/me/profile", async({ userId }) => {
    try{
        let res;
        if(userId){

            res = axiosInstance.get(`users/me?userId=${userId}`);
        }else{
            res = axiosInstance.get("users/me");
        }
        toastHandler(res, "Fetching your profile...", "profile fetched successfully", "Failed to fetch the profile");
        // console.log("From slices : ", res);
        return (await res).data;
    }catch(err){
        console.error(`Error occurred while fetching the users profile : ${err}`);
    }
})


export const changePasswordThunk = createAsyncThunk("/auth/change-password", async (data) => {
    try{
        const res = axiosInstance.post("users/change-password", data);
        toastHandler(res, "Updating your password", "Password changed successfully", "Old Password does not match or and error occurred");
        return (await res).data;
    }catch(err){
        console.error(`Error occurred while changing password : ${err}`);
    }
})

export const updateProfileDetails = createAsyncThunk("/user/me/update-profile", async(data) => {
    try{
        const res = axiosInstance.patch("users/update-profile", data);
        toastHandler(res, "Updating profile details", "Successfully updated profile", "Failed to update the profile details !!");
        return (await res).data;
    }catch(err){
        console.log(`Error occurred while updating profile details : ${err}`);
    }
})

export const updateProfileAvatar = createAsyncThunk("/user/me/update-avatar", async(data) => {
    try{
        const res = axiosInstance.patch("users/update-avatar", data);
        toastHandler(res, "Updating the profile avatar", "Successfully updated the profile avatar", "Failed to update the profile avatar");
        return (await res).data;
    }catch(err){
        console.lor(`Error occurred while updating profile avatar : ${err}`);
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createUserAccount.fulfilled, (state, action) => {
                if (action?.payload?.statusCode === 201) {
                    const user = action?.payload?.data?.user;
                    updateLocalStorage(user);

                    state.isLoggedIn = true;
                    state.userData = user;
                    state.userRole = user?.role;
                }
            })
            .addCase(createUserAccount.rejected, (state) => {
                localStorage.clear();
                state.userData = {};
                state.isLoggedIn = false;
                state.userRole = "";
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                if (action?.payload?.statusCode === 200) {
                    const user = action?.payload?.data?.user;
                    updateLocalStorage(user);

                    state.isLoggedIn = true;
                    state.userData = user;
                    state.userRole = user?.role;
                }
            })
            .addCase(authenticateUser.rejected, (state) => {
                localStorage.clear();
                state.userData = {};
                state.isLoggedIn = false;
                state.userRole = "";
            })
            .addCase(logoutUserAccount.fulfilled, (state, action) => {
                if (action?.payload?.statusCode === 200) {
                    localStorage.clear();
                    state.isLoggedIn = false;
                    state.userData = {};
                    state.userRole = "";
                }
            })
            .addCase(updateProfileDetails.fulfilled, (state, action) => {
                if(action?.payload?.statusCode == 200){
                    localStorage.setItem("userData",JSON.stringify(action?.payload?.data));
                    state.userData = action?.payload?.data;
                }
            })
            .addCase(updateProfileAvatar.fulfilled, (state, action) => {
                if(action?.payload?.statusCode === 200){
                    localStorage.setItem("userData", JSON.stringify(action?.payload?.data));
                    state.userData = action?.payload?.data;
                }
            })
    }
});

export default authSlice.reducer;
