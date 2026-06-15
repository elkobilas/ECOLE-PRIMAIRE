// Module de rapports et analyses pour l'application de gestion scolaire
class ReportsModule {
    constructor(app) {
        this.app = app;
    }

    getReportsHTML() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-chart-bar me-2"></i>Rapports et Analyses</h2>
                <button class="btn btn-success" onclick="app.reportsModule.generateReport('export-all')">
                    <i class="fas fa-file-export me-1"></i>Export Global
                </button>
            </div>
            <div class="row">
                <!-- Bulletins Individuels -->
                <div class="col-md-6 mb-4">
                    <div class="card h-100 border-primary shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0"><i class="fas fa-file-invoice me-2"></i>Bulletins de Notes</h5>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <p>Générez, visualisez, personnalisez et imprimez les bulletins de notes individuels détaillés de chaque élève.</p>
                            <button class="btn btn-primary mt-auto w-100" onclick="app.reportsModule.showStudentReportCardSelector()">
                                <i class="fas fa-file-pdf me-2"></i>Accéder aux bulletins
                            </button>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0"><i class="fas fa-user-graduate me-2"></i>Rapports Élèves</h5>
                        </div>
                        <div class="card-body">
                            <p>Analyses détaillées sur les effectifs, la répartition par classe, âge et genre.</p>
                            <button class="btn btn-outline-primary w-100" onclick="app.reportsModule.generateReport('students-summary')">
                                <i class="fas fa-chart-pie me-2"></i>Synthèse des élèves
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0"><i class="fas fa-star me-2"></i>Rapports Notes</h5>
                        </div>
                        <div class="card-body">
                            <p>Statistiques sur les résultats scolaires, moyennes par matière et par classe.</p>
                            <button class="btn btn-outline-success w-100" onclick="app.reportsModule.generateReport('grades-analysis')">
                                <i class="fas fa-chart-line me-2"></i>Analyse des notes
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-info text-white">
                            <h5 class="mb-0"><i class="fas fa-chalkboard me-2"></i>Rapports Classes</h5>
                        </div>
                        <div class="card-body">
                            <p>Vue d'ensemble des classes, taux d'occupation et répartition par niveau.</p>
                            <button class="btn btn-outline-info w-100" onclick="app.reportsModule.generateReport('class-statistics')">
                                <i class="fas fa-columns me-2"></i>Statistiques des classes
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-warning text-dark">
                            <h5 class="mb-0"><i class="fas fa-chalkboard-teacher me-2"></i>Rapports Enseignants</h5>
                        </div>
                        <div class="card-body">
                            <p>Suivi de l'activité des enseignants et statistiques de saisie des notes.</p>
                            <button class="btn btn-outline-warning w-100" onclick="app.reportsModule.generateReport('teachers-performance')">
                                <i class="fas fa-user-tie me-2"></i>Performance enseignants
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Zone pour les graphiques récents ou aperçus -->
            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="mb-0">Aperçu rapide</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3 text-center">
                            <h3 class="display-4 text-primary" id="quickStatStudents">0</h3>
                            <p class="text-muted">Élèves inscrits</p>
                        </div>
                        <div class="col-md-3 text-center">
                            <h3 class="display-4 text-success" id="quickStatTeachers">0</h3>
                            <p class="text-muted">Enseignants</p>
                        </div>
                        <div class="col-md-3 text-center">
                            <h3 class="display-4 text-info" id="quickStatClasses">0</h3>
                            <p class="text-muted">Classes</p>
                        </div>
                        <div class="col-md-3 text-center">
                            <h3 class="display-4 text-warning" id="quickStatAvg">0</h3>
                            <p class="text-muted">Moyenne globale</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadReportsData() {
        // Charger les statistiques rapides
        if (this.app.students) document.getElementById('quickStatStudents').textContent = this.app.students.length;
        if (this.app.teachers) document.getElementById('quickStatTeachers').textContent = this.app.teachers.length;
        if (this.app.classes) document.getElementById('quickStatClasses').textContent = this.app.classes.length;

        if (this.app.grades && this.app.grades.length > 0) {
            const totalPoints = this.app.grades.reduce((sum, grade) => sum + (grade.grade * (grade.coefficient || 1)), 0);
            const totalCoefficients = this.app.grades.reduce((sum, grade) => sum + (grade.coefficient || 1), 0);
            const avg = totalCoefficients > 0 ? (totalPoints / totalCoefficients).toFixed(2) : 0;
            document.getElementById('quickStatAvg').textContent = avg + '/20';
        }
    }

    // Générer un rapport
    generateReport(reportType) {
        switch (reportType) {
            case 'students-summary':
                this.generateStudentsSummary();
                break;
            case 'grades-analysis':
                this.generateGradesAnalysis();
                break;
            case 'class-statistics':
                this.generateClassStatistics();
                break;
            case 'teachers-performance':
                this.generateTeachersPerformance();
                break;
            case 'export-all':
                this.exportAllData();
                break;
            default:
                console.warn('Type de rapport non reconnu:', reportType);
        }
    }

