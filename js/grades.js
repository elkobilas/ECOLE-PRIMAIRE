// Module de gestion des évaluations (notes)
class GradesModule {
    constructor(app) {
        this.app = app;
        this.currentGradeId = null;
    }

    getGradesHTML() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-chart-line me-2"></i>Gestion des Évaluations</h2>
                <button class="btn btn-primary" onclick="app.gradesModule.showAddGradeModal()">
                    <i class="fas fa-plus me-1"></i>Ajouter une note
                </button>
            </div>
            
            <!-- Statistiques rapides -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-clipboard-list text-primary fa-3x mb-3"></i>
                            <div class="h4" id="totalGradesCount">0</div>
                            <div class="text-muted">Total notes</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-star text-success fa-3x mb-3"></i>
                            <div class="h4" id="averageGrade">0</div>
                            <div class="text-muted">Moyenne générale</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-trophy text-warning fa-3x mb-3"></i>
                            <div class="h4" id="highestGrade">0</div>
                            <div class="text-muted">Note la plus haute</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-exclamation-triangle text-danger fa-3x mb-3"></i>
                            <div class="h4" id="lowestGrade">0</div>
                            <div class="text-muted">Note la plus basse</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filtres -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <input type="text" class="form-control" id="gradeSearch" 
                                   placeholder="Rechercher..." 
                                   onkeyup="app.gradesModule.filterGrades()">
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="subjectFilter" 
                                    onchange="app.gradesModule.filterGrades()">
                                <option value="all">Toutes les matières</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="studentFilter" 
                                    onchange="app.gradesModule.filterGrades()">
                                <option value="all">Tous les élèves</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-success w-100" onclick="app.gradesModule.exportGrades()">
                                <i class="fas fa-file-export me-1"></i>Exporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Graphique des notes -->
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="fas fa-chart-bar me-2"></i>Distribution des notes</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="gradesDistributionChart" height="200"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="fas fa-chart-pie me-2"></i>Moyennes par matière</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="subjectAveragesChart" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Liste des notes -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0"><i class="fas fa-list me-2"></i>Liste des notes</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Élève</th>
                                    <th>Matière</th>
                                    <th>Note</th>
                                    <th>Coefficient</th>
                                    <th>Enseignant</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="gradesTableBody">
                                <tr>
                                    <td colspan="7" class="text-center">Chargement...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Modal d'ajout/modification -->
            <div class="modal fade" id="gradeModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="gradeModalTitle">Ajouter une note</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="gradeForm">
                                <div class="mb-3">
                                    <label for="gradeStudent" class="form-label">Élève *</label>
                                    <select class="form-select" id="gradeStudent" required>
                                        <option value="">Sélectionner un élève</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="gradeSubject" class="form-label">Matière *</label>
                                    <select class="form-select" id="gradeSubject" required>
                                        <option value="">Sélectionner une matière</option>
                                    </select>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="gradeValue" class="form-label">Note *</label>
                                        <input type="number" class="form-control" id="gradeValue" 
                                               min="0" max="20" step="0.5" required>
                                        <small class="text-muted">Sur 20</small>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="gradeCoefficient" class="form-label">Coefficient *</label>
                                        <input type="number" class="form-control" id="gradeCoefficient" 
                                               min="1" max="5" value="1" required>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="gradeDate" class="form-label">Date *</label>
                                    <input type="date" class="form-control" id="gradeDate" required>
                                </div>

                                <div class="mb-3">
                                    <label for="gradeTeacher" class="form-label">Enseignant</label>
                                    <select class="form-select" id="gradeTeacher">
                                        <option value="">Sélectionner un enseignant</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="gradeComment" class="form-label">Commentaire</label>
                                    <textarea class="form-control" id="gradeComment" rows="2" 
                                              placeholder="Commentaire facultatif..."></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="button" class="btn btn-primary" onclick="app.gradesModule.saveGrade()">
                                <i class="fas fa-save me-1"></i>Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadGradesData() {
        this.updateStatistics();
        this.displayGrades();
        this.populateFilters();
        this.createCharts();
    }

