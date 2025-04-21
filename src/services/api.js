import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Create axios instance with base URL
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptors for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);

        // Check for rate limiting (429)
        if (error.response && error.response.status === 429) {
            console.error('Rate limit exceeded. Please try again later.');
        }

        return Promise.reject(error);
    }
);

export const getTopCoins = async (currency = 'usd') => {
    try {
        const response = await api.get('/coins/markets', {
            params: {
                vs_currency: currency.toLowerCase(),
                order: 'market_cap_desc',
                per_page: 50,
                page: 1,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching top coins:', error);
        throw error;
    }
};

export const getCoinDetails = async (coinId, currency = 'usd') => {
    try {
        const response = await api.get(`/coins/${coinId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for ${coinId}:`, error);
        throw error;
    }
};

export const getCoinMarketChart = async (coinId, currency = 'usd', days = 7) => {
    try {
        const response = await api.get(`/coins/${coinId}/market_chart`, {
            params: {
                vs_currency: currency.toLowerCase(),
                days: days,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching market chart for ${coinId}:`, error);
        throw error;
    }
};