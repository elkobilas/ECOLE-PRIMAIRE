// Gestion du profil utilisateur
class ProfileModule {
    constructor(app) {
        this.app = app;
        this.currentUser = null;
    }

    getProfileHTML() {
        return `
        <div class="container">
            <div class="profile-container">
                <div class="profile-header">
                    <div class="file-upload">
                        <img id="profileAvatar" src="images/default-profile.svg" alt="Photo de profil" class="profile-avatar">
                        <input type="file" id="avatarInput" accept="image/*" style="display: none;">
                        <div class="upload-overlay">
                            <i class="fas fa-camera text-white" style="font-size: 2rem;"></i>
                        </div>
                    </div>
                    <div class="profile-name" id="profileName">Chargement...</div>
                    <div class="profile-role" id="profileRole">Chargement...</div>
                    <div class="mt-3">
                        <span class="badge bg-light text-dark" id="memberSince">Membre depuis...</span>
                    </div>
                </div>
                
                <div class="profile-body">
                    <!-- Statistiques -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number" id="studentsCount">0</div>
                            <div class="stat-label">Élèves gérés</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="classesCount">0</div>
                            <div class="stat-label">Classes assignées</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="gradesCount">0</div>
                            <div class="stat-label">Notes saisies</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="loginCount">0</div>
                            <div class="stat-label">Connexions</div>
                        </div>
                    </div>

                    <!-- Navigation des onglets -->
                    <ul class="nav nav-pills mb-4" id="profileTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="info-tab" data-bs-toggle="pill" data-bs-target="#info" type="button">
                                <i class="fas fa-user me-2"></i>Informations
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="security-tab" data-bs-toggle="pill" data-bs-target="#security" type="button">
                                <i class="fas fa-shield-alt me-2"></i>Sécurité
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="activity-tab" data-bs-toggle="pill" data-bs-target="#activity" type="button">
                                <i class="fas fa-history me-2"></i>Activité
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="preferences-tab" data-bs-toggle="pill" data-bs-target="#preferences" type="button">
                                <i class="fas fa-cog me-2"></i>Préférences
                            </button>
                        </li>
                    </ul>

                    <!-- Contenu des onglets -->
                    <div class="tab-content" id="profileTabContent">
                        <!-- Onglet Informations -->
                        <div class="tab-pane fade show active" id="info" role="tabpanel">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="info-card">
                                        <h5><i class="fas fa-id-card me-2"></i>Informations personnelles</h5>
                                        <form id="personalInfoForm">
                                            <div class="mb-3">
                                                <label class="form-label">Prénom</label>
                                                <input type="text" class="form-control" id="firstName" name="firstName">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Nom</label>
                                                <input type="text" class="form-control" id="lastName" name="lastName">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Email</label>
                                                <input type="email" class="form-control" id="email" name="email">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Téléphone</label>
                                                <input type="tel" class="form-control" id="phone" name="phone">
                                            </div>
                                            <button type="submit" class="btn btn-primary">
                                                <i class="fas fa-save me-2"></i>Sauvegarder
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="info-card">
                                        <h5><i class="fas fa-briefcase me-2"></i>Informations professionnelles</h5>
                                        <form id="professionalInfoForm">
                                            <div class="mb-3">
                                                <label class="form-label">Rôle</label>
                                                <input type="text" class="form-control" id="roleDisplay" readonly>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Spécialité</label>
                                                <input type="text" class="form-control" id="specialty" name="specialty">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Expérience</label>
                                                <input type="text" class="form-control" id="experience" name="experience">
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Bio</label>
                                                <textarea class="form-control" id="bio" name="bio" rows="3"></textarea>
                                            </div>
                                            <button type="submit" class="btn btn-primary">
                                                <i class="fas fa-save me-2"></i>Sauvegarder
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Onglet Sécurité -->
                        <div class="tab-pane fade" id="security" role="tabpanel">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="info-card">
                                        <h5><i class="fas fa-key me-2"></i>Changer le mot de passe</h5>
                                        <form id="changePasswordForm">
                                            <div class="mb-3">
                                                <label class="form-label">Mot de passe actuel</label>
                                                <div class="input-group">
                                                    <input type="password" class="form-control" id="currentPassword" name="currentPassword">
                                                    <button type="button" class="btn btn-outline-secondary" onclick="togglePasswordVisibility('currentPassword')">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Nouveau mot de passe</label>
                                                <div class="input-group">
                                                    <input type="password" class="form-control" id="newPassword" name="newPassword">
                                                    <button type="button" class="btn btn-outline-secondary" onclick="togglePasswordVisibility('newPassword')">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Confirmer le nouveau mot de passe</label>
                                                <div class="input-group">
                                                    <input type="password" class="form-control" id="confirmNewPassword" name="confirmNewPassword">
                                                    <button type="button" class="btn btn-outline-secondary" onclick="togglePasswordVisibility('confirmNewPassword')">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <button type="submit" class="btn btn-primary">
                                                <i class="fas fa-key me-2"></i>Changer le mot de passe
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="info-card">
                                        <h5><i class="fas fa-shield-alt me-2"></i>Sécurité du compte</h5>
                                        <div class="mb-3">
                                            <label class="form-label">Sessions actives</label>
                                            <div class="list-group">
                                                <div class="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>Session actuelle</strong><br>
                                                        <small class="text-muted">Navigateur actuel</small>
                                                    </div>
                                                    <span class="badge bg-success">Active</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <button class="btn btn-warning" onclick="logoutAllSessions()">
                                                <i class="fas fa-sign-out-alt me-2"></i>Déconnexion de toutes les sessions
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Onglet Activité -->
                        <div class="tab-pane fade" id="activity" role="tabpanel">
                            <div class="info-card">
                                <h5><i class="fas fa-history me-2"></i>Activité récente</h5>
                                <div id="activityList">
                                    <!-- Les activités seront chargées ici -->
                                </div>
                            </div>
                        </div>

                        <!-- Onglet Préférences -->
                        <div class="tab-pane fade" id="preferences" role="tabpanel">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="info-card">
                                        <h5><i class="fas fa-palette me-2"></i>Apparence</h5>
                                        <form id="appearanceForm">
                                            <div class="mb-3">
                                                <label class="form-label">Thème</label>
                                                <select class="form-select" id="theme" name="theme">
                                                    <option value="light">Clair</option>
                                                    <option value="dark">Sombre</option>
                                                    <option value="auto">Automatique</option>
                                                </select>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Langue</label>
                                                <select class="form-select" id="language" name="language">
                                                    <option value="fr">Français</option>
                                                    <option value="en">English</option>
                                                </select>
                                            </div>
                                            <button type="submit" class="btn btn-primary">
                                                <i class="fas fa-save me-2"></i>Sauvegarder
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="info-card">
                                        <h5><i class="fas fa-bell me-2"></i>Notifications</h5>
                                        <form id="notificationsForm">
                                            <div class="form-check mb-3">
                                                <input class="form-check-input" type="checkbox" id="emailNotifications" name="emailNotifications">
                                                <label class="form-check-label" for="emailNotifications">
                                                    Notifications par email
                                                </label>
                                            </div>
                                            <div class="form-check mb-3">
                                                <input class="form-check-input" type="checkbox" id="pushNotifications" name="pushNotifications">
                                                <label class="form-check-label" for="pushNotifications">
                                                    Notifications push
                                                </label>
                                            </div>
                                            <div class="form-check mb-3">
                                                <input class="form-check-input" type="checkbox" id="gradeNotifications" name="gradeNotifications">
                                                <label class="form-check-label" for="gradeNotifications">
                                                    Notifications de notes
                                                </label>
                                            </div>
                                            <button type="submit" class="btn btn-primary">
                                                <i class="fas fa-save me-2"></i>Sauvegarder
                                            </button>
                                        </form>
                                        
                                        <hr class="my-4">
                                        
                                        <h6 class="text-danger"><i class="fas fa-exclamation-triangle me-2"></i>Zone de danger</h6>
                                        <button class="btn btn-outline-danger w-100" onclick="app.generateMockData()">
                                            <i class="fas fa-database me-2"></i>Générer des données de test
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Messages de notification -->
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="profileToast" class="toast" role="alert">
                <div class="toast-header">
                    <i class="fas fa-bell text-primary me-2"></i>
                    <strong class="me-auto">Notification</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body" id="toastMessage">
                    <!-- Message sera inséré ici -->
                </div>
            </div>
        </div>
        `;
    }

