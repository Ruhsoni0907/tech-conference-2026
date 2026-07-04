// API Configuration for Tech Conference 2026
// Replace these values with your actual API endpoints

const CONFIG = {
    // API Endpoint for form submissions
    // Options: 'formspree', 'emailjs', 'custom'
    FORM_PROVIDER: 'custom',

    // Formspree Configuration
    FORMSPREE_ENDPOINT: 'https://formspree.io/f/YOUR_FORM_ID',

    // EmailJS Configuration
    EMAILJS_SERVICE_ID: 'your_service_id',
    EMAILJS_TEMPLATE_ID: 'your_template_id',
    EMAILJS_PUBLIC_KEY: 'your_public_key',

    // Custom API Endpoint
    CUSTOM_API_URL: '/api/register',

    // Google Analytics
    GA_MEASUREMENT_ID: '', // Replace with your GA ID

    // Site URL
    SITE_URL: 'https://tech-conference-2026.vercel.app'
};

// Form Submission Handler
const FormHandler = {
    submit: async function(formData) {
        switch (CONFIG.FORM_PROVIDER) {
            case 'formspree':
                return this.submitToFormspree(formData);
            case 'emailjs':
                return this.submitToEmailJS(formData);
            case 'custom':
                return this.submitToCustomAPI(formData);
            default:
                throw new Error('Invalid form provider');
        }
    },

    submitToFormspree: async function(formData) {
        const response = await fetch(CONFIG.FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        return response.json();
    },

    submitToEmailJS: async function(formData) {
        // EmailJS requires the emailjs library
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS library not loaded');
        }
        return emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, formData, CONFIG.EMAILJS_PUBLIC_KEY);
    },

    submitToCustomAPI: async function(formData) {
        const response = await fetch(CONFIG.CUSTOM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        return response.json();
    }
};
