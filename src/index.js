let PerfAnalytics = (function() {
    return {
        __init: function() {
            this.calculateMeasures();
        },

        calculateMeasures: function() {
            let url = this.getURL();
            let ttfb = this.calculateTTFB();
            let fcp = this.calculateFCP();
            let domLoad = this.calculateDOMLoad();
            let windowLoad = this.calculateWindowLoad();
            this.sendAPI('https://oyku-perf-api.herokuapp.com/api/analytics', { url, ttfb, fcp, domLoad, windowLoad });
        },

        getURL: function() {
            return window.location.hostname
        },

        calculateTTFB: function() {
            // https://developer.mozilla.org/en-US/docs/Glossary/time_to_first_byte
            return window.performance.timing.responseStart - window.performance.timing.navigationStart;
        },

        calculateFCP: function() {
            // https://web.dev/fcp/#measure-fcp-in-javascript
            let firstContentfulPaint = window.performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint');
            return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
        },

        calculateDOMLoad: function() {
            // https://stackoverflow.com/questions/14341156/calculating-page-load-time-in-javascript
            return window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart
        },

        calculateWindowLoad: function() {
            // https://developer.mozilla.org/en-US/docs/Web/API/Navigation_timing_API#calculate_the_total_page_load_time
            return window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
        },

        calculateNetworkTimings: function() {
            // https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API#timing_resource_loading_phases
            let resources = window.performance.getEntriesByType("resource");
            let timing;
            let totalTiming = 0;
            for (let i=0; i < resources.length; i++) {
                timing = (resources[i].startTime > 0) ? (resources[i].responseEnd - resources[i].startTime) : "0";
                totalTiming += timing;
            }
            return totalTiming;
        },

        sendAPI: function(url, data) {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            });
        }
    }
})();

PerfAnalytics.__init(); 
