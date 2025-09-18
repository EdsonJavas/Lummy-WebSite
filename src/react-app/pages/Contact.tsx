import { ThemeProvider } from '@/react-app/hooks/useTheme';
import Layout from '@/react-app/components/Layout';
import { Mail, Phone, MapPin, MessageCircle, Send, Star, Clock, Users } from 'lucide-react';
import { useTheme } from '@/react-app/hooks/useTheme';
import { useState } from 'react';

function ContactContent() {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Suporte Técnico');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!message.trim()) {
        throw new Error('Mensagem é obrigatória');
      }
      const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || '';
      if (baseUrl) {
        const response = await fetch(`${baseUrl}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, service: subject, message })
        });
        if (!response.ok) {
          let details = '';
          try { const err = await response.json(); details = err?.error || JSON.stringify(err); } catch {}
          throw new Error(details || 'Falha no envio');
        }
      } else {
        // Fallback sem backend: FormSubmit
        const response = await fetch('https://formsubmit.co/ajax/es553807@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `LUMMY`,
            Nome: name,
            Email: email,
            Assunto: subject,
            Mensagem: message
          })
        });
        if (!response.ok) {
          let details = '';
          try { const err = await response.json(); details = err?.message || JSON.stringify(err); } catch {}
          throw new Error(details || 'Falha no envio (FormSubmit)');
        }
      }
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setSubject('Suporte Técnico');
      setMessage('');
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      alert('Não foi possível enviar sua mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`py-20 ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-lummy-blue/10 to-lummy-pink/10 px-4 py-2 rounded-full mb-8">
            <MessageCircle className="w-4 h-4 text-lummy-blue" />
            <span className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Fale Conosco
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-poppins">
            <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Entre em</span>
            <br />
            <span className="bg-gradient-to-r from-lummy-blue to-lummy-pink bg-clip-text text-transparent">
              Contato
            </span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Estamos aqui para ajudar! Entre em contato conosco e vamos tornar a educação financeira 
            do seu filho ainda melhor.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className={`p-8 rounded-2xl ${
            isDark 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white border border-gray-200 shadow-xl'
          }`}>
            <h3 className={`text-2xl font-bold mb-6 font-poppins ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Envie sua Mensagem
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Nome
                  </label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-700 border border-gray-600 text-white focus:border-lummy-blue' 
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-lummy-blue'
                    } focus:outline-none focus:ring-2 focus:ring-lummy-blue/20`}
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <input 
                    type="email" 
                    className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-700 border border-gray-600 text-white focus:border-lummy-blue' 
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-lummy-blue'
                    } focus:outline-none focus:ring-2 focus:ring-lummy-blue/20`}
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Assunto
                </label>
                <select className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                  isDark 
                    ? 'bg-gray-700 border border-gray-600 text-white focus:border-lummy-blue' 
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-lummy-blue'
                } focus:outline-none focus:ring-2 focus:ring-lummy-blue/20`}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}>
                  <option value="Suporte Técnico">Suporte Técnico</option>
                  <option value="Dúvidas sobre o App">Dúvidas sobre o App</option>
                  <option value="Parcerias">Parcerias</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Mensagem
                </label>
                <textarea 
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 resize-none ${
                    isDark 
                      ? 'bg-gray-700 border border-gray-600 text-white focus:border-lummy-blue' 
                      : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-lummy-blue'
                  } focus:outline-none focus:ring-2 focus:ring-lummy-blue/20`}
                  placeholder="Digite sua mensagem aqui..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full group relative overflow-hidden bg-gradient-to-r from-lummy-blue to-lummy-pink p-[2px] rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed">
                <div className={`relative w-full py-4 px-6 rounded-xl flex items-center justify-center space-x-3 font-semibold transition-all duration-300 ${
                  isDark ? 'bg-gray-800 text-white group-hover:bg-transparent group-hover:text-white' : 'bg-white text-gray-900 group-hover:bg-transparent group-hover:text-white'
                }`}>
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? 'Enviando...' : isSubmitted ? 'Enviado!' : 'Enviar Mensagem'}</span>
                </div>
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="grid gap-6">
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-lummy-blue to-lummy-pink rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Email
                    </h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      contato@lummy.app
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-lummy-pink to-lummy-orange rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Telefone
                    </h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      (11) 9999-8888
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-lummy-orange to-lummy-green rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Localização
                    </h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      São Paulo, SP - Brasil
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className={`p-6 rounded-xl ${
              isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-lummy-blue" />
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Horário de Atendimento
                </h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Segunda - Sexta</span>
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>9h às 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Sábado</span>
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>9h às 12h</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Domingo</span>
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Fechado</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-6 rounded-xl text-center ${
                isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-center w-12 h-12 bg-lummy-blue/10 rounded-xl mb-2 mx-auto">
                  <Users className="w-6 h-6 text-lummy-blue" />
                </div>
                <div className="text-2xl font-bold text-lummy-blue mb-1">24h</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Resposta Média</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${
                isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-center w-12 h-12 bg-lummy-pink/10 rounded-xl mb-2 mx-auto">
                  <Star className="w-6 h-6 text-lummy-pink" />
                </div>
                <div className="text-2xl font-bold text-lummy-pink mb-1">98%</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <ThemeProvider>
      <Layout>
        <div className="pt-8">
          <ContactContent />
        </div>
      </Layout>
    </ThemeProvider>
  );
}
