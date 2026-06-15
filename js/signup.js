// Gestion de l'inscription
class SignupManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializePasswordStrength();
    }

    bindEvents() {
        // Gestion du formulaire d'inscription
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility();
            });
        }

        // Validation en temps réel
        const usernameField = document.getElementById('username');
        if (usernameField) {
            usernameField.addEventListener('blur', () => {
                this.validateUsername();
            });
        }

        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', () => {
                this.validateEmail();
            });
        }

        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.addEventListener('input', () => {
                this.updatePasswordStrength();
                this.validatePasswordMatch();
            });
        }

        const confirmPasswordField = document.getElementById('confirmPassword');
        if (confirmPasswordField) {
            confirmPasswordField.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
        }
    }

    initializePasswordStrength() {
        this.passwordStrengthLevels = {
            weak: { min: 0, max: 5, class: 'strength-weak', text: 'Faible' },
            medium: { min: 6, max: 9, class: 'strength-medium', text: 'Moyen' },
            strong: { min: 10, max: 100, class: 'strength-strong', text: 'Fort' }
        };
    }

    handleSignup() {
        const formData = this.collectFormData();
        
        // Validation complète
        if (!this.validateForm(formData)) {
            return;
        }

        // Afficher un indicateur de chargement
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Création du compte...';
        submitBtn.disabled = true;

        // Simuler la création du compte
        setTimeout(() => {
            if (this.createAccount(formData)) {
                this.signupSuccess();
            } else {
                this.signupError();
            }
            
            // Restaurer le bouton
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    collectFormData() {
        return {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            role: document.getElementById('role').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            acceptTerms: document.getElementById('acceptTerms').checked,
            acceptPrivacy: document.getElementById('acceptPrivacy').checked
        };
    }

    validateForm(formData) {
        // Validation des champs obligatoires
        if (!formData.firstName || !formData.lastName || !formData.username || 
            !formData.email || !formData.role || !formData.password) {
            this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
            return false;
        }

        // Validation des conditions
        if (!formData.acceptTerms || !formData.acceptPrivacy) {
            this.showMessage('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité', 'error');
            return false;
        }

        // Validation du nom d'utilisateur
        if (!this.validateUsernameFormat(formData.username)) {
            this.showMessage('Le nom d\'utilisateur doit contenir 3-20 caractères (lettres et chiffres uniquement)', 'error');
            return false;
        }

        // Validation de l'email
        if (!this.validateEmailFormat(formData.email)) {
            this.showMessage('Veuillez entrer une adresse email valide', 'error');
            return false;
        }

        // Validation du mot de passe
        if (!this.validatePasswordStrength(formData.password)) {
            this.showMessage('Le mot de passe doit contenir au moins 6 caractères', 'error');
            return false;
        }

        // Validation de la confirmation du mot de passe
        if (formData.password !== formData.confirmPassword) {
            this.showMessage('Les mots de passe ne correspondent pas', 'error');
            return false;
        }

        return true;
    }

    validateUsername() {
        const username = document.getElementById('username').value;
        if (username && !this.validateUsernameFormat(username)) {
            this.showFieldError('username', '3-20 caractères, lettres et chiffres uniquement');
        } else {
            this.clearFieldError('username');
        }
    }

    validateEmail() {
        const email = document.getElementById('email').value;
        if (email && !this.validateEmailFormat(email)) {
            this.showFieldError('email', 'Adresse email invalide');
        } else {
            this.clearFieldError('email');
        }
    }

    validateUsernameFormat(username) {
        const regex = /^[a-zA-Z0-9]{3,20}$/;
        return regex.test(username);
    }

    validateEmailFormat(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    updatePasswordStrength() {
        const passwordField = document.getElementById('password');
        const strengthDiv = document.getElementById('passwordStrength');
        
        if (!passwordField || !strengthDiv) {
            console.warn('Éléments de force du mot de passe non trouvés');
            return;
        }
        
        const password = passwordField.value;
        
        if (!password) {
            strengthDiv.innerHTML = '';
            return;
        }

        const strength = this.calculatePasswordStrength(password);
        const level = this.getPasswordStrengthLevel(strength);
        
        strengthDiv.innerHTML = `
            <div class="progress mb-1" style="height: 5px;">
                <div class="progress-bar ${level.class}" style="width: ${strength * 10}%"></div>
            </div>
            <small class="${level.class}">Force: ${level.text}</small>
        `;
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        
        // Longueur
        if (password.length >= 6) strength += 2;
        if (password.length >= 8) strength += 2;
        if (password.length >= 12) strength += 1;
        
        // Caractères divers
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 2;
        
        return Math.min(strength, 10);
    }

    getPasswordStrengthLevel(strength) {
        if (strength <= 5) return this.passwordStrengthLevels.weak;
        if (strength <= 9) return this.passwordStrengthLevels.medium;
        return this.passwordStrengthLevels.strong;
    }

    validatePasswordStrength(password) {
        // Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre
        if (password.length < 8) {
            this.showMessage('Le mot de passe doit contenir au moins 8 caractères', 'error');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            this.showMessage('Le mot de passe doit contenir au moins une lettre majuscule', 'error');
            return false;
        }
        if (!/[a-z]/.test(password)) {
            this.showMessage('Le mot de passe doit contenir au moins une lettre minuscule', 'error');
            return false;
        }
        if (!/[0-9]/.test(password)) {
            this.showMessage('Le mot de passe doit contenir au moins un chiffre', 'error');
            return false;
        }
        return true;
    }

    validatePasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Les mots de passe ne correspondent pas');
        } else {
            this.clearFieldError('confirmPassword');
        }
    }

    createAccount(formData) {
        // Vérifier si l'utilisateur existe déjà
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        if (existingUsers.find(user => user.username === formData.username)) {
            this.showMessage('Ce nom d\'utilisateur est déjà utilisé', 'error');
            return false;
        }

        if (existingUsers.find(user => user.email === formData.email)) {
            this.showMessage('Cette adresse email est déjà utilisée', 'error');
            return false;
        }

        // Créer le nouvel utilisateur
        const newUser = {
            id: Date.now(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            role: formData.role,
            password: formData.password, // Sécurité : en production, utiliser bcrypt côté serveur
            passwordLastChanged: new Date().toISOString(),
            registrationDate: new Date().toISOString(),
            isActive: true
        };

        // Ajouter à la liste des utilisateurs
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

        return true;
    }

    signupSuccess() {
        this.showMessage('Compte créé avec succès ! Redirection vers la connexion...', 'success');
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
            window.location.href = 'login.html?message=signup_success';
        }, 2000);
    }

    signupError() {
        this.showMessage('Erreur lors de la création du compte. Veuillez réessayer.', 'error');
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('signupMessage');
        const messageText = document.getElementById('signupMessageText');
        
        if (!messageDiv || !messageText) {
            console.error('Éléments de message non trouvés');
            return;
        }
        
        messageText.textContent = message;
        messageDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} show`;
        messageDiv.classList.remove('d-none');
        
        // Auto-hide après 5 secondes
        setTimeout(() => {
            messageDiv.classList.add('d-none');
            messageDiv.classList.remove('show');
        }, 5000);
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) {
            console.error(`Champ ${fieldId} non trouvé`);
            return;
        }
        
        const formGroup = field.closest('.mb-3');
        if (!formGroup) {
            console.error(`Groupe de formulaire non trouvé pour ${fieldId}`);
            return;
        }
        
        // Supprimer l'ancienne erreur
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Ajouter la nouvelle erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-danger mt-1';
        errorDiv.innerHTML = `<small><i class="fas fa-exclamation-circle me-1"></i>${message}</small>`;
        formGroup.appendChild(errorDiv);
        
        // Ajouter la classe d'erreur au champ
        field.classList.add('is-invalid');
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) {
            console.error(`Champ ${fieldId} non trouvé`);
            return;
        }
        
        const formGroup = field.closest('.mb-3');
        if (!formGroup) {
            console.error(`Groupe de formulaire non trouvé pour ${fieldId}`);
            return;
        }
        
        const errorDiv = formGroup.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        field.classList.remove('is-invalid');
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        
        if (!passwordInput || !toggleBtn) {
            console.error('Éléments de basculement du mot de passe non trouvés');
            return;
        }
        
        const icon = toggleBtn.querySelector('i');
        if (!icon) {
            console.error('Icône de basculement non trouvée');
            return;
        }
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
}

// Initialiser le gestionnaire d'inscription
document.addEventListener('DOMContentLoaded', () => {
    new SignupManager();
});


