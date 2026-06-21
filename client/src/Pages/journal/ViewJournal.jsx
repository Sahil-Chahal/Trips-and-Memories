import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import JournalEntry from "../../Components/journal/JournalEntry";
import { fetchTripJournalEntriesThunk } from "../../Redux/Slices/tripJournalSlice.js";
import AddTripStory from "../../Components/journal/AddTripStory.jsx";
import NavigationLayout from "../../Layouts/NavigationLayout.jsx";


function ViewJournal() {
    const { journalId } = useParams();
    const dispatch = useDispatch();
    const journalsEntries = useSelector((state) => state?.tripJournal?.journalsEntries) || [];
    const userData = useSelector((state) => state?.auth?.userData);
    const aiGeneratedStory = journalsEntries?.aiGeneratedStory || "";

    async function fetchJournalEntries() {
        const res = await dispatch(fetchTripJournalEntriesThunk({ journalId }));
        console.log("Response for journal entries : ", res);
    }

    useEffect(() => {
        fetchJournalEntries();
        console.log("Journal entries : ", journalsEntries);
    }, []);

    return (
        <NavigationLayout>
            <section className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 md:p-12">
                {/* Header */}
                <h1 className="text-center font-serif text-4xl text-gray-800 dark:text-gray-100 mb-8">
                    Journal Entries
                </h1>

                {/* AI-Generated Story Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                        AI-Generated Story
                    </h2>
                    {aiGeneratedStory ? (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-md">
                            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                {aiGeneratedStory}
                            </p>
                            <AddTripStory journalId={journalId} />
                        </div>
                    ) : (
                        <AddTripStory journalId={journalId} />
                    )}
                </div>

                {/* Journal Entries Section */}
                {journalsEntries.entries?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {journalsEntries.entries.map((entry, index) => (
                            <JournalEntry
                                key={index}
                                entryContributor={entry.contributor.username}
                                entryContributorAvatar={entry?.contributor?.avatar?.secure_url}
                                entryContent={entry.content}
                                entryDate={entry.date}
                                entryImages={entry.images}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 italic text-lg">
                        This journal currently has no entries yet.
                    </p>
                )}

                {/* Manage Contributors Link */}
                {userData?._id === journalsEntries?.createdBy && (
                    <Link
                        to={`/manage-contributors/${journalId}`}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 text-center text-lg underline block mt-8 transition-all duration-300"
                    >
                        Manage Contributors
                    </Link>
                )}
            </section>

        </NavigationLayout>
    );
}

export default ViewJournal;
