import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import BackButton from '../Components/BackButton.jsx';
import UpdateProfile from '../Components/User/UpdateProfile.jsx';
import UploadAvatar from '../Components/User/UpdateAvatar.jsx';


function Profile() {
    const userData = useSelector((state) => state?.auth?.userData);
    const [ isUpdateProfleModalOpen, setIsUpdateProfileModalOpne ] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <BackButton/>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md mx-4 sm:mx-auto">
                <div className="flex flex-col items-center space-y-4">
                <img
                    src={userData?.avatar?.secure_url || "https://via.placeholder.com/150"}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full shadow-lg object-cover"
                />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {userData?.name || "User Name"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{userData?.email || "user@example.com"}</p>
                <p className="text-gray-500 dark:text-gray-400">@{userData?.username || "username"}</p>


                <div className="flex space-x-4 mt-4">
                    <button
                    onClick={() => setIsAvatarModalOpen(true)}  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    Update Avatar
                    </button>
                    <button  onClick={() => setIsUpdateProfileModalOpne(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                    Update Profile
                    </button>
                </div>
                </div>
            </div>
            <UpdateProfile isOpen={isUpdateProfleModalOpen} onClose={() => setIsUpdateProfileModalOpne(false)} userName={userData?.name} />
            <UploadAvatar isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} currentAvatar={userData?.avatar?.secure_url} />
        </div>
    );
}

export default Profile;
