// Module de gestion des classes
class ClassesModule {
    constructor(app) {
        this.app = app;
        this.currentClassId = null;
    }

    getClassesHTML() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-users-class me-2"></i>Gestion des Classes</h2>
                <button class="btn btn-primary" onclick="app.classesModule.showAddClassModal()">
                    <i class="fas fa-plus me-1"></i>Ajouter une classe
                </button>
            </div>
            
            <!-- Statistiques rapides -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-chalkboard text-primary fa-3x mb-3"></i>
                            <div class="h4" id="totalClassesCount">0</div>
                            <div class="text-muted">Total classes</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-user-graduate text-success fa-3x mb-3"></i>
                            <div class="h4" id="totalStudentsInClasses">0</div>
                            <div class="text-muted">Élèves inscrits</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-chair text-info fa-3x mb-3"></i>
                            <div class="h4" id="totalCapacity">0</div>
                            <div class="text-muted">Capacité totale</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-percentage text-warning fa-3x mb-3"></i>
                            <div class="h4" id="occupancyRate">0%</div>
                            <div class="text-muted">Taux d'occupation</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filtres -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <input type="text" class="form-control" id="classSearch" 
                                   placeholder="Rechercher une classe..." 
                                   onkeyup="app.classesModule.filterClasses()">
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="levelFilter" 
                                    onchange="app.classesModule.filterClasses()">
                                <option value="all">Tous les niveaux</option>
                                <option value="Petite Section">Petite Section</option>
                                <option value="Moyenne Section">Moyenne Section</option>
                                <option value="Grande Section">Grande Section</option>
                                <option value="CP">CP</option>
                                <option value="CE1">CE1</option>
                                <option value="CE2">CE2</option>
                                <option value="CM1">CM1</option>
                                <option value="CM2">CM2</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-success w-100" onclick="app.classesModule.exportClasses()">
                                <i class="fas fa-file-export me-1"></i>Exporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Liste des classes -->
            <div class="row" id="classesGrid">
                <div class="col-12 text-center">
                    <p>Chargement des classes...</p>
                </div>
            </div>

            <!-- Modal d'ajout/modification -->
            <div class="modal fade" id="classModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="classModalTitle">Ajouter une classe</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="classForm">
                                <div class="mb-3">
                                    <label for="className" class="form-label">Nom de la classe *</label>
                                    <input type="text" class="form-control" id="className" 
                                           placeholder="Ex: CP A" required>
                                </div>

                                <div class="mb-3">
                                    <label for="classLevel" class="form-label">Niveau *</label>
                                    <select class="form-select" id="classLevel" required>
                                        <option value="">Sélectionner un niveau</option>
                                        <option value="Petite Section">Petite Section</option>
                                        <option value="Moyenne Section">Moyenne Section</option>
                                        <option value="Grande Section">Grande Section</option>
                                        <option value="CP">CP</option>
                                        <option value="CE1">CE1</option>
                                        <option value="CE2">CE2</option>
                                        <option value="CM1">CM1</option>
                                        <option value="CM2">CM2</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="classCapacity" class="form-label">Capacité *</label>
                                    <input type="number" class="form-control" id="classCapacity" 
                                           min="1" max="50" value="25" required>
                                </div>

                                <div class="mb-3">
                                    <label for="classTeacher" class="form-label">Enseignant responsable</label>
                                    <select class="form-select" id="classTeacher">
                                        <option value="">Aucun enseignant assigné</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="classRoom" class="form-label">Salle de classe</label>
                                    <input type="text" class="form-control" id="classRoom" 
                                           placeholder="Ex: Salle 101">
                                </div>

                                <div class="mb-3">
                                    <label for="classSchedule" class="form-label">Horaire</label>
                                    <textarea class="form-control" id="classSchedule" rows="2" 
                                              placeholder="Ex: Lundi-Vendredi 8h30-16h30"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="button" class="btn btn-primary" onclick="app.classesModule.saveClass()">
                                <i class="fas fa-save me-1"></i>Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadClassesData() {
        this.updateStatistics();
        this.displayClasses();
        this.populateTeacherSelect();
    }

