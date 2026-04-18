/**
 * Account page — mock shipment tracking (prototype, no carrier API).
 */
(function (global) {
    var MOCK = {
        'ORD-7845': {
            carrier: 'FedEx',
            trackingNo: '1Z999AA10123456784',
            statusLabel: 'Processing',
            statusClass: 'bg-yellow-100 text-yellow-800',
            estDelivery: 'Est. delivery Apr 22, 2026',
            steps: [
                { title: 'Order placed', detail: 'Apr 15, 2026 · Payment confirmed', done: true, current: false },
                { title: 'Warehouse processing', detail: 'Picking & quality check', done: true, current: false },
                { title: 'Preparing shipment', detail: 'Packaging your parts', done: false, current: true },
                { title: 'Shipped', detail: 'Handed to carrier', done: false, current: false },
                { title: 'In transit', detail: 'On the way to you', done: false, current: false },
                { title: 'Delivered', detail: 'Signed at delivery address', done: false, current: false }
            ]
        },
        'ORD-7723': {
            carrier: 'UPS',
            trackingNo: '1Z0635X6897584993',
            statusLabel: 'Shipped',
            statusClass: 'bg-blue-100 text-blue-800',
            estDelivery: 'Est. delivery Apr 18, 2026',
            steps: [
                { title: 'Order placed', detail: 'Apr 10, 2026', done: true, current: false },
                { title: 'Shipped', detail: 'Apr 12, 2026 · Columbus, OH', done: true, current: false },
                { title: 'In transit', detail: 'Arrived at regional hub · Chicago, IL', done: true, current: true },
                { title: 'Out for delivery', detail: 'Scheduled today', done: false, current: false },
                { title: 'Delivered', detail: '', done: false, current: false }
            ]
        },
        'ORD-7652': {
            carrier: 'USPS',
            trackingNo: '9405511899223344556677',
            statusLabel: 'Delivered',
            statusClass: 'bg-green-100 text-green-800',
            estDelivery: 'Delivered Apr 8, 2026',
            steps: [
                { title: 'Order placed', detail: 'Apr 5, 2026', done: true, current: false },
                { title: 'Shipped', detail: 'Apr 6, 2026', done: true, current: false },
                { title: 'In transit', detail: 'Apr 7, 2026', done: true, current: false },
                { title: 'Delivered', detail: 'Left in parcel locker · Signed by recipient', done: true, current: false }
            ]
        }
    };

    function normalizeOrderId(raw) {
        var s = String(raw || '').trim().toUpperCase().replace(/\s+/g, '');
        if (!s) return '';
        if (s.indexOf('ORD-') === 0) return s;
        if (/^ORD\d+$/.test(s)) return 'ORD-' + s.slice(3);
        if (/^\d+$/.test(s)) return 'ORD-' + s;
        return '';
    }

    function escapeHtml(str) {
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function renderTracking(container, errEl, data) {
        errEl.classList.add('hidden');
        errEl.textContent = '';
        container.classList.remove('hidden');
        var stepsHtml = '<div class="relative ml-2 border-l-2 border-gray-200 pl-8 space-y-8">';
        data.steps.forEach(function (step) {
            var dot =
                step.done
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : step.current
                        ? 'border-primary-600 bg-white ring-4 ring-primary-100'
                        : 'border-gray-300 bg-gray-100';
            stepsHtml +=
                '<div class="relative -ml-px">' +
                '<span class="absolute -left-[33px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ' +
                dot +
                '">' +
                (step.done ? '<i class="fas fa-check text-[9px]"></i>' : '') +
                '</span>' +
                '<p class="font-medium text-gray-900">' +
                escapeHtml(step.title) +
                '</p>' +
                (step.detail
                    ? '<p class="text-sm text-gray-500 mt-1">' + escapeHtml(step.detail) + '</p>'
                    : '') +
                '</div>';
        });
        stepsHtml += '</div>';

        container.innerHTML =
            '<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">' +
            '<div class="flex flex-wrap items-start justify-between gap-4 mb-6">' +
            '<div>' +
            '<p class="text-sm text-gray-500">Carrier</p>' +
            '<p class="text-lg font-semibold text-gray-900">' + escapeHtml(data.carrier) + '</p>' +
            '</div>' +
            '<span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ' + data.statusClass + '">' +
            escapeHtml(data.statusLabel) +
            '</span>' +
            '</div>' +
            '<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md bg-gray-50 px-4 py-3">' +
            '<div>' +
            '<p class="text-xs text-gray-500 uppercase tracking-wide">Tracking number</p>' +
            '<p class="font-mono text-sm text-gray-900 tracking-tight" id="tracking-number-display">' + escapeHtml(data.trackingNo) + '</p>' +
            '</div>' +
            '<button type="button" id="tracking-copy-btn" class="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">' +
            '<i class="fas fa-copy mr-1"></i> Copy' +
            '</button>' +
            '</div>' +
            '<p class="text-sm text-primary-700 mb-6"><i class="fas fa-calendar-alt mr-1"></i> ' + escapeHtml(data.estDelivery) + '</p>' +
            '<h3 class="text-sm font-semibold text-gray-700 mb-4">Shipment progress</h3>' +
            stepsHtml +
            '</div>';

        var copyBtn = document.getElementById('tracking-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                var t = data.trackingNo;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(t).then(function () {
                        copyBtn.innerHTML = '<i class="fas fa-check mr-1"></i> Copied';
                        setTimeout(function () {
                            copyBtn.innerHTML = '<i class="fas fa-copy mr-1"></i> Copy';
                        }, 2000);
                    });
                }
            });
        }
    }

    function runLookup() {
        var input = document.getElementById('tracking-order-input');
        var errEl = document.getElementById('tracking-error');
        var resultEl = document.getElementById('tracking-result');
        if (!input || !errEl || !resultEl) return;

        var id = normalizeOrderId(input.value);
        if (!id) {
            resultEl.classList.add('hidden');
            resultEl.innerHTML = '';
            errEl.textContent = 'Please enter a valid order number (e.g. ORD-7845 or 7845).';
            errEl.classList.remove('hidden');
            return;
        }

        var data = MOCK[id];
        if (!data) {
            resultEl.classList.add('hidden');
            resultEl.innerHTML = '';
            errEl.textContent = 'Order not found or not linked to your account. Check the number on your order confirmation email.';
            errEl.classList.remove('hidden');
            return;
        }

        renderTracking(resultEl, errEl, data);
    }

    function init() {
        var form = document.getElementById('tracking-lookup-form');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            runLookup();
        });
        global.APGTrackLookup = runLookup;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(typeof window !== 'undefined' ? window : {});
