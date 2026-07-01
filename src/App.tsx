import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Calendar, 
  CheckSquare, 
  ClipboardList, 
  Receipt, 
  Bell, 
  HelpCircle, 
  Sparkles,
  School,
  RefreshCw,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Briefcase,
  BookOpen,
  Layers,
  Bookmark,
  ShieldAlert,
  Scale,
  MessageCircle,
  Package,
  Activity,
  User
} from 'lucide-react';

import { 
  Student, 
  Teacher, 
  SchoolClass, 
  Subject, 
  Attendance, 
  ScheduleItem, 
  Exam, 
  Grade, 
  Invoice, 
  Announcement,
  StaffMember,
  StaffLeaveRequest,
  StaffAttendance as StaffAttendanceType,
  StaffPayroll,
  Inquiry,
  Book,
  StudentLeave,
  SchoolProfile,
  DisciplinaryIncident,
  TransportRoute,
  Driver,
  TransportStudent,
  Message,
  InventoryItem,
  InventoryMovement
} from './types';

import { 
  INITIAL_CLASSES, 
  INITIAL_TEACHERS, 
  INITIAL_SUBJECTS, 
  INITIAL_STUDENTS, 
  INITIAL_ATTENDANCE, 
  INITIAL_SCHEDULE, 
  INITIAL_EXAMS, 
  INITIAL_GRADES, 
  INITIAL_INVOICES, 
  INITIAL_ANNOUNCEMENTS,
  INITIAL_STAFF,
  INITIAL_STAFF_LEAVES,
  INITIAL_STAFF_ATTENDANCE,
  INITIAL_STAFF_PAYROLL,
  INITIAL_INQUIRIES,
  INITIAL_BOOKS,
  INITIAL_STUDENT_LEAVES,
  INITIAL_SCHOOLS,
  INITIAL_DISCIPLINARY_INCIDENTS,
  INITIAL_TRANSPORT_ROUTES,
  INITIAL_DRIVERS,
  INITIAL_TRANSPORT_STUDENTS
} from './initialData';

// Modular views imports
import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import TeachersView from './components/TeachersView';
import AttendanceView from './components/AttendanceView';
import TimetableView from './components/TimetableView';
import ExamsView from './components/ExamsView';
import FinancialsView from './components/FinancialsView';
import NoticeBoardView from './components/NoticeBoardView';
import StaffDashboardView from './components/StaffDashboardView';
import LoginView from './components/LoginView';
import InquiriesView from './components/InquiriesView';
import SchoolsView from './components/SchoolsView';
import LibraryView from './components/LibraryView';
import StudentLeavesView from './components/StudentLeavesView';
import DisciplineView from './components/DisciplineView';
import TransportView from './components/TransportView';
import NotificationsDropdown from './components/NotificationsDropdown';
import ExamAnalyticsView from './components/ExamAnalyticsView';
import RoleManagementView from './components/RoleManagementView';
import MessagingView from './components/MessagingView';
import LandingPageView from './components/LandingPageView';
import InventoryView from './components/InventoryView';
import AuditLogView from './components/AuditLogView';
import UserProfileView from './components/UserProfileView';

