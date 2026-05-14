-- Schéma de base de données pour l'application de gestion scolaire
-- École Primaire et Maternelle

-- Table des utilisateurs (authentification)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'director') NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des classes
CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    level ENUM('Petite Section', 'Moyenne Section', 'Grande Section', 'CP', 'CE1', 'CE2', 'CM1', 'CM2') NOT NULL,
    capacity INT NOT NULL DEFAULT 30,
    teacher_id INT,
    room_number VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table des élèves
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('M', 'F') NOT NULL,
    address TEXT,
    class_id INT,
    parent_name VARCHAR(100) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_email VARCHAR(100),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    medical_info TEXT,
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

-- Table des matières
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    level ENUM('Petite Section', 'Moyenne Section', 'Grande Section', 'CP', 'CE1', 'CE2', 'CM1', 'CM2') NOT NULL,
    coefficient DECIMAL(3,1) DEFAULT 1.0,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des évaluations/notes
CREATE TABLE grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    grade DECIMAL(4,2) NOT NULL CHECK (grade >= 0 AND grade <= 20),
    coefficient DECIMAL(3,1) DEFAULT 1.0,
    evaluation_date DATE NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des bulletins
CREATE TABLE report_cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    period VARCHAR(50) NOT NULL, -- "Trimestre 1", "Semestre 1", etc.
    school_year VARCHAR(9) NOT NULL, -- "2023-2024"
    general_average DECIMAL(4,2),
    rank_in_class INT,
    teacher_comment TEXT,
    principal_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Table des notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'success', 'danger') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des activités (logs)
CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    target_type ENUM('student', 'teacher', 'class', 'grade', 'user') NOT NULL,
    target_id INT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des paramètres de l'école
CREATE TABLE school_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion des données de base
INSERT INTO subjects (name, level, coefficient) VALUES
-- Maternelle
('Éveil', 'Petite Section', 1.0),
('Motricité', 'Petite Section', 1.0),
('Langage', 'Petite Section', 1.0),
('Éveil', 'Moyenne Section', 1.0),
('Motricité', 'Moyenne Section', 1.0),
('Langage', 'Moyenne Section', 1.0),
('Éveil', 'Grande Section', 1.0),
('Motricité', 'Grande Section', 1.0),
('Langage', 'Grande Section', 1.0),
-- Primaire
('Mathématiques', 'CP', 3.0),
('Français', 'CP', 3.0),
('Éducation Physique', 'CP', 1.0),
('Arts Plastiques', 'CP', 1.0),
('Mathématiques', 'CE1', 3.0),
('Français', 'CE1', 3.0),
('Sciences', 'CE1', 2.0),
('Histoire-Géographie', 'CE1', 2.0),
('Éducation Physique', 'CE1', 1.0),
('Arts Plastiques', 'CE1', 1.0),
('Anglais', 'CE1', 2.0),
('Mathématiques', 'CE2', 3.0),
('Français', 'CE2', 3.0),
('Sciences', 'CE2', 2.0),
('Histoire-Géographie', 'CE2', 2.0),
('Éducation Physique', 'CE2', 1.0),
('Arts Plastiques', 'CE2', 1.0),
('Anglais', 'CE2', 2.0),
('Mathématiques', 'CM1', 3.0),
('Français', 'CM1', 3.0),
('Sciences', 'CM1', 2.0),
('Histoire-Géographie', 'CM1', 2.0),
('Éducation Physique', 'CM1', 1.0),
('Arts Plastiques', 'CM1', 1.0),
('Anglais', 'CM1', 2.0),
('Mathématiques', 'CM2', 3.0),
('Français', 'CM2', 3.0),
('Sciences', 'CM2', 2.0),
('Histoire-Géographie', 'CM2', 2.0),
('Éducation Physique', 'CM2', 1.0),
('Arts Plastiques', 'CM2', 1.0),
('Anglais', 'CM2', 2.0);

-- Insertion des paramètres de l'école
INSERT INTO school_settings (setting_key, setting_value, description) VALUES
('school_name', 'École Primaire et Maternelle', 'Nom de l\'école'),
('school_address', '123 Rue de l\'École, 75000 Paris', 'Adresse de l\'école'),
('school_phone', '01 23 45 67 89', 'Téléphone de l\'école'),
('school_email', 'contact@ecole.fr', 'Email de l\'école'),
('current_school_year', '2023-2024', 'Année scolaire actuelle'),
('max_students_per_class', '30', 'Nombre maximum d\'élèves par classe'),
('grade_scale', '20', 'Échelle de notation (sur 20)');

-- Création des index pour optimiser les performances
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_name ON students(last_name, first_name);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_subject ON grades(subject_id);
CREATE INDEX idx_grades_date ON grades(evaluation_date);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_date ON activities(created_at);
