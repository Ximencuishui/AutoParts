/**
 * AutoParts Global — prototype auth (localStorage only, no backend).
 *
 * Demo accounts (passwords are for local testing only):
 *   buyer — buyer@autoparts.global / buyer123   → customer area (account, orders, …)
 *   admin — admin@autoparts.global / admin123     → admin dashboard
 * Legacy: demo@autoparts.global / demo123       → same as buyer
 */
(function (global) {
    var SESSION_KEY = 'apg_session';
    var REGISTRY_KEY = 'apg_registered_users';

    var BUILTIN = [
        {
            email: 'buyer@autoparts.global',
            password: 'buyer123',
            firstName: 'Demo',
            lastName: 'Buyer',
            role: 'buyer'
        },
        {
            email: 'admin@autoparts.global',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
        },
        {
            email: 'demo@autoparts.global',
            password: 'demo123',
            firstName: 'Demo',
            lastName: 'User',
            role: 'buyer'
        }
    ];

    /** Shown on customer login page (buyer quick-fill). */
    var DEMO = BUILTIN[0];

    function reservedEmailsLower() {
        var set = {};
        for (var i = 0; i < BUILTIN.length; i++) {
            set[BUILTIN[i].email.toLowerCase()] = true;
        }
        return set;
    }

    function findBuiltin(email, password) {
        var e = String(email).trim().toLowerCase();
        var p = String(password);
        for (var i = 0; i < BUILTIN.length; i++) {
            var u = BUILTIN[i];
            if (u.email.toLowerCase() === e && u.password === p) {
                return u;
            }
        }
        return null;
    }

    function getRegistry() {
        try {
            return JSON.parse(localStorage.getItem(REGISTRY_KEY) || '[]');
        } catch (err) {
            return [];
        }
    }

    function saveRegistry(users) {
        localStorage.setItem(REGISTRY_KEY, JSON.stringify(users));
    }

    function setSession(user) {
        var session = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role || 'buyer',
            loginAt: new Date().toISOString()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    function getSession() {
        try {
            var s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
            if (!s) return null;
            if (!s.role) s.role = 'buyer';
            return s;
        } catch (err) {
            return null;
        }
    }

    function isLoggedIn() {
        return getSession() !== null;
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
    }

    function login(email, password) {
        var builtin = findBuiltin(email, password);
        if (builtin) {
            setSession(builtin);
            return { ok: true, role: builtin.role };
        }
        var e = String(email).trim().toLowerCase();
        var p = String(password);
        var users = getRegistry();
        for (var i = 0; i < users.length; i++) {
            var u = users[i];
            if (u.email.toLowerCase() === e && u.password === p) {
                setSession({ email: u.email, firstName: u.firstName, lastName: u.lastName, role: 'buyer' });
                return { ok: true, role: 'buyer' };
            }
        }
        return { ok: false, message: 'Invalid email or password.' };
    }

    /** Admin portal: only the admin demo account (or a registered user with role admin — none yet). */
    function loginAdmin(email, password) {
        var builtin = findBuiltin(email, password);
        if (builtin && builtin.role === 'admin') {
            setSession(builtin);
            return { ok: true, role: 'admin' };
        }
        return { ok: false, message: 'Invalid admin email or password.' };
    }

    function register(data) {
        var firstName = String(data.firstName || '').trim();
        var lastName = String(data.lastName || '').trim();
        var email = String(data.email || '').trim().toLowerCase();
        var password = String(data.password || '');
        if (!firstName || !lastName || !email || !password) {
            return { ok: false, message: 'Please fill in all required fields.' };
        }
        if (password.length < 6) {
            return { ok: false, message: 'Password must be at least 6 characters.' };
        }
        var reserved = reservedEmailsLower();
        if (reserved[email]) {
            return { ok: false, message: 'This email is reserved. Sign in with the demo account instead.' };
        }
        var users = getRegistry();
        for (var i = 0; i < users.length; i++) {
            if (users[i].email.toLowerCase() === email) {
                return { ok: false, message: 'An account with this email already exists.' };
            }
        }
        users.push({ firstName: firstName, lastName: lastName, email: email, password: password });
        saveRegistry(users);
        setSession({ email: email, firstName: firstName, lastName: lastName, role: 'buyer' });
        return { ok: true };
    }

    function isAdmin() {
        var s = getSession();
        return s && s.role === 'admin';
    }

    global.APGAuth = {
        BUILTIN: BUILTIN,
        DEMO: DEMO,
        isLoggedIn: isLoggedIn,
        getSession: getSession,
        login: login,
        loginAdmin: loginAdmin,
        register: register,
        logout: logout,
        isAdmin: isAdmin
    };
})(typeof window !== 'undefined' ? window : {});
