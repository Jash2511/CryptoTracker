import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CryptoProvider } from '../context/CryptoContext.jsx';
import Header from '../components/Header.jsx';


import Dashboard from './Dashboard.jsx';
import Favorites from './Favorites.jsx';


const CoinDetail = lazy(() => import('./CoinDetail.jsx'));
const NotFound = lazy(() => import('./NotFound.jsx'));

function App() {
    return (
        <CryptoProvider>
            <Router>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow container mx-auto px-4 py-8">
                        <Suspense fallback={
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        }>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/favorites" element={<Favorites />} />
                                <Route path="/coin/:id" element={<CoinDetail />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </main>
                    <footer className="bg-white border-t py-4">
                        <div className="container mx-auto px-4 text-center text-gray-500">
                            <p>© {new Date().getFullYear()} CryptoTracker. All rights reserved.</p>
                        </div>
                    </footer>
                </div>
            </Router>
        </CryptoProvider>
    );
}

export default App;