    updateStatistics() {
        const classes = this.app.classes;
        const totalCapacity = classes.reduce((sum, c) => sum + (c.capacity || 0), 0);
        const totalStudents = this.app.students.length;
        const occupancyRate = totalCapacity > 0 ? ((totalStudents / totalCapacity) * 100).toFixed(1) : 0;

        document.getElementById('totalClassesCount').textContent = classes.length;
        document.getElementById('totalStudentsInClasses').textContent = totalStudents;
        document.getElementById('totalCapacity').textContent = totalCapacity;
        document.getElementById('occupancyRate').textContent = occupancyRate + '%';
    }

    displayClasses() {
        const grid = document.getElementById('classesGrid');
        const classes = this.getFilteredClasses();

        if (classes.length === 0) {
            grid.innerHTML = '<div class="col-12 text-center"><p>Aucune classe trouvée</p></div>';
            return;
        }

        grid.innerHTML = classes.map(cls => {
            const studentsInClass = this.app.students.filter(s => s.class === cls.name).length;
            const teacher = this.app.teachers.find(t => t.id === cls.teacherId);
            const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Non assigné';
            const occupancy = cls.capacity > 0 ? ((studentsInClass / cls.capacity) * 100).toFixed(0) : 0;
            const occupancyColor = occupancy >= 90 ? 'danger' : occupancy >= 70 ? 'warning' : 'success';

            return `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">
                                <i class="fas fa-chalkboard me-2"></i>${cls.name}
                            </h5>
                        </div>
                        <div class="card-body">
                            <p class="mb-2">
                                <strong>Niveau:</strong> ${cls.level}
                            </p>
                            <p class="mb-2">
                                <strong>Enseignant:</strong> ${teacherName}
                            </p>
                            <p class="mb-2">
                                <strong>Effectif:</strong> ${studentsInClass} / ${cls.capacity}
                            </p>
                            ${cls.room ? `<p class="mb-2"><strong>Salle:</strong> ${cls.room}</p>` : ''}
                            
                            <div class="progress mb-3" style="height: 25px;">
                                <div class="progress-bar bg-${occupancyColor}" role="progressbar" 
                                     style="width: ${occupancy}%" 
                                     aria-valuenow="${occupancy}" aria-valuemin="0" aria-valuemax="100">
                                    ${occupancy}%
                                </div>
                            </div>

                            ${cls.schedule ? `<p class="mb-2 small text-muted">${cls.schedule}</p>` : ''}
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-sm btn-info" onclick="app.classesModule.viewClassDetails(${cls.id})" 
                                    title="Voir les détails">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning" onclick="app.classesModule.editClass(${cls.id})" 
                                    title="Modifier">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="app.classesModule.deleteClass(${cls.id})" 
                                    title="Supprimer">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn btn-sm btn-success" onclick="app.classesModule.viewStudents(${cls.id})" 
                                    title="Voir les élèves">
                                <i class="fas fa-users"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getFilteredClasses() {
        let classes = [...this.app.classes];

        // Filtre de recherche
        const searchTerm = document.getElementById('classSearch')?.value.toLowerCase() || '';
        if (searchTerm) {
            classes = classes.filter(c =>
                c.name.toLowerCase().includes(searchTerm) ||
                c.level.toLowerCase().includes(searchTerm)
            );
        }

        // Filtre de niveau
        const levelFilter = document.getElementById('levelFilter')?.value || 'all';
        if (levelFilter !== 'all') {
            classes = classes.filter(c => c.level === levelFilter);
        }

        return classes;
    }

    filterClasses() {
        this.displayClasses();
    }

    populateTeacherSelect() {
        const select = document.getElementById('classTeacher');
        if (!select) return;

        const teachers = this.app.teachers.filter(t => t.isActive !== false);
        select.innerHTML = '<option value="">Aucun enseignant assigné</option>' +
            teachers.map(t => `<option value="${t.id}">${t.firstName} ${t.lastName}</option>`).join('');
    }

    showAddClassModal() {
        this.currentClassId = null;
        document.getElementById('classForm').reset();
        document.getElementById('classModalTitle').textContent = 'Ajouter une classe';
        this.populateTeacherSelect();

        const modal = new bootstrap.Modal(document.getElementById('classModal'));
        modal.show();
    }

    editClass(classId) {
        const cls = this.app.classes.find(c => c.id === classId);
        if (!cls) return;

        this.currentClassId = classId;
        this.populateTeacherSelect();

        // Remplir le formulaire
        document.getElementById('className').value = cls.name;
        document.getElementById('classLevel').value = cls.level;
        document.getElementById('classCapacity').value = cls.capacity;
        document.getElementById('classTeacher').value = cls.teacherId || '';
        document.getElementById('classRoom').value = cls.room || '';
        document.getElementById('classSchedule').value = cls.schedule || '';

        document.getElementById('classModalTitle').textContent = 'Modifier la classe';

        const modal = new bootstrap.Modal(document.getElementById('classModal'));
        modal.show();
    }

    saveClass() {
        const classData = {
            id: this.currentClassId || Date.now(),
            name: document.getElementById('className').value,
            level: document.getElementById('classLevel').value,
            capacity: parseInt(document.getElementById('classCapacity').value),
            teacherId: parseInt(document.getElementById('classTeacher').value) || null,
            room: document.getElementById('classRoom').value,
            schedule: document.getElementById('classSchedule').value,
            studentCount: 0
        };

        // Calculer le nombre d'élèves
        classData.studentCount = this.app.students.filter(s => s.class === classData.name).length;

        if (this.currentClassId) {
            // Modification
            const index = this.app.classes.findIndex(c => c.id === this.currentClassId);
            if (index !== -1) {
                this.app.classes[index] = classData;
            }
        } else {
            // Ajout
            this.app.classes.push(classData);
        }

        this.app.saveDataToStorage();
        this.app.showNotification('Classe enregistrée avec succès', 'success');

        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('classModal'));
        modal.hide();

        // Recharger les données
        this.loadClassesData();
    }

    deleteClass(classId) {
        const cls = this.app.classes.find(c => c.id === classId);
        const studentsInClass = this.app.students.filter(s => s.class === cls.name).length;

        if (studentsInClass > 0) {
            if (!confirm(`Cette classe contient ${studentsInClass} élève(s). Êtes-vous sûr de vouloir la supprimer ?`)) {
                return;
            }
        } else {
            if (!confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
                return;
            }
        }

        this.app.classes = this.app.classes.filter(c => c.id !== classId);
        this.app.saveDataToStorage();
        this.app.showNotification('Classe supprimée avec succès', 'success');
        this.loadClassesData();
    }

    viewClassDetails(classId) {
        const cls = this.app.classes.find(c => c.id === classId);
        if (!cls) return;

        const studentsInClass = this.app.students.filter(s => s.class === cls.name);
        const teacher = this.app.teachers.find(t => t.id === cls.teacherId);
        const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Non assigné';

        alert(`Détails de la classe ${cls.name}:\n\n` +
            `Niveau: ${cls.level}\n` +
            `Enseignant: ${teacherName}\n` +
            `Effectif: ${studentsInClass.length} / ${cls.capacity}\n` +
            `Salle: ${cls.room || 'Non définie'}\n` +
            `Horaire: ${cls.schedule || 'Non défini'}\n` +
            `Taux d'occupation: ${cls.capacity > 0 ? ((studentsInClass.length / cls.capacity) * 100).toFixed(1) : 0}%`);
    }

    viewStudents(classId) {
        const cls = this.app.classes.find(c => c.id === classId);
        if (!cls) return;

        const studentsInClass = this.app.students.filter(s => s.class === cls.name);

        if (studentsInClass.length === 0) {
            alert(`Aucun élève dans la classe ${cls.name}`);
            return;
        }

        const studentsList = studentsInClass.map((s, i) =>
            `${i + 1}. ${s.firstName} ${s.lastName}`
        ).join('\n');

        alert(`Élèves de la classe ${cls.name} (${studentsInClass.length}):\n\n${studentsList}`);
    }

    exportClasses() {
        const csvContent = this.generateClassesCSV(this.app.classes);
        this.downloadCSV(csvContent, 'classes.csv');
        this.app.showNotification('Export réussi', 'success');
    }

    generateClassesCSV(classes) {
        const headers = ['Nom', 'Niveau', 'Capacité', 'Effectif', 'Enseignant', 'Salle'];
        const rows = classes.map(cls => {
            const studentsInClass = this.app.students.filter(s => s.class === cls.name).length;
            const teacher = this.app.teachers.find(t => t.id === cls.teacherId);
            const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : '';

            return [
                cls.name,
                cls.level,
                cls.capacity,
                studentsInClass,
                teacherName,
                cls.room || ''
            ];
        });

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
