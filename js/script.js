/**
 * SAR Abogados Especializados - JavaScript Optimizado
 * Combina funcionalidades del blog y script general
 * Versión: 2.0.0
 * Fecha: 2025-11-05
 */

// ==============================================
// CONFIGURACIÓN Y DATOS
// ==============================================

// Posts del blog
const blogPosts = [
    {
        title: "Cambios en la Ley de Contratos",
        date: "2023-10-01",
        excerpt: "En este artículo discutimos las recientes modificaciones a la legislación sobre contratos civiles...",
        url: "posts/post1.html"
    },
    {
        title: "Consejos para Evitar Problemas Legales en tu Empresa",
        date: "2023-09-15",
        excerpt: "Aprende cómo proteger tu negocio con estas recomendaciones prácticas...",
        url: "posts/post2.html"
    },
    {
        title: "Entendiendo tus Derechos Laborales",
        date: "2023-08-20",
        excerpt: "Un resumen de los derechos básicos de los trabajadores en el país...",
        url: "posts/post3.html"
    }
];

// ==============================================
// CLASE: HEADER MANAGER
// Maneja la funcionalidad del header (sticky, scroll)
// ==============================================
class HeaderManager {
    constructor() {
        this.lastScroll = 0;
        this.header = document.querySelector('header');
        this.threshold = 50;
        this.init();
    }

    init() {
        if (!this.header) return;
        
        // Throttled scroll handler
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScrollLogic();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial state
        this.handleScrollLogic();
    }

    handleScrollLogic() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > this.threshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        this.lastScroll = currentScroll;
    }
}

// ==============================================
// MENÚ HAMBURGUESA SIMPLE
// Basado en el ejemplo exitoso del usuario
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
    // Menú hamburguesa
    const menuToggle = document.querySelector('#menu-toggle'); // ✅ CORREGIDO: ID correcto
    const menu = document.querySelector('.nav-menu');

    if (menuToggle && menu) {
        console.log('✅ Menú hamburguesa inicializado');

        menuToggle.addEventListener('click', () => {
            const isActive = menu.classList.toggle('active');
            menuToggle.classList.toggle('active', isActive);
            menuToggle.setAttribute('aria-expanded', isActive);
            console.log('Toggle ejecutado:', { isActive });
        });

        // Cerrar menú al hacer clic en un enlace
        const menuLinks = menu.querySelectorAll('li a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Cerrar menú al redimensionar ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    } else {
        console.log('❌ Elementos del menú no encontrados');
    }
});

// ==============================================
// CLASE: BLOG MANAGER
// Maneja la carga y gestión de posts del blog
// ==============================================
class BlogManager {
    constructor() {
        this.posts = blogPosts;
        this.postsContainer = document.querySelector('.posts-container') || document.querySelector('.posts');
        this.init();
    }

    init() {
        // DESACTIVADO: No renderizar posts desde JavaScript
        // Los posts ya están en el HTML
        // if (!this.postsContainer || !this.posts.length) return;
        
        // this.renderPosts();
        // this.initLazyLoading();
    }

    renderPosts() {
        const postsHTML = this.posts.map(post => this.createPostHTML(post)).join('');
        this.postsContainer.innerHTML = postsHTML;
        
        // Agregar animación de entrada
        this.animatePosts();
    }

