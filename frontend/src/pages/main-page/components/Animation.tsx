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

                {/* The Head - Simple fun design with thick outline */}
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
                    className="relative w-24 h-24 rounded-full bg-white dark:bg-gray-100 border-4 border-gray-600 dark:border-gray-500 shadow-lg z-10"
                >
                    {/* Simple fun face features */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {/* Eyes - simple dots */}
                        <div className="flex space-x-3 mb-2">
                            <motion.div
                                className="w-3 h-3 bg-gray-600 dark:bg-gray-700 rounded-full"
                                animate={{ scaleY: [1, 0.2, 1] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                            />
                            <motion.div
                                className="w-3 h-3 bg-gray-600 dark:bg-gray-700 rounded-full"
                                animate={{ scaleY: [1, 0.2, 1] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                            />
                        </div>

                        {/* Mouth - happy curve */}
                        <motion.div
                            className="w-6 h-3 border-b-4 border-gray-600 dark:border-gray-700 rounded-b-full"
                            animate={{ scaleX: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        />
                    </div>
                </motion.div>

                {/* Saturn Ring 1 - Far top right */}
                <motion.div
                    className="absolute -top-8 -right-12 w-20 h-6 border-2 border-indigo-400/70 rounded-full"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                />

                {/* Saturn Ring 2 - Far left side */}
                <motion.div
                    className="absolute top-1/2 -left-16 w-24 h-5 border-2 border-purple-400/60 rounded-full"
                    style={{ transform: "translateY(-50%) rotate(30deg)" }}
                    animate={{ rotate: [0, 360] }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                />

                {/* Saturn Ring 3 - Far bottom left */}
                <motion.div
                    className="absolute -bottom-10 -left-8 w-18 h-4 border-2 border-cyan-400/50 rounded-full"
                    style={{ transform: "rotate(-45deg)" }}
                    animate={{ rotate: [0, -360] }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                />

                {/* Saturn Ring 4 - Far right side */}
                <motion.div
                    className="absolute top-1/4 -right-20 w-16 h-3 border border-gray-400/40 rounded-full"
                    style={{ transform: "rotate(60deg)" }}
                    animate={{ rotate: [0, 360] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                />

                {/* Saturn Ring 5 - Far top */}
                <motion.div
                    className="absolute -top-12 left-1/2 w-22 h-5 border-2 border-green-400/50 rounded-full"
                    style={{ transform: "translateX(-50%) rotate(15deg)" }}
                    animate={{ rotate: [0, 360] }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                />

                {/* Saturn Ring 6 - Far bottom right */}
                <motion.div
                    className="absolute -bottom-6 -right-14 w-14 h-3 border border-yellow-400/40 rounded-full"
                    style={{ transform: "rotate(-30deg)" }}
                    animate={{ rotate: [0, -360] }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                />

                {/* Simple pulsing outline ring */}
                <motion.div
                    className="absolute inset-0 w-24 h-24 rounded-full border-2 border-gray-400/60 z-20"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5]
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