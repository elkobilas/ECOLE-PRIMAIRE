// Module de gestion des enseignants
class TeachersModule {
    constructor(app) {
        this.app = app;
        this.currentTeacherId = null;
    }

    getTeachersHTML() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-chalkboard-teacher me-2"></i>Gestion des Enseignants</h2>
                <button class="btn btn-primary" onclick="app.teachersModule.showAddTeacherModal()">
                    <i class="fas fa-plus me-1"></i>Ajouter un enseignant
                </button>
            </div>
            
            <!-- Statistiques rapides -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-users text-primary fa-3x mb-3"></i>
                            <div class="h4" id="totalTeachersCount">0</div>
                            <div class="text-muted">Total enseignants</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-user-check text-success fa-3x mb-3"></i>
                            <div class="h4" id="activeTeachersCount">0</div>
                            <div class="text-muted">Actifs</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-chalkboard text-info fa-3x mb-3"></i>
                            <div class="h4" id="teachersWithClasses">0</div>
                            <div class="text-muted">Avec classes</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-user-times text-warning fa-3x mb-3"></i>
                            <div class="h4" id="inactiveTeachersCount">0</div>
                            <div class="text-muted">Inactifs</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Barre de recherche et filtres -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <input type="text" class="form-control" id="teacherSearch" 
                                   placeholder="Rechercher un enseignant..." 
                                   onkeyup="app.teachersModule.filterTeachers()">
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="teacherStatusFilter" 
                                    onchange="app.teachersModule.filterTeachers()">
                                <option value="all">Tous les statuts</option>
                                <option value="active">Actifs</option>
                                <option value="inactive">Inactifs</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-success w-100" onclick="app.teachersModule.exportTeachers()">
                                <i class="fas fa-file-export me-1"></i>Exporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Liste des enseignants -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0"><i class="fas fa-list me-2"></i>Liste des enseignants</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nom complet</th>
                                    <th>Email</th>
                                    <th>Téléphone</th>
                                    <th>Qualification</th>
                                    <th>Date d'embauche</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="teachersTableBody">
                                <tr>
                                    <td colspan="7" class="text-center">Chargement...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Modal d'ajout/modification -->
            <div class="modal fade" id="teacherModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="teacherModalTitle">Ajouter un enseignant</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="teacherForm">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="teacherFirstName" class="form-label">Prénom *</label>
                                        <input type="text" class="form-control" id="teacherFirstName" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="teacherLastName" class="form-label">Nom *</label>
                                        <input type="text" class="form-control" id="teacherLastName" required>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="teacherEmail" class="form-label">Email *</label>
                                        <input type="email" class="form-control" id="teacherEmail" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="teacherPhone" class="form-label">Téléphone *</label>
                                        <input type="tel" class="form-control" id="teacherPhone" required>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="teacherDateOfBirth" class="form-label">Date de naissance</label>
                                        <input type="date" class="form-control" id="teacherDateOfBirth">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="teacherGender" class="form-label">Genre</label>
                                        <select class="form-select" id="teacherGender">
                                            <option value="M">Masculin</option>
                                            <option value="F">Féminin</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="teacherQualification" class="form-label">Qualification *</label>
                                    <input type="text" class="form-control" id="teacherQualification" 
                                           placeholder="Ex: Professeur des Écoles" required>
                                </div>

                                <div class="mb-3">
                                    <label for="teacherAddress" class="form-label">Adresse</label>
                                    <textarea class="form-control" id="teacherAddress" rows="2"></textarea>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="teacherHireDate" class="form-label">Date d'embauche</label>
                                        <input type="date" class="form-control" id="teacherHireDate">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <div class="form-check mt-4">
                                            <input class="form-check-input" type="checkbox" id="teacherActive" checked>
                                            <label class="form-check-label" for="teacherActive">
                                                Enseignant actif
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="button" class="btn btn-primary" onclick="app.teachersModule.saveTeacher()">
                                <i class="fas fa-save me-1"></i>Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadTeachersData() {
        this.updateStatistics();
        this.displayTeachers();
    }

    updateStatistics() {
        const teachers = this.app.teachers;
        const activeTeachers = teachers.filter(t => t.isActive !== false);
        const inactiveTeachers = teachers.filter(t => t.isActive === false);
        const teachersWithClasses = this.app.classes.filter(c => c.teacherId).length;

        document.getElementById('totalTeachersCount').textContent = teachers.length;
        document.getElementById('activeTeachersCount').textContent = activeTeachers.length;
        document.getElementById('inactiveTeachersCount').textContent = inactiveTeachers.length;
        document.getElementById('teachersWithClasses').textContent = teachersWithClasses;
    }