    loadProfileData() {
        this.checkAuthentication();
        this.bindEvents();
        this.loadProfileInfo();
        this.loadUserStats();
        this.loadActivity();
    }

    checkAuthentication() {
        const authToken = localStorage.getItem('authToken');
        const currentUser = localStorage.getItem('currentUser');

        if (!authToken || !currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.currentUser = JSON.parse(currentUser);
    }

    bindEvents() {
        // Upload d'avatar
        const avatarInput = document.getElementById('avatarInput');
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                this.handleAvatarUpload(e);
            });
        }

        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            profileAvatar.addEventListener('click', () => {
                document.getElementById('avatarInput').click();
            });
        }

        // Formulaires
        const personalInfoForm = document.getElementById('personalInfoForm');
        if (personalInfoForm) {
            personalInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updatePersonalInfo();
            });
        }

        const professionalInfoForm = document.getElementById('professionalInfoForm');
        if (professionalInfoForm) {
            professionalInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfessionalInfo();
            });
        }

        const changePasswordForm = document.getElementById('changePasswordForm');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword();
            });
        }

        const appearanceForm = document.getElementById('appearanceForm');
        if (appearanceForm) {
            appearanceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateAppearance();
            });
        }

        const notificationsForm = document.getElementById('notificationsForm');
        if (notificationsForm) {
            notificationsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateNotifications();
            });
        }
    }

    loadProfileInfo() {
        if (!this.currentUser) return;

        // Informations de base
        const profileName = document.getElementById('profileName');
        if (profileName) profileName.textContent = this.currentUser.name || 'Utilisateur';

        const profileRole = document.getElementById('profileRole');
        if (profileRole) profileRole.textContent = this.getRoleDisplayName(this.currentUser.role);

        // Date d'inscription
        const registrationDate = this.currentUser.registrationDate || new Date().toISOString();
        const date = new Date(registrationDate);
        const memberSince = document.getElementById('memberSince');
        if (memberSince) memberSince.textContent = `Membre depuis ${date.toLocaleDateString('fr-FR')}`;

        // Avatar
        const savedAvatar = localStorage.getItem(`avatar_${this.currentUser.username}`);
        const profileAvatar = document.getElementById('profileAvatar');
        if (savedAvatar && profileAvatar) {
            profileAvatar.src = savedAvatar;
        }

        // Informations personnelles
        if (document.getElementById('firstName')) document.getElementById('firstName').value = this.currentUser.firstName || '';
        if (document.getElementById('lastName')) document.getElementById('lastName').value = this.currentUser.lastName || '';
        if (document.getElementById('email')) document.getElementById('email').value = this.currentUser.email || '';
        if (document.getElementById('phone')) document.getElementById('phone').value = this.currentUser.phone || '';

        // Informations professionnelles
        if (document.getElementById('roleDisplay')) document.getElementById('roleDisplay').value = this.getRoleDisplayName(this.currentUser.role);
        if (document.getElementById('specialty')) document.getElementById('specialty').value = this.currentUser.specialty || '';
        if (document.getElementById('experience')) document.getElementById('experience').value = this.currentUser.experience || '';
        if (document.getElementById('bio')) document.getElementById('bio').value = this.currentUser.bio || '';

        // Préférences
        if (document.getElementById('theme')) document.getElementById('theme').value = this.currentUser.theme || 'light';
        if (document.getElementById('language')) document.getElementById('language').value = this.currentUser.language || 'fr';
        if (document.getElementById('emailNotifications')) document.getElementById('emailNotifications').checked = this.currentUser.emailNotifications !== false;
        if (document.getElementById('pushNotifications')) document.getElementById('pushNotifications').checked = this.currentUser.pushNotifications !== false;
        if (document.getElementById('gradeNotifications')) document.getElementById('gradeNotifications').checked = this.currentUser.gradeNotifications !== false;
    }

    loadUserStats() {
        // Initialize default data if it doesn't exist
        this.initializeDefaultData();

        // Statistiques des élèves
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
        const classes = JSON.parse(localStorage.getItem('classes') || '[]');
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');

        let studentsCount = 0;
        let classesCount = 0;
        let gradesCount = 0;

        if (this.currentUser) {
            if (this.currentUser.role === 'teacher') {
                // Pour les enseignants, compter seulement leurs élèves et classes
                studentsCount = students.filter(s => s.teacherId === this.currentUser.username).length;
                classesCount = classes.filter(c => c.teacherId === this.currentUser.username).length;
                gradesCount = grades.filter(g => g.teacherId === this.currentUser.username).length;
            } else if (this.currentUser.role === 'admin' || this.currentUser.role === 'director') {
                // Pour les admins et direction, compter tout
                studentsCount = students.length;
                classesCount = classes.length;
                gradesCount = grades.length;
            }

            // Nombre de connexions
            const loginCount = parseInt(localStorage.getItem(`loginCount_${this.currentUser.username}`) || '0');

            if (document.getElementById('studentsCount')) document.getElementById('studentsCount').textContent = studentsCount;
            if (document.getElementById('classesCount')) document.getElementById('classesCount').textContent = classesCount;
            if (document.getElementById('gradesCount')) document.getElementById('gradesCount').textContent = gradesCount;
            if (document.getElementById('loginCount')) document.getElementById('loginCount').textContent = loginCount;
        }
    }

    initializeDefaultData() {
        // Initialize default students if not exists
        if (!localStorage.getItem('students')) {
            const defaultStudents = [
                { id: 1, firstName: 'Jean', lastName: 'Dupont', dateOfBirth: '2015-03-15', gender: 'M', class: 'CP A', parentName: 'M. Dupont', parentPhone: '01 23 45 67 89', parentEmail: 'dupont@email.fr', address: '123 Rue de la Paix', teacherId: 'enseignant' },
                { id: 2, firstName: 'Marie', lastName: 'Martin', dateOfBirth: '2014-07-22', gender: 'F', class: 'CE1 A', parentName: 'Mme Martin', parentPhone: '01 23 45 67 90', parentEmail: 'martin@email.fr', address: '456 Avenue des Fleurs', teacherId: 'enseignant' },
                { id: 3, firstName: 'Pierre', lastName: 'Durand', dateOfBirth: '2016-01-10', gender: 'M', class: 'Grande Section', parentName: 'M. Durand', parentPhone: '01 23 45 67 91', parentEmail: 'durand@email.fr', address: '789 Boulevard du Soleil', teacherId: 'enseignant' }
            ];
            localStorage.setItem('students', JSON.stringify(defaultStudents));
        }

        // Initialize default teachers if not exists
        if (!localStorage.getItem('teachers')) {
            const defaultTeachers = [
                { id: 1, firstName: 'Sophie', lastName: 'Leroy', qualification: 'Professeur des Écoles', email: 's.leroy@ecole.fr', phone: '01 23 45 67 89', dateOfBirth: '1985-05-15', gender: 'F', address: '10 Rue de l\'École', hireDate: '2010-09-01', username: 'enseignant' },
                { id: 2, firstName: 'Michel', lastName: 'Moreau', qualification: 'Professeur des Écoles', email: 'm.moreau@ecole.fr', phone: '01 23 45 67 90', dateOfBirth: '1982-08-20', gender: 'M', address: '15 Avenue des Enseignants', hireDate: '2008-09-01', username: 'direction' }
            ];
            localStorage.setItem('teachers', JSON.stringify(defaultTeachers));
        }

        // Initialize default classes if not exists
        if (!localStorage.getItem('classes')) {
            const defaultClasses = [
                { id: 1, name: 'CP A', level: 'CP', capacity: 25, studentCount: 22, teacherId: 'enseignant' },
                { id: 2, name: 'CE1 A', level: 'CE1', capacity: 30, studentCount: 28, teacherId: 'enseignant' },
                { id: 3, name: 'CE2 A', level: 'CE2', capacity: 28, studentCount: 25, teacherId: 'direction' },
                { id: 4, name: 'CM1 A', level: 'CM1', capacity: 30, studentCount: 27, teacherId: 'direction' },
                { id: 5, name: 'CM2 A', level: 'CM2', capacity: 30, studentCount: 29, teacherId: 'enseignant' },
                { id: 6, name: 'Petite Section', level: 'Petite Section', capacity: 20, studentCount: 18, teacherId: 'enseignant' },
                { id: 7, name: 'Moyenne Section', level: 'Moyenne Section', capacity: 22, studentCount: 20, teacherId: 'direction' },
                { id: 8, name: 'Grande Section', level: 'Grande Section', capacity: 25, studentCount: 23, teacherId: 'enseignant' }
            ];
            localStorage.setItem('classes', JSON.stringify(defaultClasses));
        }

        // Initialize default grades if not exists
        if (!localStorage.getItem('grades')) {
            const defaultGrades = [
                { id: 1, studentId: 1, studentName: 'Jean Dupont', subjectId: 1, subject: 'Mathématiques', grade: 16.5, date: '2023-10-15', teacherId: 'enseignant' },
                { id: 2, studentId: 2, studentName: 'Marie Martin', subjectId: 2, subject: 'Français', grade: 14.0, date: '2023-10-16', teacherId: 'enseignant' },
                { id: 3, studentId: 3, studentName: 'Pierre Durand', subjectId: 1, subject: 'Mathématiques', grade: 18.0, date: '2023-10-17', teacherId: 'direction' }
            ];
            localStorage.setItem('grades', JSON.stringify(defaultGrades));
        }

        // Initialize registered users if not exists
        if (!localStorage.getItem('registeredUsers')) {
            const defaultUsers = [
                { id: 'admin', firstName: 'Admin', lastName: 'Système', username: 'admin', email: 'admin@ecole.fr', password: 'admin123', role: 'admin', registrationDate: '2023-01-01', isActive: true },
                { id: 'enseignant', firstName: 'Sophie', lastName: 'Leroy', username: 'enseignant', email: 's.leroy@ecole.fr', password: 'enseignant123', role: 'teacher', registrationDate: '2023-01-01', isActive: true },
                { id: 'direction', firstName: 'Michel', lastName: 'Moreau', username: 'direction', email: 'm.moreau@ecole.fr', password: 'direction123', role: 'director', registrationDate: '2023-01-01', isActive: true }
            ];
            localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
        }
    }

    loadActivity() {
        const activities = JSON.parse(localStorage.getItem(`activities_${this.currentUser.username}`) || '[]');
        const activityList = document.getElementById('activityList');

        if (!activityList) return;

        if (activities.length === 0) {
            activityList.innerHTML = '<p class="text-muted">Aucune activité récente</p>';
            return;
        }

        activityList.innerHTML = activities.slice(0, 10).map(activity => `
            <div class="activity-item">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${activity.action}</h6>
                        <p class="mb-1">${activity.description}</p>
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>${this.formatTimestamp(activity.timestamp)}
                        </small>
                    </div>
                    <span class="badge bg-${this.getActivityBadgeColor(activity.type)}">${activity.type}</span>
                </div>
            </div>
        `).join('');
    }

    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            this.showNotification('Veuillez sélectionner un fichier image', 'error');
            return;
        }

        // Vérifier la taille (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('L\'image doit faire moins de 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            // Sauvegarder l'avatar
            localStorage.setItem(`avatar_${this.currentUser.username}`, e.target.result);

            // Mettre à jour l'affichage
            const profileAvatar = document.getElementById('profileAvatar');
            if (profileAvatar) profileAvatar.src = e.target.result;

            // Ajouter à l'activité
            this.addActivity('Changement d\'avatar', 'Photo de profil mise à jour', 'update');

            this.showNotification('Avatar mis à jour avec succès', 'success');
        };
        reader.readAsDataURL(file);
    }

    updatePersonalInfo() {
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        if (!this.isValidEmail(formData.email)) {
            this.showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }

        // Mettre à jour les données utilisateur
        this.currentUser.firstName = formData.firstName;
        this.currentUser.lastName = formData.lastName;
        this.currentUser.email = formData.email;
        this.currentUser.phone = formData.phone;
        this.currentUser.name = `${formData.firstName} ${formData.lastName}`;

        // Sauvegarder
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Mettre à jour l'affichage
        const profileName = document.getElementById('profileName');
        if (profileName) profileName.textContent = this.currentUser.name;

        // Ajouter à l'activité
        this.addActivity('Mise à jour du profil', 'Informations personnelles modifiées', 'update');

        this.showNotification('Informations personnelles mises à jour', 'success');
    }

    updateProfessionalInfo() {
        const formData = {
            specialty: document.getElementById('specialty').value,
            experience: document.getElementById('experience').value,
            bio: document.getElementById('bio').value
        };

        // Mettre à jour les données utilisateur
        this.currentUser.specialty = formData.specialty;
        this.currentUser.experience = formData.experience;
        this.currentUser.bio = formData.bio;

        // Sauvegarder
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Ajouter à l'activité
        this.addActivity('Mise à jour professionnelle', 'Informations professionnelles modifiées', 'update');

        this.showNotification('Informations professionnelles mises à jour', 'success');
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        // Validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            this.showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showNotification('Le nouveau mot de passe doit contenir au moins 6 caractères', 'error');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            this.showNotification('Les mots de passe ne correspondent pas', 'error');
            return;
        }

        // Vérifier l'ancien mot de passe (simulation)
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = registeredUsers.findIndex(u => u.username === this.currentUser.username);

        if (userIndex !== -1) {
            if (registeredUsers[userIndex].password !== currentPassword) {
                this.showNotification('Mot de passe actuel incorrect', 'error');
                return;
            }

            // Mettre à jour le mot de passe
            registeredUsers[userIndex].password = newPassword;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }

        // Ajouter à l'activité
        this.addActivity('Changement de mot de passe', 'Mot de passe mis à jour', 'security');

        // Vider le formulaire
        document.getElementById('changePasswordForm').reset();

        this.showNotification('Mot de passe changé avec succès', 'success');
    }

    updateAppearance() {
        const theme = document.getElementById('theme').value;
        const language = document.getElementById('language').value;

        // Mettre à jour les données utilisateur
        this.currentUser.theme = theme;
        this.currentUser.language = language;

        // Sauvegarder
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Appliquer le thème
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        // Ajouter à l'activité
        this.addActivity('Préférences d\'apparence', 'Thème et langue mis à jour', 'preference');

        this.showNotification('Préférences d\'apparence sauvegardées', 'success');
    }

    updateNotifications() {
        const emailNotifications = document.getElementById('emailNotifications').checked;
        const pushNotifications = document.getElementById('pushNotifications').checked;
        const gradeNotifications = document.getElementById('gradeNotifications').checked;

        // Mettre à jour les données utilisateur
        this.currentUser.emailNotifications = emailNotifications;
        this.currentUser.pushNotifications = pushNotifications;
        this.currentUser.gradeNotifications = gradeNotifications;

        // Sauvegarder
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Ajouter à l'activité
        this.addActivity('Préférences de notifications', 'Paramètres de notification mis à jour', 'preference');

        this.showNotification('Préférences de notifications sauvegardées', 'success');
    }

    addActivity(action, description, type) {
        const activities = JSON.parse(localStorage.getItem(`activities_${this.currentUser.username}`) || '[]');

        const activity = {
            id: Date.now(),
            action,
            description,
            type,
            timestamp: new Date().toISOString()
        };

        activities.unshift(activity);

        // Limiter à 50 activités
        if (activities.length > 50) {
            activities.splice(50);
        }

        localStorage.setItem(`activities_${this.currentUser.username}`, JSON.stringify(activities));
        this.loadActivity();
    }

    getRoleDisplayName(role) {
        const names = {
            'admin': 'Administrateur',
            'director': 'Direction',
            'teacher': 'Enseignant'
        };
        return names[role] || role;
    }

    getActivityBadgeColor(type) {
        const colors = {
            'update': 'primary',
            'security': 'warning',
            'preference': 'info',
            'login': 'success',
            'logout': 'secondary'
        };
        return colors[type] || 'secondary';
    }

    formatTimestamp(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = now - date;

        if (diff < 60000) return 'À l\'instant';
        if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`;
        if (diff < 604800000) return `Il y a ${Math.floor(diff / 86400000)} jour(s)`;

        return date.toLocaleDateString('fr-FR');
    }

    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    showNotification(message, type = 'info') {
        const toast = document.getElementById('profileToast');
        const toastMessage = document.getElementById('toastMessage');

        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;

        // Changer la couleur selon le type
        const toastHeader = toast.querySelector('.toast-header');
        if (toastHeader) {
            toastHeader.className = `toast-header bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} text-white`;
        }

        // Afficher le toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

// Fonction globale pour basculer la visibilité des mots de passe
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Fonction pour déconnecter toutes les sessions
function logoutAllSessions() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter de toutes les sessions ?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberMe');

        // Ajouter à l'activité avant de rediriger
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.username) {
            const activities = JSON.parse(localStorage.getItem(`activities_${currentUser.username}`) || '[]');
            activities.unshift({
                id: Date.now(),
                action: 'Déconnexion forcée',
                description: 'Déconnexion de toutes les sessions',
                type: 'security',
                timestamp: new Date().toISOString()
            });
            localStorage.setItem(`activities_${currentUser.username}`, JSON.stringify(activities));
        }

        window.location.href = 'login.html';
    }
}
