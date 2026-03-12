import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { SignupForm } from './components/SignupForm';
import { checkAuth } from '../../utils/tokenAuth';
import { SheetDataEntries } from './components/sheetDataEntries';

export const MainPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth().isAuthenticated);
    const [user, setUser] = useState(() => checkAuth().user);
    const [loading, _setLoading] = useState(false);

    const handleAuthSuccess = () => {
        const authState = checkAuth();
        setIsAuthenticated(authState.isAuthenticated);
        setUser(authState.user);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-300">Loading...</div>
            </div>
        );
    }

    // Unauthenticated user view (landing page)
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
            {/* Navigation */}
            <Navigation onAuthSuccess={handleAuthSuccess} />

            {/* Main Content */}
            <div className="flex min-h-screen">
                {isAuthenticated && user ? (
                    <SheetDataEntries />
                ) : (
                    <>
                        {/* Hero Section - Left Side */}
                        <HeroSection />
                    </>
                )}
                {/* Signup Form - Right Side */}
                <SignupForm />
            </div>
        </div>
    );
};