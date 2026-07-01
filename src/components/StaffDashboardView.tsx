import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  UserSquare2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  DollarSign, 
  FileText, 
  Layers, 
  Briefcase, 
  Award, 
  Printer, 
  TrendingUp, 
  Sparkles, 
  RefreshCw, 
  UserCheck, 
  ChevronRight, 
  CalendarDays,
  FileCheck2,
  Lock
} from 'lucide-react';
import { StaffMember, StaffLeaveRequest, StaffAttendance, StaffPayroll, Teacher } from '../types';

interface StaffDashboardViewProps {
  staff: StaffMember[];
  teachers: Teacher[];
  leaves: StaffLeaveRequest[];
  attendance: StaffAttendance[];
  payroll: StaffPayroll[];
  onAddStaff: (newStaff: Omit<StaffMember, 'id'>) => void;
  onUpdateStaff: (updatedStaff: StaffMember) => void;
  onDeleteStaff: (id: string) => void;
  onAddLeave: (newLeave: Omit<StaffLeaveRequest, 'id'>) => void;
  onUpdateLeaveStatus: (leaveId: string, status: 'Approved' | 'Rejected') => void;
  onSaveAttendance: (date: string, records: { [staffId: string]: StaffAttendance['status'] }) => void;
  onAddPayroll: (newPayroll: Omit<StaffPayroll, 'id'>) => void;
  onUpdatePayrollStatus: (payrollId: string, status: 'Paid' | 'Unpaid') => void;
}

