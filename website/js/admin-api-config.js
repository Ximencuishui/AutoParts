/**
 * Admin API settings (logistics, payment, LLM) stored in localStorage.
 * Key: apg_admin_api_config
 */
(function (global) {
    var STORAGE_KEY = 'apg_admin_api_config';

    function defaults() {
        return {
            logistics: { endpoint: '', apiKey: '', provider: '' },
            payment: {
                provider: '',
                endpoint: '',
                clientId: '',
                secret: '',
                webhookSecret: ''
            },
            llm: { baseUrl: '', apiKey: '', model: '' }
        };
    }

    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaults();
            var o = JSON.parse(raw);
            var d = defaults();
            if (o.logistics) {
                d.logistics.endpoint = o.logistics.endpoint || '';
                d.logistics.apiKey = o.logistics.apiKey || '';
                d.logistics.provider = o.logistics.provider || '';
            }
            if (o.payment) {
                d.payment.provider = o.payment.provider || '';
                d.payment.endpoint = o.payment.endpoint || '';
                d.payment.clientId = o.payment.clientId || '';
                d.payment.secret = o.payment.secret || '';
                d.payment.webhookSecret = o.payment.webhookSecret || '';
            }
            if (o.llm) {
                d.llm.baseUrl = o.llm.baseUrl || '';
                d.llm.apiKey = o.llm.apiKey || '';
                d.llm.model = o.llm.model || '';
            }
            return d;
        } catch (e) {
            return defaults();
        }
    }

    function save(cfg) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    }

    global.APGAdminApiConfig = {
        STORAGE_KEY: STORAGE_KEY,
        defaults: defaults,
        load: load,
        save: save
    };
})(typeof window !== 'undefined' ? window : {});
