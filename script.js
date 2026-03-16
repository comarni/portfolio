/* ============================================
   Script.js - Portfolio Profesional
   Funcionalidades: Menú responsive, scroll suave,
   validación de formulario y animaciones
   ============================================ */

// ============================================
// 0. Tema oscuro / claro
// ============================================

(function () {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', saved);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }
})();

// ============================================
// 1. Menú Responsive
// ============================================

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');

// ============================================
// Typewriter del título principal
// ============================================

const typewriterElement = document.querySelector('.typewriter');

if (typewriterElement) {
    const fullText = typewriterElement.textContent.trim();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        typewriterElement.textContent = '';
        let currentIndex = 0;
        const typingSpeed = 85;

        const typingInterval = setInterval(() => {
            typewriterElement.textContent += fullText.charAt(currentIndex);
            currentIndex += 1;

            if (currentIndex >= fullText.length) {
                clearInterval(typingInterval);
                typewriterElement.classList.add('typing-done');
            }
        }, typingSpeed);
    } else {
        typewriterElement.classList.add('typing-done');
    }
}

// Toggle del menú hamburguesa
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
    });
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.header')) {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
    }
});

// ============================================
// 2. Scroll Suave para Enlaces Internos
// ============================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Validar que sea un ancla interno
        if (href.startsWith('#')) {
            e.preventDefault();
            
            const targetSection = document.querySelector(href);
            if (targetSection) {
                // Usar scrollIntoView con behavior 'smooth'
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// También aplicar scroll suave al botón CTA del hero
const ctaButton = document.querySelector('.hero .btn-primary');
if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
        const href = ctaButton.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// ============================================
// 3. Validación del Formulario de Contacto
// ============================================

const contactForm = document.getElementById('contactForm');
const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const mensajeInput = document.getElementById('mensaje');
const nombreError = document.getElementById('nombreError');
const emailError = document.getElementById('emailError');
const mensajeError = document.getElementById('mensajeError');
const formMessage = document.getElementById('formMessage');

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función de validación individual
function validateField(field, errorElement, rules) {
    const value = field.value.trim();
    let isValid = true;
    let errorText = '';

    if (rules.required && !value) {
        isValid = false;
        errorText = 'Este campo es obligatorio';
    } else if (rules.email && !isValidEmail(value)) {
        isValid = false;
        errorText = 'Por favor ingresa un email válido';
    } else if (rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorText = `Mínimo ${rules.minLength} caracteres`;
    }

    if (!isValid) {
        errorElement.textContent = errorText;
        errorElement.classList.add('show');
    } else {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    return isValid;
}

// Validación en tiempo real
nombreInput.addEventListener('blur', () => {
    validateField(nombreInput, nombreError, { required: true, minLength: 2 });
});

emailInput.addEventListener('blur', () => {
    validateField(emailInput, emailError, { required: true, email: true });
});

mensajeInput.addEventListener('blur', () => {
    validateField(mensajeInput, mensajeError, { required: true, minLength: 10 });
});

// Limpiar error cuando el usuario empieza a escribir
nombreInput.addEventListener('input', () => {
    if (nombreError.classList.contains('show')) {
        nombreError.classList.remove('show');
    }
});

emailInput.addEventListener('input', () => {
    if (emailError.classList.contains('show')) {
        emailError.classList.remove('show');
    }
});

mensajeInput.addEventListener('input', () => {
    if (mensajeError.classList.contains('show')) {
        mensajeError.classList.remove('show');
    }
});

// Envío del formulario
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validar todos los campos
    const isNombreValid = validateField(nombreInput, nombreError, { required: true, minLength: 2 });
    const isEmailValid = validateField(emailInput, emailError, { required: true, email: true });
    const isMensajeValid = validateField(mensajeInput, mensajeError, { required: true, minLength: 10 });

    // Si todos son válidos, mostrar mensaje de éxito
    if (isNombreValid && isEmailValid && isMensajeValid) {
        formMessage.textContent = '¡Mensaje enviado exitosamente! Te responderé pronto.';
        formMessage.classList.add('success');
        formMessage.classList.remove('error');

        // Limpiar el formulario
        contactForm.reset();

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.classList.remove('success', 'error');
        }, 5000);
    } else {
        formMessage.textContent = 'Por favor completa todos los campos correctamente';
        formMessage.classList.add('error');
        formMessage.classList.remove('success');
    }
});

// ============================================
// 4. Animaciones al hacer Scroll
// ============================================

// Opciones para Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Crear observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos que deben animarse
const animateElements = document.querySelectorAll(
    '.project-card, .skill-pill, .testimonial-card, .skills-category'
);

animateElements.forEach(el => {
    observer.observe(el);
});

// ============================================
// 5. Funcionalidad Adicional: Desplazamiento Activo del Menú
// ============================================

window.addEventListener('scroll', () => {
    let current = '';

    // Scroll progress bar
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }

    // Obtener todas las secciones
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    // Actualizar el estado activo del menú
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// 6. Funcionalidad del Botón "Volver al Inicio"
// ============================================

// Usar el botón existente en el HTML
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// 7. Prevención de Comportamientos Indeseados
// ============================================

// Prevenir zoom en inputs móviles
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        // En algunos navegadores móviles, esto puede prevenir el zoom
        document.documentElement.style.fontSize = '16px';
    });
});

// ============================================
// 8. Inicialización
// ============================================

console.log('Portfolio cargado correctamente');

// Mensaje de bienvenida en consola
console.log('%c Bienvenido a mi Portfolio ', 'background: #2563eb; color: white; padding: 10px; border-radius: 5px;');
console.log('%c Diseñado y desarrollado por Marko ', 'background: #10b981; color: white; padding: 10px; border-radius: 5px;');
