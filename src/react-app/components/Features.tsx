import { Gamepad2, Target, Trophy, BookOpen, Shield, Heart } from 'lucide-react';
import { useTheme } from '@/react-app/hooks/useTheme';

export default function Features() {
  const { isDark } = useTheme();

  const features = [
    {
      icon: Gamepad2,
      title: 'Jogos Interativos',
      description: 'Aprenda economia através de jogos divertidos e desafios espaciais',
      color: 'lummy-blue',
      gradient: 'from-lummy-blue to-lummy-blue/70'
    },
    {
      icon: Target,
      title: 'Metas de Poupança',
      description: 'Defina objetivos e acompanhe o progresso de forma visual e motivadora',
      color: 'lummy-pink',
      gradient: 'from-lummy-pink to-lummy-pink/70'
    },
    {
      icon: Trophy,
      title: 'Sistema de Recompensas',
      description: 'Conquiste medalhas e desbloqueie novos planetas conforme progride',
      color: 'lummy-orange',
      gradient: 'from-lummy-orange to-lummy-orange/70'
    },
    {
      icon: BookOpen,
      title: 'Conteúdo Educativo',
      description: 'Lições adaptadas para cada idade sobre dinheiro e economia',
      color: 'lummy-green',
      gradient: 'from-lummy-green to-lummy-green/70'
    },
    {
      icon: Shield,
      title: 'Ambiente Seguro',
      description: 'Controle parental completo e ambiente 100% seguro para crianças',
      color: 'lummy-blue',
      gradient: 'from-lummy-blue to-lummy-pink'
    },
    {
      icon: Heart,
      title: 'Aprendizado Emocional',
      description: 'Desenvolve inteligência emocional relacionada ao dinheiro',
      color: 'lummy-pink',
      gradient: 'from-lummy-pink to-lummy-orange'
    }
  ];

  return (
    <section id="recursos" className={`py-20 ${
      isDark ? 'bg-gray-800/50' : 'bg-gradient-to-b from-gray-100 to-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-poppins">
            <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Recursos</span>
            <br />
            <span className="bg-gradient-to-r from-lummy-blue via-lummy-pink to-lummy-orange bg-clip-text text-transparent">
              Incríveis
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Descobra como o LUMMY torna o aprendizado financeiro uma aventura espacial emocionante e educativa
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600' 
                    : 'bg-white border border-gray-200 shadow-md hover:shadow-xl'
                }`}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className={`text-xl font-bold mb-4 font-nunito group-hover:text-${feature.color} transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className={`absolute top-4 right-4 w-2 h-2 bg-${feature.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className={`absolute bottom-4 left-4 w-1 h-1 bg-${feature.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100`}></div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className={`inline-flex items-center space-x-4 px-8 py-4 rounded-xl ${
            isDark ? 'bg-gray-900/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
          } backdrop-blur-sm`}>
            <span className={`text-lg font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Pronto para começar a aventura?
            </span>
            <a href="#download" className="bg-gradient-to-r from-lummy-blue to-lummy-pink px-6 py-2 rounded-lg text-white font-semibold hover:scale-105 transition-transform duration-300">
              Baixar Agora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
