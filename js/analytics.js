/**
 * Google Analytics 4 (GA4) Configuration
 * SAR Abogados Especializados
 * ID: G-FWP8GTHPK6
 */

// Configuración de Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Inicialización de Google Analytics
gtag('js', new Date());
gtag('config', 'G-FWP8GTHPK6', {
    page_title: document.title,
    page_location: window.location.href,
    content_group1: 'Legal Services',
    content_group2: 'Colombian Law Firm'
});

// Evento de carga de página completada
document.addEventListener('DOMContentLoaded', function() {
    gtag('event', 'page_load', {
        page_title: document.title,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
    });
});

// Función para trackear eventos personalizados
function trackEvent(eventName, eventParams = {}) {
    gtag('event', eventName, {
        event_category: 'engagement',
        event_label: document.title,
        ...eventParams
    });
}

// Función para trackear clics en formularios de contacto
function trackContactForm() {
    trackEvent('contact_form_submit', {
        event_category: 'lead_generation',
        event_label: 'Contact Form'
    });
}

// Función para trackear clics en teléfonos
function trackPhoneClick() {
    trackEvent('phone_click', {
        event_category: 'contact',
        event_label: 'Phone Number'
    });
}

// Función para trackear clics en email
function trackEmailClick() {
    trackEvent('email_click', {
        event_category: 'contact',
        event_label: 'Email Address'
    });
}

// Función para trackear tiempo en página
let startTime = Date.now();
window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', {
        event_category: 'engagement',
        event_label: document.title,
        value: timeOnPage
    });
});

// Exponer funciones globalmente
window.analytics = {
    trackEvent,
    trackContactForm,
    trackPhoneClick,
    trackEmailClick
};