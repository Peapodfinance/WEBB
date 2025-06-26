// session-manager.js - Session management for Peapod Finance
class SessionManager {
    static SESSION_KEY = 'peapod_session';
    static TOKEN_KEY = 'peapod_token';
    static USER_KEY = 'peapod_user';
    
    static setSession(userData, token, rememberMe = false) {
        const storage = rememberMe ? localStorage : sessionStorage;
        
        storage.setItem(this.TOKEN_KEY, token);
        storage.setItem(this.USER_KEY, JSON.stringify(userData));
        storage.setItem(this.SESSION_KEY, 'active');
        
        console.log('Session created for:', userData.name);
    }
    
    static getSession() {
        // Only check the storage where the session was saved
        const storage = localStorage.getItem(this.TOKEN_KEY) ? localStorage : sessionStorage;
        
        const token = storage.getItem(this.TOKEN_KEY);
        const userData = storage.getItem(this.USER_KEY);
        const sessionActive = storage.getItem(this.SESSION_KEY);
        
        if (!token || !userData || !sessionActive) {
            return null;
        }
        
        return {
            token,
            user: JSON.parse(userData),
            isLoggedIn: sessionActive === 'active'
        };
    }
    
    static clearSession() {
        // Clear from both storages to ensure clean logout
        [localStorage, sessionStorage].forEach(storage => {
            storage.removeItem(this.TOKEN_KEY);
            storage.removeItem(this.USER_KEY);
            storage.removeItem(this.SESSION_KEY);
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
        window.location.href = 'PeapodPROFILE.HTML';
    }
}
