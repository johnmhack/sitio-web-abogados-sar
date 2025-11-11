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
// CLASE: MOBILE MENU
// Maneja el menú móvil
// ==============================================
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('menu-toggle');
        this.navMenu = document.querySelector('.main-nav .nav-menu');
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.navMenu) return;
        
        this.menuToggle.addEventListener('click', this.toggleMenu.bind(this));
        
        // Cerrar menú al hacer click en enlaces
        const navLinks = this.navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });
        
        // Cerrar menú al redimensionar ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('show');
        
        // Actualizar aria-expanded para accesibilidad
        const isExpanded = this.navMenu.classList.contains('show');
        this.menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Prevenir scroll del body cuando el menú está abierto
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.navMenu.classList.remove('show');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

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
        if (!this.postsContainer || !this.posts.length) return;
        
        this.renderPosts();
        this.initLazyLoading();
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
            this.modules.mobileMenu = new MobileMenu();
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
    module.exports = { HeaderManager, MobileMenu, BlogManager, FormValidator, ScrollAnimations, SARApp };
}