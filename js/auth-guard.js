// auth-guard.js - Page protection and session management
class AuthGuard {
    static PROTECTED_PAGES = [
        'peapod_user_profile.html',
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
        this.setupSessionMonitoring();
        this.setupNavigationGuards();
        this.addLogoutButtons();
    }
    
    static checkPageAccess() {
        const currentPage = this.getCurrentPageName();
        const isAuthenticated = SessionManager.isAuthenticated();
        
        console.log('Current page:', currentPage, 'Authenticated:', isAuthenticated);
        
        // Redirect authenticated users away from login/signup
        if (isAuthenticated && (currentPage === 'PeapodLOGIN.HTML' || currentPage === 'PeapodSIGNUP.HTML')) {
            console.log('Redirecting authenticated user to profile');
            SessionManager.redirectToProfile();
            return;
        }
        
        // Redirect unauthenticated users from protected pages
        if (!isAuthenticated && this.PROTECTED_PAGES.includes(currentPage)) {
            console.log('Redirecting unauthenticated user to login');
            SessionManager.redirectToLogin();
            return;
        }
        
        // Auto-extend session on protected pages
        if (isAuthenticated && this.PROTECTED_PAGES.includes(currentPage)) {
            this.extendSessionIfNeeded();
        }
        
        // Update navigation for authenticated users
        if (isAuthenticated) {
            this.updateNavigationForAuthenticatedUser();
        }
    }
    
    static getCurrentPageName() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }
    
    static setupSessionMonitoring() {
        // Check session every minute
        setInterval(() => {
            const session = SessionManager.getSession();
            
            if (!session && this.PROTECTED_PAGES.includes(this.getCurrentPageName())) {
                alert('Your session has expired. Please log in again.');
                SessionManager.redirectToLogin();
            }
        }, 60000); // Check every minute
        
        // Warn user 5 minutes before session expires
        setInterval(() => {
            const session = SessionManager.getSession();
            if (session) {
                const timeUntilExpiry = new Date(session.expiresAt) - new Date();
                const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));
                
                if (minutesUntilExpiry === 5) {
                    if (confirm('Your session will expire in 5 minutes. Would you like to extend it?')) {
                        SessionManager.extendSession();
                        alert('Session extended successfully!');
                    }
                }
            }
        }, 30000); // Check every 30 seconds
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
    
    static updateNavigationForAuthenticatedUser() {
        // Update "Sign In" links to show user info or "Profile"
        const signInLinks = document.querySelectorAll('a[href="PeapodLOGIN.HTML"]');
        signInLinks.forEach(link => {
            const user = SessionManager.getCurrentUser();
            if (user) {
                link.textContent = `👤 ${user.name.split(' ')[0]}`;
                link.href = 'peapod_user_profile.html';
                link.title = 'Go to Profile';
            }
        });
        
        // Update "Sign Up" links to "Profile" for authenticated users
        const signUpLinks = document.querySelectorAll('a[href="PeapodSIGNUP.HTML"]');
        signUpLinks.forEach(link => {
            link.textContent = '📊 Dashboard';
            link.href = 'peapod_user_profile.html';
            link.title = 'Go to Dashboard';
        });
    }
    
    static addLogoutButtons() {
        if (!SessionManager.isAuthenticated()) return;
        
        // Add logout option to user avatars/menus
        const userAvatars = document.querySelectorAll('.user-avatar, .profile-avatar');
        userAvatars.forEach(avatar => {
            avatar.style.cursor = 'pointer';
            avatar.title = 'Click for user menu';
            
            // Remove existing click handlers
            avatar.replaceWith(avatar.cloneNode(true));
            const newAvatar = document.querySelector(avatar.className);
            
            newAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showUserMenu(e.target);
            });
        });
    }
    
    static showUserMenu(avatar) {
        // Remove existing menu
        const existingMenu = document.querySelector('.user-dropdown-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }
        
        const user = SessionManager.getCurrentUser();
        const menu = document.createElement('div');
        menu.className = 'user-dropdown-menu';
        menu.style.cssText = `
            position: absolute;
            top: ${avatar.offsetTop + avatar.offsetHeight + 10}px;
            left: ${avatar.offsetLeft}px;
            background: white;
            border: 1px solid rgba(139, 195, 74, 0.3);
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(139, 195, 74, 0.2);
            z-index: 1000;
            min-width: 200px;
        `;
        
        menu.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid rgba(139, 195, 74, 0.2);">
                <div style="font-weight: 600; color: #333;">${user.name}</div>
                <div style="font-size: 0.9rem; color: rgba(51, 51, 51, 0.6);">${user.email}</div>
            </div>
            <div class="dropdown-item" onclick="AuthGuard.goToProfile()" style="padding: 12px 15px; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: background 0.3s ease;">
                👤 View Profile
            </div>
            <div class="dropdown-item" onclick="AuthGuard.logout()" style="padding: 12px 15px; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: background 0.3s ease; color: #dc2626;">
                🚪 Sign Out
            </div>
        `;
        
        // Add hover effects
        const items = menu.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = 'rgba(139, 195, 74, 0.1)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'transparent';
            });
        });
        
        document.body.appendChild(menu);
        
        // Remove menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', () => {
                menu.remove();
            }, { once: true });
        }, 100);
    }
    
    static goToProfile() {
        SessionManager.redirectToProfile();
    }
    
    static extendSessionIfNeeded() {
        const session = SessionManager.getSession();
        if (!session) return;
        
        const timeUntilExpiry = new Date(session.expiresAt) - new Date();
        const hoursUntilExpiry = timeUntilExpiry / (1000 * 60 * 60);
        
        // Auto-extend if less than 1 hour remaining
        if (hoursUntilExpiry < 1) {
            SessionManager.extendSession();
            console.log('Session automatically extended');
        }
    }
    
    static logout() {
        if (confirm('Are you sure you want to log out?')) {
            SessionManager.clearSession();
            alert('You have been logged out successfully.');
            SessionManager.redirectToLogin();
        }
    }
}

// Initialize auth guard on every page
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other scripts are loaded
    setTimeout(() => {
        AuthGuard.init();
    }, 100);
});
