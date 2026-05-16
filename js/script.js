// ===================================
// Mobile Menu Toggle
// ===================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Header Scroll Effect
// ===================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// Episode Cards Interaction & Video Modal
// ===================================
const episodeCards = document.querySelectorAll('.episode-card');
const videoModal = document.getElementById('videoModal');
const videoContainer = document.getElementById('videoContainer');
const videoModalTitle = document.getElementById('videoModalTitle');
const closeModalBtn = document.getElementById('closeModal');

episodeCards.forEach(card => {
    card.addEventListener('click', function() {
        const videoId = this.getAttribute('data-video-id');
        const episodeTitle = this.getAttribute('data-episode-title');
        
        if (videoId) {
            // Open modal with YouTube video
            openVideoModal(videoId, episodeTitle);
        }
    });
});

function openVideoModal(videoId, title) {
    // Set modal title
    videoModalTitle.textContent = title;
    
    // Create YouTube iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    
    // Clear previous content and add new iframe
    videoContainer.innerHTML = '';
    videoContainer.appendChild(iframe);
    
    // Show modal
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeVideoModal() {
    // Hide modal
    videoModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Clear video container to stop playback
    videoContainer.innerHTML = '';
}

// Close modal when clicking close button
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeVideoModal);
}

// Close modal when clicking outside the content
videoModal.addEventListener('click', function(e) {
    if (e.target === videoModal) {
        closeVideoModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
    }
});

// ===================================
// Subscribe Form Handling
// ===================================
const subscribeForm = document.getElementById('subscribeForm');
const successMessage = document.getElementById('successMessage');

if (subscribeForm) {
    subscribeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        // Basic validation
        if (!name || !email) {
            alert('Por favor, completa todos los campos');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un email válido');
            return;
        }
        
        // Disable submit button to prevent double submission
        const submitButton = subscribeForm.querySelector('.btn-submit');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando... 🐝';
        
        try {
            // Send data to API
            const response = await fetch('https://email-podcast.onrender.com/suscribirse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: name,
                    email: email
                })
            });
            
            if (response.ok) {
                // Success - show success message
                console.log('Suscripción exitosa:', { nombre: name, email: email });
                
                subscribeForm.style.display = 'none';
                successMessage.style.display = 'block';
                successMessage.style.animation = 'fadeIn 0.5s ease';
                
                // Reset form
                subscribeForm.reset();
                
                // Optional: Reset after some time
                setTimeout(() => {
                    subscribeForm.style.display = 'flex';
                    successMessage.style.display = 'none';
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }, 5000);
            } else {
                // Error response from server
                const errorData = await response.json().catch(() => ({}));
                console.error('Error en la suscripción:', errorData);
                alert('Hubo un error al procesar tu suscripción. Por favor, intenta de nuevo.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        } catch (error) {
            // Network or other error
            console.error('Error al conectar con el servidor:', error);
            alert('No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta de nuevo.');
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.episode-card, .host-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// Honeycomb Animation Enhancement
// ===================================
const hexagons = document.querySelectorAll('.hexagon');

hexagons.forEach((hex, index) => {
    hex.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(255, 193, 7, 0.3)';
        this.style.transform = 'scale(1.1)';
    });
    
    hex.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        this.style.transform = 'scale(1)';
    });
});

// ===================================
// Dynamic Year in Footer
// ===================================
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-bottom p');
if (footerText) {
    footerText.textContent = `© ${currentYear} Adentro de la Colmena. Todos los derechos reservados.`;
}

// ===================================
// Add Loading Animation
// ===================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// Keyboard Navigation Enhancement
// ===================================
document.addEventListener('keydown', (e) => {
    // Press 'Escape' to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// ===================================
// Form Input Animation
// ===================================
const formInputs = document.querySelectorAll('.form-input');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// ===================================
// Social Links Tracking (Optional)
// ===================================
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const platform = this.getAttribute('aria-label');
        console.log(`Social link clicked: ${platform}`);
        // You can add analytics tracking here
    });
});

// ===================================
// Episode Card Hover Effect Enhancement
// ===================================
episodeCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const playButton = this.querySelector('.play-button');
        playButton.style.transform = 'scale(1.1)';
        playButton.style.backgroundColor = 'var(--honey-yellow)';
        playButton.style.color = 'var(--ibm-black)';
        playButton.style.boxShadow = '0 0 20px rgba(255, 193, 7, 0.5)';
    });
    
    card.addEventListener('mouseleave', function() {
        const playButton = this.querySelector('.play-button');
        playButton.style.transform = 'scale(1)';
        playButton.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        playButton.style.color = 'var(--ibm-blue)';
        playButton.style.boxShadow = 'none';
    });
});

// ===================================
// Bee Icon Animation on Scroll
// ===================================
const beeIcon = document.querySelector('.bee-icon');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            if (beeIcon) {
                beeIcon.style.transform = `translateY(${scrolled * 0.1}px) rotate(${scrolled * 0.1}deg)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%c🐝 Bienvenido a Adentro de la Colmena! 🐝', 'color: #0f62fe; font-size: 20px; font-weight: bold;');
console.log('%cSi estás viendo esto, ¡eres parte de nuestra comunidad tech! 🚀', 'color: #ffc107; font-size: 14px;');

// ===================================
// Performance Monitoring (Optional)
// ===================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Página cargada en: ${pageLoadTime}ms`);
    });
}

// ===================================
// Add CSS Animation Keyframes via JS
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        padding: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);

// Made with Bob
