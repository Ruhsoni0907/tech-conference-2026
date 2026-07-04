// Analytics Module for Tech Conference 2026
// Replace GA_MEASUREMENT_ID with your actual Google Analytics ID

const Analytics = {
    init: function(measurementId) {
        // Load Google Analytics
        if (measurementId) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', measurementId, {
                page_title: document.title,
                page_location: window.location.href
            });
            window.gtag = gtag;
        }
    },

    trackEvent: function(eventName, params) {
        if (window.gtag) {
            gtag('event', eventName, params);
        }
    },

    trackRegistration: function(email) {
        this.trackEvent('registration', {
            event_category: 'form',
            event_label: 'tech_conf_2026',
            value: 1
        });
    },

    trackPageView: function(pageName) {
        if (window.gtag) {
            gtag('event', 'page_view', {
                page_title: pageName,
                page_location: window.location.href
            });
        }
    }
};

// Initialize with your GA ID (replace with actual ID)
// Analytics.init('G-XXXXXXXXXX');

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}
