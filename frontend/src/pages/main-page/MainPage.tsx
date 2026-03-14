import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { SignupForm } from './components/SignupForm';
import { checkAuth } from '../../utils/tokenAuth';
import { SheetDataEntries } from './components/sheetDataEntries';
import { Notification } from './components/Notification';

export const MainPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth().isAuthenticated);
    const [user, setUser] = useState(() => checkAuth().user);
    const [_loading, _setLoading] = useState(false);

    // Signup form state.
    const [formData, setFormData] = useState<{
        sheetUrl: string;
        sheetName: string;
        frequency: string;
        isEdit: boolean;
        id?: string | number;
    }>({
        sheetUrl: '',
        sheetName: '',
        frequency: 'weekly',
        isEdit: false,
        id: undefined,
    });

    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
        visible: boolean;
    }>({ message: '', type: 'success', visible: false });

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type, visible: true });

        // Auto-hide after 3 seconds
        setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    // Handle auth state across components.
    const handleAuthSuccess = () => {
        const authState = checkAuth();
        setIsAuthenticated(authState.isAuthenticated);
        setUser(authState.user);
    };

    // Function to populate form for editing.
    const handleEditSheet = (sheet: { id: string | number; link: string; sheet_name: string; frequency: string }) => {
        setFormData({
            sheetUrl: sheet.link,
            sheetName: sheet.sheet_name,
            frequency: sheet.frequency.toLowerCase(),
            isEdit: true,
            id: sheet.id
        });
    };

    // Unauthenticated user view (landing page).
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">

            {/* Notification */}
            <Notification
                message={notification.message}
                type={notification.type}
                visible={notification.visible}
                onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
            />

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
                <SignupForm showNotification={showNotification} formData={formData} setFormData={setFormData} />
            </div>
        </div>
    );
};