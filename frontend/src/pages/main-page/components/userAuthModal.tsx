import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createUser, loginUser } from '../../../hooks/userHooks';

export const UserAuthModal = ({
    isOpen,
    setIsOpen,
    onAuthSuccess
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onAuthSuccess?: () => void;
}) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const closeModal = () => {
        setIsOpen(false);
        setEmail('');
        setPassword('');
        setError('');
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                await createUser(email, password);
            }
            else {
                await loginUser(email, password);
            }
            closeModal();
            onAuthSuccess?.();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                >
                    <motion.div
                        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                {isSignUp ? 'Join the automation revolution' : 'Sign in to continue'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all duration-300"
                            >
                                {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 dark:text-gray-300">
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            </p>
                            <button
                                onClick={toggleMode}
                                className="text-indigo-500 hover:text-indigo-600 font-medium"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </div>

                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors text-xl font-bold"
                        >
                            ×
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};