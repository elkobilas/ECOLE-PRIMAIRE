// Module Tableau de bord
class DashboardModule {
    constructor(app) {
        this.app = app;
        this.clockInterval = null;
    }

    getDashboardHTML() {
        return `
            <!-- Section d'accueil Premium -->
            <div class="row g-4 mb-4">
                <div class="col-md-8">
                    <div class="card text-white shadow h-100 py-3 border-0" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); min-height: 140px; display: flex; align-items: center; justify-content: center; border-radius: var(--border-radius);">
                        <div class="card-body d-flex flex-column justify-content-center px-4 w-100">
                            <h2 class="fw-bold mb-2 text-start" id="dashboardGreeting">Bonjour !</h2>
                            <p class="text-white-50 mb-0 text-start">Ravi de vous revoir. Voici un aperçu des statistiques et activités scolaires d'aujourd'hui.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="clock-widget h-100" style="min-height: 140px;">
                        <div class="clock-time" id="clockTime">--:--:--</div>
                        <div class="clock-date" id="clockDate">chargement...</div>
                    </div>
                </div>
            </div>

            <!-- Actions Rapides -->
            <div class="row g-3 mb-4">
                <div class="col-6 col-md-3">
                    <a href="#" class="quick-action-btn w-100" style="background: var(--gradient-primary);" onclick="event.preventDefault(); app.loadPage('students'); setTimeout(() => { const btn = document.querySelector('[data-bs-target=\\'#studentModal\\']'); if(btn) btn.click(); }, 200);">
                        <i class="fas fa-user-plus"></i>
                        <span>Inscrire un élève</span>
                    </a>
                </div>
                <div class="col-6 col-md-3">
                    <a href="#" class="quick-action-btn w-100" style="background: var(--gradient-success);" onclick="event.preventDefault(); app.loadPage('teachers'); setTimeout(() => { const btn = document.querySelector('[data-bs-target=\\'#teacherModal\\']'); if(btn) btn.click(); }, 200);">
                        <i class="fas fa-chalkboard-teacher"></i>
                        <span>Recruter un enseignant</span>
                    </a>
                </div>
                <div class="col-6 col-md-3">
                    <a href="#" class="quick-action-btn w-100" style="background: var(--gradient-danger);" onclick="event.preventDefault(); app.loadPage('grades'); setTimeout(() => { const btn = document.querySelector('[data-bs-target=\\'#gradeModal\\']'); if(btn) btn.click(); }, 200);">
                        <i class="fas fa-file-signature"></i>
                        <span>Ajouter une note</span>
                    </a>
                </div>
                <div class="col-6 col-md-3">
                    <a href="#" class="quick-action-btn w-100" style="background: var(--gradient-warning);" onclick="event.preventDefault(); app.loadPage('agenda'); setTimeout(() => { if(app.agendaModule) app.agendaModule.showAddEventModal(); }, 200);">
                        <i class="fas fa-calendar-plus"></i>
                        <span>Planifier un événement</span>
                    </a>
                </div>
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
            
            <!-- Graphiques et analyses / Agenda et activités -->
            <div class="row">
                <!-- Gauche : Graphiques -->
                <div class="col-lg-7 mb-4">
                    <div class="row g-4">
                        <div class="col-12">
                            <div class="card h-100">
                                <div class="card-header bg-transparent border-0 pt-3">
                                    <h5><i class="fas fa-chart-pie me-2 text-primary"></i>Répartition par classe</h5>
                                </div>
                                <div class="card-body">
                                    <div style="position: relative; height: 260px;">
                                        <canvas id="classChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="card h-100">
                                <div class="card-header bg-transparent border-0 pt-3">
                                    <h5><i class="fas fa-chart-bar me-2 text-info"></i>Répartition des notes</h5>
                                </div>
                                <div class="card-body">
                                    <div style="position: relative; height: 260px;">
                                        <canvas id="gradesChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Droite : Agenda & Activités -->
                <div class="col-lg-5 mb-4">
                    <div class="row g-4">
                        <!-- Widget Agenda -->
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header bg-transparent border-0 pt-3 d-flex justify-content-between align-items-center">
                                    <h5><i class="fas fa-calendar-alt me-2 text-warning"></i>Prochains Événements</h5>
                                    <button class="btn btn-sm btn-link text-decoration-none" onclick="app.loadPage('agenda')">Voir tout</button>
                                </div>
                                <div class="card-body">
                                    <div id="upcomingEventsWidget" class="d-flex flex-column gap-3">
                                        <p class="text-muted">Chargement des événements...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Widget Activités -->
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header bg-transparent border-0 pt-3">
                                    <h5><i class="fas fa-clock me-2 text-danger"></i>Dernières Activités</h5>
                                </div>
                                <div class="card-body">
                                    <div class="activity-feed" id="recentActivities">
                                        <p class="text-muted">Chargement des activités...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadDashboardData() {
        // Mettre à jour les statistiques
        const totalStud = document.getElementById('totalStudents');
        if (totalStud) totalStud.textContent = this.app.students.length;
        
        const totalTeach = document.getElementById('totalTeachers');
        if (totalTeach) totalTeach.textContent = this.app.teachers.length;
        
        const totalCls = document.getElementById('totalClasses');
        if (totalCls) totalCls.textContent = this.app.classes.length;
        
        const totalGrd = document.getElementById('totalGrades');
        if (totalGrd) totalGrd.textContent = this.app.grades.length;
        
        // Gérer le message d'accueil
        this.updateGreeting();

        // Gérer l'horloge
        this.startClock();

        // Créer les graphiques
        this.createClassChart();
        this.createGradesChart();
        
        // Charger les widgets
        this.loadRecentActivities();
        this.loadUpcomingEvents();
    }

    updateGreeting() {
        const greetingEl = document.getElementById('dashboardGreeting');
        if (!greetingEl) return;

        // Récupérer le nom de l'utilisateur
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { firstName: 'Utilisateur' };
        const name = currentUser.firstName || 'Utilisateur';

        const hour = new Date().getHours();
        let salute = "Bonjour";
        if (hour >= 18) {
            salute = "Bonsoir";
        } else if (hour >= 22 || hour < 5) {
            salute = "Bonne nuit";
        }

        greetingEl.textContent = `${salute}, ${name} !`;
    }

    startClock() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }

        const updateTime = () => {
            const timeEl = document.getElementById('clockTime');
            const dateEl = document.getElementById('clockDate');
            if (!timeEl || !dateEl) return;

            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString('fr-FR');
            
            // Format date: mercredi 20 mai 2026
            dateEl.textContent = now.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        };

        updateTime();
        this.clockInterval = setInterval(updateTime, 1000);
    }

    createClassChart() {
        const ctx = document.getElementById('classChart');
        if (!ctx) return;
        
        if (this.classChartInstance) {
            this.classChartInstance.destroy();
        }
        
        const classData = this.app.classes.map(cls => ({
            name: cls.name,
            count: this.app.students.filter(s => s.class === cls.name).length
        }));
        
        this.classChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: classData.map(d => d.name),
                datasets: [{
                    data: classData.map(d => d.count),
                    backgroundColor: [
                        '#4f46e5', '#10b981', '#f59e0b', '#ef4444',
                        '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }

    createGradesChart() {
        const ctx = document.getElementById('gradesChart');
        if (!ctx) return;
        
        if (this.gradesChartInstance) {
            this.gradesChartInstance.destroy();
        }
        
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
        
        this.gradesChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: gradeRanges.map(r => r.range),
                datasets: [{
                    label: 'Nombre d\'évaluations',
                    data: gradeRanges.map(r => r.count),
                    backgroundColor: '#0284c7',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    loadRecentActivities() {
        const activities = JSON.parse(localStorage.getItem('activities')) || this.app.getDefaultActivities();
        const container = document.getElementById('recentActivities');
        if (!container) return;

        // Prendre les 5 dernières activités
        const slice = activities.slice(0, 5);

        if (slice.length === 0) {
            container.innerHTML = `<p class="text-muted small my-2">Aucune activité enregistrée.</p>`;
            return;
        }

        container.innerHTML = slice.map(activity => {
            let timeStr = 'Récemment';
            if (activity.time) {
                const diffMs = Date.now() - new Date(activity.time).getTime();
                const diffMin = Math.floor(diffMs / 60000);
                if (diffMin < 1) timeStr = "À l'instant";
                else if (diffMin < 60) timeStr = `Il y a ${diffMin} min`;
                else {
                    const diffHr = Math.floor(diffMin / 60);
                    if (diffHr < 24) timeStr = `Il y a ${diffHr} h`;
                    else timeStr = new Date(activity.time).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                }
            }

            return `
                <div class="activity-item text-start">
                    <div class="activity-badge ${activity.type || 'system'}"></div>
                    <div class="activity-time">${timeStr}</div>
                    <div class="activity-text">
                        <strong>${activity.action}</strong>
                        ${activity.details ? `<div class="text-muted small" style="font-size: 0.8rem;">${activity.details}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    loadUpcomingEvents() {
        const container = document.getElementById('upcomingEventsWidget');
        if (!container) return;

        // Charger via AgendaModule s'il existe
        const events = this.app.agendaModule ? this.app.agendaModule.getEvents() : [];
        
        // Filtrer les événements futurs ou d'aujourd'hui
        const todayStr = new Date().toISOString().split('T')[0];
        const upcoming = events.filter(e => e.endDate >= todayStr || e.startDate >= todayStr);

        if (upcoming.length === 0) {
            container.innerHTML = `
                <div class="text-center py-3 text-muted">
                    <i class="fas fa-calendar-check fa-2x mb-2 text-light-gray"></i>
                    <p class="small mb-0">Aucun événement à venir</p>
                </div>
            `;
            return;
        }

        // Trier par date
        upcoming.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        // Prendre les 3 prochains
        const slice = upcoming.slice(0, 3);

        container.innerHTML = slice.map(evt => {
            const badgeClass = this.app.agendaModule ? this.app.agendaModule.getEventBadgeClass(evt.type) : 'bg-primary';
            const icon = this.app.agendaModule ? this.app.agendaModule.getEventIcon(evt.type) : 'fa-calendar';
            
            const startFmt = new Date(evt.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
            
            return `
                <div class="d-flex align-items-center border-bottom pb-2 mb-2">
                    <div class="flex-shrink-0 text-center px-2 py-1 bg-light rounded" style="min-width: 55px;">
                        <span class="d-block fw-bold text-dark" style="font-size: 1.1rem; line-height: 1.1;">${startFmt.split(' ')[0]}</span>
                        <span class="d-block text-muted text-uppercase" style="font-size: 0.7rem; font-weight: 700;">${startFmt.split(' ')[1] || ''}</span>
                    </div>
                    <div class="flex-grow-1 ms-3 text-start">
                        <h6 class="fw-bold mb-0 text-dark" style="font-size: 0.95rem;">${evt.title}</h6>
                        <span class="badge ${badgeClass} text-xs mt-1" style="font-size: 0.7rem;">${evt.type}</span>
                        ${evt.location ? `<span class="text-muted text-xs ms-2" style="font-size: 0.75rem;"><i class="fas fa-map-marker-alt text-danger me-1"></i>${evt.location}</span>` : ''}
                    </div>
                    <button class="btn btn-sm btn-light" onclick="app.agendaModule.viewEventDetails(${evt.id})">
                        <i class="fas fa-chevron-right text-muted"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    refreshDashboard() {
        this.loadDashboardData();
        this.app.showNotification('Tableau de bord actualisé', 'success');
    }
}
