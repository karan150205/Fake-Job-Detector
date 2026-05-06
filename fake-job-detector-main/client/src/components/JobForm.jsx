import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const JobForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    company_profile: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-dark-700"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-primary-500/10 p-3 rounded-lg">
          <Bot className="w-6 h-6 text-primary-600 dark:text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white">Analyze Job Posting</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title *</label>
            <input 
              required type="text" name="title" value={formData.title} onChange={handleChange}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Info</label>
            <textarea 
              name="company_profile" rows="3" value={formData.company_profile} onChange={handleChange}
              placeholder="Brief description of the company..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requirements</label>
            <textarea 
              name="requirements" rows="3" value={formData.requirements} onChange={handleChange}
              placeholder="List of requirements..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition resize-none"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Description *</label>
            <textarea 
              required name="description" rows="5" value={formData.description} onChange={handleChange}
              placeholder="Paste the full job description here..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input 
              type="text" name="location" value={formData.location} onChange={handleChange}
              placeholder="e.g. Remote, San Francisco"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary/Compensation</label>
            <input 
              type="text" name="salary" value={formData.salary} onChange={handleChange}
              placeholder="e.g. $100k - $150k"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition"
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="e.g. hr@company.com"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition"
            />
          </div>
        </div>

        <button 
          type="submit" disabled={isLoading}
          className="w-full py-4 mt-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/30 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Model...</> : 'Run ML Analysis'}
        </button>
      </form>
    </motion.div>
  );
};

export default JobForm;
