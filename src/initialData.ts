import { Student, Teacher, SchoolClass, Subject, ScheduleItem, Exam, Grade, Invoice, Announcement, Attendance, StaffMember, StaffLeaveRequest, StaffAttendance as StaffAttendanceType, StaffPayroll, Inquiry, Book, StudentLeave, SchoolProfile, DisciplinaryIncident } from './types';

export const INITIAL_CLASSES: SchoolClass[] = [
  { id: 'c1', name: '6ème A', section: 'A', roomNumber: 'Salle 101', capacity: 30 },
  { id: 'c2', name: '5ème B', section: 'B', roomNumber: 'Salle 102', capacity: 28 },
  { id: 'c3', name: 'Terminale S', section: 'S1', roomNumber: 'Labo Physique', capacity: 25 },
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'j.dupont@ecole.fr',
    phone: '06 12 34 56 78',
    subjects: ['Mathématiques', 'Algèbre'],
    status: 'Active',
    salary: 2800,
    qualification: 'Agrégation de Mathématiques',
    joiningDate: '2022-09-01',
  },
  {
    id: 't2',
    firstName: 'Marie',
    lastName: 'Curie',
    email: 'm.curie@ecole.fr',
    phone: '06 98 76 54 32',
    subjects: ['Physique-Chimie', 'Sciences'],
    status: 'Active',
    salary: 3100,
    qualification: 'Doctorat en Sciences Physiques',
    joiningDate: '2021-09-01',
  },
  {
    id: 't3',
    firstName: 'Victor',
    lastName: 'Hugo',
    email: 'v.hugo@ecole.fr',
    phone: '07 11 22 33 44',
    subjects: ['Français', 'Littérature'],
    status: 'Active',
    salary: 2700,
    qualification: 'Master de Lettres Modernes',
    joiningDate: '2023-09-01',
  },
  {
    id: 't4',
    firstName: 'William',
    lastName: 'Shakespeare',
    email: 'w.shakes@ecole.fr',
    phone: '06 55 66 77 88',
    subjects: ['Anglais'],
    status: 'Active',
    salary: 2600,
    qualification: 'Licence d\'Anglais LCE',
    joiningDate: '2024-01-15',
  },
  {
    id: 't5',
    firstName: 'Albert',
    lastName: 'Einstein',
    email: 'a.einstein@ecole.fr',
    phone: '07 88 99 00 11',
    subjects: ['Histoire-Géographie'],
    status: 'Inactive',
    salary: 2900,
    qualification: 'Master d\'Histoire',
    joiningDate: '2020-09-01',
  },
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 's_math', name: 'Mathématiques', code: 'MATH101', teacherId: 't1' },
  { id: 's_phys', name: 'Physique-Chimie', code: 'PHYS201', teacherId: 't2' },
  { id: 's_fran', name: 'Français', code: 'FRAN101', teacherId: 't3' },
  { id: 's_ang', name: 'Anglais', code: 'ANGL101', teacherId: 't4' },
  { id: 's_hist', name: 'Histoire-Géographie', code: 'HIST101', teacherId: 't5' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'st1',
    firstName: 'Thomas',
    lastName: 'Lemaire',
    rollNumber: '2026-001',
    classId: 'c1',
    section: 'A',
    email: 'thomas.lemaire@ecole.fr',
    parentName: 'Sophie Lemaire',
    parentPhone: '06 11 22 33 44',
    address: '12 Rue de la Paix, Paris',
    status: 'Active',
    gender: 'M',
    admissionDate: '2025-09-01',
  },
  {
    id: 'st2',
    firstName: 'Léa',
    lastName: 'Martin',
    rollNumber: '2026-002',
    classId: 'c1',
    section: 'A',
    email: 'lea.martin@ecole.fr',
    parentName: 'Pierre Martin',
    parentPhone: '06 22 33 44 55',
    address: '45 Avenue de la République, Paris',
    status: 'Active',
    gender: 'F',
    admissionDate: '2025-09-01',
  },
  {
    id: 'st3',
    firstName: 'Lucas',
    lastName: 'Bernard',
    rollNumber: '2026-003',
    classId: 'c1',
    section: 'A',
    email: 'lucas.bernard@ecole.fr',
    parentName: 'Julie Bernard',
    parentPhone: '06 33 44 55 66',
    address: '8 Boulevard Haussmann, Paris',
    status: 'Active',
    gender: 'M',
    admissionDate: '2025-09-01',
  },
  {
    id: 'st4',
    firstName: 'Emma',
    lastName: 'Petit',
    rollNumber: '2026-004',
    classId: 'c2',
    section: 'B',
    email: 'emma.petit@ecole.fr',
    parentName: 'Marc Petit',
    parentPhone: '06 44 55 66 77',
    address: '23 Rue des Lilas, Lyon',
    status: 'Active',
    gender: 'F',
    admissionDate: '2025-09-01',
  },
  {
    id: 'st5',
    firstName: 'Hugo',
    lastName: 'Dubois',
    rollNumber: '2026-005',
    classId: 'c2',
    section: 'B',
    email: 'hugo.dubois@ecole.fr',
    parentName: 'Nathalie Dubois',
    parentPhone: '06 55 66 77 88',
    address: '56 Rue du Commerce, Lyon',
    status: 'Active',
    gender: 'M',
    admissionDate: '2025-09-01',
  },
  {
    id: 'st6',
    firstName: 'Inès',
    lastName: 'Richard',
    rollNumber: '2026-006',
    classId: 'c3',
    section: 'S1',
    email: 'ines.richard@ecole.fr',
    parentName: 'Christophe Richard',
    parentPhone: '06 66 77 88 99',
    address: '14 Allée des Cerisiers, Marseille',
    status: 'Active',
    gender: 'F',
    admissionDate: '2024-09-01',
  },
  {
    id: 'st7',
    firstName: 'Nathan',
    lastName: 'Moreau',
    rollNumber: '2026-007',
    classId: 'c3',
    section: 'S1',
    email: 'nathan.moreau@ecole.fr',
    parentName: 'Valérie Moreau',
    parentPhone: '06 77 88 99 00',
    address: '89 Rue de Rome, Marseille',
    status: 'Active',
    gender: 'M',
    admissionDate: '2024-09-01',
  },
  {
    id: 'st8',
    firstName: 'Chloé',
    lastName: 'Simon',
    rollNumber: '2026-008',
    classId: 'c3',
    section: 'S1',
    email: 'chloe.simon@ecole.fr',
    parentName: 'Eric Simon',
    parentPhone: '06 88 99 00 11',
    address: '32 Boulevard Michelet, Marseille',
    status: 'Inactive',
    gender: 'F',
    admissionDate: '2024-09-01',
  }
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  {
    id: 'c1_2026-06-29',
    classId: 'c1',
    date: '2026-06-29',
    records: {
      st1: 'Present',
      st2: 'Present',
      st3: 'Absent',
    }
  },
  {
    id: 'c2_2026-06-29',
    classId: 'c2',
    date: '2026-06-29',
    records: {
      st4: 'Present',
      st5: 'Late',
    }
  },
  {
    id: 'c3_2026-06-29',
    classId: 'c3',
    date: '2026-06-29',
    records: {
      st6: 'Present',
      st7: 'Present',
      st8: 'Absent',
    }
  }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: 'sch1', classId: 'c1', day: 'Lundi', period: '08:30 - 09:30', subjectId: 's_math', teacherId: 't1', room: 'Salle 101' },
  { id: 'sch2', classId: 'c1', day: 'Lundi', period: '09:30 - 10:30', subjectId: 's_fran', teacherId: 't3', room: 'Salle 101' },
  { id: 'sch3', classId: 'c1', day: 'Mardi', period: '10:45 - 11:45', subjectId: 's_phys', teacherId: 't2', room: 'Salle 101' },
  { id: 'sch4', classId: 'c1', day: 'Mercredi', period: '08:30 - 09:30', subjectId: 's_ang', teacherId: 't4', room: 'Salle 101' },
  { id: 'sch5', classId: 'c2', day: 'Lundi', period: '08:30 - 09:30', subjectId: 's_fran', teacherId: 't3', room: 'Salle 102' },
  { id: 'sch6', classId: 'c2', day: 'Mardi', period: '09:30 - 10:30', subjectId: 's_math', teacherId: 't1', room: 'Salle 102' },
  { id: 'sch7', classId: 'c3', day: 'Lundi', period: '14:00 - 15:30', subjectId: 's_phys', teacherId: 't2', room: 'Labo Physique' },
  { id: 'sch8', classId: 'c3', day: 'Jeudi', period: '08:30 - 10:30', subjectId: 's_math', teacherId: 't1', room: 'Labo Physique' },
];

