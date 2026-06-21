import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <section className="flex flex-col items-center gap-6 p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg text-center">
                <h1 className="text-6xl font-bold text-gray-800 dark:text-white">404</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    Oops! The page you are looking for doesn't exist.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="py-2 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 transition duration-300"
                    >
                        Go Back
                    </button>
                    <Link
                        to="/"
                        className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300"
                    >
                        Home Page
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default NotFound;
