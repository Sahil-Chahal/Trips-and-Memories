import { useDispatch, useSelector } from "react-redux";
import { fetchUserTripJournalsThunk } from "../../Redux/Slices/tripJournalSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import TripJournal from "../../Components/journal/TripJournal";
import NavigationLayput from "../../Layouts/NavigationLayout";
// import BackButton from "../../Components/BackButton";

function MyJournals() {
    const dispatch = useDispatch();

    async function fetchMyJournals() {
        const res = await dispatch(fetchUserTripJournalsThunk());
        console.log("Users trips journals: ", res);
    }

    useEffect(() => {
        fetchMyJournals();
        console.log("Users journals array: ", usersJournals);
    }, []);

    const usersJournals = useSelector((state) => state?.tripJournal?.usersJournals);

    console.log("----->>", usersJournals);

    return (
        <NavigationLayput>
            <section className="dark:bg-gray-900 dark:text-white min-h-screen py-8 px-4">
                {/* <BackButton /> */}
                {usersJournals.length > 0 ? (
                    <div className="">
                        {usersJournals?.map((ele) => (
                            <TripJournal
                                key={ele?._id}
                                journalOpen={ele?.status === "open"}
                                createdBy={ele?.createdBy}
                                journalTitle={ele?.title}
                                journalDesc={ele?.description}
                                journalEntries={ele?.entries?.length}
                                journalId={ele?._id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-full gap-6">
                        <p className="text-center text-4xl font-semibold dark:text-gray-300 animate-pulse">
                            You don't have any trip journals yet!
                        </p>
                        <Link
                            to="/create-journal"
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-3 text-lg font-medium dark:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 ease-in-out shadow-lg dark:shadow-blue-900"
                        >
                            Create Journal
                        </Link>
                    </div>
                )}
            </section>
        </NavigationLayput>
    );
}

export default MyJournals;
