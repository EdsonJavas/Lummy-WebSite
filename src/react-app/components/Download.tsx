import { Download as DownloadIcon, Smartphone, Shield, Clock, CheckCircle, Star, Gamepad2, Target } from 'lucide-react';
import { useTheme } from '@/react-app/hooks/useTheme';

export default function Download() {
  const { isDark } = useTheme();

  const benefits = [
    'Interface intuitiva e amigável',
    'Conteúdo educativo de qualidade',
    'Gamificação envolvente',
    'Controle parental completo',
    'Atualizações gratuitas',
    'Suporte técnico dedicado'
  ];

  return (
    <section id="download" className={`py-20 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-20 left-20 w-40 h-40 rounded-full animate-pulse ${
          isDark ? 'opacity-10 bg-lummy-blue' : 'opacity-15 bg-lummy-blue'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-32 h-32 rounded-full animate-pulse delay-75 ${
          isDark ? 'opacity-10 bg-lummy-pink' : 'opacity-15 bg-lummy-pink'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full animate-pulse delay-150 ${
          isDark ? 'opacity-5 bg-lummy-orange' : 'opacity-10 bg-lummy-orange'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-lummy-green/10 to-lummy-blue/10 px-4 py-2 rounded-full mb-8">
            <DownloadIcon className="w-4 h-4 text-lummy-green" />
            <span className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Disponível Agora
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-poppins">
            <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Baixe o</span>
            <br />
            <span className="font-poppins">
              <span className={isDark ? 'text-white' : 'text-black'}>L</span>
              <span className={isDark ? 'text-white' : 'text-black'}>U</span>
              <span className="text-lummy-blue">M</span>
              <span className="text-lummy-orange">M</span>
              <span className={isDark ? 'text-white' : 'text-black'}>Y</span>
              <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}> Agora</span>
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Comece a jornada de educação financeira do seu filho hoje mesmo. 
            Download gratuito e instalação simples.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Download Info */}
          <div>
            {/* Download Button */}
            <div className={`p-8 rounded-2xl mb-8 ${
              isDark 
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
                : 'bg-white backdrop-blur-sm border border-gray-200 shadow-xl'
            }`}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-lummy-blue to-lummy-pink rounded-xl flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold font-raleway ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    LUMMY APK
                  </h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Versão 2.1.0 • Última atualização
                  </p>
                </div>
              </div>

              <a
                href="/downloads/lummy.apk"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full group relative overflow-hidden bg-gradient-to-r from-lummy-blue via-lummy-pink to-lummy-orange p-[2px] rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl block"
              >
                <div className={`relative w-full py-4 px-6 rounded-xl flex items-center justify-center space-x-3 font-semibold text-lg transition-all duration-300 ${
                  isDark ? 'bg-gray-800 text-white group-hover:bg-transparent group-hover:text-white' : 'bg-white text-gray-900 group-hover:bg-transparent group-hover:text-white'
                }`}>
                  <DownloadIcon className="w-6 h-6" />
                  <span>Baixar APK</span>
                </div>
              </a>

              <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-lummy-green" />
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    100% Seguro
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-lummy-blue" />
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Instalação Rápida
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h4 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                O que você vai receber:
              </h4>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-lummy-green flex-shrink-0" />
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            {/* Main Phone */}
            <div className="relative mx-auto max-w-sm">
              <div className={`relative rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-500 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="aspect-[9/16] rounded-2xl relative overflow-hidden bg-gray-100">
                  {/* Tela de Login Real */}
                  <img 
                    src="https://mocha-cdn.com/0199435f-1bfa-756b-b8c4-508b94b8fa6e/Tela-da-Login.png" 
                    alt="Tela de Login do LUMMY"
                    className="w-full h-full object-cover object-center rounded-2xl"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-lummy-orange to-lummy-pink rounded-full flex items-center justify-center text-white animate-bounce shadow-lg">
                <Star className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-lummy-green to-lummy-blue rounded-full flex items-center justify-center text-white animate-bounce delay-150 shadow-lg">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div className="absolute top-1/2 -right-8 w-8 h-8 bg-gradient-to-br from-lummy-pink to-lummy-orange rounded-full flex items-center justify-center text-white animate-bounce delay-300 shadow-lg">
                <Target className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className={`mt-16 text-center p-8 rounded-2xl ${
          isDark 
            ? 'bg-gray-800/30 border border-gray-700' 
            : 'bg-white border border-gray-200 shadow-sm'
        } backdrop-blur-sm`}>
          <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Requisitos do Sistema
          </h4>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <strong className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Android:</strong>
              <span className={`block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                5.0 (API level 21) ou superior
              </span>
            </div>
            <div>
              <strong className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Espaço:</strong>
              <span className={`block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                50 MB de armazenamento livre
              </span>
            </div>
            <div>
              <strong className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Conexão:</strong>
              <span className={`block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Internet para sincronização
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
