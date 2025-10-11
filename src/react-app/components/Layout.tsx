import { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/react-app/hooks/useTheme';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900/80 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      } border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <a href="/" className="text-2xl font-bold font-poppins">
                <span className={isDark ? 'text-white' : 'text-black'}>L</span>
                <span className={isDark ? 'text-white' : 'text-black'}>u</span>
                <span className="text-lummy-blue">m</span>
                <span className="text-lummy-orange">m</span>
                <span className={isDark ? 'text-white' : 'text-black'}>y</span>
              </a>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className={`hover:text-lummy-blue transition-colors ${
                isDark ? 'text-gray-300 hover:text-lummy-blue' : 'text-gray-700 hover:text-lummy-blue'
              }`}>
                Início
              </a>
              <a href="#recursos" className={`hover:text-lummy-orange transition-colors ${
                isDark ? 'text-gray-300 hover:text-lummy-orange' : 'text-gray-700 hover:text-lummy-orange'
              }`}>
                Recursos
              </a>
              <a href="#download" className={`hover:text-lummy-green transition-colors ${
                isDark ? 'text-gray-300 hover:text-lummy-green' : 'text-gray-700 hover:text-lummy-green'
              }`}>
                Download
              </a>
              <a href="/contato" className={`hover:text-lummy-blue transition-colors ${
                isDark ? 'text-gray-300 hover:text-lummy-blue' : 'text-gray-700 hover:text-lummy-blue'
              }`}>
                Contato
              </a>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>
      
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
