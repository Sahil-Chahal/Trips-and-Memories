import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { provideRecommendationsThunk } from "../../Redux/Slices/recommSlice";
import { useNavigate } from "react-router-dom";
import MemoryCard from "../../Components/Memory/MemoryCard";
import BackButton from "../../Components/BackButton";

function TripsRecomm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function fetchTripsRecomm() {
        const res = await dispatch(provideRecommendationsThunk());
        if (res.payload?.length === 0) {
            navigate("/");
        }
    }

    useEffect(() => {
        fetchTripsRecomm();
    }, []);

    const tripsRecommendations = useSelector((state) => state?.recomm?.tripRecommendations) || [];

    return (
        <div className="dark:bg-gray-900 h-screen flex flex-col items-center px-4 py-6 space-y-6">
            <BackButton />
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                Trips Recommendations
            </h1>
            <section className="grid gap-4 w-full max-w-screen-lg sm:grid-cols-2 lg:grid-cols-3">
                {tripsRecommendations.length > 0 ? (
                    tripsRecommendations.map((ele, index) => (
                        <MemoryCard key={index} memory={ele} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No recommendations available.
                    </p>
                )}
            </section>
        </div>
    );
}

export default TripsRecomm;
