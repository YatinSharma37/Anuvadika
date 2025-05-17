import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface UsagePricingProps {
  currentUsage: number;
  maxFreeUsage: number;
}

export const UsagePricing = ({ currentUsage, maxFreeUsage }: UsagePricingProps) => {
  const usagePercentage = (currentUsage / maxFreeUsage) * 100;
  const isNearLimit = usagePercentage >= 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-white shadow-lg rounded-2xl border border-gray-200"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Usage & Pricing</h3>
        
        {/* Usage Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Free Usage</span>
            <span className="text-gray-800 font-medium">
              {currentUsage} / {maxFreeUsage} files
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                isNearLimit ? 'bg-red-500' : 'bg-primary'
              }`}
            />
          </div>
          {isNearLimit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-red-500 text-sm"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Approaching free usage limit</span>
            </motion.div>
          )}
        </div>

        {/* Pricing Plans */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">Basic Plan</h4>
              <span className="text-primary font-bold">$9.99/mo</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                Up to 100 files per month
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                Priority processing
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                Basic support
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">Pro Plan</h4>
              <span className="text-primary font-bold">$19.99/mo</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                Unlimited files
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                Priority processing
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                Advanced AI features
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                24/7 premium support
              </li>
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/20 transition-colors"
          >
            <span>Upgrade Now</span>
            <ArrowUpRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}; 