export const INITIAL_EXAMS: Exam[] = [
  { id: 'e1', name: 'Contrôle Mensuel - Algèbre', date: '2026-06-15', classId: 'c1', subjectId: 's_math', maxMarks: 20 },
  { id: 'e2', name: 'Evaluation écrite - Grammaire', date: '2026-06-18', classId: 'c1', subjectId: 's_fran', maxMarks: 20 },
  { id: 'e3', name: 'TP - Electricité', date: '2026-06-20', classId: 'c3', subjectId: 's_phys', maxMarks: 20 },
  { id: 'e4', name: 'Examen Blanc - Anglais', date: '2026-06-25', classId: 'c3', subjectId: 's_ang', maxMarks: 100 },
];

export const INITIAL_GRADES: Grade[] = [
  { id: 'e1_st1', examId: 'e1', studentId: 'st1', marksObtained: 16.5, remarks: 'Excellent travail, très bonne compréhension' },
  { id: 'e1_st2', examId: 'e1', studentId: 'st2', marksObtained: 14, remarks: 'Bon travail, continue ainsi' },
  { id: 'e1_st3', examId: 'e1', studentId: 'st3', marksObtained: 9.5, remarks: 'Insuffisant, revoir les formules de base' },
  { id: 'e2_st1', examId: 'e2', studentId: 'st1', marksObtained: 15, remarks: 'Bonne expression écrite' },
  { id: 'e2_st2', examId: 'e2', studentId: 'st2', marksObtained: 17, remarks: 'Très bon style et orthographe impeccable' },
  { id: 'e3_st6', examId: 'e3', studentId: 'st6', marksObtained: 18, remarks: 'Excellente manipulation pratique' },
  { id: 'e3_st7', examId: 'e3', studentId: 'st7', marksObtained: 13, remarks: 'Sérieux mais manque de rigueur' },
  { id: 'e4_st6', examId: 'e4', studentId: 'st6', marksObtained: 85, remarks: 'Fluide à l\'écrit' },
  { id: 'e4_st7', examId: 'e4', studentId: 'st7', marksObtained: 72, remarks: 'Niveau satisfaisant' },
];

