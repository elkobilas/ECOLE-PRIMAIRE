// Gestion de la page de connexion
class LoginManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkExistingSession();
    }

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility();
            });
        }
    }

    checkExistingSession() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('currentUser');
        
        console.log('🔍 Vérification de session existante...', { token: !!token, user: !!user });
        
        if (token && user) {
            try {
                const userData = JSON.parse(user);
                console.log('✅ Session existante trouvée:', userData);
                
                // Vérifier si le token est encore valide
                const tokenData = this.parseToken(token);
                if (tokenData && tokenData.exp > Date.now()) {
                    console.log('🔄 Redirection vers l\'application...');
                    // Utiliser le gestionnaire d'état pour éviter les conflits
                    if (window.authStateManager) {
                        window.authStateManager.safeRedirect('index.html', 'Session existante valide');
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    console.log('❌ Token expiré, nettoyage...');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('currentUser');
                }
            } catch (error) {
                console.error('❌ Erreur lors de la vérification de session:', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
            }
        } else {
            console.log('ℹ️ Aucune session existante');
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            this.showMessage('Veuillez remplir tous les champs', 'danger');
            return;
        }

        // Vérifier les identifiants
        const users = JSON.parse(localStorage.getItem('users')) || this.getDefaultUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user && user.isActive) {
            // Créer un token simple
            const token = this.generateToken(user);
            
            // Sauvegarder l'authentification
            localStorage.setItem('authToken', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            this.showMessage('Connexion réussie ! Redirection...', 'success');
            
            // Rediriger vers l'application
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            this.showMessage('Identifiants incorrects ou compte inactif', 'danger');
        }
    }

    generateToken(user) {
        const tokenData = {
            userId: user.id,
            username: user.username,
            role: user.role,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 heures
        };
        
        return btoa(JSON.stringify(tokenData));
    }

    parseToken(token) {
        try {
            return JSON.parse(atob(token));
        } catch (error) {
            console.error('Erreur lors du parsing du token:', error);
            return null;
        }
    }

    getDefaultUsers() {
        return [
            { id: 'admin', username: 'admin', password: 'admin123', role: 'admin', firstName: 'Admin', lastName: 'Système', email: 'admin@ecole.fr', isActive: true },
            { id: 'enseignant', username: 'enseignant', password: 'enseignant123', role: 'teacher', firstName: 'Enseignant', lastName: 'Test', email: 'enseignant@ecole.fr', isActive: true },
            { id: 'direction', username: 'direction', password: 'direction123', role: 'director', firstName: 'Direction', lastName: 'École', email: 'direction@ecole.fr', isActive: true }
        ];
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('loginMessage');
        const messageText = document.getElementById('loginMessageText');
        
        if (messageDiv && messageText) {
            messageDiv.className = `alert alert-${type}`;
            messageText.textContent = message;
            messageDiv.classList.remove('d-none');
        }
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        const icon = toggleBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
}

// Fonction globale pour remplir les identifiants de démonstration
function fillDemoCredentials(username, password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
}

// Initialiser le gestionnaire de connexion
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});