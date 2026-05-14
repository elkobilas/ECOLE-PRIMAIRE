// Module Gestion des Élèves
class StudentsModule {
    constructor(app) {
        this.app = app;
    }

    getStudentsHTML() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-user-graduate me-2"></i>Gestion des Élèves</h2>
                <div>
                    <button class="btn btn-success me-2" onclick="app.exportStudents()">
                        <i class="fas fa-download me-1"></i>Exporter
                    </button>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#studentModal">
                        <i class="fas fa-plus me-1"></i>Ajouter un élève
                    </button>
                </div>
            </div>
            
            <!-- Statistiques rapides -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 id="totalStudents">0</h4>
                                    <p class="mb-0">Total élèves</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="fas fa-user-graduate fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 id="activeStudents">0</h4>
                                    <p class="mb-0">Actifs</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="fas fa-check-circle fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-warning text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 id="newStudents">0</h4>
                                    <p class="mb-0">Nouveaux</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="fas fa-user-plus fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-info text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 id="averageAge">0</h4>
                                    <p class="mb-0">Âge moyen</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="fas fa-birthday-cake fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <span><i class="fas fa-list me-2"></i>Liste des élèves</span>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-6">
                                    <select class="form-select" id="classFilter">
                                        <option value="">Toutes les classes</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <input type="text" class="form-control" id="studentSearch" placeholder="Rechercher...">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        <input type="checkbox" id="selectAllStudents" class="form-check-input">
                                    </th>
                                    <th>Photo</th>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Date de naissance</th>
                                    <th>Âge</th>
                                    <th>Classe</th>
                                    <th>Parents</th>
                                    <th>Statut</th>
                                    <th class="table-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="studentsTableBody">
                                <!-- Données des élèves seront chargées ici -->
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Actions en lot -->
                    <div class="mt-3" id="bulkActions" style="display: none;">
                        <div class="d-flex gap-2">
                            <button class="btn btn-warning btn-sm" onclick="app.bulkEditStudents()">
                                <i class="fas fa-edit me-1"></i>Modifier en lot
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="app.bulkDeleteStudents()">
                                <i class="fas fa-trash me-1"></i>Supprimer
                            </button>
                            <button class="btn btn-info btn-sm" onclick="app.bulkExportStudents()">
                                <i class="fas fa-download me-1"></i>Exporter sélection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal pour l'ajout/modification d'élève -->
            <div class="modal fade" id="studentModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="studentModalTitle">Ajouter un élève</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="studentForm">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="studentFirstName" class="form-label">Prénom *</label>
                                            <input type="text" class="form-control" id="studentFirstName" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="studentLastName" class="form-label">Nom *</label>
                                            <input type="text" class="form-control" id="studentLastName" required>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="studentDateOfBirth" class="form-label">Date de naissance *</label>
                                            <input type="date" class="form-control" id="studentDateOfBirth" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="studentGender" class="form-label">Sexe *</label>
                                            <select class="form-select" id="studentGender" required>
                                                <option value="">Sélectionner</option>
                                                <option value="M">Masculin</option>
                                                <option value="F">Féminin</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="studentClass" class="form-label">Classe</label>
                                    <select class="form-select" id="studentClass">
                                        <option value="">Sélectionner une classe</option>
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="studentAddress" class="form-label">Adresse</label>
                                    <textarea class="form-control" id="studentAddress" rows="2"></textarea>
                                </div>
                                
                                <h6 class="mt-4 mb-3">Informations des parents</h6>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="parentName" class="form-label">Nom du parent *</label>
                                            <input type="text" class="form-control" id="parentName" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="parentPhone" class="form-label">Téléphone *</label>
                                            <input type="tel" class="form-control" id="parentPhone" required>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="parentEmail" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="parentEmail">
                                </div>
                                
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="studentActive" checked>
                                    <label class="form-check-label" for="studentActive">
                                        Élève actif
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="button" class="btn btn-primary" onclick="app.saveStudent()">Enregistrer</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadStudentsData() {
        this.loadStudentStatistics();
        this.loadClassesForFilter();
        this.renderStudentsTable();
        this.bindStudentEvents();
    }

