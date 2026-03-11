import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { SignupForm } from './components/SignupForm';

export const MainPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
            {/* Navigation */}
            <Navigation />
            
            {/* Main Content */}
            <div className="flex min-h-screen">
                {/* Hero Section - Left Side */}
                <HeroSection />
                
                {/* Signup Form - Right Side */}
                <SignupForm />
            </div>
        </div>
    );
};