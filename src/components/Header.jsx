import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCrypto } from '../context/CryptoContext';

const Header = () => {
    const location = useLocation();
    const { currency, setCurrency } = useCrypto();

    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        CryptoTracker
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="bg-white border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {currencies.map((curr) => (
                            <option key={curr} value={curr}>
                                {curr}
                            </option>
                        ))}
                    </select>

                    <nav className="flex items-center gap-4">
                        <Link
                            to="/"
                            className={`py-2 px-4 ${
                                location.pathname === '/'
                                    ? 'font-bold text-primary border-b-2 border-primary'
                                    : 'text-gray-600 hover:text-primary'
                            }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/favorites"
                            className={`py-2 px-4 ${
                                location.pathname === '/favorites'
                                    ? 'font-bold text-primary border-b-2 border-primary'
                                    : 'text-gray-600 hover:text-primary'
                            }`}
                        >
                            Favorites
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;