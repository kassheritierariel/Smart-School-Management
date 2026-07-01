export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  classId: string;
  section: string;
  email: string;
  parentName: string;
  parentPhone: string;
  address: string;
  status: 'Active' | 'Inactive';
  photoUrl?: string;
  gender: 'M' | 'F' | 'Other';
  admissionDate: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjects: string[];
  status: 'Active' | 'Inactive';
  salary: number;
  qualification: string;
  joiningDate: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  section: string;
  roomNumber: string;
  capacity: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId: string;
}

export interface Attendance {
  id: string; // classId_date
  classId: string;
  date: string; // YYYY-MM-DD
  records: { [studentId: string]: 'Present' | 'Absent' | 'Late' };
}

export interface ScheduleItem {
  id: string;
  classId: string;
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  period: string; // e.g. "08:30 - 09:30"
  subjectId: string;
  teacherId: string;
  room: string;
}

export interface Exam {
  id: string;
  name: string;
  date: string;
  classId: string;
  subjectId: string;
  maxMarks: number;
}

export interface Grade {
  id: string; // examId_studentId
  examId: string;
  studentId: string;
  marksObtained: number;
  remarks: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  amount: number;
  paidAmount: number;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Partial';
  type: 'Scolarité' | 'Examen' | 'Transport' | 'Bibliothèque' | 'Activités';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Academique' | 'General' | 'Examens' | 'Evenements';
  author: string;
  pinned: boolean;
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Enseignant' | 'Administrateur' | 'Comptable' | 'Secrétaire' | 'Bibliothécaire' | 'Directeur';
  status: 'Active' | 'Inactive';
  salary: number;
  qualification: string;
  joiningDate: string;
}

export interface StaffLeaveRequest {
  id: string;
  staffId: string;
  leaveType: 'Maladie' | 'Maternité' | 'Annuel' | 'Sans solde' | 'Autre';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
}

export interface StaffAttendance {
  id: string; // date_staffId
  staffId: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  checkInTime?: string;
  checkOutTime?: string;
}

export interface StaffPayroll {
  id: string;
  staffId: string;
  month: string; // e.g. "Juin 2026"
  baseSalary: number;
  allowance: number;
  deduction: number;
  netSalary: number;
  status: 'Paid' | 'Unpaid' | 'Processing';
  paymentDate?: string;
}

export interface Inquiry {
  id: string;
  studentName: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  classId: string;
  status: 'Pending' | 'Admitted' | 'Rejected';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
}

export interface StudentLeave {
  id: string;
  studentId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
}

export interface SchoolProfile {
  id: string;
  name: string;
  phone: string;
  whatsappNumber?: string;
  email: string;
  address: string;
  status: 'Active' | 'Inactive';
  logoUrl?: string;
  exchangeRate?: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string; // 'teacher', 'parent', 'student', 'admin', etc.
  receiverId: string;
  receiverName: string;
  receiverRole: string;
  subject: string;
  content: string;
  date: string;
  isRead: boolean;
  schoolId?: string;
}

export interface DisciplinaryIncident {
  id: string;
  studentId: string;
  incidentDate: string; // YYYY-MM-DD
  severity: 'Faible' | 'Moyenne' | 'Grave';
  infractionType: 'Retard répété' | 'Absence injustifiée' | 'Bagarre' | 'Tricherie' | 'Non-respect du règlement' | 'Insolence' | 'Vandalisme' | 'Autre';
  description: string;
  reportedBy: string; // Name of staff or teacher
  correctiveAction: string; // Correction measure
  actionDate?: string;
  status: 'Signalé' | 'En cours' | 'Résolu' | 'Classé sans suite';
}

export interface TransportRoute {
  id: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  vehicleType: string;
  vehicleRegistration: string;
  capacity: number;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  routeId?: string;
}

export interface TransportStudent {
  id: string;
  studentId: string;
  routeId: string;
  pickupPoint: string;
  fee: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string; // 'Fournitures', 'Livres', 'Uniformes', 'Équipement', etc.
  quantity: number;
  unit: string; // 'pièce', 'carton', 'rame', etc.
  lowStockThreshold: number;
  description?: string;
  schoolId: string; // For multi-school management
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  userId: string;
  userName: string;
  reason?: string;
}


export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'OTHER';
  entityType: string;
  entityId?: string;
  details: string;
  timestamp: string;
}

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  photoUrl?: string;
  department?: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
}
