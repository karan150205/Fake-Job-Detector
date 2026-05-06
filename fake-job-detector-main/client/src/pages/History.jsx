import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5001/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Clock className="w-8 h-8 text-primary-600 dark:text-primary-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analysis History</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-dark-800 rounded-2xl border border-dashed border-gray-200 dark:border-dark-700">
          <p className="text-gray-500 dark:text-gray-400">No predictions have been made yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((job, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={job._id} 
              className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-700 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {job.company_profile || job.description.substring(0, 100) + '...'}
                </p>
                <div className="flex items-center space-x-4 text-xs font-medium">
                  <span className="text-gray-400 dark:text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6 flex md:flex-col items-center justify-between md:items-end w-full md:w-auto">
                <div className={`flex items-center space-x-2 font-bold px-3 py-1.5 rounded-full ${job.is_fake ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                  {job.is_fake ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  <span>{job.is_fake ? 'FAKE' : 'REAL'}</span>
                </div>
                <div className="text-sm font-bold mt-2 text-gray-700 dark:text-gray-300">
                  {job.confidence}% Confidence
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
