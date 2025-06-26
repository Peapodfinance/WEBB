// auth-guard.js - Page protection and session management
class AuthGuard {
    static PROTECTED_PAGES = [
        'PeapodPROFILE.HTML',
        'profile.html',
        'dashboard.html',
        'documents.html',
        'payments.html'
    ];
    
    static PUBLIC_PAGES = [
        'index.html',
        'PeapodLOGIN.HTML',
        'PeapodSIGNUP.HTML',
        'PeapodCALCULATOR.HTML',
        'PeapodCONTACTUS.HTML',
        'PeapodABOUTUS.HTML',
        'PeapodSERVICES.HTML',
        'PeapodFAQ.HTML',
        'PeapodHOWITWORKS.HTML',
        'PeapodLEGAL.HTML',
        'PeapodLENDERS.HTML',
        'PeapodPARTNERSHIPS.HTML',
        'PeapodRESOURCES.HTML'
    ];
    
    static init() {
        this.checkPageAccess();
        this.setupNavigationGuards();
    }
    
    static checkPageAccess() {
        const currentPage = this.getCurrentPageName();
        const isAuthenticated = SessionManager.isAuthenticated();
        
        // Only redirect unauthenticated users from protected pages
        if (!isAuthenticated && this.PROTECTED_PAGES.includes(currentPage)) {
            console.log('Redirecting unauthenticated user to login');
            SessionManager.redirectToLogin();
            return;
        }
    }
    
    static getCurrentPageName() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }
    
    static setupNavigationGuards() {
        // Intercept navigation to protected pages
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            const targetPage = href.split('/').pop();
            
            if (this.PROTECTED_PAGES.includes(targetPage) && !SessionManager.isAuthenticated()) {
                e.preventDefault();
                alert('Please log in to access this page.');
                SessionManager.redirectToLogin();
            }
        });
    }
    
    static logout() {
        SessionManager.clearSession();
        SessionManager.redirectToLogin();
    }
}

// Initialize auth guard on every page
document.addEventListener('DOMContentLoaded', () => {
    AuthGuard.init();
});
