import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface QuickStatsProps {
  totalFiles: number;
  processingFiles: number;
  completedFiles: number;
  failedFiles: number;
}

export const QuickStats = ({
  totalFiles,
  processingFiles,
  completedFiles,
  failedFiles,
}: QuickStatsProps) => {
  const stats = [
    {
      label: 'Total Files',
      value: totalFiles,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Processing',
      value: processingFiles,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Completed',
      value: completedFiles,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Failed',
      value: failedFiles,
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-white shadow-lg rounded-2xl border border-gray-200"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}; 