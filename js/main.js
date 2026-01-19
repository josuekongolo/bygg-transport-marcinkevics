/* ============================================
   BYGG OG TRANSPORT MARCINKEVICS
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // Mobile Menu Toggle
    // ============================================

    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Header Scroll Effect
    // ============================================

    const header = document.querySelector('.header');
    let lastScroll = 0;

    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============================================
    // Contact Form Handling
    // ============================================

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const formMessage = document.getElementById('form-message');
            const originalBtnText = submitBtn.textContent;

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sender...';

            // Gather form data
            const formData = {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                phone: this.querySelector('#phone').value,
                address: this.querySelector('#address').value,
                serviceType: this.querySelector('#serviceType').value,
                description: this.querySelector('#description').value,
                wantSiteVisit: this.querySelector('#siteVisit').checked
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.description) {
                showFormMessage('error', 'Vennligst fyll ut alle obligatoriske felt.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage('error', 'Vennligst oppgi en gyldig e-postadresse.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            // Validate phone format (Norwegian phone numbers)
            const phoneRegex = /^(\+47)?[2-9]\d{7}$/;
            const cleanPhone = formData.phone.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFormMessage('error', 'Vennligst oppgi et gyldig telefonnummer.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            try {
                // Here you would normally send to your backend/Resend API
                // For now, we'll simulate a successful submission
                await simulateFormSubmission(formData);

                showFormMessage('success', 'Takk for din henvendelse! Vi kontakter deg så snart som mulig, vanligvis samme dag.');
                contactForm.reset();

            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('error', 'Beklager, noe gikk galt. Vennligst prøv igjen eller ring oss direkte.');
            }

            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    }

    function showFormMessage(type, message) {
        const formMessage = document.getElementById('form-message');
        if (formMessage) {
            formMessage.className = 'form-message ' + type;
            formMessage.textContent = message;
            formMessage.style.display = 'block';

            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide success message after 10 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 10000);
            }
        }
    }

    // Simulate form submission (replace with actual API call)
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Log data for development
                console.log('Form data submitted:', data);
                resolve({ success: true });
            }, 1500);
        });
    }

    // ============================================
    // Form Input Validation Feedback
    // ============================================

    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

    formInputs.forEach(input => {
        // Add validation on blur
        input.addEventListener('blur', function() {
            validateInput(this);
        });

        // Remove error state on focus
        input.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });

    function validateInput(input) {
        const value = input.value.trim();
        const isRequired = input.hasAttribute('required');

        if (isRequired && !value) {
            input.classList.add('error');
            return false;
        }

        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.classList.add('error');
                return false;
            }
        }

        if (input.type === 'tel' && value) {
            const phoneRegex = /^(\+47)?[2-9]\d{7}$/;
            const cleanPhone = value.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                input.classList.add('error');
                return false;
            }
        }

        input.classList.remove('error');
        return true;
    }

    // ============================================
    // Phone Number Formatting
    // ============================================

    const phoneInput = document.querySelector('input[type="tel"]');

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Remove all non-digit characters except +
            let value = this.value.replace(/[^\d+]/g, '');

            // Format Norwegian phone numbers
            if (value.startsWith('+47')) {
                // Format: +47 XXX XX XXX
                if (value.length > 3) {
                    value = value.slice(0, 3) + ' ' + value.slice(3);
                }
                if (value.length > 7) {
                    value = value.slice(0, 7) + ' ' + value.slice(7);
                }
                if (value.length > 10) {
                    value = value.slice(0, 10) + ' ' + value.slice(10);
                }
            } else if (value.length > 3) {
                // Format: XXX XX XXX
                value = value.slice(0, 3) + ' ' + value.slice(3);
                if (value.length > 6) {
                    value = value.slice(0, 6) + ' ' + value.slice(6);
                }
            }

            this.value = value.slice(0, 14); // Max length with spaces
        });
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // Active Navigation Link
    // ============================================

    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.endsWith(href) ||
            (currentPath.endsWith('/') && href === 'index.html') ||
            (currentPath === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ============================================
    // Click to Call Tracking (for analytics)
    // ============================================

    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone click event (add your analytics here)
            console.log('Phone link clicked:', this.href);

            // Example: Google Analytics 4 event
            // gtag('event', 'phone_call', {
            //     'event_category': 'contact',
            //     'event_label': this.href
            // });
        });
    });

    // ============================================
    // Email Link Tracking (for analytics)
    // ============================================

    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track email click event
            console.log('Email link clicked:', this.href);
        });
    });

    // ============================================
    // Service Type Selection Enhancement
    // ============================================

    const serviceTypeSelect = document.getElementById('serviceType');
    const descriptionField = document.getElementById('description');

    if (serviceTypeSelect && descriptionField) {
        serviceTypeSelect.addEventListener('change', function() {
            const placeholders = {
                'bygg': 'Beskriv byggprosjektet ditt (f.eks. type renovering, rom, omfang)...',
                'transport': 'Beskriv transporthjelpen du trenger (f.eks. hva som skal fraktes, hvor fra/til)...',
                'kombinert': 'Beskriv prosjektet ditt og hvilke tjenester du trenger (både bygg og transport)...',
                'usikker': 'Fortell oss hva du trenger hjelp med, så gir vi deg råd...'
            };

            const value = this.value;
            if (placeholders[value]) {
                descriptionField.placeholder = placeholders[value];
            }
        });
    }

    // ============================================
    // Lazy Loading Images
    // ============================================

    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Console Welcome Message
    // ============================================

    console.log('%c BYGG OG TRANSPORT MARCINKEVICS ',
        'background: #E65100; color: white; font-size: 16px; font-weight: bold; padding: 10px;');
    console.log('%c Snekker og transport i Oslo ',
        'color: #455A64; font-size: 12px;');

});

// ============================================
// Helper Functions
// ============================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
