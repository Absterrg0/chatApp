import {motion} from 'framer-motion'
export const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <motion.div
      className="flex-col flex items-center p-6 bg-gray-800/30 backdrop-blur-lg rounded-xl w-64 border border-gray-700/50 shadow-lg"
      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(123, 31, 162, 0.5)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="bg-gray-700/50 p-3 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
    </motion.div>
  );
  