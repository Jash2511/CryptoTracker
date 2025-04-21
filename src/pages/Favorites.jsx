import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import CoinList from '../components/CoinList';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const { favorites } = useCrypto();

    if (favorites.length === 0) {
        return (
            <div className="text-center py-10">
                <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p className="text-gray-600 mb-6">You haven't added any cryptocurrencies to your favorites yet.</p>
                    <Link to="/" className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 inline-block">
                        Browse Coins
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">Your Favorites</h1>
            <CoinList coins={favorites} />
        </div>
    );
};

export default Favorites;