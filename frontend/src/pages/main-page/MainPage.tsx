import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { SignupForm } from './components/SignupForm';
import { checkAuth } from '../../utils/tokenAuth';
import { SheetDataEntries } from './components/sheetDataEntries';

export const MainPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth().isAuthenticated);
    const [user, setUser] = useState(() => checkAuth().user);
    const [_loading, _setLoading] = useState(false);

    // Signup form state
    const [formData, setFormData] = useState({
        sheetUrl: '',
        sheetName: '',
        frequency: 'weekly'
    });

    const handleAuthSuccess = () => {
        const authState = checkAuth();
        setIsAuthenticated(authState.isAuthenticated);
        setUser(authState.user);
    };

    // Function to populate form for editing
    const handleEditSheet = (sheet: { link: string; sheet_name: string; frequency: string }) => {
        setFormData({
            sheetUrl: sheet.link,
            sheetName: sheet.sheet_name,
            frequency: sheet.frequency.toLowerCase()
        });
    };

    // Unauthenticated user view (landing page)
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
            {/* Navigation */}
            <Navigation onAuthSuccess={handleAuthSuccess} />

            {/* Main Content */}
            <div className="flex min-h-screen">
                {isAuthenticated && user ? (
                    <SheetDataEntries onEditSheet={handleEditSheet} />
                ) : (
                    <>
                        {/* Hero Section - Left Side */}
                        <HeroSection />
                    </>
                )}
                {/* Signup Form - Right Side */}
                <SignupForm formData={formData} setFormData={setFormData}/>
            </div>
        </div>
    );
};