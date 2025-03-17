import { motion } from "framer-motion"
import { Pizza, SandwichIcon as Hamburger, Drumstick, Coffee, Carrot, Apple } from 'lucide-react'
import logo from '@/assets/logo.png'

interface SplashScreenProps {
    onComplete?: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    return (
        <div className="fixed inset-0 bg-[#7AB63F] flex items-center justify-center overflow-hidden">
            {/* Animated food icons */}
            <motion.div
                className="absolute text-[#69A234] opacity-30"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 20, 0],
                    y: [0, -20, 0],
                    rotate: [0, 10, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    top: "5%",
                    right: "10%",
                }}
            >
                <Pizza size={100} />
            </motion.div>
            <motion.div
                className="absolute text-[#69A234] opacity-30"
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, -20, 0],
                    y: [0, 20, 0],
                    rotate: [0, -10, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    bottom: "10%",
                    left: "5%",
                }}
            >
                <Hamburger size={80} />
            </motion.div>
            <motion.div
                className="absolute text-[#69A234] opacity-30"
                animate={{
                    scale: [1, 1.15, 1],
                    x: [0, 15, 0],
                    y: [0, 15, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    top: "15%",
                    left: "15%",
                }}
            >
                <Drumstick size={90} />
            </motion.div>
            <motion.div
                className="absolute text-[#69A234] opacity-30"
                animate={{
                    scale: [1, 1.05, 1],
                    x: [0, -10, 0],
                    y: [0, -10, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    bottom: "20%",
                    right: "15%",
                }}
            >
                <Coffee size={70} />
            </motion.div>
            <motion.div
                className="absolute text-[#69A234] opacity-30"
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 10, 0],
                    y: [0, -15, 0],
                    rotate: [0, 15, 0],
                }}
                transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    top: "40%",
                    left: "5%",
                }}
            >
                <Carrot size={85} />
            </motion.div>
            <motion.div
                className="absolute text-[#69A234] opacity-30"
                animate={{
                    scale: [1, 1.08, 1],
                    x: [0, -15, 0],
                    y: [0, 10, 0],
                    rotate: [0, -8, 0],
                }}
                transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    top: "30%",
                    right: "5%",
                }}
            >
                <Apple size={75} />
            </motion.div>

            {/* Content container */}
            <motion.div
                className="flex flex-col items-center z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                onAnimationComplete={onComplete}
            >
                {/* Logo container */}
                <motion.div
                    className="w-64 h-64 relative flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img
                        src={logo}
                        alt="Fuudi Store Logo"
                        className="w-full h-full object-contain"
                        loading="eager"
                    />
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    className="text-white/80 text-lg mt-4 font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    YOUR FAVORITE FOOD STORE
                </motion.p>

                {/* Bottom indicator */}
                <motion.div
                    className="absolute bottom-12 w-3 h-3 bg-[#FFA726] rounded-full"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>
        </div>
    )
}

