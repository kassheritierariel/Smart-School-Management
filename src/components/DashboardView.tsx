import React, { useState } from 'react';
import { 
  Users, 
  UserSquare2, 
  GraduationCap, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Clock, 
  Bell, 
  FileText, 
  Plus, 
  TrendingDown, 
  CheckCircle,
  AlertTriangle,
  Bookmark,
  Sparkles,
  School,
  Library,
  Layers,
  BookOpen,
  ClipboardList,
  MessageCircle,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, Teacher, SchoolClass, Invoice, Announcement, ScheduleItem, Subject, Inquiry, Book, StudentLeave, StaffLeaveRequest } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DashboardViewProps {
  students: Student[];
  teachers: Teacher[];
  classes: SchoolClass[];
  subjects: Subject[];
  invoices: Invoice[];
  announcements: Announcement[];
  schedules: ScheduleItem[];
  onNavigate: (view: string) => void;
  onAddAnnouncement: (announcement: Partial<Announcement>) => void;
  inquiries?: Inquiry[];
  books?: Book[];
  studentLeaves?: StudentLeave[];
  staffLeaves?: StaffLeaveRequest[];
  activeSchoolName?: string;
  activeSession?: string;
  onChangeSession?: (session: string) => void;
}

export default function DashboardView({
  students,
  teachers,
  classes,
  subjects,
  invoices,
  announcements,
  schedules,
  onNavigate,
  onAddAnnouncement,
  inquiries = [],
  books = [],
  studentLeaves = [],
  staffLeaves = [],
  activeSchoolName = '${activeSchoolName}',
  activeSession = '2026-2027',
  onChangeSession
}: DashboardViewProps) {
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'Academique' | 'General' | 'Examens' | 'Evenements'>('General');

  // Calculate statistics
  const totalStudents = students.filter(s => s.status === 'Active').length;
  const totalTeachers = teachers.filter(t => t.status === 'Active').length;
  const totalClasses = classes.length;

  // Financial status
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalPending = totalInvoiced - totalCollected;
  const paymentRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  // Advanced counters
  const pendingInquiriesCount = inquiries.filter(i => i.status === 'Pending').length;
  const pendingStudentLeavesCount = studentLeaves.filter(sl => sl.status === 'Pending').length;
  const pendingStaffLeavesCount = staffLeaves.filter(l => l.status === 'Pending').length;
  const totalLibraryBooksCount = books.length;

  // Recent announcements (up to 3)
  const sortedAnnouncements = [...announcements].sort((a, b) => b.date.localeCompare(a.date));

  // Today's schedule items (using some mock/representative items)
  const todaySchedules = schedules.slice(0, 4);

  // Quick statistics for SVG bar chart
  // Invoices by Category
  const categoryAmounts = invoices.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.paidAmount;
    return acc;
  }, {} as { [key: string]: number });

  const chartCategories = ['Scolarité', 'Examen', 'Transport', 'Bibliothèque', 'Activités'];
  const chartValues = chartCategories.map(cat => categoryAmounts[cat] || 0);
  const maxChartValue = Math.max(...chartValues, 100);

  // Recharts Data: Students by class
  const studentsByClassData = classes.map(c => {
    const studentCount = students.filter(s => s.classId === c.id).length;
    return {
      name: c.name,
      students: studentCount,
      capacity: c.capacity
    };
  }).sort((a, b) => b.students - a.students).slice(0, 5); // top 5 classes for neatness

  // Recharts Data: Monthly Attendance Rate (Mock Data)
  const monthlyAttendanceData = [
    { month: 'Sep', rate: 95 },
    { month: 'Oct', rate: 93 },
    { month: 'Nov', rate: 91 },
    { month: 'Dec', rate: 89 },
    { month: 'Jan', rate: 94 },
    { month: 'Fév', rate: 92 },
    { month: 'Mar', rate: 95 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    onAddAnnouncement({
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      date: new Date().toISOString().split('T')[0],
      author: 'Administration',
      pinned: false
    });

    setNoticeTitle('');
    setNoticeContent('');
    setNoticeCategory('General');
    setShowAddNoticeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header section with school description & active school branch info */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full translate-x-24 -translate-y-24 blur-2xl" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase bg-blue-500 text-white px-2.5 py-1 rounded-md tracking-wider">
              {activeSchoolName}
            </span>
            <span className="text-[9px] font-black uppercase bg-emerald-500 text-white px-2.5 py-1 rounded-md tracking-wider">
              Session Active: {activeSession}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">{activeSchoolName} Dashboard</h1>
          <p className="text-xs text-slate-300 font-medium">
            Console d'administration multi-établissements. Pilotez vos registres scolaires, académiques et financiers en temps réel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-300 font-medium">Session Académique:</span>
            <select
              value={activeSession}
              onChange={(e) => onChangeSession?.(e.target.value)}
              className="bg-transparent text-white font-black border-none focus:outline-hidden cursor-pointer"
            >
              <option value="2025-2026" className="text-slate-800">2025-2026</option>
              <option value="2026-2027" className="text-slate-800">2026-2027</option>
              <option value="2027-2028" className="text-slate-800">2027-2028</option>
            </select>
          </div>

          <button 
            onClick={() => setShowAddNoticeModal(true)}
            id="btn-add-notice-quick"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer border border-blue-500"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Annonce
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div 
          onClick={() => onNavigate('students')}
          id="stat-card-students"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Élèves Actifs</span>
              <div className="text-3xl font-bold text-slate-950">{totalStudents}</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <span className="text-emerald-500 font-semibold">+{students.length - totalStudents} inactifs</span>
                <span>enregistrés</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Teachers */}
        <div 
          onClick={() => onNavigate('teachers')}
          id="stat-card-teachers"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-emerald-100 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enseignants</span>
              <div className="text-3xl font-bold text-slate-950">{totalTeachers}</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <span className="text-blue-600 font-semibold">{subjects.length} matières</span>
                <span>enseignées</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Classes */}
        <div 
          onClick={() => onNavigate('timetable')}
          id="stat-card-classes"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-amber-100 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Classes Actives</span>
              <div className="text-3xl font-bold text-slate-950">{totalClasses}</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <span className="text-amber-500 font-semibold">{classes.reduce((sum, c) => sum + c.capacity, 0)} places</span>
                <span>capacité max</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
              <UserSquare2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Collected Financials */}
        <div 
          onClick={() => onNavigate('financials')}
          id="stat-card-finance"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Frais Encaissés</span>
              <div className="text-3xl font-bold text-emerald-600">{totalCollected} €</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <span className="text-rose-500 font-semibold">{totalPending} €</span>
                <span>en attente ({paymentRate}%)</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Indicator KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Inquiries Card */}
        <div 
          onClick={() => onNavigate('inquiries')}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demandes d'Admission</span>
            <div className="text-xl font-black text-slate-800">{pendingInquiriesCount} en cours</div>
            <div className="text-[10px] text-indigo-600 font-semibold">Gérer les inscriptions rapides</div>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        {/* Library Card */}
        <div 
          onClick={() => onNavigate('library')}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs hover:shadow-md hover:border-cyan-100 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Livres Bibliothèque</span>
            <div className="text-xl font-black text-slate-800">{totalLibraryBooksCount} Références</div>
            <div className="text-[10px] text-cyan-600 font-semibold">Consulter le catalogue</div>
          </div>
          <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl group-hover:bg-cyan-600 group-hover:text-white transition-all">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        {/* Student Leaves Card */}
        <div 
          onClick={() => onNavigate('student_leaves')}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs hover:shadow-md hover:border-rose-100 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Congés Élèves</span>
            <div className="text-xl font-black text-rose-600">{pendingStudentLeavesCount} en attente</div>
            <div className="text-[10px] text-slate-400 font-semibold">Justifier les absences</div>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all">
            <CalendarIcon className="h-5 w-5" />
          </div>
        </div>

        {/* Staff Leaves Card */}
        <div 
          onClick={() => onNavigate('staff')}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs hover:shadow-md hover:border-amber-100 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Congés Personnel / Staff</span>
            <div className="text-xl font-black text-amber-600">{pendingStaffLeavesCount} en attente</div>
            <div className="text-[10px] text-slate-400 font-semibold">Valider les congés staff</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
            <ClipboardList className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Content Sections: Chart & Schedule & Notice board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Analytics Chart and Financial Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Distribution des Recettes par Catégorie</h2>
              <p className="text-xs text-slate-400 mt-0.5">Vue d'ensemble des fonds encaissés par type de frais</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
              <TrendingUp className="h-3.5 w-3.5" />
              Revenus totaux: {totalInvoiced} €
            </span>
          </div>

          {/* Recharts: Revenue Chart */}
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartCategories.map(cat => ({ name: cat, value: categoryAmounts[cat] || 0 }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}€`} />
                <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Financial Progress Bars */}
          <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Collecté</span>
                <span className="font-bold text-slate-900">{totalCollected} € ({paymentRate}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${paymentRate}%` }}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">En Attente / Retards</span>
                <span className="font-bold text-slate-900">{totalPending} € ({100 - paymentRate}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-400 rounded-full transition-all duration-1000" 
                  style={{ width: `${100 - paymentRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notice Board */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col h-full justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Annonces Générales</h2>
                <p className="text-xs text-slate-400">Notes épinglées par l'administration</p>
              </div>
              <button 
                onClick={() => onNavigate('notices')} 
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Tout voir
              </button>
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {sortedAnnouncements.map((notice) => (
                <div 
                  key={notice.id} 
                  className={`p-3.5 rounded-xl border text-xs relative overflow-hidden transition-all hover:bg-slate-50 ${
                    notice.pinned 
                      ? 'bg-amber-50/40 border-amber-200 shadow-3xs' 
                      : 'bg-slate-50/50 border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                      notice.category === 'Academique' ? 'bg-blue-100 text-blue-700' :
                      notice.category === 'Examens' ? 'bg-purple-100 text-purple-700' :
                      notice.category === 'Evenements' ? 'bg-pink-100 text-pink-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{notice.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    {notice.pinned && <Bookmark className="h-3 w-3 fill-amber-400 text-amber-500 shrink-0" />}
                    {notice.title}
                  </h3>
                  <p className="text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">{notice.content}</p>
                  <div className="text-[9px] text-slate-400 mt-2 flex justify-between items-center font-medium">
                    <span>Par: {notice.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3.5 mt-4">
            <button
              onClick={() => setShowAddNoticeModal(true)}
              className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-blue-600" />
              Publier un nouveau message
            </button>
          </div>
        </div>

      </div>

      {/* New Chart Row: Students by class & Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Class */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Répartition des Élèves par Classe</h2>
          <p className="text-xs text-slate-400 mb-6">Capacité et occupation des 5 classes principales</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByClassData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="students" name="Élèves inscrits" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="capacity" name="Capacité max" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Taux de Présence Mensuel</h2>
          <p className="text-xs text-slate-400 mb-6">Évolution de l'assiduité sur l'année en cours</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="rate" name="Taux de présence" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Today's Schedule & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's schedule slots */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Emploi du Temps du Jour (Aperçu)</h2>
              <p className="text-xs text-slate-400">Heures de cours planifiées pour les classes</p>
            </div>
            <button 
              onClick={() => onNavigate('timetable')} 
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Modifier la grille
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {todaySchedules.map((sched) => {
              const cls = classes.find(c => c.id === sched.classId);
              const sub = subjects.find(s => s.id === sched.subjectId);
              const teach = teachers.find(t => t.id === sched.teacherId);
              return (
                <div key={sched.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs hover:border-blue-100 transition-all">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">{sub ? sub.name : 'Matière'}</div>
                    <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {sched.period}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Prof: {teach ? `${teach.firstName} ${teach.lastName}` : 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-[10px] border border-blue-100">
                      {cls ? cls.name : 'Classe'}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-semibold">{sched.room}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Operations Links */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Raccourcis Pratiques</h2>
            <p className="text-xs text-slate-400">Accéder directement aux fonctionnalités clés</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button 
              onClick={() => onNavigate('attendance')}
              className="p-3 text-left bg-blue-50/50 hover:bg-blue-50 rounded-xl border border-blue-100/50 hover:border-blue-100 text-blue-800 transition-all font-bold flex flex-col gap-2 cursor-pointer group"
            >
              <CheckCircle className="h-5 w-5 text-blue-600 group-hover:scale-105 transition-transform" />
              Faire l'Appel
            </button>
            <button 
              onClick={() => onNavigate('exams')}
              className="p-3 text-left bg-purple-50/50 hover:bg-purple-50 rounded-xl border border-purple-100/50 hover:border-purple-100 text-purple-800 transition-all font-bold flex flex-col gap-2 cursor-pointer group"
            >
              <FileText className="h-5 w-5 text-purple-600 group-hover:scale-105 transition-transform" />
              Saisir les Notes
            </button>
            <button 
              onClick={() => onNavigate('financials')}
              className="p-3 text-left bg-emerald-50/50 hover:bg-emerald-50 rounded-xl border border-emerald-100/50 hover:border-emerald-100 text-emerald-800 transition-all font-bold flex flex-col gap-2 cursor-pointer group"
            >
              <FileText className="h-5 w-5 text-emerald-600 group-hover:scale-105 transition-transform" />
              Facturation
            </button>
            <button 
              onClick={() => onNavigate('students')}
              className="p-3 text-left bg-amber-50/50 hover:bg-amber-50 rounded-xl border border-amber-100/50 hover:border-amber-100 text-amber-800 transition-all font-bold flex flex-col gap-2 cursor-pointer group"
            >
              <Users className="h-5 w-5 text-amber-600 group-hover:scale-105 transition-transform" />
              Inscrire Élève
            </button>
          </div>
        </div>

      </div>

      {/* Third Row: WhatsApp Reminder & Schedule Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* WhatsApp Auto-Reminders Widget */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-5 lg:col-span-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <MessageCircle className="w-32 h-32 text-emerald-500" />
          </div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                Rappels WhatsApp
              </h2>
              <p className="text-xs text-slate-500 mt-1">Automatisation des échéances de paiement</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Actif</span>
              <ToggleRight className="w-6 h-6 text-emerald-500 cursor-pointer" />
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Paramètres d'envoi</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Fréquence</span>
                  <select className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-semibold focus:outline-hidden">
                    <option>J-3 avant échéance</option>
                    <option>J-7 avant échéance</option>
                    <option>Chaque fin de mois</option>
                  </select>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Numéro Expéditeur</span>
                  <span className="font-mono text-[10px] font-bold text-slate-800">+243 99 000 0000</span>
                </div>
              </div>
            </div>

            <div className="bg-[#E1F5FE] rounded-xl p-3 border border-blue-100 relative">
              <div className="absolute -left-1 top-4 w-2 h-2 bg-[#E1F5FE] rotate-45 border-l border-b border-blue-100"></div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Aperçu du message</div>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                `Bonjour Cher Parent, ceci est un rappel amical de ${activeSchoolName}. L'échéance de paiement pour [Nom Élève] est prévue pour le [Date]. Montant restant: [Montant] USD. Merci de votre confiance.`
              </p>
            </div>
          </div>
        </div>
        
        {/* Interactive Global Calendar View */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                Calendrier Interactif
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Planification globale des activités scolaires</p>
            </div>
            
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 font-medium text-slate-600">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div> Examens
              </div>
              <div className="flex items-center gap-1 font-medium text-slate-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Réunions
              </div>
              <div className="flex items-center gap-1 font-medium text-slate-600">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> Événements
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 bg-white flex flex-col">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-800">Octobre 2026</h3>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                  Aujourd'hui
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 border border-slate-100 rounded-xl overflow-hidden bg-slate-50">
              {/* Days of week */}
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-center py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-white">
                  {day}
                </div>
              ))}
              
              {/* Mock Calendar Cells */}
              {Array.from({ length: 35 }).map((_, i) => {
                const dayNum = i - 2; // Offset to start from Oct 1st roughly
                const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                
                return (
                  <div key={i} className={`min-h-[80px] p-1 border-b border-r border-slate-100 ${isCurrentMonth ? 'bg-white hover:bg-blue-50/50 transition-colors cursor-pointer' : 'bg-slate-50/50'}`}>
                    {isCurrentMonth && (
                      <div className="flex flex-col h-full">
                        <span className={`text-[10px] font-bold p-1 w-6 h-6 flex items-center justify-center rounded-full ${dayNum === 12 ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                          {dayNum}
                        </span>
                        
                        <div className="flex-1 mt-1 space-y-1">
                          {dayNum === 12 && (
                            <div className="bg-purple-50 border border-purple-100 rounded px-1.5 py-1 text-[8px] font-bold text-purple-700 leading-tight">
                              Examens Mi-Trimestre
                            </div>
                          )}
                          {dayNum === 15 && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded px-1.5 py-1 text-[8px] font-bold text-emerald-700 leading-tight">
                              Réunion Parents
                            </div>
                          )}
                          {dayNum === 24 && (
                            <div className="bg-amber-50 border border-amber-100 rounded px-1.5 py-1 text-[8px] font-bold text-amber-700 leading-tight">
                              Fête de la Science
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Notice Board modal */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-900 mb-4 uppercase tracking-wider">Créer une Annonce Générale</h3>
            
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Titre de l'annonce</label>
                <input 
                  type="text" 
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="Ex: Réunion Parents-Profs"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Catégorie</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  >
                    <option value="General">Générale</option>
                    <option value="Academique">Académique</option>
                    <option value="Examens">Examens</option>
                    <option value="Evenements">Événements</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Auteur</label>
                  <input 
                    type="text" 
                    disabled
                    value="Administration"
                    className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Message</label>
                <textarea 
                  required
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Écrivez votre message d'information ici..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