    updateStatistics() {
        const grades = this.app.grades;

        document.getElementById('totalGradesCount').textContent = grades.length;

        if (grades.length > 0) {
            const totalPoints = grades.reduce((sum, g) => sum + (g.grade * (g.coefficient || 1)), 0);
            const totalCoefficients = grades.reduce((sum, g) => sum + (g.coefficient || 1), 0);
            const average = totalCoefficients > 0 ? (totalPoints / totalCoefficients).toFixed(2) : 0;

            const highest = Math.max(...grades.map(g => g.grade));
            const lowest = Math.min(...grades.map(g => g.grade));

            document.getElementById('averageGrade').textContent = average + '/20';
            document.getElementById('highestGrade').textContent = highest.toFixed(1) + '/20';
            document.getElementById('lowestGrade').textContent = lowest.toFixed(1) + '/20';
        } else {
            document.getElementById('averageGrade').textContent = '0/20';
            document.getElementById('highestGrade').textContent = '0/20';
            document.getElementById('lowestGrade').textContent = '0/20';
        }
    }

    displayGrades() {
        const tbody = document.getElementById('gradesTableBody');
        const grades = this.getFilteredGrades();

        if (grades.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Aucune note trouvée</td></tr>';
            return;
        }

        tbody.innerHTML = grades.map(grade => {
            const student = this.app.students.find(s => s.id === grade.studentId);
            const teacher = this.app.teachers.find(t => t.id === grade.teacherId);
            const gradeColor = this.getGradeColor(grade.grade);

            return `
                <tr>
                    <td>${new Date(grade.date).toLocaleDateString('fr-FR')}</td>
                    <td>${student ? `${student.firstName} ${student.lastName}` : 'Inconnu'}</td>
                    <td>${grade.subject}</td>
                    <td>
                        <span class="badge bg-${gradeColor}" style="font-size: 1em;">
                            ${grade.grade.toFixed(1)}/20
                        </span>
                    </td>
                    <td>×${grade.coefficient || 1}</td>
                    <td>${teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="app.gradesModule.viewGradeDetails(${grade.id})" 
                                title="Voir les détails">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="app.gradesModule.editGrade(${grade.id})" 
                                title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.gradesModule.deleteGrade(${grade.id})" 
                                title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getGradeColor(grade) {
        if (grade >= 16) return 'success';
        if (grade >= 14) return 'info';
        if (grade >= 10) return 'warning';
        return 'danger';
    }

    getFilteredGrades() {
        let grades = [...this.app.grades];

        // Filtre de recherche
        const searchTerm = document.getElementById('gradeSearch')?.value.toLowerCase() || '';
        if (searchTerm) {
            grades = grades.filter(g => {
                const student = this.app.students.find(s => s.id === g.studentId);
                const studentName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
                return studentName.includes(searchTerm) ||
                    g.subject.toLowerCase().includes(searchTerm);
            });
        }

        // Filtre par matière
        const subjectFilter = document.getElementById('subjectFilter')?.value || 'all';
        if (subjectFilter !== 'all') {
            grades = grades.filter(g => g.subject === subjectFilter);
        }

        // Filtre par élève
        const studentFilter = document.getElementById('studentFilter')?.value || 'all';
        if (studentFilter !== 'all') {
            grades = grades.filter(g => g.studentId === parseInt(studentFilter));
        }

        return grades.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    filterGrades() {
        this.displayGrades();
    }

    populateFilters() {
        // Remplir le filtre des matières
        const subjectFilter = document.getElementById('subjectFilter');
        const subjects = [...new Set(this.app.grades.map(g => g.subject))];
        subjectFilter.innerHTML = '<option value="all">Toutes les matières</option>' +
            subjects.map(s => `<option value="${s}">${s}</option>`).join('');

        // Remplir le filtre des élèves
        const studentFilter = document.getElementById('studentFilter');
        studentFilter.innerHTML = '<option value="all">Tous les élèves</option>' +
            this.app.students.map(s =>
                `<option value="${s.id}">${s.firstName} ${s.lastName}</option>`
            ).join('');

        // Remplir les selects du modal
        const gradeStudent = document.getElementById('gradeStudent');
        if (gradeStudent) {
            gradeStudent.innerHTML = '<option value="">Sélectionner un élève</option>' +
                this.app.students.map(s =>
                    `<option value="${s.id}">${s.firstName} ${s.lastName} - ${s.class || 'Sans classe'}</option>`
                ).join('');
        }

        const gradeSubject = document.getElementById('gradeSubject');
        if (gradeSubject) {
            gradeSubject.innerHTML = '<option value="">Sélectionner une matière</option>' +
                this.app.subjects.map(s =>
                    `<option value="${s.name}">${s.name} (Coef: ${s.coefficient})</option>`
                ).join('');
        }

        const gradeTeacher = document.getElementById('gradeTeacher');
        if (gradeTeacher) {
            gradeTeacher.innerHTML = '<option value="">Sélectionner un enseignant</option>' +
                this.app.teachers.filter(t => t.isActive !== false).map(t =>
                    `<option value="${t.id}">${t.firstName} ${t.lastName}</option>`
                ).join('');
        }
    }

    createCharts() {
        this.createDistributionChart();
        this.createSubjectAveragesChart();
    }

    createDistributionChart() {
        const ctx = document.getElementById('gradesDistributionChart');
        if (!ctx) return;

        if (this.distributionChartInstance) {
            this.distributionChartInstance.destroy();
        }

        const ranges = [
            { label: '0-5', min: 0, max: 5, count: 0 },
            { label: '6-10', min: 6, max: 10, count: 0 },
            { label: '11-15', min: 11, max: 15, count: 0 },
            { label: '16-20', min: 16, max: 20, count: 0 }
        ];

        this.app.grades.forEach(grade => {
            const range = ranges.find(r => grade.grade >= r.min && grade.grade <= r.max);
            if (range) range.count++;
        });

        this.distributionChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ranges.map(r => r.label),
                datasets: [{
                    label: 'Nombre de notes',
                    data: ranges.map(r => r.count),
                    backgroundColor: ['#dc3545', '#ffc107', '#17a2b8', '#28a745']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }

    createSubjectAveragesChart() {
        const ctx = document.getElementById('subjectAveragesChart');
        if (!ctx) return;

        if (this.subjectAveragesChartInstance) {
            this.subjectAveragesChartInstance.destroy();
        }

        const subjectData = {};
        this.app.grades.forEach(grade => {
            if (!subjectData[grade.subject]) {
                subjectData[grade.subject] = { total: 0, count: 0 };
            }
            subjectData[grade.subject].total += grade.grade;
            subjectData[grade.subject].count++;
        });

        const subjects = Object.keys(subjectData);
        const averages = subjects.map(s =>
            (subjectData[s].total / subjectData[s].count).toFixed(2)
        );

        this.subjectAveragesChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: subjects,
                datasets: [{
                    data: averages,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    showAddGradeModal() {
        this.currentGradeId = null;
        document.getElementById('gradeForm').reset();
        document.getElementById('gradeModalTitle').textContent = 'Ajouter une note';
        document.getElementById('gradeDate').valueAsDate = new Date();
        this.populateFilters();

        const modal = new bootstrap.Modal(document.getElementById('gradeModal'));
        modal.show();
    }

    editGrade(gradeId) {
        const grade = this.app.grades.find(g => g.id === gradeId);
        if (!grade) return;

        this.currentGradeId = gradeId;
        this.populateFilters();

        // Remplir le formulaire
        document.getElementById('gradeStudent').value = grade.studentId;
        document.getElementById('gradeSubject').value = grade.subject;
        document.getElementById('gradeValue').value = grade.grade;
        document.getElementById('gradeCoefficient').value = grade.coefficient || 1;
        document.getElementById('gradeDate').value = grade.date;
        document.getElementById('gradeTeacher').value = grade.teacherId || '';
        document.getElementById('gradeComment').value = grade.comment || '';

        document.getElementById('gradeModalTitle').textContent = 'Modifier la note';

        const modal = new bootstrap.Modal(document.getElementById('gradeModal'));
        modal.show();
    }

    saveGrade() {
        const studentId = parseInt(document.getElementById('gradeStudent').value);
        const student = this.app.students.find(s => s.id === studentId);

        const gradeData = {
            id: this.currentGradeId || Date.now(),
            studentId: studentId,
            studentName: student ? `${student.firstName} ${student.lastName}` : '',
            subject: document.getElementById('gradeSubject').value,
            subjectId: this.app.subjects.find(s => s.name === document.getElementById('gradeSubject').value)?.id || 1,
            grade: parseFloat(document.getElementById('gradeValue').value),
            coefficient: parseInt(document.getElementById('gradeCoefficient').value),
            date: document.getElementById('gradeDate').value,
            teacherId: parseInt(document.getElementById('gradeTeacher').value) || null,
            comment: document.getElementById('gradeComment').value
        };

        if (this.currentGradeId) {
            // Modification
            const index = this.app.grades.findIndex(g => g.id === this.currentGradeId);
            if (index !== -1) {
                this.app.grades[index] = gradeData;
                this.app.logActivity(`Modification d'une note pour ${gradeData.studentName}`, `${gradeData.subject}: ${gradeData.grade}/20`, 'edit');
            }
        } else {
            // Ajout
            this.app.grades.push(gradeData);
            this.app.logActivity(`Ajout d'une note pour ${gradeData.studentName}`, `${gradeData.subject}: ${gradeData.grade}/20`, 'add');
        }

        this.app.saveDataToStorage();
        this.app.showNotification('Note enregistrée avec succès', 'success');

        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('gradeModal'));
        modal.hide();