    createPostHTML(post) {
        return `
            <article class="post">
                <h2><a href="${post.url}" class="post-link">${post.title}</a></h2>
                <p class="date">📅 Fecha: ${this.formatDate(post.date)}</p>
                <p class="excerpt">${post.excerpt}</p>
                <a href="${post.url}" class="read-more">Leer más →</a>
            </article>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    animatePosts() {
        const posts = this.postsContainer.querySelectorAll('.post');
        posts.forEach((post, index) => {
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                post.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    initLazyLoading() {
        // Si existe Intersection Observer, implementar lazy loading
        if ('IntersectionObserver' in window) {
            const postLinks = this.postsContainer.querySelectorAll('.post-link');
            
            const linkObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        linkObserver.unobserve(entry.target);
                    }
                });
            });

            postLinks.forEach(link => {
                link.style.opacity = '0.8';
                linkObserver.observe(link);
            });
        }
    }
}

// ==============================================
// CLASE: FORM VALIDATOR
// Maneja la validación de formularios
// ==============================================
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupValidation();
        this.addRealTimeValidation();
    }

    setupValidation() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.submitForm();
        }
    }

    validateForm() {
        const name = this.getFieldValue('name');
        const email = this.getFieldValue('email');
        const message = this.getFieldValue('message');
        
        let isValid = true;
        
        // Validar nombre
        if (!name.trim()) {
            this.showFieldError('name', 'El nombre es requerido');
            isValid = false;
        }
        
        // Validar email
        if (!email.trim()) {
            this.showFieldError('email', 'El email es requerido');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError('email', 'Por favor, ingresa un email válido');
            isValid = false;
        }
        
        // Validar mensaje
        if (!message.trim()) {
            this.showFieldError('message', 'El mensaje es requerido');
            isValid = false;
        } else if (message.trim().length < 10) {
            this.showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        }
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id;
        
        this.clearFieldError(field);
        
        if (!value) {
            this.showFieldError(fieldName, 'Este campo es requerido');
            return false;
        }
        
        if (fieldName === 'email' && !this.isValidEmail(value)) {
            this.showFieldError(fieldName, 'Por favor, ingresa un email válido');
            return false;
        }
        
        if (fieldName === 'message' && value.length < 10) {
            this.showFieldError(fieldName, 'El mensaje debe tener al menos 10 caracteres');
            return false;
        }
        
        return true;
    }

    getFieldValue(fieldName) {
        const field = document.getElementById(fieldName);
        return field ? field.value.trim() : '';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        // Remover error previo si existe
        this.clearFieldError(field);
        
        // Agregar mensaje de error
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    clearFieldError(fieldOrFieldName) {
        const field = typeof fieldOrFieldName === 'string' 
            ? document.getElementById(fieldOrFieldName) 
            : fieldOrFieldName;
            
        if (!field) return;
        
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async submitForm() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Mostrar estado de carga
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // Aquí se integrará con Supabase
            // Por ahora, simular envío exitoso
            await this.simulateSubmission();
            
            this.showSuccessMessage();
            this.form.reset();
            
        } catch (error) {
            this.showErrorMessage();
            console.error('Error al enviar formulario:', error);
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    }

    showSuccessMessage() {
        this.showNotification('¡Mensaje enviado exitosamente!', 'success');
    }

    showErrorMessage() {
        this.showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
    }

    showNotification(message, type = 'info') {
        // Remover notificación previa si existe
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '10000',
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Colores según tipo
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
        } else {
            notification.style.backgroundColor = '#17a2b8';
        }
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
}

// ==============================================
// CLASE: SCROLL ANIMATIONS
// Maneja animaciones basadas en scroll
// ==============================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
        this.init();
    }

    init() {
        if (!this.elements.length) return;
        
        if ('IntersectionObserver' in window) {
            this.initIntersectionObserver();
        } else {
            // Fallback para navegadores sin Intersection Observer
            this.initFallbackAnimations();
        }
    }

    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }

    initFallbackAnimations() {
        // Animar todos los elementos inmediatamente
        this.elements.forEach(element => {
            element.classList.add('animated');
        });
    }
}

// ==============================================
// INICIALIZADOR PRINCIPAL
// ==============================================
class SARApp {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        try {
            // Inicializar módulos
            this.modules.header = new HeaderManager();
            // MobileMenu integrado arriba en DOMContentLoaded
            this.modules.blog = new BlogManager();
            this.modules.form = new FormValidator('contact-form');
            this.modules.scrollAnimations = new ScrollAnimations();
            
            console.log('✅ SAR Abogados - Todas las funcionalidades inicializadas correctamente');
            
        } catch (error) {
            console.error('❌ Error al inicializar módulos:', error);
        }
    }

    // Método público para acceder a los módulos
    getModule(moduleName) {
        return this.modules[moduleName];
    }
}

// ==============================================
// INICIALIZACIÓN
// ==============================================
// Crear instancia global de la aplicación
window.SARApp = new SARApp();

// Exportar para uso en módulos externos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HeaderManager, BlogManager, FormValidator, ScrollAnimations, SARApp };
}

// ==============================================
// MANEJADOR DE REDES SOCIALES
// Muestra "en proceso" solo para redes no funcionales (no WhatsApp)
// ==============================================
class SocialMediaHandler {
    constructor() {
        this.messageDiv = null;
        this.init();
    }

    init() {
        // Crear elemento de mensaje
        this.createMessageElement();
        
        // Agregar event listeners a los enlaces de redes sociales (excepto WhatsApp)
        this.bindEvents();
        
        console.log('✅ Social Media Handler inicializado');
    }

    createMessageElement() {
        this.messageDiv = document.createElement('div');
        this.messageDiv.id = 'social-message';
        this.messageDiv.className = 'social-message';
        this.messageDiv.innerHTML = '🔄 Esta red social está en proceso...';
        this.messageDiv.style.display = 'none';
        document.body.appendChild(this.messageDiv);
    }

    bindEvents() {
        // Seleccionar solo los enlaces de redes sociales que NO son WhatsApp
        const socialLinks = document.querySelectorAll('.social-link:not([href*="wa.me"]):not([target="_blank"])');
        
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProcessMessage();
            });
        });
    }

    showProcessMessage() {
        if (!this.messageDiv) return;
        
        // Mostrar mensaje
        this.messageDiv.style.display = 'block';
        this.messageDiv.classList.add('show');
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            this.messageDiv.classList.remove('show');
            setTimeout(() => {
                if (this.messageDiv) {
                    this.messageDiv.style.display = 'none';
                }
            }, 300);
        }, 3000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si existen los elementos de redes sociales
    if (document.querySelector('.social-link')) {
        window.socialMediaHandler = new SocialMediaHandler();
    }
});

// ==============================================
// CLASE: BLOG FILTER
// Maneja el filtrado de posts por categoría
// ==============================================
class BlogFilter {
    constructor() {
        this.categoryLinks = document.querySelectorAll('.category-list a');
        this.posts = document.querySelectorAll('.posts-container .post');
        this.init();
    }

    init() {
        if (!this.categoryLinks.length || !this.posts.length) return;
        
        console.log('✅ Blog Filter inicializado');
        console.log(`📊 Posts encontrados: ${this.posts.length}`);
        console.log(`📂 Categorías encontradas: ${this.categoryLinks.length}`);
        
        this.bindEvents();
    }

    bindEvents() {
        this.categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.getAttribute('data-category');
                
                // Actualizar estado activo
                this.categoryLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Filtrar posts
                this.filterPosts(category);
                
                console.log(`🔍 Filtrando por categoría: ${category}`);
            });
        });
    }

    filterPosts(category) {
        let visiblePosts = [];
        
        this.posts.forEach(post => {
            const postCategory = post.getAttribute('data-category');
            
            if (!category || category === 'all' || postCategory === category) {
                visiblePosts.push(post);
                // Resetear estilos para que la paginación los maneje
                post.style.display = 'block';
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            } else {
                // Ocultar post
                post.style.display = 'none';
                post.style.opacity = '0';
            }
        });
        
        console.log(`✅ Posts visibles después del filtro: ${visiblePosts.length}`);
        
        // Actualizar paginación con posts filtrados
        if (window.blogPagination) {
            window.blogPagination.updatePagination(visiblePosts);
        }
        
        // Mostrar mensaje si no hay posts
        this.showNoResultsMessage(visiblePosts.length);
    }

    showNoResultsMessage(count) {
        const container = document.querySelector('.posts-container');
        if (!container) return;
        
        // Remover mensaje previo si existe
        const existingMessage = container.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Si no hay resultados, mostrar mensaje
        if (count === 0) {
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <p style="text-align: center; padding: 2rem; color: var(--color-text-light);">
                    📭 No hay artículos en esta categoría por el momento.
                </p>
            `;
            container.appendChild(message);
        }
    }
}

