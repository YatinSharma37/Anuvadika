import { motion } from 'framer-motion';
import { FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'upload' | 'complete' | 'error';
  fileName: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'upload':
        return FileText;
      case 'complete':
        return CheckCircle2;
      case 'error':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'upload':
        return 'text-blue-500 bg-blue-50';
      case 'complete':
        return 'text-green-500 bg-green-50';
      case 'error':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-white shadow-lg rounded-2xl border border-gray-200"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.fileName}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}; 