    loadStudentStatistics() {
        const totalStudents = this.app.students.length;
        const activeStudents = this.app.students.filter(s => s.isActive !== false).length;
        const newStudents = this.app.students.filter(s => {
            const enrollmentDate = new Date(s.enrollmentDate || '2023-09-01');
            const now = new Date();
            const diffTime = now - enrollmentDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 30;
        }).length;
        
        const totalAge = this.app.students.reduce((sum, student) => {
            const birthDate = new Date(student.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            return sum + age;
        }, 0);
        const averageAge = totalStudents > 0 ? Math.round(totalAge / totalStudents) : 0;
        
        document.getElementById('totalStudents').textContent = totalStudents;
        document.getElementById('activeStudents').textContent = activeStudents;
        document.getElementById('newStudents').textContent = newStudents;
        document.getElementById('averageAge').textContent = averageAge + ' ans';
    }

    loadClassesForFilter() {
        const classFilter = document.getElementById('classFilter');
        const studentClass = document.getElementById('studentClass');
        
        if (classFilter) {
            const uniqueClasses = [...new Set(this.app.students.map(s => s.class).filter(Boolean))];
            classFilter.innerHTML = '<option value="">Toutes les classes</option>' +
                uniqueClasses.map(cls => `<option value="${cls}">${cls}</option>`).join('');
        }
        
        if (studentClass) {
            studentClass.innerHTML = '<option value="">Sélectionner une classe</option>' +
                this.app.classes.map(cls => `<option value="${cls.name}">${cls.name}</option>`).join('');
        }
    }

    renderStudentsTable() {
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = this.app.students.map(student => {
            const birthDate = new Date(student.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const isActive = student.isActive !== false;
            
            return `
                <tr data-student-id="${student.id}">
                    <td>
                        <input type="checkbox" class="form-check-input student-checkbox" value="${student.id}">
                    </td>
                    <td>
                        <img src="${student.photo || 'images/default-profile.svg'}" 
                             alt="Photo" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
                    </td>
                    <td>${student.lastName}</td>
                    <td>${student.firstName}</td>
                    <td>${birthDate.toLocaleDateString('fr-FR')}</td>
                    <td>${age} ans</td>
                    <td>
                        <span class="badge bg-primary">${student.class || 'Non assigné'}</span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" title="Voir les parents" onclick="app.showParentInfo(${student.id})">
                            <i class="fas fa-user-friends"></i>
                        </button>
                    </td>
                    <td>
                        <span class="badge bg-${isActive ? 'success' : 'danger'}">
                            ${isActive ? 'Actif' : 'Inactif'}
                        </span>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-info" title="Voir détails" onclick="app.viewStudentDetails(${student.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-warning" title="Modifier" onclick="app.editStudent(${student.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" title="Supprimer" onclick="app.deleteStudent(${student.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    bindStudentEvents() {
        const searchInput = document.getElementById('studentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterStudents(e.target.value);
            });
        }
        
        const classFilter = document.getElementById('classFilter');
        if (classFilter) {
            classFilter.addEventListener('change', (e) => {
                this.filterStudentsByClass(e.target.value);
            });
        }
        
        const selectAllCheckbox = document.getElementById('selectAllStudents');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAllStudents(e.target.checked);
            });
        }
        
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('student-checkbox')) {
                this.updateBulkActions();
            }
        });
    }

    filterStudents(searchTerm) {
        const filteredStudents = this.app.students.filter(student => 
            student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.class && student.class.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (student.parentName && student.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        this.renderFilteredStudentsTable(filteredStudents);
    }
    
    filterStudentsByClass(className) {
        if (!className) {
            this.renderStudentsTable();
            return;
        }
        const filteredStudents = this.app.students.filter(student => student.class === className);
        this.renderFilteredStudentsTable(filteredStudents);
    }
    
    renderFilteredStudentsTable(students) {
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = students.map(student => {
            const birthDate = new Date(student.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const isActive = student.isActive !== false;
            
            return `
                <tr data-student-id="${student.id}">
                    <td>
                        <input type="checkbox" class="form-check-input student-checkbox" value="${student.id}">
                    </td>
                    <td>
                        <img src="${student.photo || 'images/default-profile.svg'}" 
                             alt="Photo" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
                    </td>
                    <td>${student.lastName}</td>
                    <td>${student.firstName}</td>
                    <td>${birthDate.toLocaleDateString('fr-FR')}</td>
                    <td>${age} ans</td>
                    <td>
                        <span class="badge bg-primary">${student.class || 'Non assigné'}</span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" title="Voir les parents" onclick="app.showParentInfo(${student.id})">
                            <i class="fas fa-user-friends"></i>
                        </button>
                    </td>
                    <td>
                        <span class="badge bg-${isActive ? 'success' : 'danger'}">
                            ${isActive ? 'Actif' : 'Inactif'}
                        </span>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-info" title="Voir détails" onclick="app.viewStudentDetails(${student.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-warning" title="Modifier" onclick="app.editStudent(${student.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" title="Supprimer" onclick="app.deleteStudent(${student.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    toggleSelectAllStudents(checked) {
        const checkboxes = document.querySelectorAll('.student-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
        this.updateBulkActions();
    }
    
    updateBulkActions() {
        const selectedCheckboxes = document.querySelectorAll('.student-checkbox:checked');
        const bulkActions = document.getElementById('bulkActions');
        
        if (selectedCheckboxes.length > 0) {
            bulkActions.style.display = 'block';
        } else {
            bulkActions.style.display = 'none';
        }
    }
}
