'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Lock, Star, Shield, Zap } from 'lucide-react';
import { FeatureCard } from './ui/FeatureCard';

const PriverseLanding = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/room');
  };

  const generateRandomStyle = () => ({
    width: `${Math.random() * 120 + 20}px`,
    height: `${Math.random() * 120 + 20}px`,
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* Animated Background Circles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-20"
          style={generateRandomStyle()}
          animate={{
            x: ['-100%', '100%'],
            y: ['-100%', '100%'],
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 mb-12"
      >
        <motion.h1
          className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Priverse
        </motion.h1>
        <motion.p
          className="text-3xl text-gray-300 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Where Privacy Meets Possibility
        </motion.p>
        
        <div className="flex justify-center mb-8">
          <div>
            
          </div>
        <Button
  onClick={handleGetStarted}
  className="text-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
>
  Get Started
</Button>

        </div>
      </motion.div>

      {/* Feature Cards */}
      <div className="flex flex-wrap justify-center gap-8 mb-12 z-10">
        <FeatureCard icon={<Lock className="w-8 h-8 text-cyan-400" />} title="Encrypted Chats" description="Your conversations are for your eyes only" />
        <FeatureCard icon={<Star className="w-8 h-8 text-yellow-300" />} title="Intuitive Design" description="User-friendly interface for seamless communication" />
        <FeatureCard icon={<Shield className="w-8 h-8 text-green-300" />} title="Advanced Security" description="State-of-the-art protection for your data" />
        <FeatureCard icon={<Zap className="w-8 h-8 text-blue-300" />} title="Lightning Fast" description="Real-time messaging with minimal latency" />
      </div>
    </div>
  );
};

export default PriverseLanding;
