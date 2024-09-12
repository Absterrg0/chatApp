import {motion} from 'framer-motion'
import React from 'react';
export const ActionButton = ({ icon, text, isActive, onClick }: { icon: React.ReactNode; text: string; isActive: boolean; onClick: () => void }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
          : 'bg-gray-700/50 hover:bg-gray-600/50'
      }`}
      aria-pressed={isActive}
    >
      {icon}
      {text}
    </motion.button>
  );