// Gestionnaire d'état d'authentification centralisé
class AuthStateManager {
    constructor() {
        this.isInitialized = false;
        this.redirectInProgress = false;
        this.init();
    }

    init() {
        if (this.isInitialized) {
            console.log('⚠️ AuthStateManager déjà initialisé');
            return;
        }
        
        this.isInitialized = true;
        console.log('🔧 Initialisation du gestionnaire d\'état d\'authentification');
        
        // Écouter les changements de localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'authToken' || e.key === 'currentUser') {
                this.handleStorageChange();
            }
        });
    }

    handleStorageChange() {
        console.log('🔄 Changement détecté dans le localStorage');
        // Éviter les redirections en boucle
        if (!this.redirectInProgress) {
            this.checkAndRedirect();
        }
    }

    checkAndRedirect() {
        const currentPage = window.location.pathname;
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('currentUser');
        
        console.log('🔍 Vérification de redirection...', { 
            page: currentPage, 
            hasToken: !!token, 
            hasUser: !!user 
        });

        // Si on a un token et un utilisateur valides
        if (token && user) {
            try {
                const userData = JSON.parse(user);
                const tokenData = this.parseToken(token);
                
                if (tokenData && tokenData.exp > Date.now()) {
                    // Utilisateur authentifié
                    if (currentPage.includes('login.html') || currentPage.includes('signup.html')) {
                        this.safeRedirect('index.html', 'Utilisateur authentifié, redirection vers l\'application');
                    }
                } else {
                    // Token expiré
                    this.clearAuth();
                    if (currentPage.includes('index.html')) {
                        this.safeRedirect('login.html', 'Session expirée, redirection vers la connexion');
                    }
                }
            } catch (error) {
                console.error('❌ Erreur lors de la vérification:', error);
                this.clearAuth();
                if (currentPage.includes('index.html')) {
                    this.safeRedirect('login.html', 'Erreur d\'authentification');
                }
            }
        } else {
            // Pas d'authentification
            if (currentPage.includes('index.html')) {
                this.safeRedirect('login.html', 'Pas d\'authentification, redirection vers la connexion');
            }
        }
    }

    safeRedirect(url, reason) {
        if (this.redirectInProgress) {
            console.log('⚠️ Redirection déjà en cours, ignorée');
            return;
        }

        console.log(`🔄 ${reason}`);
        this.redirectInProgress = true;
        
        // Petit délai pour éviter les redirections trop rapides
        setTimeout(() => {
            window.location.href = url;
        }, 100);
    }

    clearAuth() {
        console.log('🧹 Nettoyage de l\'authentification');
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }

    parseToken(token) {
        try {
            return JSON.parse(atob(token));
        } catch (error) {
            return null;
        }
    }

    // Méthode pour forcer une vérification
    forceCheck() {
        this.redirectInProgress = false;
        this.checkAndRedirect();
    }
}

// Instance globale
window.authStateManager = new AuthStateManager();