    displayTeachers() {
        const tbody = document.getElementById('teachersTableBody');
        const teachers = this.getFilteredTeachers();

        if (teachers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Aucun enseignant trouvé</td></tr>';
            return;
        }

        tbody.innerHTML = teachers.map(teacher => `
            <tr>
                <td>
                    <strong>${teacher.firstName} ${teacher.lastName}</strong>
                    ${teacher.gender ? `<br><small class="text-muted">${teacher.gender === 'M' ? 'Masculin' : 'Féminin'}</small>` : ''}
                </td>
                <td>${teacher.email}</td>
                <td>${teacher.phone}</td>
                <td>${teacher.qualification}</td>
                <td>${teacher.hireDate ? new Date(teacher.hireDate).toLocaleDateString('fr-FR') : 'N/A'}</td>
                <td>
                    <span class="badge bg-${teacher.isActive !== false ? 'success' : 'secondary'}">
                        ${teacher.isActive !== false ? 'Actif' : 'Inactif'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="app.teachersModule.viewTeacherDetails(${teacher.id})" 
                            title="Voir les détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="app.teachersModule.editTeacher(${teacher.id})" 
                            title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.teachersModule.deleteTeacher(${teacher.id})" 
                            title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getFilteredTeachers() {
        let teachers = [...this.app.teachers];

        // Filtre de recherche
        const searchTerm = document.getElementById('teacherSearch')?.value.toLowerCase() || '';
        if (searchTerm) {
            teachers = teachers.filter(t =>
                t.firstName.toLowerCase().includes(searchTerm) ||
                t.lastName.toLowerCase().includes(searchTerm) ||
                t.email.toLowerCase().includes(searchTerm) ||
                t.qualification.toLowerCase().includes(searchTerm)
            );
        }

        // Filtre de statut
        const statusFilter = document.getElementById('teacherStatusFilter')?.value || 'all';
        if (statusFilter === 'active') {
            teachers = teachers.filter(t => t.isActive !== false);
        } else if (statusFilter === 'inactive') {
            teachers = teachers.filter(t => t.isActive === false);
        }

        return teachers;
    }

    filterTeachers() {
        this.displayTeachers();
    }

    showAddTeacherModal() {
        this.currentTeacherId = null;
        document.getElementById('teacherForm').reset();
        document.getElementById('teacherModalTitle').textContent = 'Ajouter un enseignant';
        document.getElementById('teacherActive').checked = true;

        const modal = new bootstrap.Modal(document.getElementById('teacherModal'));
        modal.show();
    }

    editTeacher(teacherId) {
        const teacher = this.app.teachers.find(t => t.id === teacherId);
        if (!teacher) return;

        this.currentTeacherId = teacherId;

        // Remplir le formulaire
        document.getElementById('teacherFirstName').value = teacher.firstName;
        document.getElementById('teacherLastName').value = teacher.lastName;
        document.getElementById('teacherEmail').value = teacher.email;
        document.getElementById('teacherPhone').value = teacher.phone;
        document.getElementById('teacherDateOfBirth').value = teacher.dateOfBirth || '';
        document.getElementById('teacherGender').value = teacher.gender || 'M';
        document.getElementById('teacherQualification').value = teacher.qualification;
        document.getElementById('teacherAddress').value = teacher.address || '';
        document.getElementById('teacherHireDate').value = teacher.hireDate || '';
        document.getElementById('teacherActive').checked = teacher.isActive !== false;

        document.getElementById('teacherModalTitle').textContent = 'Modifier l\'enseignant';

        const modal = new bootstrap.Modal(document.getElementById('teacherModal'));
        modal.show();
    }

    saveTeacher() {
        const teacherData = {
            id: this.currentTeacherId || Date.now(),
            firstName: document.getElementById('teacherFirstName').value,
            lastName: document.getElementById('teacherLastName').value,
            email: document.getElementById('teacherEmail').value,
            phone: document.getElementById('teacherPhone').value,
            dateOfBirth: document.getElementById('teacherDateOfBirth').value,
            gender: document.getElementById('teacherGender').value,
            qualification: document.getElementById('teacherQualification').value,
            address: document.getElementById('teacherAddress').value,
            hireDate: document.getElementById('teacherHireDate').value,
            isActive: document.getElementById('teacherActive').checked
        };

        // === VALIDATION DATE DE NAISSANCE ENSEIGNANT ===
        if (teacherData.dateOfBirth) {
            const teacherBirthDate = new Date(teacherData.dateOfBirth);
            const todayDate = new Date();
            if (teacherBirthDate >= todayDate) {
                this.app.showNotification('⚠️ La date de naissance ne peut pas être dans le futur', 'warning');
                return;
            }
            const teacherAge = todayDate.getFullYear() - teacherBirthDate.getFullYear() - 
                ((todayDate.getMonth() < teacherBirthDate.getMonth() || 
                 (todayDate.getMonth() === teacherBirthDate.getMonth() && todayDate.getDate() < teacherBirthDate.getDate())) ? 1 : 0);
            if (teacherAge < 20 || teacherAge > 70) {
                this.app.showNotification(`⚠️ L'âge de l'enseignant (${teacherAge} ans) n'est pas valide. L'enseignant doit avoir entre 20 et 70 ans.`, 'warning');
                return;
            }
            // Vérifier que la date d'embauche est après les 18 ans
            if (teacherData.hireDate) {
                const hireDate = new Date(teacherData.hireDate);
                const minHireDate = new Date(teacherBirthDate);
                minHireDate.setFullYear(minHireDate.getFullYear() + 18);
                if (hireDate < minHireDate) {
                    this.app.showNotification('⚠️ La date d\'embauche doit être postérieure aux 18 ans de l\'enseignant', 'warning');
                    return;
                }
            }
        }

        if (this.currentTeacherId) {
            // Modification
            const index = this.app.teachers.findIndex(t => t.id === this.currentTeacherId);
            if (index !== -1) {
                this.app.teachers[index] = teacherData;
                this.app.logActivity(`Modification de l'enseignant ${teacherData.firstName} ${teacherData.lastName}`, `Qualif: ${teacherData.qualification}`, 'edit');
            }
        } else {
            // Ajout
            this.app.teachers.push(teacherData);
            this.app.logActivity(`Recrutement de l'enseignant ${teacherData.firstName} ${teacherData.lastName}`, `Qualif: ${teacherData.qualification}`, 'add');
        }

