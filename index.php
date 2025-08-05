<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lummy - Educação Financeira para Crianças</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Paytone+One&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/favicon.png">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top custom-navbar">
        <div class="container">
            <a class="navbar-brand" href="#home">
                <span class="logo-text">
                    <span class="logo-lu">Lu</span><span class="logo-m1">m</span><span class="logo-m2">m</span><span class="logo-y">y</span>
                </span>
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#home">Início</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#features">Recursos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#screenshots">Capturas</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#download">Download</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-section">
        <div class="hero-background">
            <div class="floating-elements">
                <div class="floating-coin coin-1">💰</div>
                <div class="floating-coin coin-2">🪙</div>
                <div class="floating-coin coin-3">💎</div>
                <div class="floating-coin coin-4">🏆</div>
                <div class="floating-coin coin-5">⭐</div>
                <div class="floating-coin coin-6">🎯</div>
            </div>
        </div>
        
        <div class="container">
            <div class="row align-items-center min-vh-100">
                <div class="col-lg-6 hero-content">
                    <div class="hero-badge">
                        <i class="fas fa-star"></i>
                        <span>Educação Financeira Lúdica</span>
                    </div>
                    
                    <h1 class="hero-title">
                        Ensine <span class="highlight">educação financeira</span> 
                        para crianças de forma <span class="highlight-2">divertida!</span>
                    </h1>
                    
                    <p class="hero-description">
                        O Lummy transforma o aprendizado sobre dinheiro em uma aventura emocionante! 
                        Seu filho aprenderá a poupar, controlar gastos e definir metas de forma lúdica e interativa.
                    </p>
                    
                    <div class="hero-stats">
                        <div class="stat-item">
                            <div class="stat-number">10K+</div>
                            <div class="stat-label">Crianças Aprendendo</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">95%</div>
                            <div class="stat-label">Pais Satisfeitos</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">4.9★</div>
                            <div class="stat-label">Avaliação</div>
                        </div>
                    </div>
                    
                    <div class="hero-buttons">
                        <a href="#download" class="btn btn-primary btn-download">
                            <i class="fab fa-android"></i>
                            Baixar APK Grátis
                        </a>
                        <a href="#features" class="btn btn-outline-primary btn-learn">
                            <i class="fas fa-play-circle"></i>
                            Ver Recursos
                        </a>
                    </div>
                </div>
                
                <div class="col-lg-6 hero-image">
                    <div class="phone-mockup">
                        <div class="phone-frame">
                            <div class="phone-screen">
                                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/astronauta-lummy-OXK8DpNpgdSxKxNZKtIyQynALBlh6n.svg" alt="Lummy App" class="app-screenshot">
                            </div>
                        </div>
                        <div class="phone-glow"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h2 class="section-title">Por que escolher o Lummy?</h2>
                    <p class="section-description">
                        Desenvolvido especialmente para tornar a educação financeira acessível e divertida para crianças e jovens
                    </p>
                </div>
            </div>
            
            <div class="row g-4 mt-5">
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-piggy-bank"></i>
                        </div>
                        <h4>Cofrinho Digital</h4>
                        <p>Acompanhe o saldo em tempo real com um cofrinho virtual divertido e interativo.</p>
                    </div>
                </div>
                
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-target"></i>
                        </div>
                        <h4>Metas Personalizadas</h4>
                        <p>Crie metas de economia com emojis e acompanhe o progresso de forma visual.</p>
                    </div>
                </div>
                
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-trophy"></i>
                        </div>
                        <h4>Sistema de Conquistas</h4>
                        <p>Desbloqueie medalhas e conquistas conforme desenvolve bons hábitos financeiros.</p>
                    </div>
                </div>
                
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h4>Controle de Gastos</h4>
                        <p>Registre gastos e ganhos de forma simples e aprenda a controlar o dinheiro.</p>
                    </div>
                </div>
                
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <h4>Dicas Educativas</h4>
                        <p>Aprenda com dicas diárias sobre educação financeira de forma lúdica.</p>
                    </div>
                </div>
                
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h4>Seguro para Crianças</h4>
                        <p>Interface segura e adequada para o público infantojuvenil.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Screenshots Section -->
    <section id="screenshots" class="screenshots-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h2 class="section-title">Veja o Lummy em ação</h2>
                    <p class="section-description">
                        Interface intuitiva e colorida, desenvolvida especialmente para crianças
                    </p>
                </div>
            </div>
            
            <div class="row mt-5">
                <div class="col-12">
                    <div class="screenshots-carousel">
                        <div class="screenshot-item">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lum%202-0CkW5uvZjaDxIjCSextrqE198N99r7.png" alt="Tela Principal" class="screenshot-img">
                            <div class="screenshot-overlay">
                                <h5>Tela Principal</h5>
                                <p>Cofrinho digital e metas</p>
                            </div>
                        </div>
                        
                        <div class="screenshot-item">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotocriancafodase%201-MFp8K8GLj7deZeGCFVqMJVDVgEtfsc.png" alt="Perfil" class="screenshot-img">
                            <div class="screenshot-overlay">
                                <h5>Perfil do Usuário</h5>
                                <p>Conquistas e estatísticas</p>
                            </div>
                        </div>
                        
                        <div class="screenshot-item">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome%20%281%29-3cva84Hcw1yVzTEgDHAc16jDZNkolI.svg" alt="Configuração" class="screenshot-img">
                            <div class="screenshot-overlay">
                                <h5>Configuração</h5>
                                <p>Personalize sua experiência</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Download Section -->
    <section id="download" class="download-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <div class="download-content">
                        <h2 class="download-title">
                            Pronto para começar a <span class="highlight">aventura financeira?</span>
                        </h2>
                        <p class="download-description">
                            Baixe o Lummy gratuitamente e comece a ensinar educação financeira 
                            para seu filho de forma divertida e interativa!
                        </p>
                        
                        <div class="download-features">
                            <div class="download-feature">
                                <i class="fas fa-check-circle"></i>
                                <span>100% Gratuito</span>
                            </div>
                            <div class="download-feature">
                                <i class="fas fa-check-circle"></i>
                                <span>Sem Anúncios</span>
                            </div>
                            <div class="download-feature">
                                <i class="fas fa-check-circle"></i>
                                <span>Seguro para Crianças</span>
                            </div>
                        </div>
                        
                        <div class="download-buttons">
                            <button class="btn btn-primary btn-download-main" onclick="downloadAPK()">
                                <i class="fab fa-android"></i>
                                <div class="btn-content">
                                    <span class="btn-text">Baixar para Android</span>
                                    <span class="btn-subtext">APK - Versão 1.0</span>
                                </div>
                            </button>
                        </div>
                        
                        <div class="download-info">
                            <small>
                                <i class="fas fa-info-circle"></i>
                                Compatível com Android 6.0 ou superior
                            </small>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-6">
                    <div class="download-visual">
                        <div class="download-phone">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/astronauta-lummy-OXK8DpNpgdSxKxNZKtIyQynALBlh6n.svg" alt="Lummy App Download" class="download-app-image">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="col-lg-4">
                    <div class="footer-brand">
                        <span class="logo-text">
                            <span class="logo-lu">Lu</span><span class="logo-m1">m</span><span class="logo-m2">m</span><span class="logo-y">y</span>
                        </span>
                        <p class="footer-description">
                            Educação financeira lúdica para crianças e jovens. 
                            Transformando o aprendizado sobre dinheiro em diversão!
                        </p>
                    </div>
                </div>
                
                <div class="col-lg-2 col-md-6">
                    <h5 class="footer-title">Produto</h5>
                    <ul class="footer-links">
                        <li><a href="#features">Recursos</a></li>
                        <li><a href="#screenshots">Capturas</a></li>
                        <li><a href="#download">Download</a></li>
                    </ul>
                </div>
                
                <div class="col-lg-2 col-md-6">
                    <h5 class="footer-title">Suporte</h5>
                    <ul class="footer-links">
                        <li><a href="#help">Ajuda</a></li>
                        <li><a href="#contact">Contato</a></li>
                        <li><a href="#faq">FAQ</a></li>
                    </ul>
                </div>
                
                <div class="col-lg-4">
                    <h5 class="footer-title">Fique por dentro</h5>
                    <p class="footer-newsletter-text">
                        Receba novidades sobre educação financeira infantil
                    </p>
                    <form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
                        <div class="input-group">
                            <input type="email" class="form-control" placeholder="Seu e-mail" required>
                            <button class="btn btn-primary" type="submit">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <hr class="footer-divider">
            
            <div class="row align-items-center">
                <div class="col-md-6">
                    <p class="footer-copyright">
                        © 2024 Lummy. Todos os direitos reservados.
                    </p>
                </div>
                <div class="col-md-6 text-md-end">
                    <div class="footer-social">
                        <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <!-- Download Modal -->
    <div class="modal fade" id="downloadModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fab fa-android text-success"></i>
                        Download do Lummy
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="download-progress">
                        <div class="spinner-border text-primary mb-3" role="status">
                            <span class="visually-hidden">Preparando download...</span>
                        </div>
                        <h6>Preparando seu download...</h6>
                        <p class="text-muted">O download começará automaticamente em alguns segundos.</p>
                    </div>
                </div>
                <div class="modal-footer justify-content-center">
                    <small class="text-muted">
                        <i class="fas fa-shield-alt"></i>
                        Download seguro e verificado
                    </small>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JS -->
    <script src="assets/js/script.js"></script>
</body>
</html>
