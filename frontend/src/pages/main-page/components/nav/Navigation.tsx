import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAuthModal } from './components/userAuthModal';
import { logout } from '../../../../utils/tokenAuth';
import { Features } from './components/Features';

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
    const [showFeaturesModal, setShowFeaturesModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        if (onAuthSuccess) {
            onAuthSuccess();
        }
        setMobileMenuOpen(false);
    };

    return (
        <>
            <motion.nav
                className="fixed top-0 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 z-50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="w-full px-4 sm:px-6 py-3 flex justify-between items-center">
                    {/* Left - Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                            ScriptSums
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    {isAuthenticated && user ? (
                        <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <button onClick={() => setShowFeaturesModal(true)} className="hover:text-indigo-600 transition-colors">Features</button>
                            {/* <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a> */}
                            <a 
                                href="https://docs.google.com/forms/d/e/1FAIpQLSeeFqZeGf8sAZgIa0rvOVO4u_OY0BBcBIF-trckV0heVyIYBg/viewform?usp=dialog" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                Leave Some Feedback!
                            </a>
                            <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                                {user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <button onClick={() => setShowFeaturesModal(true)} className="hover:text-indigo-600 transition-colors">Features</button>
                            {/* <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a> */}
                            <a 
                                href="https://docs.google.com/forms/d/e/1FAIpQLSeeFqZeGf8sAZgIa0rvOVO4u_OY0BBcBIF-trckV0heVyIYBg/viewform?usp=dialog" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                Leave Some Feedback!
                            </a>
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                            >
                                Sign In
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50"
                        >
                            <div className="px-4 py-4 space-y-3">
                                <button
                                    onClick={() => {
                                        setShowFeaturesModal(true);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors py-2"
                                >
                                    Features
                                </button>
                                {/* <a href="#" className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors py-2">
                                    Pricing
                                </a> */}
                                <a 
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSeeFqZeGf8sAZgIa0rvOVO4u_OY0BBcBIF-trckV0heVyIYBg/viewform?usp=dialog" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Leave Some Feedback!
                                </a>
                                {isAuthenticated && user ? (
                                    <>
                                        <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                                            <span className="block text-gray-700 dark:text-gray-200 text-sm font-medium py-2">
                                                {user.email}
                                            </span>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg hover:shadow-lg transition-all text-sm mt-2"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setShowAuthModal(true);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all text-sm mt-2"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <UserAuthModal
                isOpen={showAuthModal}
                setIsOpen={setShowAuthModal}
                onAuthSuccess={onAuthSuccess}
            />

            <Features
                isOpen={showFeaturesModal}
                setIsOpen={setShowFeaturesModal}
            />
        </>
    );
};