export const INITIAL_INVOICES: Invoice[] = [
  { id: 'inv1', studentId: 'st1', amount: 450, paidAmount: 450, date: '2026-06-01', dueDate: '2026-06-15', status: 'Paid', type: 'Scolarité' },
  { id: 'inv2', studentId: 'st2', amount: 450, paidAmount: 200, date: '2026-06-01', dueDate: '2026-06-15', status: 'Partial', type: 'Scolarité' },
  { id: 'inv3', studentId: 'st3', amount: 450, paidAmount: 0, date: '2026-06-01', dueDate: '2026-06-15', status: 'Unpaid', type: 'Scolarité' },
  { id: 'inv4', studentId: 'st4', amount: 400, paidAmount: 400, date: '2026-06-01', dueDate: '2026-06-15', status: 'Paid', type: 'Scolarité' },
  { id: 'inv5', studentId: 'st5', amount: 400, paidAmount: 400, date: '2026-06-01', dueDate: '2026-06-15', status: 'Paid', type: 'Scolarité' },
  { id: 'inv6', studentId: 'st6', amount: 550, paidAmount: 550, date: '2026-06-01', dueDate: '2026-06-15', status: 'Paid', type: 'Scolarité' },
  { id: 'inv7', studentId: 'st7', amount: 550, paidAmount: 0, date: '2026-06-01', dueDate: '2026-06-15', status: 'Unpaid', type: 'Scolarité' },
  { id: 'inv8', studentId: 'st1', amount: 50, paidAmount: 50, date: '2026-06-10', dueDate: '2026-06-25', status: 'Paid', type: 'Transport' },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    title: 'Fermeture Estivale et Réinscription',
    content: 'Les réinscriptions pour l\'année scolaire 2026-2027 débutent le 1er juillet. Le secrétariat fermera ses portes le 25 juillet.',
    date: '2026-06-28',
    category: 'General',
    author: 'Direction Scolaire',
    pinned: true,
  },
  {
    id: 'ann2',
    title: 'Calendrier des Examens de Fin d\'Année',
    content: 'Les examens finaux pour les classes de Terminale se dérouleront du 22 au 26 juin. Veuillez consulter le planning détaillé.',
    date: '2026-06-10',
    category: 'Examens',
    author: 'Bureau d\'études scolaires',
    pinned: false,
  },
  {
    id: 'ann3',
    title: 'Fête de l\'École 2026',
    content: 'La fête de fin d\'année se tiendra dans la cour d\'honneur le samedi 4 juillet à partir de 14h00. Spectacles et kermesse au programme !',
    date: '2026-06-25',
    category: 'Evenements',
    author: 'Comité des Fêtes',
    pinned: false,
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf1',
    firstName: 'Amélie',
    lastName: 'Dubois',
    email: 'a.dubois@ecole.fr',
    phone: '06 14 25 36 47',
    role: 'Administrateur',
    status: 'Active',
    salary: 3200,
    qualification: 'Master en Management Scolaire',
    joiningDate: '2019-03-12',
  },
  {
    id: 'stf2',
    firstName: 'Marc',
    lastName: 'Lefebvre',
    email: 'm.lefebvre@ecole.fr',
    phone: '06 88 77 66 55',
    role: 'Comptable',
    status: 'Active',
    salary: 2900,
    qualification: 'Diplôme Supérieur de Comptabilité',
    joiningDate: '2021-11-01',
  },
  {
    id: 'stf3',
    firstName: 'Clara',
    lastName: 'Rousseau',
    email: 'c.rousseau@ecole.fr',
    phone: '07 44 55 11 22',
    role: 'Secrétaire',
    status: 'Active',
    salary: 2100,
    qualification: 'BTS Support à l\'Action Managériale',
    joiningDate: '2023-05-10',
  },
  {
    id: 'stf4',
    firstName: 'Thierry',
    lastName: 'Morel',
    email: 't.morel@ecole.fr',
    phone: '06 33 22 11 00',
    role: 'Bibliothécaire',
    status: 'Active',
    salary: 2200,
    qualification: 'Licence Métiers du Livre',
    joiningDate: '2020-09-01',
  },
  {
    id: 'stf5',
    firstName: 'Bernard',
    lastName: 'Reno',
    email: 'b.reno@ecole.fr',
    phone: '07 12 99 88 77',
    role: 'Directeur',
    status: 'Active',
    salary: 4500,
    qualification: 'Doctorat en Sciences de l\'Éducation',
    joiningDate: '2015-09-01',
  }
];

