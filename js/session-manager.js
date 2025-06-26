// session-manager.js - Session management for Peapod Finance
class SessionManager {
    static SESSION_KEY = 'peapod_session';
    static TOKEN_KEY = 'peapod_token';
    static USER_KEY = 'peapod_user';
    static EXPIRY_KEY = 'peapod_expiry';
    
    static setSession(userData, token, rememberMe = false) {
        const storage = rememberMe ? localStorage : sessionStorage;
        const expiryTime = new Date();
        
        // Set expiry: 7 days if remember me, 8 hours otherwise
        expiryTime.setHours(expiryTime.getHours() + (rememberMe ? 24 * 7 : 8));
        
        storage.setItem(this.TOKEN_KEY, token);
        storage.setItem(this.USER_KEY, JSON.stringify(userData));
        storage.setItem(this.SESSION_KEY, 'active');
        storage.setItem(this.EXPIRY_KEY, expiryTime.toISOString());
        
        console.log('Session created for:', userData.name);
    }
    
    static getSession() {
        // Check both localStorage and sessionStorage
        const token = localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
        const userData = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
        const sessionActive = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY);
        const expiry = localStorage.getItem(this.EXPIRY_KEY) || sessionStorage.getItem(this.EXPIRY_KEY);
        
        if (!token || !userData || !sessionActive || !expiry) {
            return null;
        }
        
        // Check if session expired
        if (new Date() > new Date(expiry)) {
            this.clearSession();
            return null;
        }
        
        return {
            token,
            user: JSON.parse(userData),
            isLoggedIn: sessionActive === 'active',
            expiresAt: expiry
        };
    }
    
    static clearSession() {
        // Clear from both storages
        [localStorage, sessionStorage].forEach(storage => {
            storage.removeItem(this.TOKEN_KEY);
            storage.removeItem(this.USER_KEY);
            storage.removeItem(this.SESSION_KEY);
            storage.removeItem(this.EXPIRY_KEY);
        });
        
        console.log('Session cleared');
    }
    
    static isAuthenticated() {
        const session = this.getSession();
        return session && session.isLoggedIn;
    }
    
    static getAuthToken() {
        const session = this.getSession();
        return session ? session.token : null;
    }
    
    static getCurrentUser() {
        const session = this.getSession();
        return session ? session.user : null;
    }
    
    static redirectToLogin() {
        window.location.href = 'PeapodLOGIN.HTML';
    }
    
    static redirectToProfile() {
        window.location.href = 'peapod_user_profile.html';
    }
    
    static extendSession(additionalHours = 8) {
        const session = this.getSession();
        if (!session) return false;
        
        const newExpiry = new Date();
        newExpiry.setHours(newExpiry.getHours() + additionalHours);
        
        const storage = localStorage.getItem(this.TOKEN_KEY) ? localStorage : sessionStorage;
        storage.setItem(this.EXPIRY_KEY, newExpiry.toISOString());
        
        return true;
    }
}