// Inicializar filtro de blog cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.posts-container')) {
        window.blogFilter = new BlogFilter();
    }
});

// ==============================================
// CLASE: BLOG PAGINATION
// Maneja la paginación de posts del blog
// ==============================================
class BlogPagination {
    constructor() {
        this.postsPerPage = 5; // 5 posts por página
        this.currentPage = 1;
        this.posts = Array.from(document.querySelectorAll('.posts-container .post'));
        this.totalPosts = this.posts.length;
        this.totalPages = Math.ceil(this.totalPosts / this.postsPerPage);
        
        // Elementos del DOM
        this.postsContainer = document.querySelector('.posts-container');
        this.paginationContainer = document.querySelector('#pagination');
        this.prevButton = document.querySelector('#prev-page');
        this.nextButton = document.querySelector('#next-page');
        this.pageInfo = document.querySelector('.pagination-info');
        
        this.init();
    }

    init() {
        if (!this.postsContainer || !this.paginationContainer) {
            console.log('❌ Elementos de paginación no encontrados');
            return;
        }
        
        console.log('✅ Blog Pagination inicializado');
        console.log(`📊 Total de posts: ${this.totalPosts}`);
        console.log(`📄 Total de páginas: ${this.totalPages}`);
        console.log(`📝 Posts por página: ${this.postsPerPage}`);
        
        // Configurar eventos
        this.bindEvents();
        
        // Mostrar primera página
        this.showPage(1);
    }