export const INITIAL_STAFF_LEAVES: StaffLeaveRequest[] = [
  {
    id: 'lv1',
    staffId: 'stf1',
    leaveType: 'Annuel',
    startDate: '2026-07-10',
    endDate: '2026-07-24',
    reason: 'Congés d\'été annuels en famille',
    status: 'Approved',
    requestDate: '2026-06-15',
  },
  {
    id: 'lv2',
    staffId: 'stf3',
    leaveType: 'Maladie',
    startDate: '2026-06-25',
    endDate: '2026-06-27',
    reason: 'Rendez-vous médical d\'urgence - Grippe saisonnière',
    status: 'Approved',
    requestDate: '2026-06-24',
  },
  {
    id: 'lv3',
    staffId: 'stf2',
    leaveType: 'Annuel',
    startDate: '2026-07-15',
    endDate: '2026-07-20',
    reason: 'Voyage personnel programmé',
    status: 'Pending',
    requestDate: '2026-06-28',
  },
  {
    id: 'lv4',
    staffId: 'stf4',
    leaveType: 'Sans solde',
    startDate: '2026-09-10',
    endDate: '2026-09-15',
    reason: 'Participation à un salon littéraire international',
    status: 'Pending',
    requestDate: '2026-06-29',
  }
];

export const INITIAL_STAFF_ATTENDANCE: StaffAttendanceType[] = [
  { id: '2026-06-29_stf1', staffId: 'stf1', date: '2026-06-29', status: 'Present', checkInTime: '08:15', checkOutTime: '17:30' },
  { id: '2026-06-29_stf2', staffId: 'stf2', date: '2026-06-29', status: 'Present', checkInTime: '08:30', checkOutTime: '17:45' },
  { id: '2026-06-29_stf3', staffId: 'stf3', date: '2026-06-29', status: 'Present', checkInTime: '08:05', checkOutTime: '16:00' },
  { id: '2026-06-29_stf4', staffId: 'stf4', date: '2026-06-29', status: 'Present', checkInTime: '08:45', checkOutTime: '18:00' },
  { id: '2026-06-29_stf5', staffId: 'stf5', date: '2026-06-29', status: 'Present', checkInTime: '07:50', checkOutTime: '19:00' },
];