export default function App() {
  const [showLanding, setShowLanding] = useState(() => !localStorage.getItem('sms_current_user'));
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // --- States with Local Storage Loading ---
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffLeaves, setStaffLeaves] = useState<StaffLeaveRequest[]>([]);
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceType[]>([]);
  const [staffPayroll, setStaffPayroll] = useState<StaffPayroll[]>([]);

  // New modules states
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [studentLeaves, setStudentLeaves] = useState<StudentLeave[]>([]);
  const [schools, setSchools] = useState<SchoolProfile[]>([]);
  const [disciplinaryIncidents, setDisciplinaryIncidents] = useState<DisciplinaryIncident[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([]);

  
  // Transport module states
  const [transportRoutes, setTransportRoutes] = useState<TransportRoute[]>([]);
  const [transportDrivers, setTransportDrivers] = useState<Driver[]>([]);
  const [transportStudents, setTransportStudents] = useState<TransportStudent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  
  const [activeSchoolId, setActiveSchoolId] = useState<string>('');
  const [activeSession, setActiveSession] = useState<string>('2026-2027');
  const [user, setUser] = useState<{ id?: string, role: string, name: string, email: string, phone?: string, department?: string } | null>(() => {
    const stored = localStorage.getItem('sms_current_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Helper to save to local storage on any state change
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const logAction = (actionType: string, entityType: string, details: string, entityId?: string) => {
    if (!user) return;
    const newLog = {
      id: `log_${Date.now()}`,
      userId: user.id || user.email,
      userName: user.name,
      userRole: user.role,
      actionType,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      saveState('sms_audit_logs', updated);
      return updated;
    });
  };

  // Load state from local storage or set defaults on mount
  useEffect(() => {
    const loadState = (key: string, defaultData: any) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(`Error loading state for key ${key}:`, e);
        }
      }
      return defaultData;
    };

    setClasses(loadState('sms_classes', INITIAL_CLASSES));
    setTeachers(loadState('sms_teachers', INITIAL_TEACHERS));
    setSubjects(loadState('sms_subjects', INITIAL_SUBJECTS));
    setStudents(loadState('sms_students', INITIAL_STUDENTS));
    setAttendances(loadState('sms_attendances', INITIAL_ATTENDANCE));
    setSchedules(loadState('sms_schedules', INITIAL_SCHEDULE));
    setExams(loadState('sms_exams', INITIAL_EXAMS));
    setGrades(loadState('sms_grades', INITIAL_GRADES));
    setInvoices(loadState('sms_invoices', INITIAL_INVOICES));
    setAnnouncements(loadState('sms_announcements', INITIAL_ANNOUNCEMENTS));
    setStaff(loadState('sms_staff', INITIAL_STAFF));
    setStaffLeaves(loadState('sms_staff_leaves', INITIAL_STAFF_LEAVES));
    setStaffAttendance(loadState('sms_staff_attendance', INITIAL_STAFF_ATTENDANCE));
    setStaffPayroll(loadState('sms_staff_payroll', INITIAL_STAFF_PAYROLL));

    // New modules
    setInquiries(loadState('sms_inquiries', INITIAL_INQUIRIES));
    setBooks(loadState('sms_books', INITIAL_BOOKS));
    setStudentLeaves(loadState('sms_student_leaves', INITIAL_STUDENT_LEAVES));
    setDisciplinaryIncidents(loadState('sms_disciplinary_incidents', INITIAL_DISCIPLINARY_INCIDENTS));
    setTransportRoutes(loadState('sms_transport_routes', INITIAL_TRANSPORT_ROUTES));
    setTransportDrivers(loadState('sms_transport_drivers', INITIAL_DRIVERS));
    setTransportStudents(loadState('sms_transport_students', INITIAL_TRANSPORT_STUDENTS));
    setMessages(loadState('sms_messages', []));
    setInventoryItems(loadState('sms_inventory_items', []));
    setInventoryMovements(loadState('sms_inventory_movements', []));
    setAuditLogs(loadState('sms_audit_logs', []));
    
    const loadedSchools = loadState('sms_schools', INITIAL_SCHOOLS);
    setSchools(loadedSchools);
    setActiveSchoolId(loadState('sms_active_school_id', loadedSchools[0]?.id || ''));
    setActiveSession(loadState('sms_active_session', '2026-2027'));
  }, []);

  // --- Reset All Demo Data callback ---
  const handleResetData = () => {
    if (confirm("Réinitialiser toutes les données de l'application à leur état de démo par défaut ? Vos modifications locales seront perdues.")) {
      localStorage.clear();
      setClasses(INITIAL_CLASSES);
      setTeachers(INITIAL_TEACHERS);
      setSubjects(INITIAL_SUBJECTS);
      setStudents(INITIAL_STUDENTS);
      setAttendances(INITIAL_ATTENDANCE);
      setSchedules(INITIAL_SCHEDULE);
      setExams(INITIAL_EXAMS);
      setGrades(INITIAL_GRADES);
      setInvoices(INITIAL_INVOICES);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setStaff(INITIAL_STAFF);
      setStaffLeaves(INITIAL_STAFF_LEAVES);
      setStaffAttendance(INITIAL_STAFF_ATTENDANCE);
      setStaffPayroll(INITIAL_STAFF_PAYROLL);

      // Reset new modules
      setInquiries(INITIAL_INQUIRIES);
      setBooks(INITIAL_BOOKS);
      setStudentLeaves(INITIAL_STUDENT_LEAVES);
      setDisciplinaryIncidents(INITIAL_DISCIPLINARY_INCIDENTS);
      setTransportRoutes(INITIAL_TRANSPORT_ROUTES);
      setTransportDrivers(INITIAL_DRIVERS);
      setTransportStudents(INITIAL_TRANSPORT_STUDENTS);
      setInventoryItems([]);
      setInventoryMovements([]);
      
      setSchools(INITIAL_SCHOOLS);
      setActiveSchoolId(INITIAL_SCHOOLS[0]?.id || '');
      setActiveSession('2026-2027');
      setUser(null);

      alert("L'application a été réinitialisée avec les données de démonstration.");
      setActiveTab('dashboard');
    }
  };

  // --- Handlers: Students ---
  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    const studentWithId: Student = {
      ...newStudent,
      id: `st_${Date.now()}`
    };
    const updated = [studentWithId, ...students];
    setStudents(updated);
    saveState('sms_students', updated);
    logAction('CREATE', 'STUDENT', `Ajout de l'élève ${studentWithId.firstName} ${studentWithId.lastName}`, studentWithId.id);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    saveState('sms_students', updated);
    logAction('UPDATE', 'STUDENT', `Mise à jour de l'élève ID ${updatedStudent.id}`, updatedStudent.id);
  };

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    saveState('sms_students', updated);
    logAction('DELETE', 'STUDENT', `Suppression de l'élève ID ${id}`, id);
  };

  // --- Handlers: Teachers ---
  const handleAddTeacher = (newTeacher: Omit<Teacher, 'id'>) => {
    const teacherWithId: Teacher = {
      ...newTeacher,
      id: `t_${Date.now()}`
    };
    const updated = [teacherWithId, ...teachers];
    setTeachers(updated);
    saveState('sms_teachers', updated);
  };

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    const updated = teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t);
    setTeachers(updated);
    saveState('sms_teachers', updated);
  };

  const handleDeleteTeacher = (id: string) => {
    const updated = teachers.filter(t => t.id !== id);
    setTeachers(updated);
    saveState('sms_teachers', updated);
  };

  // --- Handlers: Attendance ---
  const handleSaveAttendance = (newAttendance: Attendance) => {
    const exists = attendances.some(att => att.id === newAttendance.id);
    let updated: Attendance[];
    if (exists) {
      updated = attendances.map(att => att.id === newAttendance.id ? newAttendance : att);
    } else {
      updated = [...attendances, newAttendance];
    }
    setAttendances(updated);
    saveState('sms_attendances', updated);
  };

  // --- Handlers: Schedules ---
  const handleAddScheduleItem = (newSchedule: Omit<ScheduleItem, 'id'>) => {
    const scheduleWithId: ScheduleItem = {
      ...newSchedule,
      id: `sch_${Date.now()}`
    };
    const updated = [...schedules, scheduleWithId];
    setSchedules(updated);
    saveState('sms_schedules', updated);
  };

  const handleDeleteScheduleItem = (id: string) => {
    const updated = schedules.filter(s => s.id !== id);
    setSchedules(updated);
    saveState('sms_schedules', updated);
  };

  // --- Handlers: Exams & Grades ---
  const handleAddExam = (newExam: Omit<Exam, 'id'>) => {
    const examWithId: Exam = {
      ...newExam,
      id: `e_${Date.now()}`
    };
    const updated = [examWithId, ...exams];
    setExams(updated);
    saveState('sms_exams', updated);
  };

  const handleSaveGrades = (examId: string, gradeRecords: { [studentId: string]: { marks: number, remarks: string } }) => {
    // Clear old grades for this exam
    const otherGrades = grades.filter(g => g.examId !== examId);
    
    // Add new ones
    const newGrades: Grade[] = Object.keys(gradeRecords).map(studentId => ({
      id: `${examId}_${studentId}`,
      examId,
      studentId,
      marksObtained: gradeRecords[studentId].marks,
      remarks: gradeRecords[studentId].remarks
    }));

    const updated = [...otherGrades, ...newGrades];
    setGrades(updated);
    saveState('sms_grades', updated);
  };

  const handleDeleteExam = (id: string) => {
    const updatedExams = exams.filter(e => e.id !== id);
    const updatedGrades = grades.filter(g => g.examId !== id);
    
    setExams(updatedExams);
    saveState('sms_exams', updatedExams);

    setGrades(updatedGrades);
    saveState('sms_grades', updatedGrades);
  };

  // --- Handlers: Invoices ---
  const handleAddInvoice = (newInvoice: Omit<Invoice, 'id'>) => {
    const invoiceWithId: Invoice = {
      ...newInvoice,
      id: `inv_${Date.now().toString().slice(-6)}`
    };
    const updated = [invoiceWithId, ...invoices];
    setInvoices(updated);
    saveState('sms_invoices', updated);
  };

  const handleRecordPayment = (invoiceId: string, amount: number) => {
    const updated = invoices.map(inv => {
      if (inv.id === invoiceId) {
        const paidAmount = inv.paidAmount + amount;
        const status = paidAmount >= inv.amount ? 'Paid' : 'Partial';
        return {
          ...inv,
          paidAmount,
          status
        };
      }
      return inv;
    });
    setInvoices(updated);
    saveState('sms_invoices', updated);
  };

  // --- Handlers: Announcements ---
  const handleAddAnnouncement = (newAnn: Partial<Announcement>) => {
    const annWithId: Announcement = {
      id: `ann_${Date.now()}`,
      title: newAnn.title || 'Note',
      content: newAnn.content || '',
      category: newAnn.category || 'General',
      date: newAnn.date || new Date().toISOString().split('T')[0],
      author: newAnn.author || 'Administration',
      pinned: newAnn.pinned || false
    };
    const updated = [annWithId, ...announcements];
    setAnnouncements(updated);
    saveState('sms_announcements', updated);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    saveState('sms_announcements', updated);
  };

  const handleTogglePinAnnouncement = (id: string) => {
    const updated = announcements.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a);
    setAnnouncements(updated);
    saveState('sms_announcements', updated);
  };

  // --- Handlers: Staff & Payroll ---
  const handleAddStaff = (newStaff: Omit<StaffMember, 'id'>) => {
    const staffWithId: StaffMember = {
      ...newStaff,
      id: `stf_${Date.now()}`
    };
    const updated = [staffWithId, ...staff];
    setStaff(updated);
    saveState('sms_staff', updated);
  };

  const handleUpdateStaff = (updatedStaff: StaffMember) => {
    const updated = staff.map(s => s.id === updatedStaff.id ? updatedStaff : s);
    setStaff(updated);
    saveState('sms_staff', updated);
  };

  const handleDeleteStaff = (id: string) => {
    const updated = staff.filter(s => s.id !== id);
    setStaff(updated);
    saveState('sms_staff', updated);
  };

  const handleAddLeave = (newLeave: Omit<StaffLeaveRequest, 'id'>) => {
    const leaveWithId: StaffLeaveRequest = {
      ...newLeave,
      id: `lv_${Date.now()}`
    };
    const updated = [leaveWithId, ...staffLeaves];
    setStaffLeaves(updated);
    saveState('sms_staff_leaves', updated);
  };

  const handleUpdateLeaveStatus = (leaveId: string, status: 'Approved' | 'Rejected') => {
    const updated = staffLeaves.map(l => l.id === leaveId ? { ...l, status } : l);
    setStaffLeaves(updated);
    saveState('sms_staff_leaves', updated);
  };

  const handleSaveStaffAttendance = (date: string, records: { [staffId: string]: StaffAttendanceType['status'] }) => {
    const otherRecords = staffAttendance.filter(a => a.date !== date);
    const newRecords: StaffAttendanceType[] = Object.keys(records).map(staffId => ({
      id: `${date}_${staffId}`,
      staffId,
      date,
      status: records[staffId],
      checkInTime: records[staffId] === 'Present' ? '08:30' : undefined,
      checkOutTime: records[staffId] === 'Present' ? '17:30' : undefined
    }));
    const updated = [...otherRecords, ...newRecords];
    setStaffAttendance(updated);
    saveState('sms_staff_attendance', updated);
  };

  const handleAddPayroll = (newPayroll: Omit<StaffPayroll, 'id'>) => {
    const payrollWithId: StaffPayroll = {
      ...newPayroll,
      id: `pr_${Date.now()}`
    };
    const updated = [payrollWithId, ...staffPayroll];
    setStaffPayroll(updated);
    saveState('sms_staff_payroll', updated);
  };

  const handleUpdatePayrollStatus = (payrollId: string, status: 'Paid' | 'Unpaid') => {
    const updated = staffPayroll.map(p => p.id === payrollId ? { ...p, status } : p);
    setStaffPayroll(updated);
    saveState('sms_staff_payroll', updated);
  };

  // --- Handlers: Login & Session ---
  const handleLogin = (role: string, name: string, email: string, uid?: string) => {
    const userData = { role, name, email, uid };
    setUser(userData);
    localStorage.setItem('sms_current_user', JSON.stringify(userData));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sms_current_user');
    setShowLanding(true);
  };

  const hasAccess = (tab: string) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    
    // Everyone should have access to their profile
    if (tab === 'user_profile') return true;

    switch (user.role) {
      case 'school_admin':
        return ['dashboard', 'students', 'teachers', 'attendance', 'timetable', 'exams', 'exam_analytics', 'notices', 'transport', 'role_management', 'messages', 'inventory'].includes(tab);
      case 'teacher':
        return ['dashboard', 'attendance', 'timetable', 'exams', 'notices', 'messages'].includes(tab);
      case 'accountant':
        return ['dashboard', 'financials', 'notices', 'messages', 'inventory'].includes(tab);
      case 'student':
      case 'parent':
        return ['dashboard', 'attendance', 'timetable', 'exams', 'notices', 'financials', 'library', 'transport', 'messages'].includes(tab);
      case 'receptionist':
        return ['dashboard', 'inquiries', 'students', 'notices', 'transport', 'messages'].includes(tab);
      case 'librarian':
        return ['dashboard', 'library', 'notices', 'messages'].includes(tab);
      default:
        return ['dashboard', 'messages'].includes(tab);
    }
  };

  // --- Handlers: Inquiries ---
  const handleAddInquiry = (newInq: Omit<Inquiry, 'id'>) => {
    const inqWithId: Inquiry = {
      ...newInq,
      id: `inq_${Date.now()}`
    };
    const updated = [inqWithId, ...inquiries];
    setInquiries(updated);
    saveState('sms_inquiries', updated);
  };

  const handleAdmitInquiry = (inquiryId: string) => {
    const target = inquiries.find(i => i.id === inquiryId);
    if (!target) return;

    // Mark as admitted
    const updatedInq = inquiries.map(i => i.id === inquiryId ? { ...i, status: 'Admitted' as const } : i);
    setInquiries(updatedInq);
    saveState('sms_inquiries', updatedInq);

    // Auto convert inquiry to Student in registry!
    const names = target.studentName.trim().split(' ');
    const lastName = names[names.length - 1] || 'Candidat';
    const firstName = names.slice(0, names.length - 1).join(' ') || 'Élève';

    handleAddStudent({
      firstName,
      lastName,
      rollNumber: `MAT-${Date.now().toString().slice(-4)}`,
      email: target.email,
      classId: target.classId,
      gender: 'M',
      section: 'A',
      status: 'Active',
      parentName: 'Tuteur Inscription',
      parentPhone: target.phone,
      address: 'Non renseigné',
      admissionDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleRejectInquiry = (inquiryId: string) => {
    const updated = inquiries.map(i => i.id === inquiryId ? { ...i, status: 'Rejected' as const } : i);
    setInquiries(updated);
    saveState('sms_inquiries', updated);
  };

  const handleDeleteInquiry = (inquiryId: string) => {
    const updated = inquiries.filter(i => i.id !== inquiryId);
    setInquiries(updated);
    saveState('sms_inquiries', updated);
  };

  // --- Handlers: Library / Books ---
  const handleAddBook = (newBook: Omit<Book, 'id'>) => {
    const bookWithId: Book = {
      ...newBook,
      id: `bk_${Date.now()}`
    };
    const updated = [bookWithId, ...books];
    setBooks(updated);
    saveState('sms_books', updated);
  };

  const handleUpdateBookCopies = (id: string, totalCopies: number, availableCopies: number) => {
    const updated = books.map(b => b.id === id ? { ...b, totalCopies, availableCopies } : b);
    setBooks(updated);
    saveState('sms_books', updated);
  };

  const handleDeleteBook = (id: string) => {
    const updated = books.filter(b => b.id !== id);
    setBooks(updated);
    saveState('sms_books', updated);
  };

  // --- Handlers: Student Leaves ---
  const handleAddStudentLeave = (newLeave: Omit<StudentLeave, 'id'>) => {
    const leaveWithId: StudentLeave = {
      ...newLeave,
      id: `slv_${Date.now()}`
    };
    const updated = [leaveWithId, ...studentLeaves];
    setStudentLeaves(updated);
    saveState('sms_student_leaves', updated);
  };

  const handleUpdateStudentLeaveStatus = (id: string, status: 'Approved' | 'Rejected') => {
    const updated = studentLeaves.map(l => l.id === id ? { ...l, status } : l);
    setStudentLeaves(updated);
    saveState('sms_student_leaves', updated);
  };

  const handleDeleteStudentLeave = (id: string) => {
    const updated = studentLeaves.filter(l => l.id !== id);
    setStudentLeaves(updated);
    saveState('sms_student_leaves', updated);
  };

  // --- Handlers: Multi-schools ---
  const handleAddSchool = (newSch: Omit<SchoolProfile, 'id'>) => {
    const schoolWithId: SchoolProfile = {
      ...newSch,
      id: `schp_${Date.now()}`
    };
    const updated = [...schools, schoolWithId];
    setSchools(updated);
    saveState('sms_schools', updated);
  };

  const handleUpdateSchool = (id: string, updates: Partial<SchoolProfile>) => {
    const updated = schools.map(s => s.id === id ? { ...s, ...updates } : s);
    setSchools(updated);
    saveState('sms_schools', updated);
  };

  const handleDeleteSchool = (id: string) => {
    const updated = schools.filter(s => s.id !== id);
    setSchools(updated);
    saveState('sms_schools', updated);
    if (activeSchoolId === id && updated.length > 0) {
      setActiveSchoolId(updated[0].id);
      saveState('sms_active_school_id', updated[0].id);
    }
  };

  const handleSelectSchool = (id: string) => {
    setActiveSchoolId(id);
    saveState('sms_active_school_id', id);
  };

  // --- Handlers: Inventory ---
  const handleAddInventoryItem = (newItem: Omit<InventoryItem, 'id'>) => {
    const itemWithId: InventoryItem = { ...newItem, id: `inv_${Date.now()}` };
    const updated = [...inventoryItems, itemWithId];
    setInventoryItems(updated);
    saveState('sms_inventory_items', updated);
  };

  const handleUpdateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    const updated = inventoryItems.map(item => item.id === id ? { ...item, ...updates } : item);
    setInventoryItems(updated);
    saveState('sms_inventory_items', updated);
  };

  const handleRecordInventoryMovement = (mov: Omit<InventoryMovement, 'id' | 'date' | 'userId' | 'userName'>) => {
    if (!user) return;
    const movementWithId: InventoryMovement = {
      ...mov,
      id: `mov_${Date.now()}`,
      date: new Date().toISOString(),
      userId: 'currentUser', // In a real app use user ID
      userName: user.name
    };
    
    // Update item quantity
    const item = inventoryItems.find(i => i.id === mov.itemId);
    if (!item) return;

    const newQuantity = mov.type === 'IN' ? item.quantity + mov.quantity : item.quantity - mov.quantity;
    handleUpdateInventoryItem(item.id, { quantity: newQuantity });

    const updated = [...inventoryMovements, movementWithId];
    setInventoryMovements(updated);
    saveState('sms_inventory_movements', updated);
  };

  // --- Handlers: Discipline ---
  const handleAddDisciplinaryIncident = (newIncident: Omit<DisciplinaryIncident, 'id'>) => {
    const incidentWithId: DisciplinaryIncident = {
      ...newIncident,
      id: `disc_${Date.now()}`
    };
    const updated = [incidentWithId, ...disciplinaryIncidents];
    setDisciplinaryIncidents(updated);
    saveState('sms_disciplinary_incidents', updated);
  };

  const handleUpdateDisciplinaryIncidentStatus = (
    id: string, 
    status: DisciplinaryIncident['status'], 
    correctiveAction?: string, 
    actionDate?: string
  ) => {
    const updated = disciplinaryIncidents.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          status,
          correctiveAction: correctiveAction !== undefined ? correctiveAction : inc.correctiveAction,
          actionDate: actionDate !== undefined ? actionDate : inc.actionDate
        };
      }
      return inc;
    });
    setDisciplinaryIncidents(updated);
    saveState('sms_disciplinary_incidents', updated);
  };

  const handleDeleteDisciplinaryIncident = (id: string) => {
    const updated = disciplinaryIncidents.filter(inc => inc.id !== id);
    setDisciplinaryIncidents(updated);
    saveState('sms_disciplinary_incidents', updated);
  };

  // --- Handlers: Transport ---
  const handleAddTransportRoute = (newRoute: Omit<TransportRoute, 'id'>) => {
    const routeWithId: TransportRoute = { ...newRoute, id: `tr_${Date.now()}` };
    const updated = [routeWithId, ...transportRoutes];
    setTransportRoutes(updated);
    saveState('sms_transport_routes', updated);
  };

  const handleDeleteTransportRoute = (id: string) => {
    const updated = transportRoutes.filter(r => r.id !== id);
    setTransportRoutes(updated);
    saveState('sms_transport_routes', updated);
    
    // Also remove assigned drivers and students?
    // Let's just remove the association for drivers
    const updatedDrivers = transportDrivers.map(d => d.routeId === id ? { ...d, routeId: undefined } : d);
    setTransportDrivers(updatedDrivers);
    saveState('sms_transport_drivers', updatedDrivers);
    
    // And remove students from route
    const updatedStudents = transportStudents.filter(ts => ts.routeId !== id);
    setTransportStudents(updatedStudents);
    saveState('sms_transport_students', updatedStudents);
  };

  const handleAddDriver = (newDriver: Omit<Driver, 'id'>) => {
    const driverWithId: Driver = { ...newDriver, id: `dr_${Date.now()}` };
    const updated = [driverWithId, ...transportDrivers];
    setTransportDrivers(updated);
    saveState('sms_transport_drivers', updated);
  };

  const handleDeleteDriver = (id: string) => {
    const updated = transportDrivers.filter(d => d.id !== id);
    setTransportDrivers(updated);
    saveState('sms_transport_drivers', updated);
  };

  const handleAssignTransportStudent = (assignment: Omit<TransportStudent, 'id'>) => {
    // Remove if already assigned to another route
    const existingFiltered = transportStudents.filter(ts => ts.studentId !== assignment.studentId);
    const newAssignment: TransportStudent = { ...assignment, id: `ts_${Date.now()}` };
    const updated = [...existingFiltered, newAssignment];
    setTransportStudents(updated);
    saveState('sms_transport_students', updated);
  };

  const handleRemoveTransportStudent = (id: string) => {
    const updated = transportStudents.filter(ts => ts.id !== id);
    setTransportStudents(updated);
    saveState('sms_transport_students', updated);
  };

  const handleSendMessage = (newMessage: Omit<Message, 'id' | 'isRead' | 'date'>) => {
    const msg: Message = {
      ...newMessage,
      id: `msg_${Date.now()}`,
      isRead: false,
      date: new Date().toISOString()
    };
    const updated = [msg, ...messages];
    setMessages(updated);
    saveState('sms_messages', updated);
  };

  const handleMarkMessageRead = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, isRead: true } : m);
    setMessages(updated);
    saveState('sms_messages', updated);
  };

  const unreadMessagesCount = user ? messages.filter(m => m.receiverId === user.email && !m.isRead).length : 0;

  // Switch tabs
  const handleNavigate = (view: string) => {
    setActiveTab(view);
    setIsMobileSidebarOpen(false);
  };

  const currentSchool = schools.find(s => s.id === activeSchoolId) || null;
  const displaySchoolName = currentSchool?.name || "Smart School";

  if (showLanding) {
    return <LandingPageView onGetStarted={() => setShowLanding(false)} currentSchool={currentSchool} />;
  }

  if (!user) {
    return <LoginView onLogin={handleLogin} currentSchool={currentSchool} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 antialiased font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white flex-shrink-0 h-full justify-between">
        <div className="flex flex-col flex-1 py-6 px-4 space-y-7 overflow-y-auto">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2 overflow-hidden">
            {currentSchool?.logoUrl ? (
              <img src={currentSchool.logoUrl} alt="Logo" className="h-10 w-10 object-contain rounded-xl bg-white p-1 shrink-0" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                <School className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-white leading-tight text-sm tracking-tight uppercase truncate" title={displaySchoolName}>
                {displaySchoolName}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5 truncate">
                Management ERP
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {hasAccess('dashboard') && (
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'dashboard'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4.5 w-4.5" />
                Tableau de Bord
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'dashboard' ? 'block' : 'hidden'}`} />
            </button>
            )}

            <div className="pt-4 pb-1 px-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Super Admin / Admin</p>
            </div>

            {hasAccess('role_management') && (
            <button
              onClick={() => handleNavigate('role_management')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'role_management'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4.5 w-4.5" />
                Gestion des Rôles
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'role_management' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('audit_logs') && (
            <button
              onClick={() => handleNavigate('audit_logs')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'audit_logs'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="h-4.5 w-4.5" />
                Journal d'Activité
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'audit_logs' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('messages') && (
            <button
              onClick={() => handleNavigate('messages')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'messages'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <MessageCircle className="h-4.5 w-4.5" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {unreadMessagesCount}
                    </span>
                  )}
                </div>
                Messagerie
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'messages' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('notices') && (
            <button
              onClick={() => handleNavigate('notices')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'notices'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="h-4.5 w-4.5" />
                Annonces
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'notices' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('inquiries') && (
            <button
              onClick={() => handleNavigate('inquiries')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'inquiries'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className="h-4.5 w-4.5" />
                Inquiries Management
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'inquiries' ? 'block' : 'hidden'}`} />
            </button>
            )}

            <div className="pt-4 pb-1 px-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Students & Academic</p>
            </div>

            {hasAccess('students') && (
            <button
              onClick={() => handleNavigate('students')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'students'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="h-4.5 w-4.5" />
                Registre des Élèves
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'students' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('teachers') && (
            <button
              onClick={() => handleNavigate('teachers')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'teachers'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserSquare2 className="h-4.5 w-4.5" />
                Corps Enseignant
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'teachers' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('staff') && (
            <button
              onClick={() => handleNavigate('staff')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'staff'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="h-4.5 w-4.5" />
                Gestion Staff
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'staff' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('attendance') && (
            <button
              onClick={() => handleNavigate('attendance')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'attendance'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="h-4.5 w-4.5" />
                Registre de Présences
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'attendance' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('timetable') && (
            <button
              onClick={() => handleNavigate('timetable')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'timetable'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-4.5 w-4.5" />
                Emploi du Temps
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'timetable' ? 'block' : 'hidden'}`} />
            </button>
            )}

            <div className="pt-4 pb-1 px-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Accounting</p>
            </div>

            {hasAccess('financials') && (
            <button
              onClick={() => handleNavigate('financials')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'financials'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Receipt className="h-4.5 w-4.5" />
                Comptabilité & Frais
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'financials' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('inventory') && (
            <button
              onClick={() => handleNavigate('inventory')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'inventory'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="h-4.5 w-4.5" />
                Stocks & Inventaire
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'inventory' ? 'block' : 'hidden'}`} />
            </button>
            )}

            <div className="pt-4 pb-1 px-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Examination</p>
            </div>

            {hasAccess('exams') && (
            <button
              onClick={() => handleNavigate('exams')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'exams'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="h-4.5 w-4.5" />
                Examens & Notes
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'exams' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('exam_analytics') && (
            <button
              onClick={() => handleNavigate('exam_analytics')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'exam_analytics'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="h-4.5 w-4.5" />
                Analytiques
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'exam_analytics' ? 'block' : 'hidden'}`} />
            </button>
            )}

            <div className="pt-4 pb-1 px-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Library & Services</p>
            </div>

            {hasAccess('library') && (
            <button
              onClick={() => handleNavigate('library')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'library'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-4.5 w-4.5" />
                Bibliothèque
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'library' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('transport') && (
            <button
              onClick={() => handleNavigate('transport')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'transport'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="h-4.5 w-4.5" />
                Transport Scolaire
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'transport' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('student_leaves') && (
            <button
              onClick={() => handleNavigate('student_leaves')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'student_leaves'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4.5 w-4.5" />
                Congés Élèves
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'student_leaves' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('discipline') && (
            <button
              onClick={() => handleNavigate('discipline')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'discipline'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Scale className="h-4.5 w-4.5" />
                Discipline Scolaire
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'discipline' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('schools_settings') && (
            <button
              onClick={() => handleNavigate('schools_settings')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'schools_settings'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <School className="h-4.5 w-4.5" />
                Multi-Écoles
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'schools_settings' ? 'block' : 'hidden'}`} />
            </button>
            )}

            {hasAccess('role_management') && (
            <button
              onClick={() => handleNavigate('role_management')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-r-xl text-xs font-semibold tracking-tight transition-all text-left border-l-4 ${
                activeTab === 'role_management'
                  ? 'bg-white/10 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4.5 w-4.5" />
                Rôles & Permissions
              </div>
              <ChevronRight className={`h-3 w-3 opacity-60 ${activeTab === 'role_management' ? 'block' : 'hidden'}`} />
            </button>
            )}
          </nav>
        </div>

        {/* Action button at bottom */}
        <div className="p-4 border-t border-slate-800 space-y-2 shrink-0">
          <button
            onClick={handleResetData}
            className="w-full flex items-center gap-2 justify-center py-2.5 bg-slate-800/80 hover:bg-rose-950/60 text-[10px] uppercase font-bold text-slate-300 hover:text-rose-400 rounded-xl border border-slate-800 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Réinitialiser démo
          </button>
        </div>
      </aside>

      {/* SIDEBAR NAVIGATION - Mobile Menu Popup */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 lg:hidden flex">
          <div className="w-64 bg-slate-900 text-white h-full p-5 flex flex-col justify-between shadow-2xl relative">
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6 pt-4 flex-1 overflow-y-auto">
              <div className="flex items-center gap-3 px-2 overflow-hidden">
                {currentSchool?.logoUrl ? (
                  <img src={currentSchool.logoUrl} alt="Logo" className="h-10 w-10 object-contain rounded-xl bg-white p-1 shrink-0" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <School className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-white leading-tight text-sm uppercase truncate" title={displaySchoolName}>
                    {displaySchoolName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 truncate">
                    Management ERP
                  </div>
                </div>
              </div>

              <nav className="flex flex-col space-y-1.5">
                {hasAccess('dashboard') && (
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'dashboard' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <LayoutDashboard className="h-4.5 w-4.5" />
                  Tableau de Bord
                </button>
                )}

                {hasAccess('messages') && (
                <button
                  onClick={() => handleNavigate('messages')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'messages' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <div className="relative">
                    <MessageCircle className="h-4.5 w-4.5" />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        {unreadMessagesCount}
                      </span>
                    )}
                  </div>
                  Messagerie
                </button>
                )}

                {hasAccess('students') && (
                <button
                  onClick={() => handleNavigate('students')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'students' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Users className="h-4.5 w-4.5" />
                  Registre des Élèves
                </button>
                )}
                {hasAccess('teachers') && (
                <button
                  onClick={() => handleNavigate('teachers')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'teachers' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <UserSquare2 className="h-4.5 w-4.5" />
                  Corps Enseignant
                </button>
                )}
                {hasAccess('staff') && (
                <button
                  onClick={() => handleNavigate('staff')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'staff' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Briefcase className="h-4.5 w-4.5" />
                  Gestion Staff
                </button>
                )}
                {hasAccess('attendance') && (
                <button
                  onClick={() => handleNavigate('attendance')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'attendance' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <CheckSquare className="h-4.5 w-4.5" />
                  Présences
                </button>
                )}
                {hasAccess('timetable') && (
                <button
                  onClick={() => handleNavigate('timetable')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'timetable' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Calendar className="h-4.5 w-4.5" />
                  Emploi du Temps
                </button>
                )}
                {hasAccess('exams') && (
                <button
                  onClick={() => handleNavigate('exams')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'exams' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <ClipboardList className="h-4.5 w-4.5" />
                  Examens & Notes
                </button>
                )}
                {hasAccess('exam_analytics') && (
                <button
                  onClick={() => handleNavigate('exam_analytics')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'exam_analytics' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Layers className="h-4.5 w-4.5" />
                  Analytiques
                </button>
                )}
                {hasAccess('financials') && (
                <button
                  onClick={() => handleNavigate('financials')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'financials' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Receipt className="h-4.5 w-4.5" />
                  Facturation
                </button>
                )}
                {hasAccess('inventory') && (
                <button
                  onClick={() => handleNavigate('inventory')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'inventory' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Package className="h-4.5 w-4.5" />
                  Stocks & Inventaire
                </button>
                )}
                {hasAccess('notices') && (
                <button
                  onClick={() => handleNavigate('notices')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'notices' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Bell className="h-4.5 w-4.5" />
                  Annonces
                </button>
                )}
                {hasAccess('inquiries') && (
                <button
                  onClick={() => handleNavigate('inquiries')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'inquiries' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Bookmark className="h-4.5 w-4.5" />
                  Demandes d'Admission
                </button>
                )}
                {hasAccess('library') && (
                <button
                  onClick={() => handleNavigate('library')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'library' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <BookOpen className="h-4.5 w-4.5" />
                  Bibliothèque
                </button>
                )}
                {hasAccess('transport') && (
                <button
                  onClick={() => handleNavigate('transport')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'transport' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Briefcase className="h-4.5 w-4.5" />
                  Transport Scolaire
                </button>
                )}
                {hasAccess('student_leaves') && (
                <button
                  onClick={() => handleNavigate('student_leaves')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'student_leaves' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <ShieldAlert className="h-4.5 w-4.5" />
                  Congés Élèves
                </button>
                )}
                {hasAccess('discipline') && (
                <button
                  onClick={() => handleNavigate('discipline')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'discipline' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Scale className="h-4.5 w-4.5" />
                  Discipline Scolaire
                </button>
                )}
                {hasAccess('schools_settings') && (
                <button
                  onClick={() => handleNavigate('schools_settings')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'schools_settings' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <School className="h-4.5 w-4.5" />
                  Multi-Écoles
                </button>
                )}
                {hasAccess('role_management') && (
                <button
                  onClick={() => handleNavigate('role_management')}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-semibold text-left border-l-4 ${
                    activeTab === 'role_management' ? 'bg-white/10 text-white border-blue-500' : 'text-slate-400 hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <ShieldAlert className="h-4.5 w-4.5" />
                  Rôles & Permissions
                </button>
                )}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 shrink-0">
              <button
                onClick={handleResetData}
                className="w-full flex items-center gap-2 justify-center py-2 bg-slate-800 hover:bg-rose-950/60 text-[10px] font-bold text-slate-300 hover:text-rose-400 rounded-xl border border-slate-800 transition-colors uppercase"
              >
                <RefreshCw className="h-3 w-3" />
                Réinitialiser démo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER PANEL */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-slate-100 h-16 shrink-0 flex items-center justify-between px-6 shadow-xs">
          <div className="flex items-center gap-3.5">
            {/* Hamburger Button on mobile */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 shrink-0"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>

            {/* School System Logo for Mobile Header view */}
            <div className="flex lg:hidden items-center gap-2 shrink-0 overflow-hidden max-w-[200px]">
              {currentSchool?.logoUrl ? (
                <img src={currentSchool.logoUrl} alt="Logo" className="h-8 w-8 object-contain rounded-lg bg-white p-0.5 shrink-0" />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shrink-0">
                  <School className="h-4 w-4" />
                </div>
              )}
              <span className="font-extrabold text-slate-900 text-xs tracking-tight uppercase truncate" title={displaySchoolName}>
                {displaySchoolName}
              </span>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Espace Administration Scolaire Actif
            </span>
          </div>

          <div className="flex items-center gap-3">
            <NotificationsDropdown 
              announcements={announcements} 
              onNavigate={handleNavigate} 
            />
            
            <div className="hidden sm:flex flex-col text-right text-xs ml-2">
              <span className="font-bold text-slate-900">{user?.name || 'Directeur Académique'}</span>
              <span className="text-[10px] text-slate-400">{user?.email || 'admin@school.com'}</span>
            </div>
            <button 
              onClick={() => handleNavigate('user_profile')}
              className="h-9 w-9 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs rounded-full flex items-center justify-center ring-2 ring-blue-100 hover:ring-blue-300 shrink-0 cursor-pointer transition-all"
              title="Mon Profil"
            >
              {(user?.name || 'AD').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </button>
            <button 
              onClick={handleLogout}
              className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-100 hover:border-rose-100 transition-all cursor-pointer"
              title="Se déconnecter de la session"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Interactive View Panel content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'user_profile' && (
            <UserProfileView user={user} auditLogs={auditLogs} />
          )}

          {activeTab === 'audit_logs' && (
            <AuditLogView logs={auditLogs} />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView 
              students={students}
              teachers={teachers}
              classes={classes}
              subjects={subjects}
              invoices={invoices}
              announcements={announcements}
              schedules={schedules}
              onNavigate={handleNavigate}
              onAddAnnouncement={handleAddAnnouncement}
              inquiries={inquiries}
              books={books}
              studentLeaves={studentLeaves}
              staffLeaves={staffLeaves}
              activeSchoolName={schools.find(s => s.id === activeSchoolId)?.name || 'Smart School Management'}
              activeSession={activeSession}
              onChangeSession={(session) => {
                setActiveSession(session);
                saveState('sms_active_session', session);
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView 
              students={students}
              classes={classes}
              grades={grades}
              exams={exams}
              subjects={subjects}
              attendances={attendances}
              invoices={invoices}
              school={schools.find(s => s.id === activeSchoolId) || null}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {activeTab === 'messages' && (
            <MessagingView
              messages={messages}
              user={user}
              students={students}
              teachers={teachers}
              staff={staff}
              onSendMessage={handleSendMessage}
              onMarkMessageRead={handleMarkMessageRead}
            />
          )}

          {activeTab === 'teachers' && (
            <TeachersView 
              teachers={teachers}
              onAddTeacher={handleAddTeacher}
              onUpdateTeacher={handleUpdateTeacher}
              onDeleteTeacher={handleDeleteTeacher}
            />
          )}

          {activeTab === 'staff' && (
            <StaffDashboardView
              staff={staff}
              teachers={teachers}
              leaves={staffLeaves}
              attendance={staffAttendance}
              payroll={staffPayroll}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onDeleteStaff={handleDeleteStaff}
              onAddLeave={handleAddLeave}
              onUpdateLeaveStatus={handleUpdateLeaveStatus}
              onSaveAttendance={handleSaveStaffAttendance}
              onAddPayroll={handleAddPayroll}
              onUpdatePayrollStatus={handleUpdatePayrollStatus}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView 
              students={students}
              classes={classes}
              attendances={attendances}
              onSaveAttendance={handleSaveAttendance}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableView 
              schedules={schedules}
              classes={classes}
              subjects={subjects}
              teachers={teachers}
              onAddScheduleItem={handleAddScheduleItem}
              onDeleteScheduleItem={handleDeleteScheduleItem}
            />
          )}

          {activeTab === 'exams' && (
            <ExamsView 
              schoolProfile={schools.find(s => s.id === activeSchoolId)}
              exams={exams}
              grades={grades}
              students={students}
              classes={classes}
              subjects={subjects}
              schoolProfile={schools.find(s => s.id === activeSchoolId)}
              onAddExam={handleAddExam}
              onSaveGrades={handleSaveGrades}
              onDeleteExam={handleDeleteExam}
            />
          )}

          {activeTab === 'financials' && (
            <FinancialsView 
              invoices={invoices}
              students={students}
              classes={classes}
              schoolProfile={schools.find(s => s.id === activeSchoolId)}
              onAddInvoice={handleAddInvoice}
              onRecordPayment={handleRecordPayment}
            />
          )}

          {activeTab === 'notices' && (
            <NoticeBoardView 
              announcements={announcements}
              onAddAnnouncement={handleAddAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              onTogglePinAnnouncement={handleTogglePinAnnouncement}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesView 
              inquiries={inquiries}
              classes={classes}
              onAddInquiry={handleAddInquiry}
              onAdmitInquiry={handleAdmitInquiry}
              onRejectInquiry={handleRejectInquiry}
              onDeleteInquiry={handleDeleteInquiry}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView 
              items={inventoryItems}
              movements={inventoryMovements}
              activeSchoolId={activeSchoolId}
              currentUser={user}
              onAddItem={handleAddInventoryItem}
              onRecordMovement={handleRecordInventoryMovement}
              onUpdateItem={handleUpdateInventoryItem}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView 
              books={books}
              onAddBook={handleAddBook}
              onUpdateBookCopies={handleUpdateBookCopies}
              onDeleteBook={handleDeleteBook}
            />
          )}

          {activeTab === 'student_leaves' && (
            <StudentLeavesView 
              leaves={studentLeaves}
              students={students}
              classes={classes}
              onAddLeave={handleAddStudentLeave}
              onUpdateLeaveStatus={handleUpdateStudentLeaveStatus}
              onDeleteLeave={handleDeleteStudentLeave}
            />
          )}

          {activeTab === 'discipline' && (
            <DisciplineView 
              incidents={disciplinaryIncidents}
              students={students}
              classes={classes}
              currentSchool={currentSchool}
              onAddIncident={handleAddDisciplinaryIncident}
              onUpdateIncidentStatus={handleUpdateDisciplinaryIncidentStatus}
              onDeleteIncident={handleDeleteDisciplinaryIncident}
            />
          )}

          {activeTab === 'exam_analytics' && (
            <ExamAnalyticsView 
              exams={exams}
              grades={grades}
              students={students}
              classes={classes}
              subjects={subjects}
            />
          )}

          {activeTab === 'schools_settings' && (
            <SchoolsView 
              schools={schools}
              activeSchoolId={activeSchoolId}
              onSelectSchool={handleSelectSchool}
              onAddSchool={handleAddSchool}
              onUpdateSchool={handleUpdateSchool}
              onDeleteSchool={handleDeleteSchool}
            />
          )}

          {activeTab === 'role_management' && (
            <RoleManagementView />
          )}

          {activeTab === 'transport' && (
            <TransportView 
              routes={transportRoutes}
              drivers={transportDrivers}
              transportStudents={transportStudents}
              allStudents={students}
              onAddRoute={handleAddTransportRoute}
              onDeleteRoute={handleDeleteTransportRoute}
              onAddDriver={handleAddDriver}
              onDeleteDriver={handleDeleteDriver}
              onAssignStudent={handleAssignTransportStudent}
              onRemoveStudent={handleRemoveTransportStudent}
            />
          )}
        </div>
      </main>

    </div>
  );
}
