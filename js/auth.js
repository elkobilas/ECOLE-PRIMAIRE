// Système d'authentification pour l'application de gestion scolaire
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.bindEvents();
    }

    checkAuthentication() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('currentUser');
        
        console.log('🔍 Vérification de l\'authentification...', { token: !!token, user: !!user });
        
        if (token && user) {
            try {
                this.currentUser = JSON.parse(user);
                
                // Vérifier si le token est encore valide
                if (this.isAuthenticated()) {
                    this.updateUserInterface();
                    console.log('✅ Utilisateur authentifié:', this.currentUser);
                } else {
                    console.log('❌ Token expiré, déconnexion...');
                    this.logout('Session expirée');
                }
            } catch (error) {
                console.error('❌ Erreur lors du parsing de l\'utilisateur:', error);
                this.logout('Erreur d\'authentification');
            }
        } else {
            console.log('❌ Pas d\'authentification trouvée');
        }
        
        // Déléguer la gestion des redirections au gestionnaire d'état
        if (window.authStateManager) {
            window.authStateManager.forceCheck();
        }
    }

    updateUserInterface() {
        const userNameElement = document.getElementById('userName');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }
    }

    bindEvents() {
        // Événements d'authentification
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn') {
                e.preventDefault();
                this.logout();
            }
        });
    }

    login(username, password) {
        // Récupérer les utilisateurs par défaut et ceux inscrits
        const defaultUsers = JSON.parse(localStorage.getItem('users')) || [];
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const allUsers = [...defaultUsers, ...registeredUsers];
        
        // Trouver l'utilisateur par nom d'utilisateur OU email
        const user = allUsers.find(u => 
            (u.username === username || u.email === username) && 
            u.password === password
        );
        
        if (user && user.isActive) {
            // Créer un token simple
            const token = this.generateToken(user);
            
            // Sauvegarder l'authentification
            localStorage.setItem('authToken', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            this.currentUser = user;
            this.updateUserInterface();
            
            return { success: true, user: user };
        } else {
            return { success: false, message: 'Identifiants incorrects ou compte inactif' };
        }
    }

    logout(message = 'Déconnexion réussie') {
        console.log('🚪 Déconnexion:', message);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        
        // Rediriger vers la page de connexion SEULEMENT si on n'y est pas déjà
        const currentPage = window.location.pathname;
        if (!currentPage.includes('login.html')) {
            console.log('🔄 Redirection vers la page de connexion...');
            window.location.href = 'login.html';
        } else {
            console.log('✅ Déjà sur la page de connexion');
        }
    }

    generateToken(user) {
        // Token amélioré avec plus d'informations de sécurité
        const tokenData = {
            userId: user.id,
            username: user.username,
            role: user.role,
            iat: Date.now(), // issued at
            exp: Date.now() + (8 * 60 * 60 * 1000), // 8 heures (réduit de 24h)
            nonce: Math.random().toString(36).substring(2, 15) // anti-replay
        };
        
        return btoa(JSON.stringify(tokenData));
    }

    parseToken(token) {
        try {
            return JSON.parse(atob(token));
        } catch (error) {
            return null;
        }
    }

    isAuthenticated() {
        const token = localStorage.getItem('authToken');
        if (!token) return false;
        
        const tokenData = this.parseToken(token);
        if (!tokenData) {
            this.logout('Token invalide');
            return false;
        }
        
        // Vérifier l'expiration
        if (tokenData.exp <= Date.now()) {
            this.logout('Session expirée');
            return false;
        }
        
        // Vérifier que le token contient les champs requis
        if (!tokenData.userId || !tokenData.username || !tokenData.role) {
            this.logout('Token corrompu');
            return false;
        }
        
        return true;
    }

    hasRole(role) {
        if (!this.currentUser) return false;
        return this.currentUser.role === role;
    }

    hasAnyRole(roles) {
        if (!this.currentUser) return false;
        return roles.includes(this.currentUser.role);
    }
}

// Note: L'instance authManager est maintenant gérée par SchoolManagementApp dans app.js