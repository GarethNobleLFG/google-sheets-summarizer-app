import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserAuthModal } from './userAuthModal';
import { logout } from '../../../utils/tokenAuth';

export const Navigation = ({
    onAuthSuccess,
    isAuthenticated = false,
    user
}: {
    onAuthSuccess?: () => void;
    isAuthenticated?: boolean;
    user?: { id: number; email: string; } | null;
}) => {
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleLogout = () => {
        logout();
        if (onAuthSuccess) {
            onAuthSuccess();
        }
    };

    return (
        <>
            <motion.nav
                className="fixed top-0 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 z-50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="w-full px-6 py-3 flex justify-between items-center">
                    {/* Left - Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                            Clarus
                        </span>
                    </div>

                    {/* Center - Welcome Message (only when authenticated) */}
                    {isAuthenticated && user && (
                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                                {user.email}
                            </span>
                        </div>
                    )}

                    {/* Right - Navigation Items */}
                    {isAuthenticated && user ? (
                        <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                            >
                                Sign In
                            </button>
                        </div>
                    )}
                </div>
            </motion.nav>

            <UserAuthModal
                isOpen={showAuthModal}
                setIsOpen={setShowAuthModal}
                onAuthSuccess={onAuthSuccess}
            />
        </>
    );
};