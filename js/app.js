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
        this.reportsModule = new ReportsModule(this);
        this.profileModule = new ProfileModule(this);

        this.init();
    }

    init() {
        this.loadDataFromStorage();
        this.bindEvents();
        this.loadPage('dashboard');
        this.showNotification('Application chargée avec succès', 'success');
    }

    loadDataFromStorage() {
        this.students = JSON.parse(localStorage.getItem('students')) || this.getDefaultStudents();
        this.teachers = JSON.parse(localStorage.getItem('teachers')) || this.getDefaultTeachers();
        this.classes = JSON.parse(localStorage.getItem('classes')) || this.getDefaultClasses();
        this.grades = JSON.parse(localStorage.getItem('grades')) || this.getDefaultGrades();
        this.subjects = JSON.parse(localStorage.getItem('subjects')) || this.getDefaultSubjects();
        this.users = JSON.parse(localStorage.getItem('users')) || this.getDefaultUsers();
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
                setTimeout(() => this.dashboardModule.loadDashboardData(), 100);
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

        if (this.currentStudentId) {
            // Modification
            const index = this.students.findIndex(s => s.id === this.currentStudentId);
            if (index !== -1) {
                this.students[index] = studentData;
            }
        } else {
            // Ajout
            this.students.push(studentData);
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
            this.students = this.students.filter(s => s.id !== studentId);
            this.saveDataToStorage();
            this.showNotification('Élève supprimé avec succès', 'success');
            this.loadPage('students');
        }
    }

    showParentInfo(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        alert(`Informations des parents de ${student.firstName} ${student.lastName}:\n\nNom: ${student.parentName}\nTéléphone: ${student.parentPhone}\nEmail: ${student.parentEmail || 'Non renseigné'}`);
    }

    viewStudentDetails(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        alert(`Détails de ${student.firstName} ${student.lastName}:\n\nDate de naissance: ${new Date(student.dateOfBirth).toLocaleDateString('fr-FR')}\nClasse: ${student.class || 'Non assigné'}\nAdresse: ${student.address || 'Non renseignée'}`);
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
}

// Initialiser l'application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SchoolManagementApp();
});