    // Rapport de synthèse des élèves
    generateStudentsSummary() {
        const students = this.app.students;

        const summary = {
            total: students.length,
            byClass: {},
            byGender: { M: 0, F: 0 },
            byAge: {},
            newThisMonth: 0
        };

        // Analyser par classe
        students.forEach(student => {
            const className = student.class || 'Non assigné';
            if (!summary.byClass[className]) {
                summary.byClass[className] = 0;
            }
            summary.byClass[className]++;

            // Analyser par genre
            if (student.gender) {
                summary.byGender[student.gender]++;
            }

            // Analyser par âge
            const age = this.calculateAge(student.dateOfBirth);
            const ageGroup = this.getAgeGroup(age);
            if (!summary.byAge[ageGroup]) {
                summary.byAge[ageGroup] = 0;
            }
            summary.byAge[ageGroup]++;

            // Nouveaux ce mois
            const enrollmentDate = new Date(student.enrollmentDate || '2023-09-01');
            const now = new Date();
            if (enrollmentDate.getMonth() === now.getMonth() &&
                enrollmentDate.getFullYear() === now.getFullYear()) {
                summary.newThisMonth++;
            }
        });

        this.displayReport('Rapport de synthèse des élèves', summary);
    }

    // Analyse des notes
    generateGradesAnalysis() {
        const grades = this.app.grades;
        const students = this.app.students;

        const analysis = {
            totalGrades: grades.length,
            averageGrade: 0,
            bySubject: {},
            byClass: {},
            topPerformers: [],
            strugglingStudents: []
        };

        if (grades.length > 0) {
            // Calculer la moyenne générale
            const totalPoints = grades.reduce((sum, grade) => sum + (grade.grade * (grade.coefficient || 1)), 0);
            const totalCoefficients = grades.reduce((sum, grade) => sum + (grade.coefficient || 1), 0);
            analysis.averageGrade = totalCoefficients > 0 ? (totalPoints / totalCoefficients).toFixed(2) : 0;

            // Analyser par matière
            grades.forEach(grade => {
                const subject = grade.subject || 'Inconnue';
                if (!analysis.bySubject[subject]) {
                    analysis.bySubject[subject] = { count: 0, total: 0, average: 0 };
                }
                analysis.bySubject[subject].count++;
                analysis.bySubject[subject].total += grade.grade;
            });

            // Calculer les moyennes par matière
            Object.keys(analysis.bySubject).forEach(subject => {
                const data = analysis.bySubject[subject];
                data.average = (data.total / data.count).toFixed(2);
            });

            // Analyser par classe
            students.forEach(student => {
                const studentGrades = grades.filter(g => g.studentId === student.id);
                if (studentGrades.length > 0) {
                    const studentAverage = this.calculateStudentAverage(studentGrades);
                    const className = student.class || 'Non assigné';

                    if (!analysis.byClass[className]) {
                        analysis.byClass[className] = { students: 0, totalAverage: 0, averages: [] };
                    }
                    analysis.byClass[className].students++;
                    analysis.byClass[className].averages.push(studentAverage);
                }
            });

            // Calculer les moyennes par classe
            Object.keys(analysis.byClass).forEach(className => {
                const data = analysis.byClass[className];
                data.totalAverage = data.averages.length > 0 ?
                    (data.averages.reduce((sum, avg) => sum + avg, 0) / data.averages.length).toFixed(2) : 0;
            });

            // Identifier les meilleurs et les plus faibles
            const studentAverages = students.map(student => {
                const studentGrades = grades.filter(g => g.studentId === student.id);
                return {
                    student,
                    average: studentGrades.length > 0 ? this.calculateStudentAverage(studentGrades) : 0
                };
            }).filter(s => s.average > 0);

            analysis.topPerformers = studentAverages
                .sort((a, b) => b.average - a.average)
                .slice(0, 5);

            analysis.strugglingStudents = studentAverages
                .filter(s => s.average < 10)
                .sort((a, b) => a.average - b.average)
                .slice(0, 5);
        }

        this.displayReport('Analyse des notes', analysis);
    }

    // Statistiques des classes
    generateClassStatistics() {
        const classes = this.app.classes;
        const students = this.app.students;

        const statistics = {
            totalClasses: classes.length,
            totalCapacity: classes.reduce((sum, cls) => sum + cls.capacity, 0),
            totalStudents: students.length,
            occupancyRate: 0,
            byLevel: {},
            fullClasses: [],
            availableSpots: []
        };

        // Calculer le taux d'occupation
        statistics.occupancyRate = statistics.totalCapacity > 0 ?
            ((statistics.totalStudents / statistics.totalCapacity) * 100).toFixed(1) : 0;

        // Analyser par niveau
        classes.forEach(cls => {
            const level = cls.level;
            if (!statistics.byLevel[level]) {
                statistics.byLevel[level] = { classes: 0, students: 0, capacity: 0 };
            }
            statistics.byLevel[level].classes++;
            statistics.byLevel[level].capacity += cls.capacity;

            // Compter les élèves dans cette classe
            const studentsInClass = students.filter(s => s.class === cls.name).length;
            statistics.byLevel[level].students += studentsInClass;
        });

        // Identifier les classes pleines et les places disponibles
        classes.forEach(cls => {
            const studentsInClass = students.filter(s => s.class === cls.name).length;
            const occupancy = (studentsInClass / cls.capacity) * 100;

            if (occupancy >= 90) {
                statistics.fullClasses.push({
                    name: cls.name,
                    level: cls.level,
                    students: studentsInClass,
                    capacity: cls.capacity,
                    occupancy: occupancy.toFixed(1)
                });
            }

            if (occupancy < 50) {
                statistics.availableSpots.push({
                    name: cls.name,
                    level: cls.level,
                    available: cls.capacity - studentsInClass,
                    occupancy: occupancy.toFixed(1)
                });
            }
        });

        this.displayReport('Statistiques des classes', statistics);
    }

    // Performance des enseignants
    generateTeachersPerformance() {
        const teachers = this.app.teachers;
        const grades = this.app.grades;
        const students = this.app.students;

        const performance = {
            totalTeachers: teachers.length,
            activeTeachers: teachers.filter(t => t.isActive !== false).length,
            byTeacher: {},
            averageGradesByTeacher: {},
            mostActiveTeachers: []
        };

        // Analyser par enseignant
        teachers.forEach(teacher => {
            const teacherGrades = grades.filter(g => g.teacherId === teacher.id);
            const teacherStudents = students.filter(s => s.teacherId === teacher.id);

            performance.byTeacher[teacher.id] = {
                name: `${teacher.firstName} ${teacher.lastName}`,
                gradesCount: teacherGrades.length,
                studentsCount: teacherStudents.length,
                averageGrade: 0
            };

            if (teacherGrades.length > 0) {
                const totalPoints = teacherGrades.reduce((sum, grade) => sum + (grade.grade * (grade.coefficient || 1)), 0);
                const totalCoefficients = teacherGrades.reduce((sum, grade) => sum + (grade.coefficient || 1), 0);
                performance.byTeacher[teacher.id].averageGrade = totalCoefficients > 0 ?
                    (totalPoints / totalCoefficients).toFixed(2) : 0;
            }
        });

        // Identifier les enseignants les plus actifs
        performance.mostActiveTeachers = Object.values(performance.byTeacher)
            .sort((a, b) => b.gradesCount - a.gradesCount)
            .slice(0, 5);

        this.displayReport('Performance des enseignants', performance);
    }

