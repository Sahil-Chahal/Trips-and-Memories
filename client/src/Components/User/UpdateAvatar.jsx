import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfileAvatar } from '../../Redux/Slices/authSlice';

function UploadAvatar({ isOpen, onClose, currentAvatar }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const dispatch = useDispatch();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log("Selected file:", selectedFile);
        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setPreview(previewUrl); 
            setFile(selectedFile); 
        }
    };

    async function handleUpload() {
        if (!file) {
            console.log("No file selected for upload.");
            return;
        }


        const formData = new FormData();
        formData.append('avatar', file); 

        try {
            const res = await dispatch(updateProfileAvatar(formData));
            console.log("Upload response:", res);

            if (res?.payload?.statusCode === 200) {
                setFile(null);
                setPreview(null);
                onClose();
            } else {
                console.error("Failed to upload the file:", res?.payload);
            }
        } catch (error) {
            console.error("Error uploading the file:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setFile(null);
            setPreview(null);
        }
    }, [isOpen]);


    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        if (isOpen) {
            setShowModal(true);
        } else {
            const timer = setTimeout(() => setShowModal(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!showModal) return null;

    return (
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-4 transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'}`}>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Upload New Avatar</h2>
                <div className="flex justify-center mb-4">
                    <img
                        src={preview || currentAvatar || "https://via.placeholder.com/150"}
                        alt="Selected Avatar"
                        className="w-24 h-24 rounded-full object-cover shadow-lg"
                    />
                </div>

                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <label htmlFor="file-upload" className="flex justify-center items-center cursor-pointer bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Choose Avatar
                </label>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handleUpload}
                        className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-500 transition-all disabled:opacity-50"
                        disabled={!file}
                    >
                        Upload Avatar
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

export default UploadAvatar;
