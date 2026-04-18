/**
 * Marketing: rebate, promotions, referral (localStorage: apg_admin_marketing).
 * Migrates rebate from legacy apg_admin_customer_loyalty.rebate once.
 */
(function (global) {
    var STORAGE_KEY = 'apg_admin_marketing';
    var LEGACY_LOYALTY_KEY = 'apg_admin_customer_loyalty';

    function defaultRebate() {
        return {
            enabled: true,
            orderRebatePercent: 1,
            settlementDays: 30,
            minOrderForRebate: 50
        };
    }

    function defaultPromotions() {
        return {
            enabled: true,
            rows: [
                { title: 'Summer parts sale', type: 'percent', value: 10, minCart: 100, start: '', end: '', active: true },
                { title: '', type: 'fixed', value: 15, minCart: 80, start: '', end: '', active: false },
                { title: '', type: 'percent', value: 5, minCart: 0, start: '', end: '', active: false }
            ]
        };
    }

    function defaultReferral() {
        return {
            enabled: true,
            referrerCredit: 20,
            refereeCredit: 10,
            minOrderToUnlock: 50,
            attributionDays: 30
        };
    }

    function defaults() {
        return {
            rebate: defaultRebate(),
            promotions: defaultPromotions(),
            referral: defaultReferral()
        };
    }

    function stripRebateFromLegacyLoyalty() {
        try {
            var raw = localStorage.getItem(LEGACY_LOYALTY_KEY);
            if (!raw) return;
            var o = JSON.parse(raw);
            if (!o.rebate) return;
            delete o.rebate;
            localStorage.setItem(LEGACY_LOYALTY_KEY, JSON.stringify(o));
        } catch (e) {}
    }

    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                var o = JSON.parse(raw);
                var d = defaults();
                if (o.rebate) {
                    d.rebate.enabled = !!o.rebate.enabled;
                    d.rebate.orderRebatePercent = Number(o.rebate.orderRebatePercent) || 0;
                    d.rebate.settlementDays = Number(o.rebate.settlementDays) || 30;
                    d.rebate.minOrderForRebate = Number(o.rebate.minOrderForRebate) || 0;
                }
                if (o.promotions && Array.isArray(o.promotions.rows)) {
                    d.promotions.enabled = !!o.promotions.enabled;
                    for (var i = 0; i < 3; i++) {
                        var r = o.promotions.rows[i];
                        var b = defaultPromotions().rows[i];
                        if (!r) continue;
                        d.promotions.rows[i] = {
                            title: r.title != null ? String(r.title) : b.title,
                            type: r.type === 'fixed' || r.type === 'shipping' ? r.type : 'percent',
                            value: Number(r.value) || 0,
                            minCart: Number(r.minCart) || 0,
                            start: r.start != null ? String(r.start) : '',
                            end: r.end != null ? String(r.end) : '',
                            active: !!r.active
                        };
                    }
                }
                if (o.referral) {
                    d.referral.enabled = !!o.referral.enabled;
                    d.referral.referrerCredit = Number(o.referral.referrerCredit) || 0;
                    d.referral.refereeCredit = Number(o.referral.refereeCredit) || 0;
                    d.referral.minOrderToUnlock = Number(o.referral.minOrderToUnlock) || 0;
                    d.referral.attributionDays = Number(o.referral.attributionDays) || 30;
                }
                return d;
            }
            raw = localStorage.getItem(LEGACY_LOYALTY_KEY);
            if (raw) {
                var leg = JSON.parse(raw);
                var out = defaults();
                if (leg.rebate) {
                    out.rebate.enabled = !!leg.rebate.enabled;
                    out.rebate.orderRebatePercent = Number(leg.rebate.orderRebatePercent) || 0;
                    out.rebate.settlementDays = Number(leg.rebate.settlementDays) || 30;
                    out.rebate.minOrderForRebate = Number(leg.rebate.minOrderForRebate) || 0;
                }
                return out;
            }
        } catch (e) {}
        return defaults();
    }

    function save(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        stripRebateFromLegacyLoyalty();
    }

    global.APGAdminMarketing = {
        STORAGE_KEY: STORAGE_KEY,
        defaults: defaults,
        load: load,
        save: save
    };
})(typeof window !== 'undefined' ? window : {});