export const INITIAL_STAFF_PAYROLL: StaffPayroll[] = [
  { id: 'pr1', staffId: 'stf1', month: 'Juin 2026', baseSalary: 3200, allowance: 250, deduction: 120, netSalary: 3330, status: 'Paid', paymentDate: '2026-06-28' },
  { id: 'pr2', staffId: 'stf2', month: 'Juin 2026', baseSalary: 2900, allowance: 150, deduction: 100, netSalary: 2950, status: 'Paid', paymentDate: '2026-06-28' },
  { id: 'pr3', staffId: 'stf3', month: 'Juin 2026', baseSalary: 2100, allowance: 100, deduction: 80, netSalary: 2120, status: 'Paid', paymentDate: '2026-06-28' },
  { id: 'pr4', staffId: 'stf4', month: 'Juin 2026', baseSalary: 2200, allowance: 120, deduction: 90, netSalary: 2230, status: 'Paid', paymentDate: '2026-06-28' },
  { id: 'pr5', staffId: 'stf5', month: 'Juin 2026', baseSalary: 4500, allowance: 400, deduction: 200, netSalary: 4700, status: 'Paid', paymentDate: '2026-06-28' },
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  { id: 'inq1', studentName: 'Jean-Pierre Bemba', phone: '0812345678', email: 'jp.bemba@gmail.com', message: 'Je souhaite m\'inscrire en classe de Terminale pour l\'option Scientifique.', date: '2026-06-25', classId: 'c3', status: 'Pending' },
  { id: 'inq2', studentName: 'Sarah Tshisekedi', phone: '0998765432', email: 'sarah.tsh@yahoo.fr', message: 'Demande d\'inscription en classe de 6ème pour l\'année scolaire prochaine.', date: '2026-06-28', classId: 'c1', status: 'Admitted' },
  { id: 'inq3', studentName: 'Kabange Ngoie', phone: '0854321098', email: 'kabange@outlook.com', message: 'Inscription en classe de 5ème.', date: '2026-06-29', classId: 'c2', status: 'Pending' }
];

export const INITIAL_BOOKS: Book[] = [
  { id: 'b1', title: 'Physique de Feynman', author: 'Richard Feynman', isbn: '978-2100522105', category: 'Physique', totalCopies: 5, availableCopies: 5 },
  { id: 'b2', title: 'Mathématiques Algèbre 6ème', author: 'Hachette Éducation', isbn: '978-2011254321', category: 'Mathématiques', totalCopies: 15, availableCopies: 12 },
  { id: 'b3', title: 'Les Misérables', author: 'Victor Hugo', isbn: '978-2253006121', category: 'Littérature', totalCopies: 10, availableCopies: 9 },
  { id: 'b4', title: 'Grammaire Française Pratique', author: 'Maurice Grevisse', isbn: '978-2801116543', category: 'Français', totalCopies: 8, availableCopies: 8 }
];

export const INITIAL_STUDENT_LEAVES: StudentLeave[] = [
  { id: 'sl1', studentId: 'st1', startDate: '2026-07-02', endDate: '2026-07-05', reason: 'Voyage familial urgent de fin d\'année scolaire', status: 'Pending', requestDate: '2026-06-28' },
  { id: 'sl2', studentId: 'st3', startDate: '2026-06-20', endDate: '2026-06-23', reason: 'Indisposition de santé (certificat médical fourni)', status: 'Approved', requestDate: '2026-06-19' },
  { id: 'sl3', studentId: 'st4', startDate: '2026-07-01', endDate: '2026-07-02', reason: 'Rendez-vous dentaire spécialisé', status: 'Approved', requestDate: '2026-06-29' }
];

