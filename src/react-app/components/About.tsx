import { Rocket, Star, Globe, Users } from 'lucide-react';
import { useTheme } from '@/react-app/hooks/useTheme';

export default function About() {
  const { isDark } = useTheme();

  return (
    <section id="sobre" className={`py-20 relative overflow-hidden ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-gray-100'
    }`}>
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-10 left-1/4 w-32 h-32 rounded-full ${
          isDark ? 'opacity-5 bg-lummy-blue' : 'opacity-20 bg-lummy-blue'
        }`}></div>
        <div className={`absolute bottom-20 right-1/4 w-24 h-24 rounded-full ${
          isDark ? 'opacity-5 bg-lummy-pink' : 'opacity-20 bg-lummy-pink'
        }`}></div>
        <div className={`absolute top-1/2 left-10 w-16 h-16 rounded-full ${
          isDark ? 'opacity-5 bg-lummy-orange' : 'opacity-20 bg-lummy-orange'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-lummy-blue/10 to-lummy-green/10 px-4 py-2 rounded-full mb-8">
              <Rocket className="w-4 h-4 text-lummy-blue" />
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Nossa Missão
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-8 font-poppins">
              <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Transformando</span>
              <br />
              <span className="bg-gradient-to-r from-lummy-orange to-lummy-green bg-clip-text text-transparent">
                Educação Financeira
              </span>
            </h2>

            <p className={`text-lg mb-8 leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              O LUMMY nasceu da necessidade de ensinar educação financeira de forma divertida e envolvente para crianças e jovens. 
              Acreditamos que aprender sobre dinheiro deve ser uma aventura emocionante, não uma tarefa chata.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-lummy-blue to-lummy-pink rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 font-nunito ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Metodologia Gamificada
                  </h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Aprendizado através de jogos, missões e recompensas que motivam e engajam
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-lummy-pink to-lummy-orange rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Conteúdo Adaptado
                  </h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Lições personalizadas para diferentes idades e níveis de conhecimento
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-lummy-orange to-lummy-green rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Participação Familiar
                  </h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Ferramentas para pais acompanharem e participarem da jornada educativa
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-gray-800/50' : 'bg-white/80 border border-gray-200 shadow-sm'
              }`}>
                <div className="text-3xl font-bold text-lummy-blue mb-2">98%</div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Das crianças melhoram seus hábitos financeiros
                </div>
              </div>
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-gray-800/50' : 'bg-white/80 border border-gray-200 shadow-sm'
              }`}>
                <div className="text-3xl font-bold text-lummy-pink mb-2">50+</div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Atividades interativas disponíveis
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className={`p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 ${
                isDark ? 'bg-gray-800 shadow-xl' : 'bg-white border border-gray-200 shadow-lg'
              }`}>
                <div className="w-12 h-12 bg-gradient-to-br from-lummy-blue to-lummy-pink rounded-xl flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Missões Espaciais
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Explore planetas enquanto aprende conceitos financeiros
                </p>
              </div>

              {/* Card 2 */}
              <div className={`p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 mt-8 ${
                isDark ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-lg'
              }`}>
                <div className="w-12 h-12 bg-gradient-to-br from-lummy-orange to-lummy-green rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recompensas
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Ganhe estrelas e desbloqueie novos conteúdos
                </p>
              </div>

              {/* Card 3 */}
              <div className={`p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 ${
                isDark ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-lg'
              }`}>
                <div className="w-12 h-12 bg-gradient-to-br from-lummy-pink to-lummy-orange rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Mundos Virtuais
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Ambientes imersivos para praticar economia
                </p>
              </div>

              {/* Card 4 */}
              <div className={`p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 mt-8 ${
                isDark ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-lg'
              }`}>
                <div className="w-12 h-12 bg-gradient-to-br from-lummy-green to-lummy-blue rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Comunidade
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Conecte-se com outros jovens poupadores
                </p>
              </div>
            </div>

            {/* Floating element */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-lummy-blue to-lummy-pink rounded-full flex items-center justify-center text-white animate-float shadow-lg">
              <Rocket className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
