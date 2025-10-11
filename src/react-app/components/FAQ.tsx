import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTheme } from '@/react-app/hooks/useTheme';

export default function FAQ() {
  const { isDark } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'O LUMMY é adequado para que idade?',
      answer: 'O LUMMY foi desenvolvido para crianças de 6 a 14 anos, com conteúdo adaptado para diferentes faixas etárias. O aplicativo ajusta automaticamente o nível de dificuldade e complexidade das lições de acordo com a idade e progresso da criança.'
    },
    {
      question: 'Como funciona o controle parental?',
      answer: 'Os pais têm acesso completo a um painel de controle onde podem acompanhar o progresso dos filhos, definir metas de poupança, aprovar compras virtuais e receber relatórios detalhados sobre o aprendizado. Tudo em um ambiente 100% seguro e privado.'
    },
    {
      question: 'O aplicativo requer conexão com internet?',
      answer: 'Algumas funcionalidades do LUMMY funcionam offline, mas para sincronizar o progresso, acessar novos conteúdos e participar de desafios em grupo, é necessária conexão com internet. Recomendamos pelo menos 50 MB de dados mensais.'
    },
    {
      question: 'Como são as missões e recompensas?',
      answer: 'As crianças completam missões espaciais que ensinam conceitos financeiros de forma lúdica. Cada missão concluída rende estrelas, moedas virtuais e medalhas. Conforme progridem, desbloqueiam novos planetas, personagens e funcionalidades especiais.'
    },
    {
      question: 'O LUMMY é gratuito?',
      answer: 'O LUMMY oferece uma versão gratuita com funcionalidades básicas e uma versão premium com acesso completo a todos os planetas, missões exclusivas e relatórios avançados para os pais. Você pode experimentar gratuitamente por 30 dias.'
    },
    {
      question: 'Como instalar o APK no Android?',
      answer: 'Após baixar o arquivo APK, vá em Configurações > Segurança > Fontes Desconhecidas e ative a opção. Em seguida, abra o arquivo APK baixado e siga as instruções na tela. É seguro e simples! Caso tenha dúvidas, entre em contato conosco.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={`py-20 relative overflow-hidden ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-white to-gray-50'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-20 right-20 w-32 h-32 rounded-full animate-pulse ${
          isDark ? 'opacity-5 bg-lummy-blue' : 'opacity-10 bg-lummy-blue'
        }`}></div>
        <div className={`absolute bottom-20 left-20 w-24 h-24 rounded-full animate-pulse delay-75 ${
          isDark ? 'opacity-5 bg-lummy-pink' : 'opacity-10 bg-lummy-pink'
        }`}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-lummy-blue/10 to-lummy-pink/10 px-4 py-2 rounded-full mb-8">
            <HelpCircle className="w-4 h-4 text-lummy-blue" />
            <span className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Perguntas Frequentes
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-poppins">
            <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Dúvidas</span>
            <br />
            <span className="bg-gradient-to-r from-lummy-blue to-lummy-pink bg-clip-text text-transparent">
              Comuns
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Encontre respostas para as perguntas mais frequentes sobre o LUMMY
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800/50 border border-gray-700 hover:border-gray-600' 
                  : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-200"
              >
                <span className={`text-lg font-semibold pr-8 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-lummy-blue' : 'text-gray-400'
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`px-6 pb-5 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                } leading-relaxed`}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Não encontrou a resposta que procurava?
          </p>
          <a
            href="/contato"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-lummy-blue to-lummy-pink px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-300"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Entre em Contato</span>
          </a>
        </div>
      </div>
    </section>
  );
}