export const INITIAL_SCHOOLS: SchoolProfile[] = [
  { id: 'sch_default', name: 'Smart School Management', phone: '555-4438', email: 'direction@smartschool.edu', address: '443 124 Lakeview Road, Brookfield, New City 458201', status: 'Active' },
  { id: 'sch_public', name: 'Delhi Public School', phone: '555-9081', email: 'contact@delhipublic.edu', address: 'Sector 4, Dwarka, New Delhi', status: 'Active' },
  { id: 'sch_burma', name: 'Burma Public School', phone: '555-3209', email: 'info@burmaschool.mm', address: 'Pyay Road, Yangon, Myanmar', status: 'Active' }
];

export const INITIAL_DISCIPLINARY_INCIDENTS: DisciplinaryIncident[] = [
  {
    id: 'disc1',
    studentId: 'st1', // Thomas Lemaire
    incidentDate: '2026-06-15',
    severity: 'Moyenne',
    infractionType: 'Retard répété',
    description: 'Arrivées tardives répétées en cours de mathématiques (plus de 4 fois cette semaine sans motif valable).',
    reportedBy: 'Jean Dupont (Professeur)',
    correctiveAction: 'Heure de colle le mercredi après-midi et appel aux parents.',
    actionDate: '2026-06-16',
    status: 'Résolu'
  },
  {
    id: 'disc2',
    studentId: 'st3', // Let's check other student IDs later, but st3 is valid in INITIAL_STUDENTS
    incidentDate: '2026-06-24',
    severity: 'Grave',
    infractionType: 'Tricherie',
    description: 'Utilisation d\'un téléphone portable pour consulter des fiches d\'aide durant l\'examen d\'anglais du second trimestre.',
    reportedBy: 'William Shakespeare (Professeur)',
    correctiveAction: 'Note de 0/20 à l\'épreuve, avertissement de discipline officiel consigné dans le dossier scolaire.',
    actionDate: '2026-06-25',
    status: 'Résolu'
  },
  {
    id: 'disc3',
    studentId: 'st2', // Léa Martin
    incidentDate: '2026-06-28',
    severity: 'Faible',
    infractionType: 'Non-respect du règlement',
    description: 'Utilisation d\'écouteurs de musique pendant les heures d\'étude surveillée malgré plusieurs avertissements verbaux.',
    reportedBy: 'Marie Curie (Enseignante)',
    correctiveAction: 'Confiscation de l\'appareil jusqu\'à la fin de la journée scolaire.',
    actionDate: '2026-06-28',
    status: 'Résolu'
  },
  {
    id: 'disc4',
    studentId: 'st1', // Thomas Lemaire
    incidentDate: '2026-06-29',
    severity: 'Grave',
    infractionType: 'Bagarre',
    description: 'Altercation physique violente dans la cour de récréation durant la pause de midi avec un élève d\'une autre classe.',
    reportedBy: 'Directeur Académique',
    correctiveAction: 'Exclusion temporaire de 3 jours avec convocation immédiate des tuteurs légaux pour conseil de discipline.',
    actionDate: '2026-06-29',
    status: 'En cours'
  }
];

export const INITIAL_TRANSPORT_ROUTES = [
  { id: 'tr1', routeName: 'Ligne A - Centre Ville', startPoint: 'Gare Centrale', endPoint: 'Campus Principal', vehicleType: 'Bus', vehicleRegistration: 'AA-123-BB', capacity: 30 },
  { id: 'tr2', routeName: 'Ligne B - Banlieue Sud', startPoint: 'Quartier Sud', endPoint: 'Campus Principal', vehicleType: 'Minibus', vehicleRegistration: 'CC-987-DD', capacity: 15 },
];

export const INITIAL_DRIVERS = [
  { id: 'd1', firstName: 'Michel', lastName: 'Blanc', phone: '06 12 34 56 78', licenseNumber: 'PERMIS-123456', routeId: 'tr1' },
  { id: 'd2', firstName: 'Jean', lastName: 'Gabin', phone: '07 98 76 54 32', licenseNumber: 'PERMIS-987654', routeId: 'tr2' },
];

export const INITIAL_TRANSPORT_STUDENTS = [
  { id: 'ts1', studentId: 'st1', routeId: 'tr1', pickupPoint: 'Arrêt de Mairie', fee: 50 },
  { id: 'ts2', studentId: 'st2', routeId: 'tr1', pickupPoint: 'Arrêt du Parc', fee: 50 },
  { id: 'ts3', studentId: 'st3', routeId: 'tr2', pickupPoint: 'Sud - Place', fee: 35 },
];