    bindEvents() {
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.showPage(this.currentPage - 1);
                    this.scrollToTop();
                }
            });
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                if (this.currentPage < this.totalPages) {
                    this.showPage(this.currentPage + 1);
                    this.scrollToTop();
                }
            });
        }
    }

    showPage(pageNumber) {
        this.currentPage = pageNumber;
        
        // Calcular índices
        const startIndex = (pageNumber - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        
        // Ocultar todos los posts primero
        this.posts.forEach(post => {
            post.style.display = 'none';
            post.style.opacity = '0';
        });
        
        // Mostrar posts de la página actual con animación
        const postsToShow = this.posts.slice(startIndex, endIndex);
        postsToShow.forEach((post, index) => {
            post.style.display = 'block';
            
            setTimeout(() => {
                post.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Actualizar controles de paginación
        this.updatePaginationControls();
        
        console.log(`📄 Mostrando página ${pageNumber} de ${this.totalPages}`);
        console.log(`📝 Posts mostrados: ${postsToShow.length}`);
    }

    updatePaginationControls() {
        // Actualizar botones
        if (this.prevButton) {
            this.prevButton.disabled = this.currentPage === 1;
        }
        
        if (this.nextButton) {
            this.nextButton.disabled = this.currentPage === this.totalPages;
        }
        
        // Actualizar información de página
        if (this.pageInfo) {
            this.pageInfo.textContent = `Página ${this.currentPage} de ${this.totalPages}`;
        }
    }

    scrollToTop() {
        // Scroll suave hacia el inicio del contenedor de posts
        const blogSection = document.querySelector('.blog-page');
        if (blogSection) {
            const offset = 100; // Offset para el header
            const elementPosition = blogSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Método público para actualizar la paginación (útil cuando se filtra por categoría)
    updatePagination(filteredPosts = null) {
        if (filteredPosts) {
            this.posts = filteredPosts;
            this.totalPosts = this.posts.length;
        } else {
            this.posts = Array.from(document.querySelectorAll('.posts-container .post'));
            this.totalPosts = this.posts.length;
        }
        
        this.totalPages = Math.ceil(this.totalPosts / this.postsPerPage);
        this.currentPage = 1;
        this.showPage(1);
    }
}

// Inicializar paginación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.posts-container') && document.querySelector('#pagination')) {
        window.blogPagination = new BlogPagination();
    }
});