// auth.js - Authentication functions for Peapod Finance

class Auth {
    static async login(userId, password) {
        try {
            const response = await PeapodAPI.login(userId, password);
            if (response.success) {
                SessionManager.setSession(response.user, response.token);
                window.location.href = 'peapod-profile.html';
            }
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async signup(userData) {
        try {
            // Redirect to signup page for now
            window.location.href = 'peapod-signup.html';
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    }

    static async forgotPassword(email) {
        try {
            // TODO: Implement forgot password functionality
            alert('Password reset link would be sent to your email.');
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    }

    static logout() {
        SessionManager.clearSession();
        window.location.href = 'index.html';
    }

    static isAuthenticated() {
        return SessionManager.isAuthenticated();
    }

    static getCurrentUser() {
        return SessionManager.getCurrentUser();
    }
}

