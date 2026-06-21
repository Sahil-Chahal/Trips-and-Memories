import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changePasswordThunk } from '../Redux/Slices/authSlice.js';
import BackButton from "../Components/BackButton.jsx";

function ChangePassword() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    async function handlePasswordChange(e){
        e.preventDefault();
        if(!oldPassword || !newPassword){
            toast.dismiss();
            toast.error("Both fields are mandatory !!");
            return;
        }


        const res = await dispatch(changePasswordThunk({ oldPassword, newPassword }));

        if(res?.payload?.statusCode === 200){
            navigate("/");
            setNewPassword("");
            setOldPassword("");
        }
        // console.log('Old Password:', oldPassword);
        // console.log('New Password:', newPassword);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <BackButton/>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md mx-4 sm:mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-6">
                    Change Password
                </h2>
                <form onSubmit={handlePasswordChange} noValidate className="flex flex-col space-y-4">
                <div>
                    <label
                    htmlFor="oldPassword"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                    >
                    Old Password
                    </label>
                    <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    placeholder="Enter your old password"
                    required
                    />
                </div>

                <div>
                    <label
                    htmlFor="newPassword"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                    >
                    New Password
                    </label>
                    <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    placeholder="Enter your new password"
                    required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mt-4"
                >
                    Update Password
                </button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
