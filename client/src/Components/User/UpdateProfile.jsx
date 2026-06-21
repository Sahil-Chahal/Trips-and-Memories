import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { updateProfileDetails } from '../../Redux/Slices/authSlice';

function UpdateProfile({ isOpen, onClose, userName }) {
    const [name, setName] = useState(userName || "");
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowModal(true);
        } else {
            const timer = setTimeout(() => setShowModal(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    async function handleUpdateName(){
        if(name == userName ){
            toast.dismiss();
            toast.error("Please provide the updated name!!");
            return;
        }
        const res = await dispatch(updateProfileDetails({ name }));
        // console.log("Updated name response : ", res);
        if(res?.payload?.statusCode === 200){
            setName('');
            onClose(); 
        }
    };

    if (!showModal) return null; 

    return (
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-4 transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'}`}>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Update Name</h2>
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your new name"
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full mb-4"
            />
            <div className="flex justify-between">
            <button
                onClick={handleUpdateName}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition-all"
            >
                Update Name
            </button>
            <button
                onClick={onClose}
                className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
                Cancel
            </button>
            </div>
        </div>
        </div>
    );
}

export default UpdateProfile;
