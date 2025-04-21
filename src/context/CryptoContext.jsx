import React, { createContext, useState, useEffect, useContext } from 'react';

const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        const savedCurrency = localStorage.getItem('currency');
        return savedCurrency || 'USD';
    });

    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (coin) => {
        setFavorites((prevFavorites) => {
            // Check if already in favorites
            if (!prevFavorites.some(fav => fav.id === coin.id)) {
                return [...prevFavorites, coin];
            }
            return prevFavorites;
        });
    };

    const removeFavorite = (coinId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.filter(coin => coin.id !== coinId)
        );
    };

    const isFavorite = (coinId) => {
        return favorites.some(coin => coin.id === coinId);
    };

    return (
        <CryptoContext.Provider value={{
            currency,
            setCurrency,
            favorites,
            addFavorite,
            removeFavorite,
            isFavorite
        }}>
            {children}
        </CryptoContext.Provider>
    );
};

export const useCrypto = () => useContext(CryptoContext);




