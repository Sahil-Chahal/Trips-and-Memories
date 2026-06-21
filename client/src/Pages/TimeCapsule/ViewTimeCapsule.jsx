import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTimeCapsuleDetailsThunk } from '../../Redux/Slices/timeCapsuleSlice';
import DeleteTimeCapsule from '../../Components/TimeCapsule/DeleteTimeCapsule';

function ViewTimeCapsule({ title, description, memoryText, memoryImg, memoryDescription, openDate }) {
    const { capsuleId } = useParams();
    const dispatch = useDispatch();
    const [capsuleDetails, setCapsuleDetails] = useState({});

    async function fetchDetails() {
        const res = await dispatch(fetchTimeCapsuleDetailsThunk({ capsuleId }));
        setCapsuleDetails(res?.payload?.data);
        console.log("Capsule Details : ", res);
    }

    function formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    useEffect(() => {
        fetchDetails();
    }, []);

    return (
        <div className="p-8 max-w-5xl h-screen mx-auto bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-lg transition duration-300 ease-in-out">
            {/* Title Section */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">{capsuleDetails?.title || 'Time Capsule'}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">{capsuleDetails?.description}</p>
            </div>

            {/* Image Section */}
            {capsuleDetails?.memoryImg && (
                <div className="relative mb-8">
                    <img
                        src={capsuleDetails?.memoryImg?.secure_url}
                        alt="Memory"
                        className="w-full h-72 object-cover rounded-lg shadow-md border border-gray-300 dark:border-gray-700"
                    />
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white w-full p-4 rounded-b-lg">
                        <p className="text-sm font-light">{capsuleDetails?.memoryDescription}</p>
                    </div>
                </div>
            )}

            {/* Memory Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Memory</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {capsuleDetails?.memoryText || "No memory text available."}
                </p>
            </div>

            {/* Date Details Section */}
            <div className="text-center space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Date Created:</span> {formatDate(capsuleDetails?.createdAt) || "N/A"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Open Date:</span> {formatDate(capsuleDetails?.openDate) || "N/A"}
                </p>
            </div>
            <DeleteTimeCapsule capsuleId={capsuleId}/>
        </div>
    );
}

export default ViewTimeCapsule;
