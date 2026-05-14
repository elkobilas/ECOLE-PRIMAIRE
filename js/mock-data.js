class MockDataGenerator {
    static generateData() {
        const teachers = this.generateTeachers();
        const classes = this.generateClasses(teachers);
        const students = this.generateStudents(classes);
        const subjects = this.generateSubjects();
        const grades = this.generateGrades(students, subjects, teachers);

        return {
            teachers,
            classes,
            students,
            subjects,
            grades
        };
    }

    static generateTeachers() {
        const teacherNames = [
            { first: 'Sophie', last: 'Leroy', gender: 'F' },
            { first: 'Michel', last: 'Moreau', gender: 'M' },
            { first: 'Isabelle', last: 'Dubois', gender: 'F' },
            { first: 'Thomas', last: 'Petit', gender: 'M' },
            { first: 'Catherine', last: 'Roux', gender: 'F' },
            { first: 'Nicolas', last: 'Blanc', gender: 'M' },
            { first: 'Marie', last: 'Garnier', gender: 'F' },
            { first: 'Pierre', last: 'Faure', gender: 'M' },
            { first: 'Julie', last: 'Mercier', gender: 'F' },
            { first: 'François', last: 'Dupuis', gender: 'M' }
        ];

        return teacherNames.map((t, index) => ({
            id: index + 1,
            firstName: t.first,
            lastName: t.last,
            qualification: 'Professeur des Écoles',
            email: `${t.first.toLowerCase().charAt(0)}.${t.last.toLowerCase()}@ecole.fr`,
            phone: `06 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
            dateOfBirth: this.randomDate(new Date(1975, 0, 1), new Date(1995, 0, 1)),
            gender: t.gender,
            address: `${Math.floor(Math.random() * 100) + 1} Rue de l'École`,
            hireDate: this.randomDate(new Date(2010, 0, 1), new Date(2023, 0, 1)),
            isActive: true
        }));
    }

    static generateClasses(teachers) {
        const levels = [
            { name: 'Petite Section', level: 'Petite Section', capacity: 25 },
            { name: 'Moyenne Section', level: 'Moyenne Section', capacity: 25 },
            { name: 'Grande Section', level: 'Grande Section', capacity: 25 },
            { name: 'CP A', level: 'CP', capacity: 25 },
            { name: 'CP B', level: 'CP', capacity: 25 },
            { name: 'CE1 A', level: 'CE1', capacity: 28 },
            { name: 'CE1 B', level: 'CE1', capacity: 28 },
            { name: 'CE2 A', level: 'CE2', capacity: 28 },
            { name: 'CE2 B', level: 'CE2', capacity: 28 },
            { name: 'CM1 A', level: 'CM1', capacity: 30 },
            { name: 'CM1 B', level: 'CM1', capacity: 30 },
            { name: 'CM2 A', level: 'CM2', capacity: 30 },
            { name: 'CM2 B', level: 'CM2', capacity: 30 }
        ];

        return levels.map((c, index) => ({
            id: index + 1,
            name: c.name,
            level: c.level,
            capacity: c.capacity,
            studentCount: 0, // Will be updated later
            teacherId: teachers[index % teachers.length].id,
            room: `Salle ${100 + index}`,
            schedule: 'Lundi-Vendredi 8h30-16h30'
        }));
    }

    static generateStudents(classes) {
        const students = [];
        let studentId = 1;

        const firstNamesM = ['Lucas', 'Léo', 'Gabriel', 'Louis', 'Arthur', 'Jules', 'Maël', 'Adam', 'Paul', 'Hugo'];
        const firstNamesF = ['Emma', 'Jade', 'Louise', 'Alice', 'Chloé', 'Lina', 'Léa', 'Rose', 'Anna', 'Mila'];
        const lastNames = ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux'];

        classes.forEach(cls => {
            // Generate 15-25 students per class
            const count = Math.floor(Math.random() * 10) + 15;

            for (let i = 0; i < count; i++) {
                const gender = Math.random() > 0.5 ? 'M' : 'F';
                const firstName = gender === 'M' ?
                    firstNamesM[Math.floor(Math.random() * firstNamesM.length)] :
                    firstNamesF[Math.floor(Math.random() * firstNamesF.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

                // Birth year based on class level (approximate)
                let birthYear = 2018; // Default
                if (cls.level.includes('Petite')) birthYear = 2020;
                else if (cls.level.includes('Moyenne')) birthYear = 2019;
                else if (cls.level.includes('Grande')) birthYear = 2018;
                else if (cls.level === 'CP') birthYear = 2017;
                else if (cls.level === 'CE1') birthYear = 2016;
                else if (cls.level === 'CE2') birthYear = 2015;
                else if (cls.level === 'CM1') birthYear = 2014;
                else if (cls.level === 'CM2') birthYear = 2013;

                students.push({
                    id: studentId++,
                    firstName: firstName,
                    lastName: lastName,
                    dateOfBirth: this.randomDate(new Date(birthYear, 0, 1), new Date(birthYear, 11, 31)),
                    gender: gender,
                    class: cls.name,
                    parentName: `Parent de ${firstName}`,
                    parentPhone: `06 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
                    parentEmail: `parents.${lastName.toLowerCase()}${studentId}@email.com`,
                    address: `${Math.floor(Math.random() * 500) + 1} Rue Principale`,
                    isActive: true
                });
            }

            // Update class student count
            cls.studentCount = count;
        });

        return students;
    }

    static generateSubjects() {
        return [
            { id: 1, name: 'Mathématiques', coefficient: 4 },
            { id: 2, name: 'Français', coefficient: 4 },
            { id: 3, name: 'Histoire-Géographie', coefficient: 3 },
            { id: 4, name: 'Sciences', coefficient: 3 },
            { id: 5, name: 'Anglais', coefficient: 2 },
            { id: 6, name: 'EPS', coefficient: 2 },
            { id: 7, name: 'Arts Plastiques', coefficient: 1 },
            { id: 8, name: 'Musique', coefficient: 1 }
        ];
    }

    static generateGrades(students, subjects, teachers) {
        const grades = [];
        let gradeId = 1;

        // Only generate grades for CP and above
        const gradedStudents = students.filter(s =>
            !s.class.includes('Section') // Exclude kindergarten
        );

        gradedStudents.forEach(student => {
            // Generate 3-5 grades per subject for each student
            subjects.forEach(subject => {
                const gradeCount = Math.floor(Math.random() * 3) + 3;

                for (let i = 0; i < gradeCount; i++) {
                    // Random grade between 8 and 20, weighted towards 12-16
                    let score = Math.floor(Math.random() * 12) + 8;
                    // Add decimal .0 or .5
                    score += Math.random() > 0.5 ? 0.5 : 0;
                    if (score > 20) score = 20;

                    grades.push({
                        id: gradeId++,
                        studentId: student.id,
                        studentName: `${student.firstName} ${student.lastName}`,
                        subjectId: subject.id,
                        subject: subject.name,
                        grade: score,
                        coefficient: subject.coefficient,
                        date: this.randomDate(new Date(2023, 8, 1), new Date()).toISOString().split('T')[0],
                        teacherId: teachers[Math.floor(Math.random() * teachers.length)].id,
                        comment: this.getRandomComment(score)
                    });
                }
            });
        });

        return grades;
    }

    static randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    static getRandomComment(grade) {
        if (grade >= 18) return "Excellent travail !";
        if (grade >= 16) return "Très bon travail.";
        if (grade >= 14) return "Bon travail, continuez ainsi.";
        if (grade >= 12) return "Assez bien, des efforts à poursuivre.";
        if (grade >= 10) return "Moyen, peut mieux faire.";
        if (grade >= 8) return "Insuffisant, il faut réviser les bases.";
        return "Très insuffisant, attention.";
    }
}
