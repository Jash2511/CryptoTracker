import React, { useState, useEffect } from 'react';
import { getTopCoins } from '../services/api';
import { useCrypto } from '../context/CryptoContext';
import CoinList from '../components/CoinList';

const Dashboard = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currency } = useCrypto();

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                setLoading(true);
                const data = await getTopCoins(currency);
                setCoins(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch cryptocurrency data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCoins();

        const interval = setInterval(fetchCoins, 60000);

        return () => clearInterval(interval);
    }, [currency]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">Cryptocurrency Market</h1>
            <CoinList coins={coins} />
        </div>
    );
};

export default Dashboard;