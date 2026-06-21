import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import BackButton from '../../Components/BackButton';
import { createMemoryThunk } from '../../Redux/Slices/memorySlice';
import { useNavigate } from 'react-router-dom';

function CreateMemory(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tripDate: '',
        location: '',
        category: '',
        tags: [],
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);
    const [tagInput, setTagInput] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setThumbnail(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleTagChange = (e) => {
        setTagInput(e.target.value);
    };

    const handleRemoveTag = (index) => {
        const newTags = formData.tags.filter((_, i) => i !== index);
        setFormData({ ...formData, tags: newTags });
    };


    const handleAddTag = () => {
        if (tagInput.trim()) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput] });
            setTagInput('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    

        if (!formData.title || !formData.content || !formData.tripDate || !formData.location || !formData.category || formData.tags.length === 0 || !thumbnail) {
            toast.dismiss();
            toast.error("All fields are mandatory");
            return;
        }
    

        const memoryData = new FormData();
        memoryData.append('title', formData.title);
        memoryData.append('content', formData.content);
        memoryData.append('tripDate', formData.tripDate);
        memoryData.append('location', formData.location);
        memoryData.append('category', formData.category);
        memoryData.append('thumbnail', thumbnail); 
        formData.tags.forEach(tag => memoryData.append('tags', tag));
    
        const res = await dispatch(createMemoryThunk(memoryData));
        if (res?.payload?.statusCode === 201) {

            setFormData({
                title: '',
                content: '',
                tripDate: '',
                location: '',
                category: '',
                tags: [],
            });
            setThumbnail(null);
            setPreview(null);
            navigate("/"); 
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 flex flex-col items-center justify-center">
            <BackButton/>
            <div className="max-w-4xl w-full">
                <h2 className="text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white">
                    Create a New Memory
                </h2>

                <form noValidate onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full">
                    
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Memory Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="content" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Memory Description</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows="6"
                            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="tripDate" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Trip Date</label>
                            <input
                                type="date"
                                id="tripDate"
                                name="tripDate"
                                value={formData.tripDate}
                                onChange={handleChange}
                                className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="category" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                        >
                            <option value="">Select Category</option>
                            <option value="Emotional">Emotional</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Horror">Horror</option>
                            <option value="Funky">Funky</option>
                            <option value="Cute">Cute</option>
                            <option value="Romantic">Romantic</option>
                            <option value="Spiritual">Spiritual</option>
                            <option value="Nature">Nature</option>
                            <option value="Foodie">Foodie</option>
                            <option value="Wildlife">Wildlife</option>
                            <option value="Historical">Historical</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Eco-Friendly">Eco-Friendly</option>
                            <option value="Urban">Urban</option>
                            <option value="Adventure Sports">Adventure Sports</option>
                            <option value="Travel">Travel</option>
                            <option value="Relaxation">Relaxation</option>
                            <option value="Family">Family</option>
                            <option value="Photogenic">Photogenic</option>
                            <option value="Solo Travel">Solo Travel</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="thumbnail" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Memory Thumbnail</label>
                        <input
                            type="file"
                            id="thumbnail"
                            name="thumbnail"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-2 block w-full text-gray-900 dark:text-gray-100"
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Thumbnail Preview"
                                className="w-32 h-32 mt-4 rounded-lg object-cover mx-auto"
                            />
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">Tags</label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={handleTagChange}
                                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-all"
                            >
                                Add Tag
                            </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-sm flex items-center"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-500 transition-all text-lg"
                        >
                            Save Memory
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMemory;
