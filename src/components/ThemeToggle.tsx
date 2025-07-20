import React from 'react';
import { Sun, Moon } from 'lucide-react';
import classNames from 'classnames';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  isCollapsed?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isCollapsed = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  if (isCollapsed) {
    return (
      <div className="flex justify-center relative group">
        <button
          onClick={toggleTheme}
          className={classNames(
            'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
            'hover:scale-105',
            {
              'bg-gray-700 text-yellow-400': isDarkMode,
              'bg-blue-100 text-blue-600': !isDarkMode,
            }
          )}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Tooltip for collapsed state */}
        <div className="fixed left-[4.5rem] ml-3 px-3 py-2 bg-gray-800 dark:bg-gray-600 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-[100] pointer-events-none shadow-lg">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-gray-800 dark:border-r-gray-600"></div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={classNames(
        'flex items-center space-x-3 px-4 py-2.5 w-full rounded-lg transition-all duration-200',
        {
          'hover:bg-gray-700 text-dark-text-secondary': isDarkMode,
          'hover:bg-tag/30 text-medium': !isDarkMode,
        }
      )}
    >
      <div className={classNames(
        'w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-200',
        {
          'bg-gray-700 text-yellow-400': isDarkMode,
          'bg-blue-100 text-blue-600': !isDarkMode,
        }
      )}>
        {isDarkMode ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </div>

      <span className="text-sm font-medium">
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
