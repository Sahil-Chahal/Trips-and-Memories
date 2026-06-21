import React from "react";
// import BackButton from "../../Components/BackButton";

function JournalEntry({ entryContributor, entryContributorAvatar, entryContent, entryDate, entryImages }) {
  // Format the entry date to be user-friendly
    function formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    return (
        <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200 dark:border-gray-700">
            {/* <BackButton/> */}
            <header className="border-b border-gray-300 dark:border-gray-600 pb-4 mb-6">
                <div className="flex flex-row justify-start items-center gap-2">
                    <img src={entryContributorAvatar} className="h-[40px] rounded-full " alt="" />
                    <h2 className="text-2xl font-serif text-blue-700 dark:text-gray-300 tracking-wide">
                        {entryContributor || "Anonymous Contributor"}
                    </h2>
                </div>
                <time className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(entryDate)}
                </time>
            </header>


            <article className="mb-6">
                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-sans">
                {entryContent || "No content available for this journal entry. Start adding your thoughts or memories here!"}
                </p>
            </article>


            {entryImages && entryImages.length > 0 && (
                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-3">
                        Attached Memories
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {entryImages.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                            src={image.secure_url}
                            alt={`Memory ${index + 1}`}
                            className="w-full h-36 object-cover rounded-md shadow-md hover:scale-105 transform transition-transform"
                            />
                        </div>
                        ))}
                    </div>
                </div>
            )}


            <footer className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 italic">
                <p>
                This journal entry is part of your <span className="font-medium text-blue-500 dark:text-blue-400">Journal</span> collection. Add more entries to preserve your adventures.
                </p>
            </footer>
        </section>
    );
}

export default JournalEntry;
