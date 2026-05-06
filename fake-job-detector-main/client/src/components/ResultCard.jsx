import { CheckCircle, XCircle, AlertTriangle, Activity, PenTool, Link, Building, Briefcase, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const CircularProgress = ({ value, label, colorClass, subtitle }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-200 dark:text-dark-700" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" 
            strokeDasharray={circumference}
            className={`${colorClass}`} 
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-xl font-bold ${colorClass.split(' ')[0]}`}>{value}%</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-bold text-gray-700 dark:text-gray-300">{label}</p>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-500 text-center">{subtitle}</p>}
    </div>
  );
};

const MetricBadge = ({ icon: Icon, label, value, description }) => (
  <div className="bg-white/50 dark:bg-dark-900/50 rounded-xl p-4 border border-black/5 dark:border-white/5 backdrop-blur-sm shadow-sm flex items-start space-x-4">
    <div className="p-3 bg-primary-500/10 rounded-lg text-primary-600 dark:text-primary-500">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</h4>
      <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

const ResultCard = ({ result }) => {
  if (!result) return null;

  const { is_fake, confidence, reasons, analytics } = result;
  
  const isFake = is_fake;
  const statusColor = isFake ? 'text-red-500' : 'text-emerald-500';
  const statusColorBg = isFake ? 'bg-red-500' : 'bg-emerald-500';
  const bgColor = isFake ? 'bg-red-500/5' : 'bg-emerald-500/5';
  const borderColor = isFake ? 'border-red-500/30' : 'border-emerald-500/30';
  const shadowGlow = isFake ? 'shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'shadow-[0_0_30px_rgba(16,185,129,0.2)]';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-3xl p-6 md:p-8 border ${borderColor} ${bgColor} ${shadowGlow} relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 p-8 opacity-5">
        {isFake ? <XCircle className="w-64 h-64" /> : <CheckCircle className="w-64 h-64" />}
      </div>

      <div className="relative z-10">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center space-x-5">
              <div className={`p-4 rounded-2xl ${isFake ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                {isFake ? <ShieldAlert className="w-10 h-10" /> : <CheckCircle className="w-10 h-10" />}
              </div>
              <div>
                <h3 className={`text-4xl font-black tracking-tighter uppercase ${statusColor}`}>
                  {isFake ? 'High Fraud Risk' : 'Authentic Listing'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium text-lg flex items-center mt-1">
                  Confidence Rating: <span className="font-black text-2xl ml-2">{confidence}%</span>
                </p>
              </div>
            </div>
            
            <div className="flex-shrink-0 flex items-center md:flex-col justify-center">
              <div className="relative w-full max-w-[200px] h-4 bg-gray-200 dark:bg-dark-900 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`absolute top-0 left-0 h-full ${statusColorBg}`}
                />
              </div>
            </div>
        </div>

        {/* Analytics Grid */}
        {analytics && (
          <div className="mb-10">
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-primary-500" /> AI Diagnostic Metrics
              </h4>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <CircularProgress 
                      label="Grammar Score" 
                      value={analytics.grammar_score} 
                      colorClass="text-blue-500" 
                      subtitle="Syntax integrity"
                  />
                  <CircularProgress 
                      label="Readability" 
                      value={analytics.readability} 
                      colorClass="text-purple-500" 
                      subtitle="Flesch-Kincaid" 
                  />
                  <CircularProgress 
                      label="Company Info" 
                      value={analytics.company_score} 
                      colorClass="text-amber-500" 
                      subtitle="Profile density" 
                  />
                  <CircularProgress 
                      label="Logistics" 
                      value={analytics.logistics_score} 
                      colorClass="text-indigo-500" 
                      subtitle="Salary realism" 
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricBadge 
                    icon={PenTool} label="Detected Tone" value={analytics.tone} 
                    description={`Sentiment Index: ${analytics.sentiment_score}`} 
                  />
                  <MetricBadge 
                    icon={Link} label="External Entities" value={`${analytics.links_found} URLs | ${analytics.emails_found} Emails`} 
                    description="Outbound links & contacts found" 
                  />
              </div>
          </div>
        )}

        {/* Explicit Warnings List */}
        {reasons && reasons.length > 0 ? (
          <div className="bg-red-500/5 dark:bg-dark-900/80 rounded-2xl p-6 border border-red-500/20 shadow-md">
            <h4 className="flex items-center font-bold text-xl text-red-600 dark:text-red-400 mb-5 border-b border-red-500/20 pb-3">
              <AlertTriangle className="w-6 h-6 mr-3" />
              Critical Red Flags
            </h4>
            <ul className="space-y-4">
              {reasons.map((reason, idx) => (
                <motion.li 
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  key={idx} className="flex items-start bg-white/40 dark:bg-dark-800/60 p-3 rounded-xl border border-red-500/10"
                >
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 mr-4 font-black">{idx + 1}</div>
                  <span className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{reason}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-emerald-500/5 dark:bg-dark-900/80 rounded-2xl p-6 border border-emerald-500/20 shadow-md flex items-center">
            <div className="bg-emerald-500/20 p-4 rounded-full mr-5">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-bold text-xl text-emerald-600 dark:text-emerald-400">
                Safe Listing
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                The AI model and NLP rule engine found no suspicious patterns or anomalies. This appears to be a legitimate job posting.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultCard;
