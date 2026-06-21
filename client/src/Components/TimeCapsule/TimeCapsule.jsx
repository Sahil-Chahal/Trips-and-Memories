import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineLockClock } from "react-icons/md";
import { GoUnlock } from "react-icons/go";
import { Link } from "react-router-dom";
import DeleteTimeCapsule from "./DeleteTimeCapsule";

function TimeCapsule({ capsuleId, imgSrc, capsuleTitle, capsuleOpenDate, isUnlocked }) {
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

    function calculateTimeLeft() {
        const now = new Date().getTime();
        const midnight = new Date(capsuleOpenDate);
        midnight.setHours(0, 0, 0, 0);
        const diff = Math.max(0, midnight - now);

        if (diff <= 0) {
            setIsTimeUp(true);
            return 0;
        }

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
    }

    function formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [capsuleOpenDate]);

    return (
        <div className="relative border border-solid border-gray-300 shadow-lg rounded-3xl w-[350px] bg-gradient-to-r from-gray-100 to-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
            

            <section className="relative h-52 w-full rounded-t-3xl overflow-hidden">
                <img
                    src={imgSrc || "https://dummyimage.com/600x400/000/fff"}
                    alt="Memory Capsule"
                    className="h-full w-full object-cover"
                />
                {!isTimeUp && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-500 text-white font-bold text-lg">
                        {timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0 ? (
                            <p className="text-4xl">
                                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                            </p>
                        ) : null}
                    </div>
                )}
            </section>


            <section className="p-6 flex flex-col items-center gap-4">
                <p className="text-xl font-semibold text-gray-800 text-center">
                    {capsuleTitle || "Time Capsule"}
                </p>
                <div className="flex items-center flex-row justify-around gap-8 text-gray-600 w-full">
                    {
                        isUnlocked ? (
                            <GoUnlock className="text-5xl text-blue-500" />
                        ) : (
                            <MdOutlineLockClock className="text-5xl text-red-500" />
                        )
                    }
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{formatDate(capsuleOpenDate) || "12-Dec-2024"}</p>
                        <FaCalendarAlt className="text-lg text-gray-500" />
                    </div>
                </div>
                {isUnlocked && (
                    <p className="text-sm text-green-500 font-medium">This capsule is unlocked!</p>
                )}
                {isTimeUp && (
                    <>
                        <Link
                            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
                            to ={`/time-capsules/view/${capsuleId}`}
                        >
                            Relive Memory
                        </Link>
                    </>
                )}
                <DeleteTimeCapsule capsuleId={capsuleId}/>
                {!isTimeUp && (
                    <p className="mt-4 px-6 py-2 text-red-500 text-center text-lg">
                        This capsule is yet to be unlocked
                    </p>
                )}
            </section>
        </div>
    );
}

export default TimeCapsule;
