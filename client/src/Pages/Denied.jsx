import React, { useEffect, useState } from 'react';
import { FiLock } from "react-icons/fi";

function Denied() {
    const [isDarkMode, setIsDarkMode] = useState(false);

  
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
            <div className="max-w-lg text-center space-y-6">
                <div className="flex justify-center">
                    <FiLock className="text-6xl text-red-500 dark:text-red-400 animate-pulse" />
                </div>
                <h1 className="text-5xl font-extrabold tracking-wide">
                Access Denied
                </h1>
                <p className="text-lg font-medium">
                    Oops! It seems like you don’t have the required permissions to view this page.
                </p>
                <a
                    href="/"
                    className="inline-block px-8 py-3 mt-4 rounded-full bg-blue-500 dark:bg-blue-700 text-white font-semibold hover:bg-blue-600 dark:hover:bg-blue-800 transition-all transform hover:scale-105"
                >
                    Return to Homepage
                </a>
            </div>
        </div>
    );
}

export default Denied;
