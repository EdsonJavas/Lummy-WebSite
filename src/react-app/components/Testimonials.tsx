import { Star, Quote } from 'lucide-react';
import { useTheme } from '@/react-app/hooks/useTheme';

export default function Testimonials() {
  const { isDark } = useTheme();

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Mãe de 2 crianças',
      avatar: '👩‍💼',
      rating: 5,
      text: 'O LUMMY transformou completamente a relação dos meus filhos com dinheiro! Eles agora entendem o valor de poupar e fazem escolhas mais conscientes. O aplicativo é divertido e educativo ao mesmo tempo.',
      highlight: 'Transformou completamente'
    },
    {
      name: 'João Santos',
      role: 'Pai e Educador',
      avatar: '👨‍🏫',
      rating: 5,
      text: 'Como educador, fico impressionado com a qualidade pedagógica do LUMMY. As missões são bem estruturadas e os conceitos são apresentados de forma lúdica. Minha filha de 8 anos adora!',
      highlight: 'Qualidade pedagógica'
    },
    {
      name: 'Ana Costa',
      role: 'Mãe de 3 filhos',
      avatar: '👩‍👧‍👦',
      rating: 5,
      text: 'Finalmente um aplicativo que ensina educação financeira de verdade! Meus filhos competem entre si para completar as missões e estão aprendendo a importância de economizar para realizar seus sonhos.',
      highlight: 'Ensina de verdade'
    },
    {
      name: 'Pedro Oliveira',
      role: 'Pai e Empresário',
      avatar: '👨‍💼',
      rating: 5,
      text: 'O controle parental é excelente! Consigo acompanhar o progresso dos meus filhos e até definir metas junto com eles. O LUMMY está preparando a próxima geração para ter uma relação saudável com o dinheiro.',
      highlight: 'Controle parental excelente'
    }
  ];

  return (
    <section id="depoimentos" className={`py-20 relative overflow-hidden ${
      isDark ? 'bg-gray-800/50' : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-10 left-1/4 w-32 h-32 rounded-full ${
          isDark ? 'opacity-5 bg-lummy-pink' : 'opacity-10 bg-lummy-pink'
        }`}></div>
        <div className={`absolute bottom-20 right-1/4 w-24 h-24 rounded-full ${
          isDark ? 'opacity-5 bg-lummy-blue' : 'opacity-10 bg-lummy-blue'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-lummy-pink/10 to-lummy-orange/10 px-4 py-2 rounded-full mb-8">
            <Star className="w-4 h-4 text-lummy-pink" />
            <span className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Depoimentos
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-poppins">
            <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>O que dizem</span>
            <br />
            <span className="bg-gradient-to-r from-lummy-pink to-lummy-orange bg-clip-text text-transparent">
              Nossos Usuários
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Famílias reais compartilhando suas experiências com o LUMMY
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-2xl transition-all duration-500 hover:scale-105 ${
                isDark 
                  ? 'bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600' 
                  : 'bg-white border border-gray-200 shadow-md hover:shadow-xl'
              }`}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Quote className={`w-16 h-16 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-lummy-orange text-lummy-orange" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className={`text-lg leading-relaxed mb-6 relative z-10 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                "{testimonial.text}"
              </p>

              {/* Highlight Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-lummy-blue/10 to-lummy-pink/10 mb-6">
                <span className={`text-sm font-medium ${
                  isDark ? 'text-lummy-blue' : 'text-lummy-blue'
                }`}>
                  ✨ {testimonial.highlight}
                </span>
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lummy-blue to-lummy-pink flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {testimonial.name}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className={`text-center p-6 rounded-xl ${
            isDark ? 'bg-gray-900/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="text-3xl font-bold text-lummy-blue mb-2">4.9</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Avaliação Média
            </div>
          </div>
          <div className={`text-center p-6 rounded-xl ${
            isDark ? 'bg-gray-900/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="text-3xl font-bold text-lummy-pink mb-2">10K+</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Famílias Ativas
            </div>
          </div>
          <div className={`text-center p-6 rounded-xl ${
            isDark ? 'bg-gray-900/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="text-3xl font-bold text-lummy-orange mb-2">98%</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Satisfação
            </div>
          </div>
          <div className={`text-center p-6 rounded-xl ${
            isDark ? 'bg-gray-900/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="text-3xl font-bold text-lummy-green mb-2">50+</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Missões Disponíveis
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

