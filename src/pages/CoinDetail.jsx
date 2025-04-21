import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getCoinDetails, getCoinMarketChart } from '../services/api';
import { useCrypto } from '../context/CryptoContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CoinDetail = () => {
    const { id } = useParams();
    const { currency, addFavorite, removeFavorite, isFavorite } = useCrypto();

    const [coin, setCoin] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState(7);

    const favorited = coin ? isFavorite(coin.id) : false;

    useEffect(() => {
        const fetchCoinData = async () => {
            try {
                setLoading(true);
                const coinData = await getCoinDetails(id);
                setCoin(coinData);

                const marketData = await getCoinMarketChart(id, currency, timeframe);
                prepareChartData(marketData.prices);

                setError(null);
            } catch (err) {
                setError('Failed to fetch cryptocurrency data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCoinData();
    }, [id, currency, timeframe]);

    const prepareChartData = (priceData) => {
        const labels = priceData.map(price => {
            const date = new Date(price[0]);
            return date.toLocaleDateString();
        });

        const data = priceData.map(price => price[1]);

        const gradient = document.createElement('canvas').getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

        setChartData({
            labels,
            datasets: [
                {
                    label: `Price in ${currency}`,
                    data,
                    fill: true,
                    backgroundColor: gradient,
                    borderColor: '#3B82F6',
                    tension: 0.1,
                    pointRadius: 2,
                    pointBackgroundColor: '#3B82F6',
                }
            ]
        });
    };

    const toggleFavorite = () => {
        if (favorited) {
            removeFavorite(coin.id);
        } else {
            addFavorite({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                image: coin.image.small,
                current_price: coin.market_data.current_price[currency.toLowerCase()],
                price_change_percentage_24h: coin.market_data.price_change_percentage_24h,
                market_cap: coin.market_data.market_cap[currency.toLowerCase()]
            });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const formatPercent = (percent) => {
        return percent?.toFixed(2) + '%';
    };

    const formatMarketCap = (marketCap) => {
        if (marketCap > 1e12) {
            return `${(marketCap / 1e12).toFixed(2)} T`;
        } else if (marketCap > 1e9) {
            return `${(marketCap / 1e9).toFixed(2)} B`;
        } else if (marketCap > 1e6) {
            return `${(marketCap / 1e6).toFixed(2)} M`;
        } else {
            return formatPrice(marketCap);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !coin) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error || 'Coin not found'}</span>
                <Link to="/" className="block mt-4 text-blue-700 underline">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    const priceChangeClass = coin.market_data.price_change_percentage_24h >= 0
        ? 'text-green-500'
        : 'text-red-500';

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center">
                    <img
                        src={coin.image.small}
                        alt={coin.name}
                        className="w-16 h-16 mr-4"
                    />
                    <div>
                        <h1 className="text-3xl font-bold flex items-center">
                            {coin.name}
                            <span className="text-gray-500 text-lg ml-2">({coin.symbol.toUpperCase()})</span>
                            <span className="ml-2 text-sm px-2 py-1 bg-gray-200 rounded-md">
                Rank #{coin.market_cap_rank}
              </span>
                        </h1>
                    </div>
                </div>

                <button
                    onClick={toggleFavorite}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        favorited
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                >
                    {favorited ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Remove from Favorites
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Add to Favorites
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">Price</h3>
                    <p className="text-2xl font-bold">
                        {formatPrice(coin.market_data.current_price[currency.toLowerCase()])}
                    </p>
                    <p className={`${priceChangeClass} font-medium`}>
                        {formatPercent(coin.market_data.price_change_percentage_24h)}
                        <span className="text-gray-500 text-sm"> (24h)</span>
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">Market Cap</h3>
                    <p className="text-2xl font-bold">
                        {formatMarketCap(coin.market_data.market_cap[currency.toLowerCase()])}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">Volume (24h)</h3>
                    <p className="text-2xl font-bold">
                        {formatMarketCap(coin.market_data.total_volume[currency.toLowerCase()])}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Price Chart</h2>
                    <div className="space-x-2">
                        {[1, 7, 30, 90].map((days) => (
                            <button
                                key={days}
                                onClick={() => setTimeframe(days)}
                                className={`px-4 py-1 text-sm rounded-full ${
                                    timeframe === days
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {days === 1 ? '1D' : days === 7 ? '1W' : days === 30 ? '1M' : '3M'}
                            </button>
                        ))}
                    </div>
                </div>

                {chartData && (
                    <div className="h-80">
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                interaction: {
                                    intersect: false,
                                    mode: 'index',
                                },
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                return formatPrice(context.raw);
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            display: false,
                                        },
                                        ticks: {
                                            maxTicksLimit: 7,
                                        }
                                    },
                                    y: {
                                        position: 'right',
                                        ticks: {
                                            callback: function(value) {
                                                return formatPrice(value);
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Market Stats</h2>
                    <ul className="space-y-3">
                        <li className="flex justify-between">
                            <span className="text-gray-500">All Time High</span>
                            <span className="font-medium">{formatPrice(coin.market_data.ath[currency.toLowerCase()])}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-500">All Time Low</span>
                            <span className="font-medium">{formatPrice(coin.market_data.atl[currency.toLowerCase()])}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-500">Circulating Supply</span>
                            <span className="font-medium">
                {coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
              </span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-500">Max Supply</span>
                            <span className="font-medium">
                {coin.market_data.max_supply
                    ? `${coin.market_data.max_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`
                    : "∞"}
              </span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">About</h2>
                    <div
                        className="prose max-w-none text-gray-600"
                        dangerouslySetInnerHTML={{ __html: coin.description.en.split(". ").slice(0, 3).join(". ") + "." }}
                    />
                    {coin.links && coin.links.homepage[0] && (
                        <a
                            href={coin.links.homepage[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-blue-700 flex items-center mt-4"
                        >
                            Visit Official Website
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoinDetail;