import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addEntryToJournalThunk } from "../../Redux/Slices/tripJournalSlice";
import { useNavigate, useParams } from "react-router-dom";

function AddEntry() {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { journalId } = useParams();

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);

        if (selectedFiles.length + files.length > 5) {
            toast.error("You can upload a maximum of 5 files !!");
            return;
        }

        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("content", content);
        files.forEach((file) => {
            formData.append("journalImg", file); 
        });

        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }
        const res = await dispatch(addEntryToJournalThunk({ journalId, formData}));
        navigate("/my-journals");
        // console.log("Response from backend : ", res);


    };

    const removeFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 py-12 px-6 flex items-center justify-center">
            <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-8">
                <h1 className="text-center font-bold text-4xl text-gray-900 dark:text-white mb-8">
                    Add Entry to Journal
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="content"
                            className="block text-lg font-medium text-gray-700 dark:text-gray-200"
                        >
                            Entry Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your journal entry here..."
                            rows="5"
                            className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        ></textarea>
                    </div>

                    <div>
                        <label
                            htmlFor="files"
                            className="block text-lg font-medium text-gray-700 dark:text-gray-200"
                        >
                            Upload Images (Max 5)
                        </label>
                        <input
                            type="file"
                            id="files"
                            multiple
                            name="journalImg"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm cursor-pointer"
                        />
                        {files.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 shadow-sm"
                                    >
                                        <span className="text-sm text-gray-700 dark:text-gray-100 truncate">
                                            {file.name}
                                        </span>
                                        <button
                                            type="button"
                                            className="text-red-500 dark:text-red-400 font-medium hover:underline text-sm"
                                            onClick={() => removeFile(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all"
                        >
                            Save Entry
                        </button>
                    </div>
                    <p className="text-center text-gray-400">*You won't be able to update or delete this entry later, the only option would be to delete the <span className="text-red-500">Trip Journal</span></p>
                </form>
            </div>
        </div>
    );
}

export default AddEntry;
1