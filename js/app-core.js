// Application de Gestion Scolaire - Partie principale
class SchoolManagementApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.students = [];
        this.teachers = [];
        this.classes = [];
        this.grades = [];
        this.subjects = [];
        this.users = [];
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

    saveDataToStorage() {
        localStorage.setItem('students', JSON.stringify(this.students));
        localStorage.setItem('teachers', JSON.stringify(this.teachers));
        localStorage.setItem('classes', JSON.stringify(this.classes));
        localStorage.setItem('grades', JSON.stringify(this.grades));
        localStorage.setItem('subjects', JSON.stringify(this.subjects));
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    bindEvents() {
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.loadPage(page);
            });
        });

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
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
        
        switch(page) {
            case 'dashboard':
                content.innerHTML = this.getDashboardHTML();
                setTimeout(() => this.loadDashboardData(), 100);
                break;
            case 'students':
                content.innerHTML = this.getStudentsHTML();
                setTimeout(() => this.loadStudentsData(), 100);
                break;
            case 'teachers':
                content.innerHTML = this.getTeachersHTML();
                setTimeout(() => this.loadTeachersData(), 100);
                break;
            case 'classes':
                content.innerHTML = this.getClassesHTML();
                setTimeout(() => this.loadClassesData(), 100);
                break;
            case 'grades':
                content.innerHTML = this.getGradesHTML();
                setTimeout(() => this.loadGradesData(), 100);
                break;
            case 'reports':
                content.innerHTML = this.getReportsHTML();
                setTimeout(() => this.loadReportsData(), 100);
                break;
            case 'profile':
                content.innerHTML = this.getProfileHTML();
                setTimeout(() => this.loadProfileData(), 100);
                break;
            default:
                content.innerHTML = '<div class="alert alert-warning">Page non trouvée</div>';
        }
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
