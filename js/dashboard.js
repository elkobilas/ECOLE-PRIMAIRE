// Module Tableau de bord
class DashboardModule {
    constructor(app) {
        this.app = app;
    }

    getDashboardHTML() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-tachometer-alt me-2"></i>Tableau de bord</h2>
                <button class="btn btn-primary" onclick="app.refreshDashboard()">
                    <i class="fas fa-sync-alt me-1"></i>Actualiser
                </button>
            </div>
            
            <!-- Statistiques principales -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-user-graduate text-primary fa-3x mb-3"></i>
                            <div class="h4" id="totalStudents">0</div>
                            <div class="text-muted">Total élèves</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-chalkboard-teacher text-success fa-3x mb-3"></i>
                            <div class="h4" id="totalTeachers">0</div>
                            <div class="text-muted">Enseignants</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-users-class text-warning fa-3x mb-3"></i>
                            <div class="h4" id="totalClasses">0</div>
                            <div class="text-muted">Classes</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-chart-line text-danger fa-3x mb-3"></i>
                            <div class="h4" id="totalGrades">0</div>
                            <div class="text-muted">Évaluations</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Graphiques et analyses -->
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="fas fa-chart-pie me-2"></i>Répartition par classe</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="classChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="fas fa-chart-bar me-2"></i>Évolution des notes</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="gradesChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Dernières activités -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="fas fa-clock me-2"></i>Dernières activités</h5>
                        </div>
                        <div class="card-body">
                            <div id="recentActivities">
                                <p class="text-muted">Chargement des activités...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadDashboardData() {
        // Mettre à jour les statistiques
        document.getElementById('totalStudents').textContent = this.app.students.length;
        document.getElementById('totalTeachers').textContent = this.app.teachers.length;
        document.getElementById('totalClasses').textContent = this.app.classes.length;
        document.getElementById('totalGrades').textContent = this.app.grades.length;
        
        // Créer les graphiques
        this.createClassChart();
        this.createGradesChart();
        this.loadRecentActivities();
    }

    createClassChart() {
        const ctx = document.getElementById('classChart');
        if (!ctx) return;
        
        const classData = this.app.classes.map(cls => ({
            name: cls.name,
            count: this.app.students.filter(s => s.class === cls.name).length
        }));
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: classData.map(d => d.name),
                datasets: [{
                    data: classData.map(d => d.count),
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

    createGradesChart() {
        const ctx = document.getElementById('gradesChart');
        if (!ctx) return;
        
        const gradeRanges = [
            { range: '0-5', count: 0 },
            { range: '6-10', count: 0 },
            { range: '11-15', count: 0 },
            { range: '16-20', count: 0 }
        ];
        
        this.app.grades.forEach(grade => {
            if (grade.grade <= 5) gradeRanges[0].count++;
            else if (grade.grade <= 10) gradeRanges[1].count++;
            else if (grade.grade <= 15) gradeRanges[2].count++;
            else gradeRanges[3].count++;
        });
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: gradeRanges.map(r => r.range),
                datasets: [{
                    label: 'Nombre de notes',
                    data: gradeRanges.map(r => r.count),
                    backgroundColor: '#36A2EB'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    loadRecentActivities() {
        const activities = [
            { action: 'Nouvel élève inscrit', student: 'Jean Dupont', time: 'Il y a 2 heures' },
            { action: 'Note ajoutée', subject: 'Mathématiques', student: 'Marie Martin', time: 'Il y a 3 heures' },
            { action: 'Classe créée', class: 'CP B', time: 'Il y a 1 jour' },
            { action: 'Enseignant ajouté', teacher: 'Sophie Leroy', time: 'Il y a 2 jours' }
        ];
        
        const container = document.getElementById('recentActivities');
        if (container) {
            container.innerHTML = activities.map(activity => `
                <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>
                        <strong>${activity.action}</strong>
                        ${activity.student ? `<br><small class="text-muted">${activity.student}</small>` : ''}
                        ${activity.subject ? `<br><small class="text-muted">${activity.subject}</small>` : ''}
                        ${activity.class ? `<br><small class="text-muted">${activity.class}</small>` : ''}
                        ${activity.teacher ? `<br><small class="text-muted">${activity.teacher}</small>` : ''}
                    </div>
                    <small class="text-muted">${activity.time}</small>
                </div>
            `).join('');
        }
    }

    refreshDashboard() {
        this.loadDashboardData();
        this.app.showNotification('Tableau de bord actualisé', 'success');
    }
}
