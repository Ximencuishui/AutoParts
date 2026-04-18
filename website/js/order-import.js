/**
 * Buyer — import local order lines and fuzzy-match to store catalog (prototype).
 */
(function (global) {
    var CATALOG = [
        {
            sku: 'APG-GRILLE-FE',
            title: 'Front Grille Assembly',
            price: 149.99,
            href: 'product-detail.html',
            img: 'https://p26-doubao-search-sign.byteimg.com/labis/image/d5ee5b4a29e6cd14ee4f52ae0b4ed05b~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1792033277&x-signature=xrxHPF2Z9pYCYuBKzigaGtrs%2Fxc%3D',
            keywords: ['grille', 'grill', 'front grille', 'grille assembly', 'explorer grille']
        },
        {
            sku: 'APG-BUMPER-MKZ',
            title: 'Front Bumper Lip',
            price: 89.99,
            href: 'product-detail.html',
            img: 'https://p26-doubao-search-sign.byteimg.com/labis/981935be9996e6b7f50786b03a002cf6~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1792033277&x-signature=bzSmrgRqS2PLi6lYGU%2FwWd%2FUsQY%3D',
            keywords: ['bumper', 'bumper lip', 'lip', 'mkz']
        },
        {
            sku: 'APG-CAM-F150',
            title: 'Camshaft',
            price: 249.99,
            href: 'product-detail.html',
            img: 'https://p26-doubao-search-sign.byteimg.com/tos-cn-i-be4g95zd3a/869926994296307762~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1792033277&x-signature=d0jR2E3YzvFJGZkAup4hcJvx%2B%2FI%3D',
            keywords: ['camshaft', 'cam', 'f150']
        },
        {
            sku: 'APG-BRAKE-SET',
            title: 'Brake Pad Set',
            price: 89.99,
            href: 'product-detail.html',
            img: 'https://p26-doubao-search-sign.byteimg.com/labis/981935be9996e6b7f50786b03a002cf6~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1792033277&x-signature=bzSmrgRqS2PLi6lYGU%2FwWd%2FUsQY%3D',
            keywords: ['brake', 'pad', 'brakes', 'rotor']
        },
        {
            sku: 'APG-EMBLEM-F',
            title: 'Ford Emblem',
            price: 39.99,
            href: 'product-detail.html',
            img: 'https://p11-doubao-search-sign.byteimg.com/labis/f31b9b3e75b93ada85d5a6d6902ea687~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1792033277&x-signature=tv4e061SlqyHwdDwm%2FhQ8GvEUVg%3D',
            keywords: ['emblem', 'badge', 'logo', 'ford emblem']
        },
        {
            sku: 'APG-FILTER-OIL',
            title: 'Oil Filter',
            price: 12.99,
            href: 'product-detail.html',
            img: 'https://p11-doubao-search-sign.byteimg.com/labis/f31b9b3e75b93ada85d5a6d6902ea687~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1792033277&x-signature=tv4e061SlqyHwdDwm%2FhQ8GvEUVg%3D',
            keywords: ['oil filter', 'filter', 'motor oil']
        },
        {
            sku: 'APG-ALT-ELEC',
            title: 'Alternator',
            price: 189.99,
            href: 'product-detail.html',
            img: 'https://p26-doubao-search-sign.byteimg.com/labis/image/d5ee5b4a29e6cd14ee4f52ae0b4ed05b~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1792033277&x-signature=xrxHPF2Z9pYCYuBKzigaGtrs%2Fxc%3D',
            keywords: ['alternator', 'charging', 'generator']
        },
        {
            sku: 'APG-LIGHT-HL',
            title: 'Headlight Assembly',
            price: 329.99,
            href: 'product-detail.html',
            img: 'https://p26-doubao-search-sign.byteimg.com/labis/image/d5ee5b4a29e6cd14ee4f52ae0b4ed05b~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1792033277&x-signature=xrxHPF2Z9pYCYuBKzigaGtrs%2Fxc%3D',
            keywords: ['headlight', 'headlamp', 'head lamp', 'light assembly']
        }
    ];

    var IMPORT_CART_KEY = 'apg_cart_import';

    function normalize(s) {
        return String(s)
            .toLowerCase()
            .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function parseLine(line) {
        var t = String(line).trim();
        if (!t || t.charAt(0) === '#' || /^sku/i.test(t) && /part/i.test(t)) return null;
        var qty = 1;
        var name = t;
        var m1 = t.match(/^(.+?)[\s\t]+[x×]\s*(\d+)\s*$/i);
        var m2 = t.match(/^(\d+)\s*[x×]\s*(.+)$/i);
        if (m1 && m1[1] && m1[2]) {
            name = m1[1].replace(/^["']|["']$/g, '').trim();
            qty = parseInt(m1[2], 10) || 1;
        } else if (m2 && m2[1] && m2[2]) {
            qty = parseInt(m2[1], 10) || 1;
            name = m2[2].replace(/^["']|["']$/g, '').trim();
        }
        var mq = t.match(/(?:qty|quantity|数量)[:\s]*(\d+)/i);
        if (mq) qty = parseInt(mq[1], 10) || qty;
        if (t.indexOf(',') !== -1 && !/[x×]\s*\d+\s*$/i.test(t) && !/^\d+\s*[x×]/i.test(t)) {
            var parts = t.split(',');
            if (parts.length >= 2) {
                var lastCell = parts[parts.length - 1].trim();
                if (/^\d+$/.test(lastCell)) {
                    qty = parseInt(lastCell, 10) || qty;
                    name = parts.slice(0, -1).join(',').replace(/^["']|["']$/g, '').trim();
                }
            }
        }
        var skuCol = t.match(/(?:^|[\s,;])(APG-[A-Z0-9-]+)/i);
        if (skuCol) {
            name = name + ' ' + skuCol[1];
        }
        return { raw: line, name: name, qty: qty };
    }

    function scoreMatch(normalizedName, product) {
        var score = 0;
        var i;
        if (product.sku && normalizedName.indexOf(product.sku.toLowerCase()) !== -1) {
            score += 12;
        }
        for (i = 0; i < product.keywords.length; i++) {
            var kw = product.keywords[i];
            if (normalizedName.indexOf(kw) !== -1) {
                score += 4;
            }
        }
        var words = normalizedName.split(' ');
        for (i = 0; i < words.length; i++) {
            var w = words[i];
            if (w.length < 3) continue;
            var j;
            for (j = 0; j < product.keywords.length; j++) {
                if (product.keywords[j].indexOf(w) !== -1 || w.indexOf(product.keywords[j]) !== -1) {
                    score += 1;
                }
            }
        }
        return score;
    }

    function matchLine(parsed) {
        if (!parsed) return null;
        var nn = normalize(parsed.name);
        var best = null;
        var bestScore = 0;
        var idx;
        for (idx = 0; idx < CATALOG.length; idx++) {
            var p = CATALOG[idx];
            var s = scoreMatch(nn, p);
            if (s > bestScore) {
                bestScore = s;
                best = p;
            }
        }
        var confidence = 'none';
        if (bestScore >= 10) confidence = 'high';
        else if (bestScore >= 4) confidence = 'medium';
        else if (bestScore >= 1) confidence = 'low';
        if (!best || bestScore === 0) {
            return {
                parsed: parsed,
                product: null,
                confidence: 'none',
                bestScore: 0
            };
        }
        return {
            parsed: parsed,
            product: best,
            confidence: confidence,
            bestScore: bestScore
        };
    }

    function matchText(text) {
        var lines = String(text).split(/\r?\n/);
        var results = [];
        var li;
        for (li = 0; li < lines.length; li++) {
            var p = parseLine(lines[li]);
            if (p) results.push(matchLine(p));
        }
        return results;
    }

    function saveImportCart(items) {
        try {
            localStorage.setItem(IMPORT_CART_KEY, JSON.stringify(items));
        } catch (e) {}
    }

    function getImportCart() {
        try {
            return JSON.parse(localStorage.getItem(IMPORT_CART_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    function clearImportCart() {
        localStorage.removeItem(IMPORT_CART_KEY);
    }

    global.APGOrderImport = {
        CATALOG: CATALOG,
        matchText: matchText,
        parseLine: parseLine,
        saveImportCart: saveImportCart,
        getImportCart: getImportCart,
        clearImportCart: clearImportCart,
        IMPORT_CART_KEY: IMPORT_CART_KEY
    };
})(typeof window !== 'undefined' ? window : {});
