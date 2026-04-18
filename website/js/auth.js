/**
 * AutoParts Global — prototype auth (localStorage only, no backend).
 * Demo account: demo@autoparts.global / demo123
 */
(function (global) {
    var SESSION_KEY = 'apg_session';
    var REGISTRY_KEY = 'apg_registered_users';

    var DEMO = {
        email: 'demo@autoparts.global',
        password: 'demo123',
        firstName: 'Demo',
        lastName: 'User'
    };

    function getRegistry() {
        try {
            return JSON.parse(localStorage.getItem(REGISTRY_KEY) || '[]');
        } catch (e) {
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
            loginAt: new Date().toISOString()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    function getSession() {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
        } catch (e) {
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
        var e = String(email).trim().toLowerCase();
        var p = String(password);
        if (e === DEMO.email.toLowerCase() && p === DEMO.password) {
            setSession(DEMO);
            return { ok: true };
        }
        var users = getRegistry();
        for (var i = 0; i < users.length; i++) {
            var u = users[i];
            if (u.email.toLowerCase() === e && u.password === p) {
                setSession({ email: u.email, firstName: u.firstName, lastName: u.lastName });
                return { ok: true };
            }
        }
        return { ok: false, message: 'Invalid email or password.' };
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
        var users = getRegistry();
        if (email === DEMO.email.toLowerCase()) {
            return { ok: false, message: 'This email is reserved for the demo account. Sign in instead.' };
        }
        for (var i = 0; i < users.length; i++) {
            if (users[i].email.toLowerCase() === email) {
                return { ok: false, message: 'An account with this email already exists.' };
            }
        }
        users.push({ firstName: firstName, lastName: lastName, email: email, password: password });
        saveRegistry(users);
        setSession({ email: email, firstName: firstName, lastName: lastName });
        return { ok: true };
    }

    global.APGAuth = {
        DEMO: DEMO,
        isLoggedIn: isLoggedIn,
        getSession: getSession,
        login: login,
        register: register,
        logout: logout
    };
})(typeof window !== 'undefined' ? window : {});
