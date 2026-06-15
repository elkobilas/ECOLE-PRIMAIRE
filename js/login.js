// Gestion de la page de connexion
class LoginManager {
    constructor() {
        this.failedAttempts = 0;
        this.lockoutUntil = null;
        this.maxAttempts = 5;
        this.lockoutDuration = 2 * 60 * 1000; // 2 minutes
        this.init();
    }

    init() {
        // Restaurer l'état de verrouillage depuis sessionStorage
        const savedLockout = sessionStorage.getItem('loginLockout');
        if (savedLockout) {
            const lockoutData = JSON.parse(savedLockout);
            this.failedAttempts = lockoutData.attempts || 0;
            this.lockoutUntil = lockoutData.until ? new Date(lockoutData.until) : null;
        }
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
        // === PROTECTION ANTI-BRUTE FORCE ===
        if (this.lockoutUntil && new Date() < this.lockoutUntil) {
            const remainingSeconds = Math.ceil((this.lockoutUntil - new Date()) / 1000);
            this.showMessage(`🔒 Compte verrouillé. Réessayez dans ${remainingSeconds} secondes.`, 'danger');
            return;
        }

        // Réinitialiser si le verrouillage a expiré
        if (this.lockoutUntil && new Date() >= this.lockoutUntil) {
            this.failedAttempts = 0;
            this.lockoutUntil = null;
            sessionStorage.removeItem('loginLockout');
        }

        // === SANITISATION DES ENTRÉES ===
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            this.showMessage('Veuillez remplir tous les champs', 'danger');
            return;
        }

        if (username.length < 3 || username.length > 50) {
            this.showMessage('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères', 'danger');
            return;
        }

        // Vérifier les identifiants
        const users = JSON.parse(localStorage.getItem('users')) || this.getDefaultUsers();
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const allUsers = [...users, ...registeredUsers];
        const user = allUsers.find(u => 
            (u.username === username || u.email === username) && 
            u.password === password
        );
        
        if (user && user.isActive) {
            // Réinitialiser les tentatives
            this.failedAttempts = 0;
            this.lockoutUntil = null;
            sessionStorage.removeItem('loginLockout');

            // Créer un token sécurisé
            const token = this.generateToken(user);
            
            // Ne pas stocker le mot de passe dans currentUser
            const safeUser = { ...user };
            delete safeUser.password;
            
            // Sauvegarder l'authentification
            localStorage.setItem('authToken', token);
            localStorage.setItem('currentUser', JSON.stringify(safeUser));
            
            // Logger la connexion réussie
            this.logLoginAttempt(username, true);
            
            this.showMessage('✅ Connexion réussie ! Redirection...', 'success');
            
            // Rediriger vers l'application
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            // Incrémenter les tentatives échouées
            this.failedAttempts++;
            this.logLoginAttempt(username, false);
            
            const remaining = this.maxAttempts - this.failedAttempts;
            
            if (this.failedAttempts >= this.maxAttempts) {
                // Verrouiller le compte
                this.lockoutUntil = new Date(Date.now() + this.lockoutDuration);
                sessionStorage.setItem('loginLockout', JSON.stringify({
                    attempts: this.failedAttempts,
                    until: this.lockoutUntil.toISOString()
                }));
                this.showMessage(`🔒 Trop de tentatives échouées. Compte verrouillé pour 2 minutes.`, 'danger');
            } else {
                sessionStorage.setItem('loginLockout', JSON.stringify({
                    attempts: this.failedAttempts,
                    until: null
                }));
                this.showMessage(`❌ Identifiants incorrects. ${remaining} tentative(s) restante(s).`, 'danger');
            }
        }
    }

    logLoginAttempt(username, success) {
        const loginLog = JSON.parse(localStorage.getItem('loginLog')) || [];
        loginLog.unshift({
            username: username,
            success: success,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 100)
        });
        // Garder les 50 dernières entrées
        if (loginLog.length > 50) loginLog.pop();
        localStorage.setItem('loginLog', JSON.stringify(loginLog));
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