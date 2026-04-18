/**
 * Buyer center: show latest marketing rules (from APGAdminMarketing) + referral code/link.
 */
(function (global) {
    var MAP_KEY = 'apg_buyer_referral_map';

    function esc(s) {
        var d = document.createElement('div');
        d.textContent = s == null ? '' : String(s);
        return d.innerHTML;
    }

    function getMap() {
        try {
            return JSON.parse(localStorage.getItem(MAP_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveMap(map) {
        localStorage.setItem(MAP_KEY, JSON.stringify(map));
    }

    function randomSegment() {
        return Math.random().toString(36).slice(2, 6).toUpperCase();
    }

    /** Stable code per email; call with regenerate=true for new code. */
    function getReferralRecord(email, regenerate) {
        var map = getMap();
        var key = String(email || '').toLowerCase();
        if (!key) return null;
        if (!regenerate && map[key]) return map[key];
        var code = 'APG-' + randomSegment() + randomSegment().slice(0, 2);
        map[key] = { code: code, createdAt: new Date().toISOString() };
        saveMap(map);
        return map[key];
    }

    function referralRegisterUrl(code) {
        try {
            return new URL('register.html?ref=' + encodeURIComponent(code), global.location.href).href;
        } catch (e) {
            return 'register.html?ref=' + encodeURIComponent(code);
        }
    }

    function formatMoney(n) {
        var x = Number(n);
        if (isNaN(x)) return '—';
        return x.toFixed(2);
    }

    function typeLabel(type) {
        if (type === 'fixed') return '固定减额';
        if (type === 'shipping') return '包邮';
        return '折扣%';
    }

    function renderPolicies(container) {
        if (!container || !global.APGAdminMarketing) {
            if (container) container.innerHTML = '<p class="text-gray-500 text-sm">暂无法读取营销配置（需与后台共用本机数据）。</p>';
            return;
        }
        var cfg = APGAdminMarketing.load();
        var r = cfg.rebate || {};
        var p = cfg.promotions || {};
        var rows = (p.rows || []).filter(function (x) { return x && (x.title || x.active); });
        var ref = cfg.referral || {};

        var html = '';
        html += '<div class="rounded-lg border border-primary-100 bg-primary-50/50 p-4 mb-4">';
        html += '<h4 class="font-semibold text-gray-900 mb-2">返利</h4>';
        html += '<ul class="text-sm text-gray-700 space-y-1 list-disc list-inside">';
        html += '<li>' + esc(r.enabled ? '已开启' : '已关闭') + ' · 订单额（税前）' + esc(String(r.orderRebatePercent || 0)) + '% 计入返利</li>';
        html += '<li>结算周期 ' + esc(String(r.settlementDays || 30)) + ' 天 · 参与门槛订单 ≥ $' + esc(String(r.minOrderForRebate || 0)) + '</li>';
        html += '</ul></div>';

        html += '<div class="rounded-lg border border-gray-200 p-4 mb-4">';
        html += '<h4 class="font-semibold text-gray-900 mb-2">促销</h4>';
        html += '<p class="text-xs text-gray-500 mb-2">促销引擎：' + esc(p.enabled ? '开' : '关') + '</p>';
        if (!rows.length) {
            html += '<p class="text-sm text-gray-500">暂无规则。</p>';
        } else {
            html += '<ul class="text-sm text-gray-700 space-y-2">';
            rows.forEach(function (row) {
                html += '<li class="border-b border-gray-100 pb-2 last:border-0"><span class="font-medium">' + esc(row.title || '（未命名）') + '</span> · ';
                html += esc(typeLabel(row.type)) + ' · ' + (row.active ? '生效中' : '未启用') + '</li>';
            });
            html += '</ul>';
        }
        html += '</div>';

        html += '<div class="rounded-lg border border-gray-200 p-4">';
        html += '<h4 class="font-semibold text-gray-900 mb-2">推广奖励</h4>';
        html += '<ul class="text-sm text-gray-700 space-y-1 list-disc list-inside">';
        html += '<li>' + esc(ref.enabled ? '活动进行中' : '活动未开启') + '</li>';
        html += '<li>新用户 $' + esc(formatMoney(ref.refereeCredit)) + ' · 推广人 $' + esc(formatMoney(ref.referrerCredit)) + '（解锁后）</li>';
        html += '<li>首单满 $' + esc(String(ref.minOrderToUnlock || 0)) + ' 解锁 · 归因 ' + esc(String(ref.attributionDays || 30)) + ' 天</li>';
        html += '</ul></div>';

        container.innerHTML = html;
    }

    function copyText(text, onOk) {
        if (!text) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () { if (onOk) onOk(); }).catch(function () {});
        } else {
            var ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                if (onOk) onOk();
            } catch (e) {}
            document.body.removeChild(ta);
        }
    }

    function initMarketingTab() {
        var sess = global.APGAuth && APGAuth.getSession();
        if (!sess || sess.role === 'admin') return;

        renderPolicies(document.getElementById('buyer-marketing-policies'));

        var codeEl = document.getElementById('buyer-ref-code');
        var linkEl = document.getElementById('buyer-ref-link');
        var hintEl = document.getElementById('buyer-ref-hint');
        if (!codeEl || !linkEl) return;

        function applyRecord(rec) {
            if (!rec) return;
            codeEl.value = rec.code;
            linkEl.value = referralRegisterUrl(rec.code);
            if (hintEl) hintEl.textContent = '分享链接或推广码；好友通过链接注册或注册时填写推广码即可关联。';
        }

        applyRecord(getReferralRecord(sess.email, false));

        if (!global._apgBuyerMktUiBound) {
            global._apgBuyerMktUiBound = true;
            var genBtn = document.getElementById('buyer-ref-generate');
            if (genBtn) {
                genBtn.addEventListener('click', function () {
                    var s = global.APGAuth && APGAuth.getSession();
                    if (!s) return;
                    applyRecord(getReferralRecord(s.email, true));
                });
            }
            document.querySelectorAll('[data-copy-target]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var id = btn.getAttribute('data-copy-target');
                    var el = document.getElementById(id);
                    if (el && el.value) {
                        copyText(el.value, function () {
                            var t = btn.getAttribute('data-copy-done');
                            if (t) {
                                var o = btn.textContent;
                                btn.textContent = t;
                                setTimeout(function () { btn.textContent = o; }, 1500);
                            }
                        });
                    }
                });
            });
        }
    }

    global.APGBuyerMarketing = {
        getReferralRecord: getReferralRecord,
        referralRegisterUrl: referralRegisterUrl,
        renderPolicies: renderPolicies,
        initMarketingTab: initMarketingTab
    };
})(typeof window !== 'undefined' ? window : {});
