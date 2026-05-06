import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, ShieldAlert } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-dark-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-500 hover:opacity-80 transition">
          <ShieldAlert className="w-8 h-8" />
          <span className="text-xl font-bold tracking-wider">VerityJob</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 font-medium transition">Home</Link>
          <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 font-medium transition">History</Link>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 transition"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
