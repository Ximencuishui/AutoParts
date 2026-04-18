/**
 * Customer membership tiers only (localStorage: apg_admin_customer_loyalty).
 * Rebate settings live in apg_admin_marketing — see admin-marketing.js.
 */
(function (global) {
    var STORAGE_KEY = 'apg_admin_customer_loyalty';

    function defaultTiers() {
        return [
            { code: 'bronze', name: 'Bronze', minSpend: 0, discountPercent: 0, pointsMultiplier: 1 },
            { code: 'silver', name: 'Silver', minSpend: 500, discountPercent: 2, pointsMultiplier: 1.1 },
            { code: 'gold', name: 'Gold', minSpend: 2000, discountPercent: 5, pointsMultiplier: 1.25 },
            { code: 'platinum', name: 'Platinum', minSpend: 8000, discountPercent: 8, pointsMultiplier: 1.5 }
        ];
    }

    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { tiers: defaultTiers() };
            var o = JSON.parse(raw);
            var d = { tiers: defaultTiers() };
            if (Array.isArray(o.tiers) && o.tiers.length) {
                d.tiers = o.tiers.map(function (t, i) {
                    var b = defaultTiers()[i] || defaultTiers()[0];
                    return {
                        code: t.code || b.code,
                        name: t.name != null ? String(t.name) : b.name,
                        minSpend: Number(t.minSpend) || 0,
                        discountPercent: Number(t.discountPercent) || 0,
                        pointsMultiplier: Number(t.pointsMultiplier) > 0 ? Number(t.pointsMultiplier) : 1
                    };
                });
                while (d.tiers.length < 4) {
                    d.tiers.push(defaultTiers()[d.tiers.length]);
                }
                d.tiers = d.tiers.slice(0, 4);
            }
            return d;
        } catch (e) {
            return { tiers: defaultTiers() };
        }
    }

    function save(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ tiers: data.tiers || defaultTiers() }));
    }

    global.APGCustomerLoyalty = {
        STORAGE_KEY: STORAGE_KEY,
        defaultTiers: defaultTiers,
        load: load,
        save: save
    };
})(typeof window !== 'undefined' ? window : {});
