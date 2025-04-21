import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCrypto } from '../context/CryptoContext';

const CoinList = ({ coins }) => {
    const { currency, addFavorite, removeFavorite, isFavorite } = useCrypto();
    const [search, setSearch] = useState('');

    const filteredCoins = coins.filter(
        (coin) =>
            coin.name.toLowerCase().includes(search.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const formatPercent = (percent) => {
        return percent?.toFixed(2) + '%';
    };

    return (
        <div className="w-full">
            <div className="mb-6 w-full max-w-md mx-auto">
                <input
                    type="text"
                    placeholder="Search coins..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                        <th className="py-3 px-6 text-left">Coin</th>
                        <th className="py-3 px-6 text-right">Price</th>
                        <th className="py-3 px-6 text-right">24h Change</th>
                        <th className="py-3 px-6 text-right">Market Cap</th>
                        <th className="py-3 px-6 text-center">Favorite</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                    {filteredCoins.map((coin) => {
                        const priceChangeClass = coin.price_change_percentage_24h >= 0
                            ? 'text-green-500'
                            : 'text-red-500';
                        const isFavorited = isFavorite(coin.id);

                        return (
                            <tr key={coin.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 whitespace-nowrap">
                                    <Link to={`/coin/${coin.id}`} className="flex items-center">
                                        <img
                                            src={coin.image}
                                            alt={coin.name}
                                            className="w-8 h-8 mr-3"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{coin.name}</span>
                                            <span className="text-xs text-gray-500 uppercase">{coin.symbol}</span>
                                        </div>
                                    </Link>
                                </td>
                                <td className="py-3 px-6 text-right">
                                    {formatPrice(coin.current_price)}
                                </td>
                                <td className={`py-3 px-6 text-right ${priceChangeClass}`}>
                                    {formatPercent(coin.price_change_percentage_24h)}
                                </td>
                                <td className="py-3 px-6 text-right">
                                    {formatPrice(coin.market_cap)}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <button
                                        onClick={() => {
                                            isFavorited
                                                ? removeFavorite(coin.id)
                                                : addFavorite(coin);
                                        }}
                                        className="transform hover:scale-110 transition-transform"
                                        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        {isFavorited ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {filteredCoins.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                        No coins found matching "{search}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoinList;