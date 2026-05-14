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
}
