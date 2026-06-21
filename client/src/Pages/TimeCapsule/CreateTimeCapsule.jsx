import React, { useState } from 'react';
import { IoMdTimer } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { createTimeCapsuleThunk } from '../../Redux/Slices/timeCapsuleSlice';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import { useNavigate } from 'react-router-dom';

function CreateTimeCapsule() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        openDate: '',
        memoryTitle: '',
        memoryDescription: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [imagePreview, setImagePreview] = useState(null);
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit =  async (e) => {
        e.preventDefault();

        const data = new FormData();
        toast.dismiss();

        if(!formData.title || !formData.description || !formData.memoryTitle || !formData.memoryDescription || !formData.openDate || !file){
            toast.error("All Fields are mandatory");
            return;
        }

        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("openDate", formData.openDate);
        data.append("memoryText", formData.memoryTitle);
        data.append("memoryDescription", formData.memoryDescription);
        data.append("memoryImg", file);

        const res = await dispatch(createTimeCapsuleThunk(data));
        navigate("/time-capsules/fetch/my");
        setFormData({
            title: '',
            description: '',
            openDate: '',
            memoryTitle: '',
            memoryDescription: '',
        })
        console.log(" Res : ", res);


        // console.log("Form Data Submitted:", formData);
        // console.log("File Selected:", file);

    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 flex flex-col items-center justify-center">
            <BackButton/>
            <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white flex justify-center items-center gap-4">
                Create Time Capsule <IoMdTimer className='text-5xl'/>
            </h1>
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-lg font-medium text-gray-700 dark:text-gray-200"
                        >
                            Capsule Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter the title for your capsule..."
                            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-lg font-medium text-gray-700 dark:text-gray-200"
                        >
                            Capsule Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Enter the description for your capsule..."
                            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="openDate"
                            className="block text-lg font-medium text-gray-700 dark:text-gray-200"
                        >
                            Open Date
                        </label>
                        <input
                            type="date"
                            id="openDate"
                            name="openDate"
                            value={formData.openDate}
                            onChange={handleChange}
                            min={new Date(new Date().setDate(new Date().getDate() + 1))
                                .toISOString()
                                .split('T')[0]}
                            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="memoryTitle"
                            className="block text-lg font-medium text-gray-700 dark:text-gray-200"
                        >
                            Memory Title
                        </label>
                        <input
                            type="text"
                            id="memoryTitle"
                            name="memoryTitle"
                            value={formData.memoryTitle}
                            onChange={handleChange}
                            placeholder="Enter a title for the memory..."
                            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="memoryDescription"
                            className="block text-lg font-medium text-gray-700 dark:text-gray-200"
                        >
                            Memory Description
                        </label>
                        <textarea
                            id="memoryDescription"
                            name="memoryDescription"
                            value={formData.memoryDescription}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Enter a description for the memory..."
                            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="memoryImage"
                            className="block text-lg font-medium text-gray-700 dark:text-gray-200"
                        >
                            Memory Image
                        </label>
                        <input
                            type="file"
                            id="memoryImage"
                            name="memoryImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-2 block w-full text-gray-900 dark:text-gray-100"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-4 w-32 h-32 rounded-lg object-cover mx-auto"
                            />
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-500 transition-all text-lg"
                        >
                            Save Time Capsule
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTimeCapsule;
