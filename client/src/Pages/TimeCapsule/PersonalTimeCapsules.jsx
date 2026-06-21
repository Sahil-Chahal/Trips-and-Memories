import { useDispatch, useSelector } from "react-redux";
import { fetchUserTimeCapsulesThunk } from "../../Redux/Slices/timeCapsuleSlice";
import { useEffect } from "react";
import TimeCapsule from "../../Components/TimeCapsule/TimeCapsule";
import { Link } from "react-router-dom";
import BackButton from '../../Components/BackButton.jsx';

function PersonalTimeCapsules() {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state?.auth?.userData);


    const usersTimeCapsules = useSelector((state) => state?.timeCapsule?.usersTimeCapsules) || [];

    useEffect(() => {
        dispatch(fetchUserTimeCapsulesThunk());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10 px-4">
            <BackButton />
            <h1 className="text-center text-4xl font-bold text-gray-800 mb-8">
                <span className="text-blue-500">{userData?.name}'s</span> Time Capsules
            </h1>
            
            {usersTimeCapsules.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <p className="text-xl text-gray-600 font-medium mb-4">
                        You haven't created a Time Capsule yet.
                    </p>
                    <Link 
                        to="/time-capsules/create" 
                        className="text-lg text-white bg-blue-600 px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                    >
                        Create Now
                    </Link>
                </div>
            ) : (
                <div className="flex justify-center items-center gap-6 flex-wrap">
                    {usersTimeCapsules.map((ele, ind) => (
                        <TimeCapsule
                            key={ind}
                            imgSrc={ele?.memoryImg?.secure_url}
                            capsuleTitle={ele?.title}
                            capsuleOpenDate={ele?.openDate}
                            isUnlocked={ele?.isUnlocked}
                            capsuleId={ele?._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default PersonalTimeCapsules;
