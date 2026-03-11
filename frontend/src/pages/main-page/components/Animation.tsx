import { motion } from 'framer-motion';

export const Animation = () => {
    return (
        <div className="flex items-center justify-center w-full h-24 pt-24">
            <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Animated idea lines/sparks */}
                <svg
                    className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-32"
                    viewBox="0 0 160 120"
                    fill="none"
                >
                    {/* Center vertical line */}
                    <motion.path
                        d="M80 80 L80 20"
                        stroke="url(#gradient1)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0.7, 1, 0] }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
                    />

                    {/* Left diagonal lines */}
                    <motion.path
                        d="M80 80 L50 30"
                        stroke="url(#gradient2)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0.7, 1, 0] }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.7 }}
                    />

                    <motion.path
                        d="M80 80 L30 50"
                        stroke="url(#gradient3)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0.7, 1, 0] }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.9 }}
                    />

                    {/* Right diagonal lines */}
                    <motion.path
                        d="M80 80 L110 30"
                        stroke="url(#gradient4)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0.7, 1, 0] }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.1 }}
                    />

                    <motion.path
                        d="M80 80 L130 50"
                        stroke="url(#gradient5)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0.7, 1, 0] }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.3 }}
                    />

                    {/* Curved lines for more organic feel */}
                    <motion.path
                        d="M80 80 Q60 60 40 20"
                        stroke="url(#gradient6)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0.7, 1, 0] }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5 }}
                    />

                    <motion.path
                        d="M80 80 Q100 60 120 20"
                        stroke="url(#gradient7)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0.7, 1, 0] }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.7 }}
                    />

                    {/* Updated gradient definitions to match HeroSection colors */}
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#0891b2" />
                        </linearGradient>
                        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                        <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Floating particles/sparkles - updated colors */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-indigo-400 rounded-full"
                        style={{
                            top: `${-60 + 1 * 40}px`,
                            left: `${60 + 1 * 80}px`,
                        }}
                        animate={{
                            y: [0, -15, 0],
                            x: [0, 2 * 8 - 4, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2 + 2 * 1.5,
                            repeat: Infinity,
                            delay: 2 * 2,
                        }}
                    />
                ))}

                {/* The Head - updated colors to match theme */}
                <motion.div
                    initial={{ scale: 0.8, y: 10 }}
                    animate={{
                        scale: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-800 dark:to-purple-900 shadow-xl border-3 border-white/30"
                >
                    {/* Face features */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {/* Eyes */}
                        <div className="flex space-x-3 mb-1">
                            <motion.div
                                className="w-2.5 h-2.5 bg-gray-700 dark:bg-gray-300 rounded-full"
                                animate={{ scaleY: [1, 0.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                            />
                            <motion.div
                                className="w-2.5 h-2.5 bg-gray-700 dark:bg-gray-300 rounded-full"
                                animate={{ scaleY: [1, 0.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                            />
                        </div>

                        {/* Mouth - excited expression */}
                        <motion.div
                            className="w-5 h-2.5 border-2 border-gray-700 dark:border-gray-300 border-t-0 rounded-b-full"
                            animate={{ scaleX: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        />
                    </div>

                    {/* Glow effect - updated color */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-indigo-400/20"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>

                {/* Pulsing ring around head - updated color */}
                <motion.div
                    className="absolute inset-0 w-24 h-24 rounded-full border-2 border-indigo-400/40"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 0.1, 0.6]
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                />
            </motion.div>
        </div>
    );
};