    // Exporter toutes les données
    exportAllData() {
        const data = {
            students: this.app.students,
            teachers: this.app.teachers,
            classes: this.app.classes,
            grades: this.app.grades,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `export_complet_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.app.showNotification('Export complet téléchargé', 'success');
    }

    // Afficher un rapport
    displayReport(title, data) {
        const reportHTML = this.generateReportHTML(title, data);

        // Créer un modal pour afficher le rapport
        const modalHTML = `
            <div class="modal fade" id="reportModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${reportHTML}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                            <button type="button" class="btn btn-primary" onclick="app.reportsModule.printReport()">
                                <i class="fas fa-print me-1"></i>Imprimer
                            </button>
                            <button type="button" class="btn btn-success" onclick="app.reportsModule.exportReport()">
                                <i class="fas fa-download me-1"></i>Exporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Supprimer l'ancien modal s'il existe
        const existingModal = document.getElementById('reportModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Ajouter le nouveau modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Afficher le modal
        const modal = new bootstrap.Modal(document.getElementById('reportModal'));
        modal.show();
    }

    // Générer le HTML du rapport
    generateReportHTML(title, data) {
        let html = `<div class="report-content">`;

        if (title.includes('élèves')) {
            html += this.generateStudentsReportHTML(data);
        } else if (title.includes('notes')) {
            html += this.generateGradesReportHTML(data);
        } else if (title.includes('classes')) {
            html += this.generateClassesReportHTML(data);
        } else if (title.includes('enseignants')) {
            html += this.generateTeachersReportHTML(data);
        }

        html += `</div>`;
        return html;
    }

    // HTML pour le rapport des élèves
    generateStudentsReportHTML(data) {
        return `
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card bg-primary text-white">
                        <div class="card-body text-center">
                            <h3>${data.total}</h3>
                            <p class="mb-0">Total élèves</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-success text-white">
                        <div class="card-body text-center">
                            <h3>${data.byGender.M}</h3>
                            <p class="mb-0">Garçons</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-info text-white">
                        <div class="card-body text-center">
                            <h3>${data.byGender.F}</h3>
                            <p class="mb-0">Filles</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-warning text-white">
                        <div class="card-body text-center">
                            <h3>${data.newThisMonth}</h3>
                            <p class="mb-0">Nouveaux ce mois</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <h5>Répartition par classe</h5>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Classe</th>
                                <th>Effectif</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(data.byClass).map(([className, count]) => `
                                <tr>
                                    <td>${className}</td>
                                    <td>${count}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="col-md-6">
                    <h5>Répartition par âge</h5>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Tranche d'âge</th>
                                <th>Effectif</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(data.byAge).map(([ageGroup, count]) => `
                                <tr>
                                    <td>${ageGroup}</td>
                                    <td>${count}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // HTML pour le rapport des notes
    generateGradesReportHTML(data) {
        return `
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body text-center">
                            <h3>${data.totalGrades}</h3>
                            <p class="mb-0">Total notes</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-success text-white">
                        <div class="card-body text-center">
                            <h3>${data.averageGrade}/20</h3>
                            <p class="mb-0">Moyenne générale</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-info text-white">
                        <div class="card-body text-center">
                            <h3>${data.strugglingStudents.length}</h3>
                            <p class="mb-0">Élèves en difficulté</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <h5>Moyennes par matière</h5>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Matière</th>
                                <th>Moyenne</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(data.bySubject).map(([subject, info]) => `
                                <tr>
                                    <td>${subject}</td>
                                    <td>${info.average}/20</td>
                                    <td>${info.count}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="col-md-6">
                    <h5>Meilleurs élèves</h5>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Élève</th>
                                <th>Moyenne</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.topPerformers.map(student => `
                                <tr>
                                    <td>${student.student.firstName} ${student.student.lastName}</td>
                                    <td>${student.average.toFixed(2)}/20</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // HTML pour le rapport des classes
    generateClassesReportHTML(data) {
        return `
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card bg-primary text-white">
                        <div class="card-body text-center">
                            <h3>${data.totalClasses}</h3>
                            <p class="mb-0">Classes</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-success text-white">
                        <div class="card-body text-center">
                            <h3>${data.totalStudents}</h3>
                            <p class="mb-0">Élèves</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-info text-white">
                        <div class="card-body text-center">
                            <h3>${data.totalCapacity}</h3>
                            <p class="mb-0">Capacité totale</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-warning text-white">
                        <div class="card-body text-center">
                            <h3>${data.occupancyRate}%</h3>
                            <p class="mb-0">Taux d'occupation</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <h5>Répartition par niveau</h5>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Niveau</th>
                                <th>Classes</th>
                                <th>Élèves</th>
                                <th>Capacité</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(data.byLevel).map(([level, info]) => `
                                <tr>
                                    <td>${level}</td>
                                    <td>${info.classes}</td>
                                    <td>${info.students}</td>
                                    <td>${info.capacity}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="col-md-6">
                    <h5>Classes surchargées</h5>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Classe</th>
                                <th>Effectif</th>
                                <th>Capacité</th>
                                <th>Taux</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.fullClasses.map(cls => `
                                <tr>
                                    <td>${cls.name}</td>
                                    <td>${cls.students}</td>
                                    <td>${cls.capacity}</td>
                                    <td>${cls.occupancy}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // HTML pour le rapport des enseignants
    generateTeachersReportHTML(data) {
        return `
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body text-center">
                            <h3>${data.totalTeachers}</h3>
                            <p class="mb-0">Total enseignants</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-success text-white">
                        <div class="card-body text-center">
                            <h3>${data.activeTeachers}</h3>
                            <p class="mb-0">Actifs</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-info text-white">
                        <div class="card-body text-center">
                            <h3>${data.mostActiveTeachers.length}</h3>
                            <p class="mb-0">Très actifs</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12">
                    <h5>Performance par enseignant</h5>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Enseignant</th>
                                <th>Notes saisies</th>
                                <th>Élèves</th>
                                <th>Moyenne</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.values(data.byTeacher).map(teacher => `
                                <tr>
                                    <td>${teacher.name}</td>
                                    <td>${teacher.gradesCount}</td>
                                    <td>${teacher.studentsCount}</td>
                                    <td>${teacher.averageGrade}/20</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Imprimer le rapport
    printReport() {
        const reportContent = document.querySelector('.report-content');
        if (reportContent) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Rapport - ${new Date().toLocaleDateString('fr-FR')}</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                        <style>
                            @media print {
                                body { font-size: 12px; }
                                .card { border: 1px solid #ddd; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container mt-3">
                            <h2>Rapport généré le ${new Date().toLocaleDateString('fr-FR')}</h2>
                            ${reportContent.outerHTML}
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }

    // Exporter le rapport
    exportReport() {
        const reportContent = document.querySelector('.report-content');
        if (reportContent) {
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Rapport - ${new Date().toLocaleDateString('fr-FR')}</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    </head>
                    <body>
                        <div class="container mt-3">
                            <h2>Rapport généré le ${new Date().toLocaleDateString('fr-FR')}</h2>
                            ${reportContent.outerHTML}
                        </div>
                    </body>
                </html>
            `;

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `rapport_${new Date().toISOString().split('T')[0]}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }

    // Utilitaires
    calculateAge(dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        return today.getFullYear() - birthDate.getFullYear();
    }

    getAgeGroup(age) {
        if (age < 3) return '0-2 ans';
        if (age < 6) return '3-5 ans';
        if (age < 8) return '6-7 ans';
        if (age < 10) return '8-9 ans';
        if (age < 12) return '10-11 ans';
        return '12+ ans';
    }

    calculateStudentAverage(grades) {
        if (grades.length === 0) return 0;
        const totalPoints = grades.reduce((sum, grade) => sum + (grade.grade * (grade.coefficient || 1)), 0);
        const totalCoefficients = grades.reduce((sum, grade) => sum + (grade.coefficient || 1), 0);
        return totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;
    }

    showStudentReportCardSelector() {
        const classes = this.app.classes;
        const classOptions = classes.map(c => `<option value="${c.name}">${c.name}</option>`).join('');

        const modalHTML = `
            <div class="modal fade" id="studentReportCardSelectorModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content shadow-lg border-0 rounded-4">
                        <div class="modal-header bg-primary text-white py-3">
                            <h5 class="modal-title fw-bold"><i class="fas fa-file-invoice me-2"></i>Bulletins de Notes Individuels</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold text-secondary">Filtrer par classe</label>
                                    <select id="reportClassSelect" class="form-select" onchange="app.reportsModule.filterReportStudentsList()">
                                        <option value="">Toutes les classes</option>
                                        ${classOptions}
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold text-secondary">Rechercher un élève</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i class="fas fa-search text-muted"></i></span>
                                        <input type="text" id="reportStudentSearch" class="form-control border-start-0" placeholder="Nom ou prénom..." oninput="app.reportsModule.filterReportStudentsList()">
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive rounded-3 border" style="max-height: 400px; overflow-y: auto;">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="table-light py-2">
                                        <tr>
                                            <th class="ps-3">Élève</th>
                                            <th>Classe</th>
                                            <th class="text-end pe-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="reportStudentsTableBody">
                                        <!-- Rempli dynamiquement -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer bg-light py-2 border-top-0">
                            <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Fermer</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Supprimer l'ancien modal s'il existe
        const existingModal = document.getElementById('studentReportCardSelectorModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Charger et filtrer la liste des élèves initiale
        this.filterReportStudentsList();

        const modal = new bootstrap.Modal(document.getElementById('studentReportCardSelectorModal'));
        modal.show();
    }

    filterReportStudentsList() {
        const classFilter = document.getElementById('reportClassSelect').value;
        const searchFilter = document.getElementById('reportStudentSearch').value.toLowerCase().trim();
        const students = this.app.students;
        const tbody = document.getElementById('reportStudentsTableBody');

        if (!tbody) return;

        // Filtrer les élèves actifs et correspondants
        const filtered = students.filter(s => {
            if (s.isActive === false) return false;
            const matchesClass = !classFilter || s.class === classFilter;
            const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
            const matchesSearch = !searchFilter || fullName.includes(searchFilter);
            return matchesClass && matchesSearch;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted p-4">Aucun élève trouvé</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(s => {
            // Check if they have grades to determine badge color
            const hasGrades = this.app.grades.some(g => g.studentId === s.id);
            const badge = hasGrades ? 
                '<span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2">Notes enregistrées</span>' :
                '<span class="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-2">Aucune note</span>';

            return `
                <tr>
                    <td class="ps-3 py-3">
                        <div class="fw-bold text-dark">${s.firstName} ${s.lastName}</div>
                        <div class="small">${badge}</div>
                    </td>
                    <td><span class="badge bg-light text-dark border px-2 py-1 rounded">${s.class || 'Non assigné'}</span></td>
                    <td class="text-end pe-3">
                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="app.reportsModule.generateStudentReportCard(${s.id})">
                            <i class="fas fa-file-invoice me-1"></i>Voir bulletin
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    generateStudentReportCard(studentId) {
        const student = this.app.students.find(s => s.id === studentId);
        if (!student) return;

        // Trouver la classe de l'élève
        const studentClass = this.app.classes.find(c => c.name === student.class);
        let classTeacherName = 'Non assigné';
        if (studentClass && studentClass.teacherId) {
            const teacher = this.app.teachers.find(t => t.id === studentClass.teacherId);
            if (teacher) {
                classTeacherName = `${teacher.firstName} ${teacher.lastName}`;
            }
        }

        // Récupérer toutes les notes de l'élève
        const studentGrades = this.app.grades.filter(g => g.studentId === studentId);
        
        // Groupement des notes par matière
        const gradesBySubject = {};
        studentGrades.forEach(g => {
            const subjectName = g.subject || 'Autre';
            if (!gradesBySubject[subjectName]) {
                gradesBySubject[subjectName] = {
                    coefficient: g.coefficient || 1,
                    grades: [],
                    comments: []
                };
            }
            gradesBySubject[subjectName].grades.push(g.grade);
            if (g.comment && g.comment.trim()) {
                gradesBySubject[subjectName].comments.push(g.comment);
            }
        });

        // Trouver tous les élèves de la même classe pour calculer la moyenne de classe et les rangs
        const classStudents = this.app.students.filter(s => s.class === student.class && s.isActive !== false);

        // Liste des matières évaluées dans cette classe
        const subjectsInClass = [...new Set(this.app.grades
            .filter(g => classStudents.some(cs => cs.id === g.studentId))
            .map(g => g.subject)
        )];

        // Calcul des moyennes par matière pour tous les élèves de la classe
        const classSubjectAverages = {};
        subjectsInClass.forEach(sub => {
            classSubjectAverages[sub] = classStudents.map(cs => {
                const csGrades = this.app.grades.filter(g => g.studentId === cs.id && g.subject === sub);
                return {
                    studentId: cs.id,
                    average: this.calculateStudentAverage(csGrades)
                };
            }).filter(item => item.average > 0 || this.app.grades.some(g => g.studentId === item.studentId && g.subject === sub));
        });

        // Calcul des moyennes générales pour tous les élèves de la classe
        const studentGeneralAverages = classStudents.map(cs => {
            const csGrades = this.app.grades.filter(g => g.studentId === cs.id);
            return {
                studentId: cs.id,
                average: this.calculateStudentAverage(csGrades)
            };
        }).filter(item => item.average > 0);

        studentGeneralAverages.sort((a, b) => b.average - a.average);
        const generalRankIndex = studentGeneralAverages.findIndex(item => item.studentId === student.id);
        const generalRank = generalRankIndex !== -1 ? generalRankIndex + 1 : 'N/A';
        
        const sumGeneralAverages = studentGeneralAverages.reduce((sum, item) => sum + item.average, 0);
        const classGeneralAverage = studentGeneralAverages.length > 0 ? (sumGeneralAverages / studentGeneralAverages.length).toFixed(2) : '0.00';

        // Construire les lignes du tableau des matières
        let rowsHTML = '';
        let totalCoeffPoints = 0;
        let totalCoeff = 0;

        // Récupérer la liste de toutes les matières de l'élève
        const studentSubjects = Object.keys(gradesBySubject);

        if (studentSubjects.length === 0) {
            rowsHTML = `<tr><td colspan="7" class="text-center text-muted p-4"><i class="fas fa-exclamation-circle me-1"></i>Aucune note enregistrée pour cet élève.</td></tr>`;
        } else {
            studentSubjects.forEach(sub => {
                const subData = gradesBySubject[sub];
                const gradesList = subData.grades;
                const coef = subData.coefficient;
                
                // Calcul de la moyenne de l'élève pour cette matière
                const subTotal = gradesList.reduce((sum, val) => sum + val, 0);
                const studentSubAvg = gradesList.length > 0 ? (subTotal / gradesList.length) : 0;
                
                totalCoeffPoints += studentSubAvg * coef;
                totalCoeff += coef;

                // Calcul de la moyenne de classe pour cette matière
                const classSubList = classSubjectAverages[sub] || [];
                const classSubSum = classSubList.reduce((sum, item) => sum + item.average, 0);
                const classSubAvg = classSubList.length > 0 ? (classSubSum / classSubList.length).toFixed(2) : '0.00';

                // Rang de l'élève dans cette matière
                let subRank = 'N/A';
                if (classSubList.length > 0) {
                    const sortedClassSub = [...classSubList].sort((a, b) => b.average - a.average);
                    const rankIndex = sortedClassSub.findIndex(item => item.studentId === student.id);
                    subRank = rankIndex !== -1 ? (rankIndex + 1) + '/' + sortedClassSub.length : 'N/A';
                }

                const gradesStr = gradesList.map(g => g.toFixed(1)).join(' | ');
                const commentsStr = subData.comments.length > 0 ? subData.comments.join(' ; ') : 'Travail régulier.';

                rowsHTML += `
                    <tr>
                        <td class="fw-bold text-dark ps-3">${sub}</td>
                        <td class="text-center">${coef}</td>
                        <td class="text-center small">${gradesStr}</td>
                        <td class="text-center fw-bold text-primary">${studentSubAvg.toFixed(2)}</td>
                        <td class="text-center text-muted">${classSubAvg}</td>
                        <td class="text-center">${subRank}</td>
                        <td class="small text-muted pe-3">${commentsStr}</td>
                    </tr>
                `;
            });
        }

        const overallAverage = totalCoeff > 0 ? (totalCoeffPoints / totalCoeff).toFixed(2) : '0.00';
        
        // Charger le commentaire général existant depuis le localStorage
        const savedComments = JSON.parse(localStorage.getItem('reportCardComments')) || {};
        const generalComment = savedComments[studentId] || '';

        // Appréciation automatique en fonction de la moyenne
        let autoAppreciation = 'Insuffisant, doit redoubler d\'efforts.';
        const avgNum = parseFloat(overallAverage);
        if (avgNum >= 16) autoAppreciation = 'Excellent trimestre. Félicitations du conseil de classe !';
        else if (avgNum >= 14) autoAppreciation = 'Très bon trimestre, travail sérieux et régulier.';
        else if (avgNum >= 12) autoAppreciation = 'Bon trimestre. Continuez ainsi.';
        else if (avgNum >= 10) autoAppreciation = 'Trimestre convenable, mais peut faire mieux.';
        else if (avgNum >= 8) autoAppreciation = 'Trimestre fragile. Des efforts sont attendus au prochain trimestre.';

        const defaultCommentPlaceholder = generalComment || autoAppreciation;

        const reportCardHTML = `
            <div class="modal fade" id="reportCardModal" tabindex="-1">
                <div class="modal-dialog modal-xl modal-dialog-scrollable">
                    <div class="modal-content shadow-lg border-0 rounded-4">
                        <div class="modal-header bg-dark text-white py-3 d-print-none border-bottom-0">
                            <h5 class="modal-title fw-bold"><i class="fas fa-file-invoice me-2"></i>Aperçu du Bulletin Individuel</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-5" id="printableReportCardContainer">
                            <style>
                                #printableReportCardContainer {
                                    font-family: 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif;
                                    color: #333;
                                    background: #fff;
                                }
                                .report-header-box {
                                    border-bottom: 3px double #333;
                                    padding-bottom: 15px;
                                }
                                .school-title {
                                    font-size: 19px;
                                    font-weight: 800;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                    color: #1a1a1a;
                                }
                                .report-title {
                                    font-size: 22px;
                                    font-weight: 900;
                                    color: #1a1a1a;
                                    letter-spacing: 1px;
                                }
                                .bulletin-table th {
                                    background-color: #f8f9fa !important;
                                    color: #212529 !important;
                                    border-color: #dee2e6;
                                    font-weight: 700;
                                }
                                .bulletin-table td {
                                    border-color: #dee2e6;
                                }
                                .summary-card-custom {
                                    border: 2px solid #333;
                                    border-radius: 8px;
                                    background-color: #f8f9fa;
                                    padding: 15px;
                                }
                                .signature-zone {
                                    margin-top: 50px;
                                }
                                .signature-title {
                                    font-weight: bold;
                                    font-size: 13px;
                                    text-decoration: underline;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                }
                                @media print {
                                    body * {
                                        visibility: hidden;
                                    }
                                    #printableReportCardContainer, #printableReportCardContainer * {
                                        visibility: visible;
                                    }
                                    #printableReportCardContainer {
                                        position: absolute;
                                        left: 0;
                                        top: 0;
                                        width: 100%;
                                        padding: 0px !important;
                                        margin: 0px !important;
                                    }
                                    .d-print-none {
                                        display: none !important;
                                    }
                                }
                            </style>

                            <!-- BULLETIN DESIGN -->
                            <div class="row report-header-box mb-4 align-items-center">
                                <div class="col-md-6 col-6">
                                    <div class="school-title">🏫 ÉCOLE PRIMAIRE & MATERNELLE</div>
                                    <div class="text-muted small"><i class="fas fa-map-marker-alt me-1"></i>123 Rue de l'École, 75000 Paris</div>
                                    <div class="text-muted small"><i class="fas fa-phone me-1"></i>Tél: 01 23 45 67 89 | contact@ecole.fr</div>
                                </div>
                                <div class="col-md-6 col-6 text-end">
                                    <div class="report-title">BULLETIN DE NOTES</div>
                                    <div class="badge bg-dark fs-6 px-3 py-2 mt-1">Année Scolaire : 2023-2024</div>
                                    <div class="text-muted mt-1 small"><i class="fas fa-calendar-alt me-1"></i>Période : Trimestre Unique</div>
                                </div>
                            </div>

                            <div class="row mb-4 g-3">
                                <div class="col-md-6 col-6">
                                    <div class="card h-100 border-secondary-subtle">
                                        <div class="card-header bg-light py-2">
                                            <h6 class="mb-0 fw-bold"><i class="fas fa-user-graduate me-2"></i>ÉLÈVE</h6>
                                        </div>
                                        <div class="card-body py-2">
                                            <table class="table table-sm table-borderless mb-0">
                                                <tr>
                                                    <td class="fw-bold py-1 w-40" style="width: 35%;">Nom & Prénom :</td>
                                                    <td class="py-1 text-dark fw-semibold">${student.lastName} ${student.firstName}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold py-1">Né(e) le :</td>
                                                    <td class="py-1">${new Date(student.dateOfBirth).toLocaleDateString('fr-FR')}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold py-1">Classe :</td>
                                                    <td class="py-1"><span class="badge bg-secondary">${student.class || 'Non assigné'}</span></td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 col-6">
                                    <div class="card h-100 border-secondary-subtle">
                                        <div class="card-header bg-light py-2">
                                            <h6 class="mb-0 fw-bold"><i class="fas fa-chalkboard-teacher me-2"></i>CADRE SCOLAIRE</h6>
                                        </div>
                                        <div class="card-body py-2">
                                            <table class="table table-sm table-borderless mb-0">
                                                <tr>
                                                    <td class="fw-bold py-1 w-40" style="width: 45%;">Enseignant Principal :</td>
                                                    <td class="py-1">${classTeacherName}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold py-1">Parent / Tuteur :</td>
                                                    <td class="py-1">${student.parentName || 'Non renseigné'}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold py-1">Contact Tél :</td>
                                                    <td class="py-1">${student.parentPhone || 'Non renseigné'}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <table class="table table-bordered bulletin-table align-middle mb-4">
                                <thead>
                                    <tr class="text-center table-light">
                                        <th class="text-start ps-3" style="width: 25%;">Matière / Discipline</th>
                                        <th style="width: 8%;">Coef</th>
                                        <th style="width: 25%;">Notes obtenues</th>
                                        <th style="width: 10%;">Moyenne Élève</th>
                                        <th style="width: 10%;">Moyenne Classe</th>
                                        <th style="width: 8%;">Rang</th>
                                        <th class="pe-3" style="width: 24%;">Appréciation / Observation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rowsHTML}
                                </tbody>
                            </table>

                            <div class="row mb-4 align-items-stretch">
                                <div class="col-md-5 col-5">
                                    <div class="summary-card-custom h-100">
                                        <h5 class="fw-bold border-bottom pb-2 text-center text-dark">RÉCAPITULATIF</h5>
                                        <div class="d-flex justify-content-between my-2">
                                            <span class="fw-bold">Moyenne Générale :</span>
                                            <span class="badge bg-primary fs-5 px-3 py-1">${overallAverage} / 20</span>
                                        </div>
                                        <div class="d-flex justify-content-between my-2">
                                            <span class="text-muted">Moyenne de la Classe :</span>
                                            <span class="fw-semibold text-dark">${classGeneralAverage} / 20</span>
                                        </div>
                                        <div class="d-flex justify-content-between my-2">
                                            <span class="text-muted">Rang de l'élève :</span>
                                            <span class="badge bg-dark px-2 py-1 fs-6">${generalRank}/${studentGeneralAverages.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-7 col-7">
                                    <div class="card h-100 border-dark">
                                        <div class="card-header bg-dark text-white py-2">
                                            <h6 class="mb-0 fw-bold"><i class="fas fa-comment-dots me-2"></i>Avis du Conseil des Maîtres</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3 d-print-none">
                                                <label class="form-label small text-muted fw-semibold">Éditer l'observation générale :</label>
                                                <textarea id="reportGeneralCommentInput" class="form-control form-control-sm border-secondary-subtle" rows="2" placeholder="${autoAppreciation}">${generalComment}</textarea>
                                                <button class="btn btn-sm btn-primary mt-2 rounded-pill px-3" onclick="app.reportsModule.saveReportCardComment(${studentId})">
                                                    <i class="fas fa-save me-1"></i>Sauvegarder l'avis
                                                </button>
                                            </div>
                                            <div class="p-3 text-center border rounded bg-light-subtle" style="font-size: 14.5px; min-height: 50px; background-color: #fafbfc;">
                                                <span id="reportGeneralCommentDisplay" class="fst-italic text-dark fw-semibold">"${defaultCommentPlaceholder}"</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row signature-zone text-center">
                                <div class="col-md-6 col-6">
                                    <div class="signature-title">Signature de l'Enseignant(e)</div>
                                    <div class="mt-4 text-muted small">[ ${classTeacherName} ]</div>
                                </div>
                                <div class="col-md-6 col-6">
                                    <div class="signature-title">Signature de la Direction</div>
                                    <div class="mt-4 text-muted small">[ Visa & Cachet ]</div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer bg-light d-print-none py-3 border-top-0 justify-content-between">
                            <button type="button" class="btn btn-secondary px-4 rounded-pill" onclick="app.reportsModule.showStudentReportCardSelector()">
                                <i class="fas fa-arrow-left me-1"></i>Retour à la liste
                            </button>
                            <div>
                                <button type="button" class="btn btn-success text-white px-4 rounded-pill me-2" onclick="app.reportsModule.printStudentReportCard(${studentId})">
                                    <i class="fas fa-print me-1"></i>Imprimer le bulletin (A4)
                                </button>
                                <button type="button" class="btn btn-outline-dark px-4 rounded-pill" data-bs-dismiss="modal">Fermer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Supprimer l'ancien modal du bulletin s'il existe
        const existingCardModal = document.getElementById('reportCardModal');
        if (existingCardModal) {
            existingCardModal.remove();
        }

        // Fermer le sélecteur s'il est ouvert
        const selectorModalEl = document.getElementById('studentReportCardSelectorModal');
        if (selectorModalEl) {
            const selectorInstance = bootstrap.Modal.getInstance(selectorModalEl);
            if (selectorInstance) selectorInstance.hide();
        }

        document.body.insertAdjacentHTML('beforeend', reportCardHTML);

        const cardModal = new bootstrap.Modal(document.getElementById('reportCardModal'));
        cardModal.show();
    }

    saveReportCardComment(studentId) {
        const text = document.getElementById('reportGeneralCommentInput').value.trim();
        const savedComments = JSON.parse(localStorage.getItem('reportCardComments')) || {};
        savedComments[studentId] = text;
        localStorage.setItem('reportCardComments', JSON.stringify(savedComments));
        
        // Mettre à jour l'affichage
        document.getElementById('reportGeneralCommentDisplay').textContent = text ? `"${text}"` : `"${document.getElementById('reportGeneralCommentInput').placeholder}"`;
        this.app.showNotification('Observation générale enregistrée avec succès', 'success');
    }

    printStudentReportCard(studentId) {
        const reportCardElement = document.getElementById('printableReportCardContainer');
        if (reportCardElement) {
            // Cloner le conteneur du bulletin
            const clone = reportCardElement.cloneNode(true);
            
            // Masquer les contrôles d'édition de commentaires dans la version imprimée
            const editControls = clone.querySelector('.d-print-none');
            if (editControls) {
                editControls.remove();
            }

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Bulletin de Notes</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                        <style>
                            body {
                                background-color: #fff;
                                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                                padding: 30px;
                            }
                            .report-header-box {
                                border-bottom: 3px double #333;
                                padding-bottom: 15px;
                            }
                            .school-title {
                                font-size: 18px;
                                font-weight: bold;
                                text-transform: uppercase;
                            }
                            .report-title {
                                font-size: 20px;
                                font-weight: 800;
                                letter-spacing: 1px;
                            }
                            .bulletin-table th {
                                background-color: #f8f9fa !important;
                                color: #000 !important;
                                border-color: #dee2e6;
                                font-weight: bold;
                            }
                            .summary-card-custom {
                                border: 2px solid #333;
                                border-radius: 8px;
                                background-color: #f8f9fa;
                                padding: 15px;
                            }
                            .signature-zone {
                                margin-top: 60px;
                            }
                            .signature-title {
                                font-weight: bold;
                                font-size: 14px;
                                text-decoration: underline;
                            }
                            @media print {
                                body {
                                    padding: 0;
                                    margin: 0;
                                    font-size: 13px;
                                }
                                .container {
                                    width: 100% !important;
                                    max-width: 100% !important;
                                    padding: 0 !important;
                                    margin: 0 !important;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            ${clone.innerHTML}
                        </div>
                        <script>
                            window.onload = function() {
                                window.print();
                                setTimeout(function() { window.close(); }, 500);
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    }
}
