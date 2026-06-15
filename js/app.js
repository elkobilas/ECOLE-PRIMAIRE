// Les modules DashboardModule et StudentsModule sont chargés depuis leurs fichiers respectifs (js/dashboard.js et js/students.js)


// Application de Gestion Scolaire - Version complète et fonctionnelle
class SchoolManagementApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.students = [];
        this.teachers = [];
        this.classes = [];
        this.grades = [];
        this.subjects = [];
        this.users = [];
        this.currentStudentId = null;

        // Initialiser les modules
        this.dashboardModule = new DashboardModule(this);
        this.studentsModule = new StudentsModule(this);
        this.teachersModule = new TeachersModule(this);
        this.classesModule = new ClassesModule(this);
        this.gradesModule = new GradesModule(this);
        this.agendaModule = new AgendaModule(this);
        this.reportsModule = new ReportsModule(this);
        this.profileModule = new ProfileModule(this);
        this.authManager = new AuthManager();

        this.init();
    }

    init() {
        this.loadDataFromStorage();
        this.bindEvents();
        
        // La vérification d'authentification est gérée par authManager.init()
        // qui est appelé dans le constructeur via this.authManager = new AuthManager()
        
        this.loadPage('dashboard');
    }

    loadDataFromStorage() {
        this.students = JSON.parse(localStorage.getItem('students')) || this.getDefaultStudents();
        this.teachers = JSON.parse(localStorage.getItem('teachers')) || this.getDefaultTeachers();
        this.classes = JSON.parse(localStorage.getItem('classes')) || this.getDefaultClasses();
        this.grades = JSON.parse(localStorage.getItem('grades')) || this.getDefaultGrades();
        this.subjects = JSON.parse(localStorage.getItem('subjects')) || this.getDefaultSubjects();
        this.users = JSON.parse(localStorage.getItem('users')) || this.getDefaultUsers();
        
        // S'assurer que le nouvel administrateur est bien ajouté même si le cache existe
        if (!this.users.find(u => u.email === 'kiemamahama@gmail.com')) {
            const adminUser = this.getDefaultUsers().find(u => u.email === 'kiemamahama@gmail.com');
            if (adminUser) this.users.push(adminUser);
        }
        
        this.saveDataToStorage();
    }

    getDefaultStudents() {
        return [
            { id: 1, firstName: 'Jean', lastName: 'Dupont', dateOfBirth: '2015-03-15', gender: 'M', class: 'CP A', parentName: 'M. Dupont', parentPhone: '01 23 45 67 89', parentEmail: 'dupont@email.fr', address: '123 Rue de la Paix', isActive: true },
            { id: 2, firstName: 'Marie', lastName: 'Martin', dateOfBirth: '2014-07-22', gender: 'F', class: 'CE1 A', parentName: 'Mme Martin', parentPhone: '01 23 45 67 90', parentEmail: 'martin@email.fr', address: '456 Avenue des Fleurs', isActive: true },
            { id: 3, firstName: 'Pierre', lastName: 'Durand', dateOfBirth: '2016-01-10', gender: 'M', class: 'Grande Section', parentName: 'M. Durand', parentPhone: '01 23 45 67 91', parentEmail: 'durand@email.fr', address: '789 Boulevard du Soleil', isActive: true }
        ];
    }

    getDefaultTeachers() {
        return [
            { id: 1, firstName: 'Sophie', lastName: 'Leroy', qualification: 'Professeur des Écoles', email: 's.leroy@ecole.fr', phone: '01 23 45 67 89', dateOfBirth: '1985-05-15', gender: 'F', address: '10 Rue de l\'École', hireDate: '2010-09-01', isActive: true },
            { id: 2, firstName: 'Michel', lastName: 'Moreau', qualification: 'Professeur des Écoles', email: 'm.moreau@ecole.fr', phone: '01 23 45 67 90', dateOfBirth: '1982-08-20', gender: 'M', address: '15 Avenue des Enseignants', hireDate: '2008-09-01', isActive: true }
        ];
    }

    getDefaultClasses() {
        return [
            { id: 1, name: 'CP A', level: 'CP', capacity: 25, studentCount: 22, teacherId: 1 },
            { id: 2, name: 'CE1 A', level: 'CE1', capacity: 30, studentCount: 28, teacherId: 2 },
            { id: 3, name: 'CE2 A', level: 'CE2', capacity: 28, studentCount: 25, teacherId: 1 },
            { id: 4, name: 'CM1 A', level: 'CM1', capacity: 30, studentCount: 27, teacherId: 2 },
            { id: 5, name: 'CM2 A', level: 'CM2', capacity: 30, studentCount: 29, teacherId: 1 },
            { id: 6, name: 'Petite Section', level: 'Petite Section', capacity: 20, studentCount: 18, teacherId: 2 },
            { id: 7, name: 'Moyenne Section', level: 'Moyenne Section', capacity: 22, studentCount: 20, teacherId: 1 },
            { id: 8, name: 'Grande Section', level: 'Grande Section', capacity: 25, studentCount: 23, teacherId: 2 }
        ];
    }

    getDefaultGrades() {
        return [
            { id: 1, studentId: 1, studentName: 'Jean Dupont', subjectId: 1, subject: 'Mathématiques', grade: 16.5, date: '2023-10-15', coefficient: 3, teacherId: 1 },
            { id: 2, studentId: 2, studentName: 'Marie Martin', subjectId: 2, subject: 'Français', grade: 14.0, date: '2023-10-16', coefficient: 3, teacherId: 2 }
        ];
    }

    getDefaultSubjects() {
        return [
            { id: 1, name: 'Mathématiques', level: 'CP', coefficient: 3.0 },
            { id: 2, name: 'Français', level: 'CP', coefficient: 3.0 },
            { id: 3, name: 'Sciences', level: 'CE1', coefficient: 2.0 },
            { id: 4, name: 'Histoire-Géographie', level: 'CE1', coefficient: 2.0 },
            { id: 5, name: 'Éducation Physique', level: 'CP', coefficient: 1.0 },
            { id: 6, name: 'Arts Plastiques', level: 'CP', coefficient: 1.0 }
        ];
    }

    getDefaultUsers() {
        return [
            { id: 'admin', username: 'admin', password: 'admin123', role: 'admin', firstName: 'Admin', lastName: 'Système', email: 'admin@ecole.fr', isActive: true },
            { id: 'admin2', username: 'kiema', password: 'password123', role: 'admin', firstName: 'Mahama', lastName: 'Kiema', email: 'kiemamahama@gmail.com', isActive: true },
            { id: 'enseignant', username: 'enseignant', password: 'enseignant123', role: 'teacher', firstName: 'Enseignant', lastName: 'Test', email: 'enseignant@ecole.fr', isActive: true },
            { id: 'direction', username: 'direction', password: 'direction123', role: 'director', firstName: 'Direction', lastName: 'École', email: 'direction@ecole.fr', isActive: true }
        ];
    }

    generateMockData() {
        if (confirm('Attention : Cette action va effacer toutes les données actuelles et générer de nouvelles données de test. Voulez-vous continuer ?')) {
            const data = MockDataGenerator.generateData();
            this.students = data.students;
            this.teachers = data.teachers;
            this.classes = data.classes;
            this.grades = data.grades;
            this.subjects = data.subjects;

            this.saveDataToStorage();
            this.showNotification('Données de test générées avec succès !', 'success');

            // Recharger la page actuelle pour afficher les nouvelles données
            this.loadPage(this.currentPage);
        }
    }

    saveDataToStorage() {
        localStorage.setItem('students', JSON.stringify(this.students));
        localStorage.setItem('teachers', JSON.stringify(this.teachers));
        localStorage.setItem('classes', JSON.stringify(this.classes));
        localStorage.setItem('grades', JSON.stringify(this.grades));
        localStorage.setItem('subjects', JSON.stringify(this.subjects));
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    bindEvents() {
        // Navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-page]');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.loadPage(page);
                this.updateActiveNavLink(page);
            }
        });

        // Logout
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn') {
                e.preventDefault();
                this.logout();
            }
        });
    }

    updateActiveNavLink(activePage) {
        // Retirer la classe active de tous les liens
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Ajouter la classe active au lien actuel
        const activeLink = document.querySelector(`[data-page="${activePage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    loadPage(page) {
        this.currentPage = page;
        const content = document.getElementById('main-content');

        if (!content) {
            console.error('Élément main-content non trouvé');
            return;
        }

        console.log(`Chargement de la page: ${page}`);

        switch (page) {
            case 'dashboard':
                content.innerHTML = this.dashboardModule.getDashboardHTML();
                this.dashboardModule.loadDashboardData();
                break;
            case 'students':
                content.innerHTML = this.studentsModule.getStudentsHTML();
                setTimeout(() => this.studentsModule.loadStudentsData(), 100);
                break;
            case 'teachers':
                content.innerHTML = this.teachersModule.getTeachersHTML();
                setTimeout(() => this.teachersModule.loadTeachersData(), 100);
                break;
            case 'classes':
                content.innerHTML = this.classesModule.getClassesHTML();
                setTimeout(() => this.classesModule.loadClassesData(), 100);
                break;
            case 'grades':
                content.innerHTML = this.gradesModule.getGradesHTML();
                setTimeout(() => this.gradesModule.loadGradesData(), 100);
                break;
            case 'agenda':
                content.innerHTML = this.agendaModule.getAgendaHTML();
                setTimeout(() => this.agendaModule.loadAgendaData(), 100);
                break;
            case 'reports':
                content.innerHTML = this.reportsModule.getReportsHTML();
                setTimeout(() => this.reportsModule.loadReportsData(), 100);
                break;
            case 'profile':
                content.innerHTML = this.profileModule.getProfileHTML();
                setTimeout(() => this.profileModule.loadProfileData(), 100);
                break;
            default:
                content.innerHTML = '<div class="alert alert-warning">Page non trouvée</div>';
        }
    }

    // Les méthodes pour les modules sont maintenant déléguées aux modules respectifs

    // Méthodes pour les élèves
    saveStudent() {
        const form = document.getElementById('studentForm');
        const formData = new FormData(form);

        const studentData = {
            id: this.currentStudentId || Date.now(),
            firstName: document.getElementById('studentFirstName').value,
            lastName: document.getElementById('studentLastName').value,
            dateOfBirth: document.getElementById('studentDateOfBirth').value,
            gender: document.getElementById('studentGender').value,
            class: document.getElementById('studentClass').value,
            address: document.getElementById('studentAddress').value,
            parentName: document.getElementById('parentName').value,
            parentPhone: document.getElementById('parentPhone').value,
            parentEmail: document.getElementById('parentEmail').value,
            isActive: document.getElementById('studentActive').checked
        };

        // === VALIDATION DATE DE NAISSANCE ÉLÈVE ===
        if (!studentData.dateOfBirth) {
            this.showNotification('⚠️ La date de naissance est obligatoire', 'warning');
            return;
        }
        const studentBirthDate = new Date(studentData.dateOfBirth);
        const today = new Date();
        if (studentBirthDate >= today) {
            this.showNotification('⚠️ La date de naissance ne peut pas être dans le futur', 'warning');
            return;
        }
        const studentAge = today.getFullYear() - studentBirthDate.getFullYear() - 
            ((today.getMonth() < studentBirthDate.getMonth() || 
             (today.getMonth() === studentBirthDate.getMonth() && today.getDate() < studentBirthDate.getDate())) ? 1 : 0);
        if (studentAge < 2 || studentAge > 15) {
            this.showNotification(`⚠️ L'âge de l'élève (${studentAge} ans) n'est pas valide. L'élève doit avoir entre 2 et 15 ans.`, 'warning');
            return;
        }

        if (this.currentStudentId) {
            // Modification
            const index = this.students.findIndex(s => s.id === this.currentStudentId);
            if (index !== -1) {
                this.students[index] = studentData;
                this.logActivity(`Modification de l'élève ${studentData.firstName} ${studentData.lastName}`, `Classe: ${studentData.class || 'Aucune'}`, 'edit');
            }
        } else {
            // Ajout
            this.students.push(studentData);
            this.logActivity(`Inscription de l'élève ${studentData.firstName} ${studentData.lastName}`, `Classe: ${studentData.class || 'Aucune'}`, 'add');
        }

        this.saveDataToStorage();
        this.showNotification('Élève enregistré avec succès', 'success');

        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('studentModal'));
        modal.hide();

        // Recharger la page
        this.loadPage('students');
    }

    editStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        this.currentStudentId = studentId;

        // Remplir le formulaire
        document.getElementById('studentFirstName').value = student.firstName;
        document.getElementById('studentLastName').value = student.lastName;
        document.getElementById('studentDateOfBirth').value = student.dateOfBirth;
        document.getElementById('studentGender').value = student.gender;
        document.getElementById('studentClass').value = student.class || '';
        document.getElementById('studentAddress').value = student.address || '';
        document.getElementById('parentName').value = student.parentName || '';
        document.getElementById('parentPhone').value = student.parentPhone || '';
        document.getElementById('parentEmail').value = student.parentEmail || '';
        document.getElementById('studentActive').checked = student.isActive !== false;

        // Changer le titre du modal
        document.getElementById('studentModalTitle').textContent = 'Modifier l\'élève';

        // Ouvrir le modal
        const modal = new bootstrap.Modal(document.getElementById('studentModal'));
        modal.show();
    }

    deleteStudent(studentId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
            const student = this.students.find(s => s.id === studentId);
            const studentName = student ? `${student.firstName} ${student.lastName}` : `ID ${studentId}`;
            this.students = this.students.filter(s => s.id !== studentId);
            this.saveDataToStorage();
            this.logActivity(`Suppression de l'élève ${studentName}`, '', 'delete');
            this.showNotification('Élève supprimé avec succès', 'success');
            this.loadPage('students');
        }
    }

    showParentInfo(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase();
        const html = `
            <div class="text-center mb-4">
                <div class="detail-avatar" style="background: var(--gradient-purple);">
                    ${initials}
                </div>
                <h4 class="fw-bold">${student.firstName} ${student.lastName}</h4>
                <p class="text-muted text-center">Contact Parents / Tuteurs</p>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-user-friends me-1"></i>Nom du Parent</div>
                <div class="detail-value">${student.parentName || 'Non renseigné'}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-phone me-1"></i>Téléphone</div>
                <div class="detail-value">${student.parentPhone || 'Non renseigné'}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-envelope me-1"></i>Adresse Email</div>
                <div class="detail-value">${student.parentEmail || 'Non renseigné'}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-map-marker-alt me-1"></i>Adresse Domicile</div>
                <div class="detail-value">${student.address || 'Non renseignée'}</div>
            </div>
        `;

        document.getElementById('detailsModalTitle').textContent = "Informations Parents";
        document.getElementById('detailsModalBody').innerHTML = html;

        const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
        modal.show();
    }

    viewStudentDetails(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase();
        const birthFmt = new Date(student.dateOfBirth).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        const isActive = student.isActive !== false;

        const html = `
            <div class="text-center mb-4">
                <div class="detail-avatar" style="background: var(--gradient-primary);">
                    ${initials}
                </div>
                <h4 class="fw-bold">${student.firstName} ${student.lastName}</h4>
                <span class="badge bg-${isActive ? 'success' : 'danger'}">${isActive ? 'Actif' : 'Inactif'}</span>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-birthday-cake me-1"></i>Date de naissance</div>
                <div class="detail-value">${birthFmt}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-chalkboard me-1"></i>Classe</div>
                <div class="detail-value">${student.class || 'Non assigné'}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-map-marker-alt me-1"></i>Adresse Domicile</div>
                <div class="detail-value">${student.address || 'Non renseignée'}</div>
            </div>
        `;

        document.getElementById('detailsModalTitle').textContent = "Détails de l'Élève";
        document.getElementById('detailsModalBody').innerHTML = html;

        const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
        modal.show();
    }

    exportStudents() {
        const csvContent = this.generateStudentsCSV(this.students);
        this.downloadCSV(csvContent, 'eleves.csv');
    }

    generateStudentsCSV(students) {
        const headers = ['Nom', 'Prénom', 'Date de naissance', 'Classe', 'Parents', 'Téléphone', 'Email'];
        const rows = students.map(student => [
            student.lastName,
            student.firstName,
            student.dateOfBirth,
            student.class || '',
            student.parentName || '',
            student.parentPhone || '',
            student.parentEmail || ''
        ]);

        return [headers, ...rows].map(row =>
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Méthodes pour les actions en lot
    bulkEditStudents() {
        const selectedIds = Array.from(document.querySelectorAll('.student-checkbox:checked'))
            .map(cb => parseInt(cb.value));

        if (selectedIds.length === 0) {
            this.showNotification('Aucun élève sélectionné', 'warning');
            return;
        }

        this.showNotification(`Modification en lot de ${selectedIds.length} élève(s)`, 'info');
    }

    bulkDeleteStudents() {
        const selectedIds = Array.from(document.querySelectorAll('.student-checkbox:checked'))
            .map(cb => parseInt(cb.value));

        if (selectedIds.length === 0) {
            this.showNotification('Aucun élève sélectionné', 'warning');
            return;
        }

        if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.length} élève(s) ?`)) {
            this.students = this.students.filter(s => !selectedIds.includes(s.id));
            this.saveDataToStorage();
            this.showNotification(`${selectedIds.length} élève(s) supprimé(s)`, 'success');
            this.loadPage('students');
        }
    }

    bulkExportStudents() {
        const selectedIds = Array.from(document.querySelectorAll('.student-checkbox:checked'))
            .map(cb => parseInt(cb.value));

        if (selectedIds.length === 0) {
            this.showNotification('Aucun élève sélectionné', 'warning');
            return;
        }

        const selectedStudents = this.students.filter(s => selectedIds.includes(s.id));
        const csvContent = this.generateStudentsCSV(selectedStudents);
        this.downloadCSV(csvContent, `eleves_selection_${new Date().toISOString().split('T')[0]}.csv`);
    }

    generateReport(reportType) {
        this.showNotification('Génération de rapport en cours...', 'info');
    }

    refreshDashboard() {
        this.dashboardModule.refreshDashboard();
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    logActivity(action, details, type = 'system') {
        const activities = JSON.parse(localStorage.getItem('activities')) || this.getDefaultActivities();
        const newActivity = {
            id: Date.now(),
            action,
            details,
            type, // 'add', 'edit', 'delete', 'system'
            time: new Date().toISOString()
        };
        activities.unshift(newActivity);
        
        if (activities.length > 30) {
            activities.pop();
        }
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    getDefaultActivities() {
        return [
            { id: 1, action: "Démarrage de l'application", details: "L'application de gestion scolaire a été initialisée.", type: "system", time: new Date(Date.now() - 3600000).toISOString() },
            { id: 2, action: "Génération des données", details: "Données de démonstration chargées.", type: "add", time: new Date(Date.now() - 7200000).toISOString() }
        ];
    }
}

// Initialiser l'application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SchoolManagementApp();
});