        // Recharger les données
        this.loadGradesData();
    }

    deleteGrade(gradeId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
            const grade = this.app.grades.find(g => g.id === gradeId);
            const studentName = grade ? grade.studentName : 'Inconnu';
            const subject = grade ? grade.subject : '';
            this.app.grades = this.app.grades.filter(g => g.id !== gradeId);
            this.app.saveDataToStorage();
            this.app.logActivity(`Suppression de la note de ${studentName}`, `${subject}`, 'delete');
            this.app.showNotification('Note supprimée avec succès', 'success');
            this.loadGradesData();
        }
    }

    viewGradeDetails(gradeId) {
        const grade = this.app.grades.find(g => g.id === gradeId);
        if (!grade) return;

        const student = this.app.students.find(s => s.id === grade.studentId);
        const teacher = this.app.teachers.find(t => t.id === grade.teacherId);
        const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Non renseigné';
        const studentName = student ? `${student.firstName} ${student.lastName}` : 'Inconnu';
        const dateFmt = new Date(grade.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

        const html = `
            <div class="text-center mb-4">
                <div class="detail-avatar" style="background: var(--gradient-danger);">
                    <i class="fas fa-file-signature"></i>
                </div>
                <h4 class="fw-bold">${grade.grade} / 20</h4>
                <span class="badge bg-primary">${grade.subject}</span>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-user-graduate me-1"></i>Élève</div>
                <div class="detail-value">${studentName}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-weight me-1"></i>Coefficient</div>
                <div class="detail-value">x${grade.coefficient || 1}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-calendar-alt me-1"></i>Date d'évaluation</div>
                <div class="detail-value">${dateFmt}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-chalkboard-teacher me-1"></i>Saisie par</div>
                <div class="detail-value">${teacherName}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-comment-dots me-1"></i>Commentaire</div>
                <div class="detail-value">${grade.comment || 'Aucun commentaire.'}</div>
            </div>
        `;

        document.getElementById('detailsModalTitle').textContent = "Détails de la Note";
        document.getElementById('detailsModalBody').innerHTML = html;

        const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
        modal.show();
    }

    exportGrades() {
        const csvContent = this.generateGradesCSV(this.app.grades);
        this.downloadCSV(csvContent, 'notes.csv');
        this.app.showNotification('Export réussi', 'success');
    }

    generateGradesCSV(grades) {
        const headers = ['Date', 'Élève', 'Matière', 'Note', 'Coefficient', 'Enseignant', 'Commentaire'];
        const rows = grades.map(grade => {
            const student = this.app.students.find(s => s.id === grade.studentId);
            const teacher = this.app.teachers.find(t => t.id === grade.teacherId);

            return [
                new Date(grade.date).toLocaleDateString('fr-FR'),
                student ? `${student.firstName} ${student.lastName}` : 'Inconnu',
                grade.subject,
                grade.grade,
                grade.coefficient || 1,
                teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
                grade.comment || ''
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
