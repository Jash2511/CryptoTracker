import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
                Oops! The coin or page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
                Back to Dashboard
            </Link>
        </div>
    );
};

export default NotFound;