export default function StaffDashboardView({
  staff,
  teachers,
  leaves,
  attendance,
  payroll,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onAddLeave,
  onUpdateLeaveStatus,
  onSaveAttendance,
  onAddPayroll,
  onUpdatePayrollStatus,
}: StaffDashboardViewProps) {
  // Navigation tabs
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'directory' | 'attendance' | 'leaves' | 'payroll'>('overview');

  // Search & Filter States
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryRole, setDirectoryRole] = useState('all');

  // Selected Profile for Self-Service / Details
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staff[0]?.id || '');
  const activeStaff = staff.find(s => s.id === selectedStaffId) || staff[0];

  // Modals / Form states
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffModalMode, setStaffModalMode] = useState<'add' | 'edit'>('add');
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('Secrétaire');
  const [status, setStatus] = useState<StaffMember['status']>('Active');
  const [salary, setSalary] = useState(2200);
  const [qualification, setQualification] = useState('');

  // Attendance logging
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<{ [staffId: string]: StaffAttendance['status'] }>({});

  // Leave Form
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<StaffLeaveRequest['leaveType']>('Annuel');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  // Payroll modal
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [payStaffId, setPayStaffId] = useState(staff[0]?.id || '');
  const [payMonth, setPayMonth] = useState('Juillet 2026');
  const [payAllowance, setPayAllowance] = useState(150);
  const [payDeduction, setPayDeduction] = useState(50);

  // Payslip Printer state
  const [selectedPayslip, setSelectedPayslip] = useState<StaffPayroll | null>(null);

  // Mark Staff Check-In / Self-Service State
  const [checkedInToday, setCheckedInToday] = useState<{ [staffId: string]: boolean }>({});

  // Combining regular staff and teachers for payroll or display if needed, but keeping separate based on props
  const allStaffCount = staff.length + teachers.length;

  // --- Handlers: Staff Member ---
  const openAddStaffModal = () => {
    setStaffModalMode('add');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setRole('Secrétaire');
    setStatus('Active');
    setSalary(2200);
    setQualification('BTS');
    setIsStaffModalOpen(true);
  };

  const openEditStaffModal = (stf: StaffMember) => {
    setStaffModalMode('edit');
    setEditingStaff(stf);
    setFirstName(stf.firstName);
    setLastName(stf.lastName);
    setEmail(stf.email);
    setPhone(stf.phone);
    setRole(stf.role);
    setStatus(stf.status);
    setSalary(stf.salary);
    setQualification(stf.qualification);
    setIsStaffModalOpen(true);
  };

  const handleSaveStaffForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffModalMode === 'add') {
      onAddStaff({
        firstName,
        lastName,
        email,
        phone,
        role,
        status,
        salary,
        qualification,
        joiningDate: new Date().toISOString().split('T')[0]
      });
      alert('Nouveau membre du personnel ajouté.');
    } else if (staffModalMode === 'edit' && editingStaff) {
      onUpdateStaff({
        ...editingStaff,
        firstName,
        lastName,
        email,
        phone,
        role,
        status,
        salary,
        qualification
      });
      alert('Fiche modifiée.');
    }
    setIsStaffModalOpen(false);
  };

  // --- Handlers: Leave ---
  const handleAddLeaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd || !leaveReason) return;
    onAddLeave({
      staffId: selectedStaffId || staff[0]?.id || 'stf1',
      leaveType,
      startDate: leaveStart,
      endDate: leaveEnd,
      reason: leaveReason,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0]
    });
    setLeaveReason('');
    setIsLeaveModalOpen(false);
    alert('Votre demande de congé a été enregistrée et est en cours d\'examen.');
  };

  // --- Handlers: Attendance Mark ---
  const startAttendanceMarking = () => {
    const records: { [staffId: string]: StaffAttendance['status'] } = {};
    staff.forEach(s => {
      const existing = attendance.find(a => a.date === selectedAttendanceDate && a.staffId === s.id);
      records[s.id] = existing ? existing.status : 'Present';
    });
    setAttendanceRecords(records);
  };

  const handleSaveAttendanceForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAttendance(selectedAttendanceDate, attendanceRecords);
    alert('Le registre des présences a été enregistré avec succès.');
  };

  // --- Handlers: Payroll ---
  const handleAddPayrollForm = (e: React.FormEvent) => {
    e.preventDefault();
    const stf = staff.find(s => s.id === payStaffId);
    if (!stf) return;
    const base = stf.salary;
    const net = base + payAllowance - payDeduction;
    onAddPayroll({
      staffId: payStaffId,
      month: payMonth,
      baseSalary: base,
      allowance: payAllowance,
      deduction: payDeduction,
      netSalary: net,
      status: 'Paid',
      paymentDate: new Date().toISOString().split('T')[0]
    });
    setIsPayrollModalOpen(false);
    alert('Fiche de paie enregistrée et payée.');
  };

  // Filter staff directory
  const filteredStaff = staff.filter(s => {
    const nameMatch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(directorySearch.toLowerCase()) ||
                      s.email.toLowerCase().includes(directorySearch.toLowerCase());
    const roleMatch = directoryRole === 'all' || s.role === directoryRole;
    return nameMatch && roleMatch;
  });

  // Calculate stats
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const activeStaffCount = staff.filter(s => s.status === 'Active').length;
  const totalPayrollValue = staff.reduce((sum, s) => sum + s.salary, 0);

  return (
    <div className="space-y-6">

      {/* Payslip Viewer Modal / Printable Template */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-blue-600" />
                Bulletin de Paie Officiel
              </h3>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="text-xs text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-bold cursor-pointer"
              >
                Fermer
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6" id="printable-payslip">
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-900">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-950 uppercase">Académie Privée WPSchool</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Établissement Primaire & Secondaire</p>
                  <p className="text-[10px] text-slate-500 mt-1">SIRET: 458 962 147 00012</p>
                  <p className="text-[10px] text-slate-500">Adresse: 45 Avenue des Écoles, Paris</p>
                </div>
                <div className="text-right">
                  <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-right inline-block">
                    <span className="text-[10px] font-bold text-blue-900 uppercase block">Période de Paie</span>
                    <span className="text-xs font-black text-blue-700">{selectedPayslip.month}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-2">Émis le: {selectedPayslip.paymentDate || new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Staff Details */}
              <div className="grid grid-cols-2 gap-4 text-[11px] bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <div><span className="text-slate-400 font-semibold">Salarié(e):</span> <span className="font-extrabold text-slate-950 uppercase">{staff.find(s => s.id === selectedPayslip.staffId)?.lastName}</span> {staff.find(s => s.id === selectedPayslip.staffId)?.firstName}</div>
                  <div><span className="text-slate-400 font-semibold">Poste occupé:</span> <span className="font-bold text-slate-800">{staff.find(s => s.id === selectedPayslip.staffId)?.role}</span></div>
                  <div><span className="text-slate-400 font-semibold">Date d'embauche:</span> <span className="font-medium text-slate-700">{staff.find(s => s.id === selectedPayslip.staffId)?.joiningDate}</span></div>
                </div>
                <div className="space-y-1 text-right">
                  <div><span className="text-slate-400 font-semibold">Identifiant Unique:</span> <span className="font-mono font-bold text-slate-800">{selectedPayslip.staffId}</span></div>
                  <div><span className="text-slate-400 font-semibold">E-mail:</span> <span className="font-medium text-slate-700">{staff.find(s => s.id === selectedPayslip.staffId)?.email}</span></div>
                  <div><span className="text-slate-400 font-semibold">Qualification:</span> <span className="font-medium text-slate-700">{staff.find(s => s.id === selectedPayslip.staffId)?.qualification}</span></div>
                </div>
              </div>

              {/* Salary Breakdown Matrix */}
              <div className="space-y-2">
                <table className="w-full text-left text-[11px] border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 uppercase text-[9px] font-bold text-slate-600">
                    <tr>
                      <th className="py-2 px-3 border-b border-slate-200">Rubrique / Désignation</th>
                      <th className="py-2 px-3 border-b border-slate-200 text-right">Part Patronale</th>
                      <th className="py-2 px-3 border-b border-slate-200 text-right">Gains (+)</th>
                      <th className="py-2 px-3 border-b border-slate-200 text-right">Retenues (-)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-2.5 px-3 text-slate-900 font-bold">Salaire de Base Mensuel</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">---</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">+{selectedPayslip.baseSalary.toFixed(2)} €</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">---</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-slate-600">Indemnités / Primes exceptionnelles</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">---</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">+{selectedPayslip.allowance.toFixed(2)} €</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">---</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-slate-600">Cotisations Sociales & Mutuelle (Deduction)</td>
                      <td className="py-2.5 px-3 text-right text-slate-500">120.00 €</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">---</td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-bold">-{selectedPayslip.deduction.toFixed(2)} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net Payout Box */}
              <div className="border-2 border-slate-950 rounded-xl p-4 flex justify-between items-center bg-slate-50">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Mode de paiement: Virement Bancaire</span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle className="h-3 w-3 shrink-0" /> Statut: Payé & Validé
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase font-extrabold block">Net à Payer</span>
                  <span className="text-2xl font-black text-slate-950">{selectedPayslip.netSalary.toFixed(2)} €</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-10 pt-6 text-[10px] text-center text-slate-500 font-bold">
                <div className="space-y-10">
                  <div className="uppercase">Le Salarié</div>
                  <div className="border-b border-slate-300 w-1/2 mx-auto" />
                </div>
                <div className="space-y-10">
                  <div className="uppercase text-blue-900">La Direction Administrative</div>
                  <div className="border-b border-slate-300 w-1/2 mx-auto" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Imprimer la Fiche de Paie
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left sidebar settings & Right content panels */}
      <div className="flex flex-col xl:flex-row gap-6">

        {/* Sidebar Panel: Self-Service Portal & Stats */}
        <div className="w-full xl:w-80 shrink-0 space-y-6">

          {/* Quick Stats Grid */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              Statistiques Administratives
            </h3>

            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 font-medium block">Total Personnel</span>
                <span className="text-lg font-black block mt-1">{staff.length} agents</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 font-medium block">Congés Actifs</span>
                <span className="text-lg font-black text-amber-400 block mt-1">{pendingLeaves} en attente</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl col-span-2">
                <span className="text-[10px] text-slate-400 font-medium block">Masse Salariale Staff</span>
                <span className="text-md font-bold text-emerald-400 block mt-1">{totalPayrollValue.toLocaleString('fr-FR')} € / mois</span>
              </div>
            </div>
          </div>

          {/* Self-Service Portal Widget: Simulating a staff member logging in */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-indigo-600" />
                Espace Salarié (Simulateur)
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Sélectionnez un membre du personnel pour simuler son accès privé.</p>
            </div>

            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold text-slate-700"
            >
              {staff.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.role})</option>
              ))}
            </select>

            {activeStaff && (
              <div className="space-y-4 pt-2">
                {/* Simulated profile */}
                <div className="flex items-center gap-2.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {activeStaff.firstName[0]}{activeStaff.lastName[0]}
                  </div>
                  <div className="text-[11px] overflow-hidden">
                    <div className="font-bold text-slate-900 truncate">{activeStaff.firstName} {activeStaff.lastName}</div>
                    <div className="text-slate-400 font-medium truncate">{activeStaff.email}</div>
                  </div>
                </div>

                {/* Self Service Quick Buttons */}
                <div className="grid grid-cols-1 gap-2">
                  {/* Attendance Check in Check out simulation */}
                  <button
                    onClick={() => {
                      const checked = !!checkedInToday[activeStaff.id];
                      setCheckedInToday(prev => ({ ...prev, [activeStaff.id]: !checked }));
                      alert(checked ? `Dépointage enregistré à ${new Date().toLocaleTimeString('fr-FR')}` : `Pointage d'arrivée enregistré à ${new Date().toLocaleTimeString('fr-FR')}`);
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-[11px] font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${
                      checkedInToday[activeStaff.id]
                        ? 'bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {checkedInToday[activeStaff.id] ? 'Dépointer (Sortie)' : 'Pointer (Arrivée)'}
                  </button>

                  {/* Ask Leave */}
                  <button
                    onClick={() => {
                      setLeaveStart(new Date().toISOString().split('T')[0]);
                      setLeaveEnd(new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0]);
                      setIsLeaveModalOpen(true);
                    }}
                    className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-lg text-[11px] font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CalendarDays className="h-3.5 w-3.5" />
                    Demander un Congé
                  </button>
                </div>

                {/* Leaves breakdown */}
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-[10px] space-y-1.5">
                  <div className="font-extrabold text-slate-500 uppercase tracking-wider">Résumé de mes absences</div>
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Congés Annuels restants</span>
                    <span className="text-blue-700 font-bold">18 jours</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Absences validées</span>
                    <span className="text-slate-900 font-bold">
                      {leaves.filter(l => l.staffId === activeStaff.id && l.status === 'Approved').length} fois
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Panel Area */}
        <div className="flex-1 space-y-6">

          {/* Sub Navigation Bar tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap bg-white p-2.5 rounded-2xl shadow-2xs border border-slate-100 gap-1.5">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Espace Personnel & Accueil
            </button>
            <button
              onClick={() => setActiveSubTab('directory')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'directory'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Annuaire & Fiches Staff
            </button>
            <button
              onClick={() => {
                setActiveSubTab('attendance');
                startAttendanceMarking();
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'attendance'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Présences Journalières
            </button>
            <button
              onClick={() => setActiveSubTab('leaves')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'leaves'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Congés & Absences ({pendingLeaves > 0 ? `${pendingLeaves} attente` : '0'})
            </button>
            <button
              onClick={() => setActiveSubTab('payroll')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'payroll'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Fiches de Paie & Comptabilité
            </button>
          </div>

          {/* Sub-view: Overview / Dashboard Summary */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Nice banner */}
              <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-wider">Espace sm-staff-dashboard</span>
                  <h3 className="text-lg font-black tracking-tight">Bonjour, Directeur Académique</h3>
                  <p className="text-xs text-slate-300">Bienvenue dans le portail d'administration et de gestion de votre corps enseignant et de vos salariés.</p>
                </div>
                <button
                  onClick={openAddStaffModal}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 cursor-pointer shadow-xs transition-all"
                >
                  Ajouter un Employé
                </button>
              </div>

              {/* Action grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Recent pending leaves list */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                    <span>Dernières demandes de congés</span>
                    <span className="bg-amber-100 text-amber-800 font-bold rounded-md text-[9px] px-2 py-0.5">{pendingLeaves} à traiter</span>
                  </h4>

                  <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                    {leaves.length > 0 ? (
                      leaves.map(req => {
                        const s = staff.find(st => st.id === req.staffId);
                        return (
                          <div key={req.id} className="py-3 flex justify-between items-start text-xs gap-3">
                            <div>
                              <div className="font-extrabold text-slate-900">{s ? `${s.firstName} ${s.lastName}` : 'Anonyme'}</div>
                              <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{req.leaveType} • {req.startDate} au {req.endDate}</div>
                              <p className="text-slate-500 italic mt-1 font-medium text-[11px] max-w-sm">"{req.reason}"</p>
                            </div>
                            <div className="shrink-0">
                              {req.status === 'Pending' ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => onUpdateLeaveStatus(req.id, 'Approved')}
                                    className="p-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-md text-[10px] font-black uppercase cursor-pointer"
                                  >
                                    Accepter
                                  </button>
                                  <button
                                    onClick={() => onUpdateLeaveStatus(req.id, 'Rejected')}
                                    className="p-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-md text-[10px] font-black uppercase cursor-pointer"
                                  >
                                    Refuser
                                  </button>
                                </div>
                              ) : (
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                  req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                }`}>
                                  {req.status === 'Approved' ? 'Approuvé' : 'Refusé'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-slate-400 text-xs italic py-4 text-center">Aucune demande de congé enregistrée.</p>
                    )}
                  </div>
                </div>

                {/* Today's Check in activity log */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                    <span>Pointages & Activité du jour</span>
                    <span className="text-slate-400 text-[10px]">{new Date().toLocaleDateString('fr-FR')}</span>
                  </h4>

                  <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                    {staff.map(s => {
                      const checked = checkedInToday[s.id];
                      const todayAtt = attendance.find(a => a.staffId === s.id && a.date === new Date().toISOString().split('T')[0]);
                      const statusText = checked ? 'Présent (Simulé)' : (todayAtt ? todayAtt.status : 'Non pointé');
                      const checkIn = todayAtt?.checkInTime || (checked ? '08:30' : '---');
                      const checkOut = todayAtt?.checkOutTime || '---';

                      return (
                        <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-extrabold text-slate-900">{s.firstName} {s.lastName}</span>
                            <span className="block text-[10px] text-slate-400 font-bold uppercase">{s.role}</span>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                              statusText.includes('Présent') || statusText === 'Present'
                                ? 'bg-emerald-50 text-emerald-700'
                                : statusText === 'Late' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {statusText}
                            </span>
                            <span className="block text-[10px] font-mono text-slate-400 mt-0.5">E: {checkIn} • S: {checkOut}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Sub-view: Staff Directory & Profile Forms */}
          {activeSubTab === 'directory' && (
            <div className="space-y-6">
              {/* Header and Add button */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email..."
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <select
                    value={directoryRole}
                    onChange={(e) => setDirectoryRole(e.target.value)}
                    className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold text-slate-700"
                  >
                    <option value="all">Tous les rôles</option>
                    <option value="Administrateur">Administrateurs</option>
                    <option value="Comptable">Comptables</option>
                    <option value="Secrétaire">Secrétaires</option>
                    <option value="Bibliothécaire">Bibliothécaires</option>
                    <option value="Directeur">Directeurs</option>
                  </select>

                  <button
                    onClick={openAddStaffModal}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4" /> Ajouter
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                        <th className="py-3 px-4 font-bold">Identité de l'agent</th>
                        <th className="py-3 px-4 font-bold">Rôle / Poste</th>
                        <th className="py-3 px-4 font-bold">Diplômes / Titres</th>
                        <th className="py-3 px-4 font-bold">Coordonnées</th>
                        <th className="py-3 px-4 font-bold">Salaire de base</th>
                        <th className="py-3 px-4 font-bold text-center">Statut</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStaff.map(agent => (
                        <tr key={agent.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8.5 w-8.5 bg-blue-50 text-blue-700 font-extrabold rounded-lg flex items-center justify-center shrink-0">
                                {agent.firstName[0]}{agent.lastName[0]}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900">{agent.firstName} {agent.lastName}</div>
                                <div className="text-[10px] text-slate-400 font-bold">Embauche: {agent.joiningDate}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold">
                            <span className="text-blue-900 bg-blue-50/60 border border-blue-100 px-2 py-0.5 rounded-md text-[10px]">
                              {agent.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-semibold">{agent.qualification}</td>
                          <td className="py-3.5 px-4 space-y-0.5 text-slate-500 font-medium">
                            <div>{agent.email}</div>
                            <div className="text-[10px] font-mono">{agent.phone}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-950">{agent.salary.toLocaleString('fr-FR')} €</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              agent.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {agent.status === 'Active' ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditStaffModal(agent)}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="Modifier"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Supprimer définitivement ${agent.firstName} ${agent.lastName} de la base staff ?`)) {
                                    onDeleteStaff(agent.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: Staff Attendance marking log */}
          {activeSubTab === 'attendance' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Pointage Administratif Journalier</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Enregistrer et piloter les feuilles de présence de vos salariés.</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] text-slate-400 font-bold">Sélectionner la Date:</span>
                    <input
                      type="date"
                      value={selectedAttendanceDate}
                      onChange={(e) => {
                        setSelectedAttendanceDate(e.target.value);
                        startAttendanceMarking();
                      }}
                      className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold"
                    />
                  </div>
                </div>

                <form onSubmit={handleSaveAttendanceForm} className="space-y-4">
                  <div className="divide-y divide-slate-100">
                    {staff.map(agent => {
                      const status = attendanceRecords[agent.id] || 'Present';
                      return (
                        <div key={agent.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 bg-blue-50 text-blue-700 font-bold rounded-lg flex items-center justify-center shrink-0">
                              {agent.firstName[0]}{agent.lastName[0]}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900">{agent.firstName} {agent.lastName}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase">{agent.role}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
                            {['Present', 'Absent', 'Late', 'On Leave'].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setAttendanceRecords(prev => ({ ...prev, [agent.id]: opt as any }))}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border cursor-pointer ${
                                  status === opt
                                    ? opt === 'Present' ? 'bg-emerald-600 text-white border-emerald-600'
                                      : opt === 'Absent' ? 'bg-rose-600 text-white border-rose-600'
                                      : opt === 'Late' ? 'bg-amber-500 text-white border-amber-500'
                                      : 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                                }`}
                              >
                                {opt === 'Present' ? 'Présent' : opt === 'Absent' ? 'Absent' : opt === 'Late' ? 'En Retard' : 'En Congé'}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-xs cursor-pointer uppercase tracking-wider"
                    >
                      Enregistrer la Feuille de Présence
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Sub-view: Leave Request Log / Form */}
          {activeSubTab === 'leaves' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Demandes de congés</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Demandes d'absences, congés payés, et arrêts maladie du staff.</p>
                  </div>
                  <button
                    onClick={() => setIsLeaveModalOpen(true)}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Demander un Congé
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                        <th className="py-3 px-4 font-bold">Agent</th>
                        <th className="py-3 px-4 font-bold">Type</th>
                        <th className="py-3 px-4 font-bold">Période</th>
                        <th className="py-3 px-4 font-bold">Raison invoquée</th>
                        <th className="py-3 px-4 font-bold">Date Demande</th>
                        <th className="py-3 px-4 font-bold text-center">Statut</th>
                        <th className="py-3 px-4 font-bold text-right">Décision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaves.map(req => {
                        const agent = staff.find(s => s.id === req.staffId);
                        return (
                          <tr key={req.id} className="hover:bg-slate-50/20">
                            <td className="py-3.5 px-4">
                              <div className="font-extrabold text-slate-900">{agent ? `${agent.firstName} ${agent.lastName}` : 'Inconnu'}</div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">{agent?.role}</span>
                            </td>
                            <td className="py-3.5 px-4 font-bold">
                              <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                                {req.leaveType}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-700">Du {req.startDate} au {req.endDate}</td>
                            <td className="py-3.5 px-4 text-slate-500 italic max-w-xs truncate font-medium">"{req.reason}"</td>
                            <td className="py-3.5 px-4 text-slate-400 font-medium">{req.requestDate}</td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700'
                                  : req.status === 'Rejected' ? 'bg-rose-50 text-rose-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}>
                                {req.status === 'Approved' ? 'Accepté' : req.status === 'Rejected' ? 'Refusé' : 'En attente'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {req.status === 'Pending' && (
                                <div className="flex gap-1 justify-end">
                                  <button
                                    onClick={() => onUpdateLeaveStatus(req.id, 'Approved')}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase rounded-lg transition-colors cursor-pointer"
                                  >
                                    Accepter
                                  </button>
                                  <button
                                    onClick={() => onUpdateLeaveStatus(req.id, 'Rejected')}
                                    className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase rounded-lg transition-colors cursor-pointer"
                                  >
                                    Refuser
                                  </button>
                                </div>
                              )}
                              {req.status !== 'Pending' && (
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Traité</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: Payroll list and Slip printer */}
          {activeSubTab === 'payroll' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Bulletins de Salaire & Comptabilité Staff</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Émission des fiches de paie et historiques des paiements.</p>
                  </div>
                  <button
                    onClick={() => {
                      setPayStaffId(staff[0]?.id || '');
                      setIsPayrollModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Verser un Salaire
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                        <th className="py-3 px-4 font-bold">Membre du Personnel</th>
                        <th className="py-3 px-4 font-bold text-center">Période</th>
                        <th className="py-3 px-4 font-bold text-right">Salaire Brut</th>
                        <th className="py-3 px-4 font-bold text-right">Indemnités</th>
                        <th className="py-3 px-4 font-bold text-right">Deductions</th>
                        <th className="py-3 px-4 font-bold text-right">Net Versé</th>
                        <th className="py-3 px-4 font-bold">Date de Paiement</th>
                        <th className="py-3 px-4 font-bold text-center">Fiche de Paie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {payroll.map(pay => {
                        const s = staff.find(st => st.id === pay.staffId);
                        return (
                          <tr key={pay.id} className="hover:bg-slate-50/20">
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {s ? `${s.firstName} ${s.lastName}` : 'Inconnu'}
                              <span className="block text-[10px] text-slate-400 font-bold uppercase">{s?.role}</span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-blue-900">{pay.month}</td>
                            <td className="py-3.5 px-4 text-right font-mono">{pay.baseSalary.toLocaleString('fr-FR')} €</td>
                            <td className="py-3.5 px-4 text-right text-emerald-600 font-mono">+{pay.allowance.toLocaleString('fr-FR')} €</td>
                            <td className="py-3.5 px-4 text-right text-rose-600 font-mono">-{pay.deduction.toLocaleString('fr-FR')} €</td>
                            <td className="py-3.5 px-4 text-right font-mono font-black text-slate-950">{pay.netSalary.toLocaleString('fr-FR')} €</td>
                            <td className="py-3.5 px-4 text-slate-500">{pay.paymentDate || 'En cours'}</td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => setSelectedPayslip(pay)}
                                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              >
                                <FileText className="h-3.5 w-3.5 text-blue-600" /> Bulletin
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MODAL: ADD/EDIT STAFF */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
              <UserSquare2 className="h-4.5 w-4.5 text-blue-600" />
              {staffModalMode === 'add' ? 'Créer un dossier Agent' : 'Modifier les informations de l\'agent'}
            </h3>

            <form onSubmit={handleSaveStaffForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nom de famille</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">E-mail pro</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Téléphone mobile</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Désignation / Rôle</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold text-slate-700"
                  >
                    <option value="Administrateur">Administrateur</option>
                    <option value="Comptable">Comptable</option>
                    <option value="Secrétaire">Secrétaire</option>
                    <option value="Bibliothécaire">Bibliothécaire</option>
                    <option value="Directeur">Directeur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Niveau d'études / Titre</label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="Ex: Master, Doctorat, Licence..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Salaire de Base Brut (€)</label>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Statut initial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold text-slate-700"
                  >
                    <option value="Active">Actif</option>
                    <option value="Inactive">Inactif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT LEAVE REQUEST */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
              <CalendarDays className="h-4.5 w-4.5 text-blue-600" />
              Soumettre une demande d'absence
            </h3>

            <form onSubmit={handleAddLeaveForm} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 font-sans">Type de Congé</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold text-slate-700"
                >
                  <option value="Annuel">Congés Annuels</option>
                  <option value="Maladie">Arrêt Maladie</option>
                  <option value="Maternité">Maternité / Paternité</option>
                  <option value="Sans solde">Sans solde</option>
                  <option value="Autre">Autre circonstance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Date de début</label>
                  <input
                    type="date"
                    required
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Date de fin</label>
                  <input
                    type="date"
                    required
                    value={leaveEnd}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Motif détaillé</label>
                <textarea
                  required
                  rows={3}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Expliquez brièvement le motif de votre absence..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Envoyer la Demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VERSEMENT SALAIRE (PAYROLL) */}
      {isPayrollModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
              <DollarSign className="h-4.5 w-4.5 text-blue-600" />
              Émettre un Versement & Bulletin de Paie
            </h3>

            <form onSubmit={handleAddPayrollForm} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Bénéficiaire</label>
                <select
                  value={payStaffId}
                  onChange={(e) => setPayStaffId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold text-slate-700"
                >
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (Salaire de Base: {s.salary} €)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Mois d'évaluation</label>
                  <input
                    type="text"
                    required
                    value={payMonth}
                    onChange={(e) => setPayMonth(e.target.value)}
                    placeholder="Ex: Juillet 2026"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Primes / Indemnités (+)</label>
                  <input
                    type="number"
                    required
                    value={payAllowance}
                    onChange={(e) => setPayAllowance(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Deductions / Charges Retenues (-)</label>
                <input
                  type="number"
                  required
                  value={payDeduction}
                  onChange={(e) => setPayDeduction(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-mono font-bold text-slate-900"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayrollModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Émettre et Payer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