        this.app.saveDataToStorage();
        this.app.showNotification('Enseignant enregistré avec succès', 'success');

        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('teacherModal'));
        modal.hide();

        // Recharger les données
        this.loadTeachersData();
    }

    deleteTeacher(teacherId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
            const teacher = this.app.teachers.find(t => t.id === teacherId);
            const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : `ID ${teacherId}`;
            this.app.teachers = this.app.teachers.filter(t => t.id !== teacherId);
            this.app.saveDataToStorage();
            this.app.logActivity(`Suppression de l'enseignant ${teacherName}`, '', 'delete');
            this.app.showNotification('Enseignant supprimé avec succès', 'success');
            this.loadTeachersData();
        }
    }

    viewTeacherDetails(teacherId) {
        const teacher = this.app.teachers.find(t => t.id === teacherId);
        if (!teacher) return;

        const classes = this.app.classes.filter(c => c.teacherId === teacherId);
        const classNames = classes.map(c => c.name).join(', ') || 'Aucune classe assignée';
        const initials = `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`.toUpperCase();
        const hireFmt = teacher.hireDate ? new Date(teacher.hireDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
        const isActive = teacher.isActive !== false;

        const html = `
            <div class="text-center mb-4">
                <div class="detail-avatar" style="background: var(--gradient-success);">
                    ${initials}
                </div>
                <h4 class="fw-bold">${teacher.firstName} ${teacher.lastName}</h4>
                <span class="badge bg-${isActive ? 'success' : 'danger'}">${isActive ? 'Actif' : 'Inactif'}</span>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-envelope me-1"></i>Adresse Email</div>
                <div class="detail-value">${teacher.email || 'Non renseigné'}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-phone me-1"></i>Téléphone</div>
                <div class="detail-value">${teacher.phone || 'Non renseigné'}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-graduation-cap me-1"></i>Qualification</div>
                <div class="detail-value">${teacher.qualification || 'Non renseigné'}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-calendar-check me-1"></i>Date d'embauche</div>
                <div class="detail-value">${hireFmt}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-chalkboard-teacher me-1"></i>Classes Assignées</div>
                <div class="detail-value">${classNames}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-map-marker-alt me-1"></i>Adresse Domicile</div>
                <div class="detail-value">${teacher.address || 'Non renseignée'}</div>
            </div>
        `;

        document.getElementById('detailsModalTitle').textContent = "Détails de l'Enseignant";
        document.getElementById('detailsModalBody').innerHTML = html;

        const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
        modal.show();
    }

    exportTeachers() {
        const csvContent = this.generateTeachersCSV(this.app.teachers);
        this.downloadCSV(csvContent, 'enseignants.csv');
        this.app.showNotification('Export réussi', 'success');
    }

    generateTeachersCSV(teachers) {
        const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Qualification', 'Date d\'embauche', 'Statut'];
        const rows = teachers.map(teacher => [
            teacher.lastName,
            teacher.firstName,
            teacher.email,
            teacher.phone,
            teacher.qualification,
            teacher.hireDate || '',
            teacher.isActive !== false ? 'Actif' : 'Inactif'
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
}
