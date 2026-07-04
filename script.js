/* ========================================
   Tech Conference 2026 - JavaScript
   Theme Toggle, Form Validation & Interactivity
   ======================================== */

// Service Worker Registration for PWA & Caching
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered:', reg.scope))
            .catch(err => console.log('SW registration failed:', err));
    });
}

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page Load Time:', Math.round(perfData.loadEventEnd - perfData.startTime), 'ms');
            }
        }, 0);
    });
}

// Lazy Load Images with Intersection Observer
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
}, { rootMargin: '50px 0px' });

lazyImages.forEach(img => imageObserver.observe(img));

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // Theme Toggle Functionality
    // ========================================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ========================================
    // Navbar Functionality
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    });

    // ========================================
    // Form Validation
    // ========================================
    const form = document.getElementById('registration-form');
    const successMessage = document.getElementById('success-message');
    const registerAnotherBtn = document.getElementById('register-another');

    // Input elements
    const inputs = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        terms: document.getElementById('terms')
    };

    // Error elements
    const errors = {
        fullName: document.getElementById('fullName-error'),
        email: document.getElementById('email-error'),
        phone: document.getElementById('phone-error'),
        terms: document.getElementById('terms-error')
    };

    // Validation patterns
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };

    // Show error message
    function showError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }

    // Show success state
    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.classList.remove('visible');
    }

    // Clear validation state
    function clearValidation(input, errorElement) {
        input.classList.remove('error', 'success');
        errorElement.classList.remove('visible');
    }

    // Validate full name
    function validateFullName() {
        const value = inputs.fullName.value.trim();
        if (!value) {
            showError(inputs.fullName, errors.fullName, 'Full name is required');
            return false;
        }
        if (value.length < 2) {
            showError(inputs.fullName, errors.fullName, 'Name must be at least 2 characters');
            return false;
        }
        showSuccess(inputs.fullName, errors.fullName);
        return true;
    }

    // Validate email
    function validateEmail() {
        const value = inputs.email.value.trim();
        if (!value) {
            showError(inputs.email, errors.email, 'Email address is required');
            return false;
        }
        if (!patterns.email.test(value)) {
            showError(inputs.email, errors.email, 'Please enter a valid email address');
            return false;
        }
        showSuccess(inputs.email, errors.email);
        return true;
    }

    // Validate phone (optional but must be valid if provided)
    function validatePhone() {
        const value = inputs.phone.value.trim();
        if (value && value.length < 10) {
            showError(inputs.phone, errors.phone, 'Please enter a valid phone number');
            return false;
        }
        showSuccess(inputs.phone, errors.phone);
        return true;
    }

    // Validate terms checkbox
    function validateTerms() {
        if (!inputs.terms.checked) {
            showError(inputs.terms, errors.terms, 'You must agree to the terms');
            return false;
        }
        errors.terms.classList.remove('visible');
        return true;
    }

    // Real-time validation on blur
    inputs.fullName.addEventListener('blur', validateFullName);
    inputs.email.addEventListener('blur', validateEmail);
    inputs.phone.addEventListener('blur', validatePhone);
    inputs.terms.addEventListener('change', validateTerms);

    // Clear error on input
    inputs.fullName.addEventListener('input', () => {
        if (inputs.fullName.classList.contains('error')) {
            clearValidation(inputs.fullName, errors.fullName);
        }
    });

    inputs.email.addEventListener('input', () => {
        if (inputs.email.classList.contains('error')) {
            clearValidation(inputs.email, errors.email);
        }
    });

    inputs.phone.addEventListener('input', () => {
        if (inputs.phone.classList.contains('error')) {
            clearValidation(inputs.phone, errors.phone);
        }
    });

    // ========================================
    // Form Submission
    // ========================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Run all validations
        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isTermsValid = validateTerms();

        // Check if all validations pass
        if (isFullNameValid && isEmailValid && isPhoneValid && isTermsValid) {
            // Show loading state
            const submitBtn = form.querySelector('.btn-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            submitBtn.disabled = true;

            try {
                // Collect form data
                const formData = {
                    fullName: inputs.fullName.value.trim(),
                    email: inputs.email.value.trim(),
                    phone: inputs.phone.value.trim(),
                    organization: document.getElementById('organization').value.trim(),
                    jobTitle: document.getElementById('jobTitle').value.trim(),
                    dietary: document.getElementById('dietary').value,
                    submittedAt: new Date().toISOString()
                };

                // Submit to API
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Registration failed');
                }

                // Send confirmation email via FormSubmit
                try {
                    await fetch('https://formsubmit.co/ajax/rajsoni999.r@gmail.com', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({
                            _subject: 'New Registration - TechConf 2026',
                            _template: 'table',
                            name: formData.fullName,
                            email: formData.email,
                            phone: formData.phone || 'Not provided',
                            organization: formData.organization || 'Not provided',
                            job_title: formData.jobTitle || 'Not provided',
                            dietary: formData.dietary || 'None',
                            submitted_at: formData.submittedAt
                        })
                    });
                } catch (emailError) {
                    console.log('Email notification failed but registration saved:', emailError);
                }

                // Track registration event
                if (typeof Analytics !== 'undefined') {
                    Analytics.trackRegistration(formData.email);
                }

                // Hide form and show success message
                form.style.display = 'none';
                successMessage.style.display = 'block';

                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch (error) {
                console.error('Form submission error:', error);
                alert('There was an error submitting your registration. Please try again.');
            } finally {
                // Reset button state
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        }
    });

    // ========================================
    // Register Another Person
    // ========================================
    registerAnotherBtn.addEventListener('click', () => {
        // Reset form
        form.reset();

        // Clear all validation states
        Object.keys(inputs).forEach(key => {
            inputs[key].classList.remove('error', 'success');
        });
        Object.keys(errors).forEach(key => {
            errors[key].classList.remove('visible');
        });

        // Hide success message and show form
        successMessage.style.display = 'none';
        form.style.display = 'flex';

        // Scroll to registration section
        document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
    });

    // ========================================
    // Smooth Scroll for CTA Buttons
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                history.pushState(null, null, href);
            }
        });
    });

    // ========================================
    // Intersection Observer for Animations
    // ========================================
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

    // Observe cards for animation
    document.querySelectorAll('.about-card, .speaker-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
