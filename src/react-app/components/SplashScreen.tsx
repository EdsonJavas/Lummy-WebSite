import { useEffect, useState } from 'react';
import { useTheme } from '@/react-app/hooks/useTheme';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { isDark } = useTheme();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      const fadeOutDuration = 1000; // Corresponde à duração da animação de fade-out no CSS
      setTimeout(onFinish, fadeOutDuration);
    }, 2000); // Exibe a splash screen por 2 segundos antes de iniciar o fade-out

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'} ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <h2 className="text-3xl font-semibold mb-4 animate-fadeInUp delay-100">
        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Bem-vindo ao</span>
      </h2>
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold font-poppins animate-fadeInUp delay-200">
        <span className={isDark ? 'text-white' : 'text-black'}>L</span>
        <span className={isDark ? 'text-white' : 'text-black'}>u</span>
        <span className="text-lummy-blue">m</span>
        <span className="text-lummy-orange">m</span>
        <span className={isDark ? 'text-white' : 'text-black'}>y</span>
      </h1>
      <p className="text-xl sm:text-2xl mt-8 animate-fadeInUp delay-300">
        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Sua jornada financeira começa aqui!</span>
      </p>
    </div>
  );
}

