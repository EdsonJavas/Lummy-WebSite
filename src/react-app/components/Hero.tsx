import { Download, Play, Star, Users, Award } from 'lucide-react';
import { useTheme } from '@/react-app/hooks/useTheme';

export default function Hero() {
  const { isDark } = useTheme();

  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-20 left-10 w-20 h-20 rounded-full animate-pulse ${
          isDark ? 'opacity-20 bg-lummy-blue' : 'opacity-25 bg-lummy-blue'
        }`}></div>
        <div className={`absolute top-40 right-20 w-16 h-16 rounded-full animate-pulse delay-75 ${
          isDark ? 'opacity-20 bg-lummy-pink' : 'opacity-25 bg-lummy-pink'
        }`}></div>
        <div className={`absolute bottom-20 left-1/4 w-12 h-12 rounded-full animate-pulse delay-150 ${
          isDark ? 'opacity-20 bg-lummy-orange' : 'opacity-25 bg-lummy-orange'
        }`}></div>
        <div className={`absolute top-60 right-1/3 w-8 h-8 rounded-full animate-pulse delay-300 ${
          isDark ? 'opacity-20 bg-lummy-green' : 'opacity-25 bg-lummy-green'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-lummy-blue/10 to-lummy-pink/10 px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-lummy-orange" />
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Educação Financeira Divertida
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-poppins">
              <span className="font-poppins">
                <span className={isDark ? 'text-white' : 'text-black'}>L</span>
                <span className={isDark ? 'text-white' : 'text-black'}>u</span>
                <span className="text-lummy-blue">m</span>
                <span className="text-lummy-orange">m</span>
                <span className={isDark ? 'text-white' : 'text-black'}>y</span>
              </span>
              <br />
              <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                Aprenda a
              </span>
              <br />
              <span className="bg-gradient-to-r from-lummy-orange to-lummy-green bg-clip-text text-transparent">
                Poupar Brincando
              </span>
            </h1>

            <p className={`text-xl mb-8 leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              O aplicativo que transforma educação financeira em uma aventura espacial divertida! 
              Seu filho vai aprender a gerenciar dinheiro de forma interativa e envolvente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="#download" className="group relative overflow-hidden bg-gradient-to-r from-lummy-blue to-lummy-pink px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-lummy-pink to-lummy-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Baixar APK</span>
                </div>
              </a>

              <a href="#recursos" className={`group flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border-2 justify-center ${
                isDark 
                  ? 'border-gray-700 text-gray-300 hover:border-lummy-blue hover:text-lummy-blue' 
                  : 'border-gray-300 text-gray-700 hover:border-lummy-blue hover:text-lummy-blue'
              }`}>
                <Play className="w-5 h-5 group-hover:text-lummy-pink transition-colors" />
                <span>Ver Recursos</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-lummy-blue/10 rounded-xl mb-2 mx-auto">
                  <Users className="w-6 h-6 text-lummy-blue" />
                </div>
                <div className="text-2xl font-bold text-lummy-blue mb-1">10K+</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-lummy-pink/10 rounded-xl mb-2 mx-auto">
                  <Star className="w-6 h-6 text-lummy-pink" />
                </div>
                <div className="text-2xl font-bold text-lummy-pink mb-1">4.9</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avaliação</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-lummy-green/10 rounded-xl mb-2 mx-auto">
                  <Award className="w-6 h-6 text-lummy-green" />
                </div>
                <div className="text-2xl font-bold text-lummy-green mb-1">95%</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Satisfação</div>
              </div>
            </div>
          </div>

          {/* Right Content - Astronaut Character */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Phone Mockup */}
              <div className={`relative rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="aspect-[9/16] rounded-2xl relative overflow-hidden">
                  {/* Logo do Astronauta */}
                  <img 
                    src="https://mocha-cdn.com/0199435f-1bfa-756b-b8c4-508b94b8fa6e/fac72bb4-adcf-4593-bfd2-6a6d1617f56c-1.png" 
                    alt="Logo LUMMY - Astronauta"
                    className="w-full h-full object-cover object-center rounded-2xl"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-lummy-orange to-lummy-pink rounded-full flex items-center justify-center text-white font-bold animate-bounce shadow-lg">
                <Award className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-lummy-green to-lummy-blue rounded-full flex items-center justify-center text-white animate-bounce delay-150 shadow-lg">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
