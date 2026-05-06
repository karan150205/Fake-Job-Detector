import { useState } from 'react';
import axios from 'axios';
import JobForm from '../components/JobForm';
import ResultCard from '../components/ResultCard';

const Home = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (jobData) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5001/analyze-job', jobData);
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || 'An error occurred while analyzing the job posting.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          AI-Powered Fake Job Detector
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
          Protect yourself from employment scams. Paste a job description below, and our machine learning model will analyze it for fraudulent patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <JobForm onSubmit={handleAnalyze} isLoading={isLoading} />
        
        <div className="sticky top-24">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {result ? (
            <ResultCard result={result} />
          ) : !isLoading && !error ? (
            <div className="bg-gray-100/50 dark:bg-dark-800/50 rounded-2xl p-10 border border-dashed border-gray-300 dark:border-dark-700 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="w-20 h-20 bg-gray-200 dark:bg-dark-900 rounded-full flex items-center justify-center mb-6 opacity-50">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">Awaiting Analysis</h3>
              <p className="text-gray-500 dark:text-gray-500">
                Fill out the form to the left to see advanced AI predictions and rule-based insights here.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Home;
