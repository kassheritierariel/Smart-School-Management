import React, { useState } from 'react';
import { z } from 'zod';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  UserSquare2, 
  Phone, 
  Mail, 
  Briefcase, 
  BookOpen, 
  GraduationCap, 
  DollarSign, 
  Calendar,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Teacher } from '../types';

const teacherSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("L'adresse e-mail est invalide"),
  phone: z.string().regex(/^[0-9\-\+\s]{8,15}$/, "Le numéro de téléphone est invalide (8 à 15 caractères)"),
});

interface TeachersViewProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
}

export default function TeachersView({
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
}: TeachersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Teacher modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subjectsString, setSubjectsString] = useState(''); // Comma-separated
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [salary, setSalary] = useState(2500);
  const [qualification, setQualification] = useState('');

  const openAddModal = () => {
    setModalMode('add');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setSubjectsString('');
    setStatus('Active');
    setSalary(2500);
    setQualification('');
    setIsModalOpen(true);
  };

  const openEditModal = (teacher: Teacher) => {
    setModalMode('edit');
    setEditingTeacher(teacher);
    setFirstName(teacher.firstName);
    setLastName(teacher.lastName);
    setEmail(teacher.email);
    setPhone(teacher.phone);
    setSubjectsString(teacher.subjects.join(', '));
    setStatus(teacher.status);
    setSalary(teacher.salary);
    setQualification(teacher.qualification);
    setIsModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      teacherSchema.parse({ firstName, lastName, email, phone });
    } catch (err: any) {
      if (err && typeof err === 'object' && 'errors' in err) {
        alert(err.errors.map((e: any) => e.message).join('\n'));
      }
      return;
    }

    const subjects = subjectsString
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (modalMode === 'add') {
      onAddTeacher({
        firstName,
        lastName,
        email,
        phone,
        subjects,
        status,
        salary,
        qualification,
        joiningDate: new Date().toISOString().split('T')[0]
      });
    } else if (modalMode === 'edit' && editingTeacher) {
      onUpdateTeacher({
        ...editingTeacher,
        firstName,
        lastName,
        email,
        phone,
        subjects,
        status,
        salary,
        qualification,
      });
    }
    setIsModalOpen(false);
  };

  // Filter teachers
  const filteredTeachers = teachers.filter(teacher => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.subjects.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || teacher.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Math stats
  const activeTeachersCount = teachers.filter(t => t.status === 'Active').length;
  const totalMonthlyPayroll = teachers.reduce((sum, t) => sum + (t.status === 'Active' ? t.salary : 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Corps Enseignant</h2>
          <p className="text-xs text-gray-500 mt-0.5">Piloter les enseignants, leurs matières associées et la masse salariale.</p>
        </div>
        
        <button
          onClick={openAddModal}
          id="btn-add-teacher"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter un Enseignant
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <UserSquare2 className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <div className="text-gray-400 font-medium">Total Professeurs</div>
            <div className="text-lg font-bold text-gray-900">{teachers.length} ({activeTeachersCount} actifs)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <div className="text-gray-400 font-medium">Masse Salariale Mensuelle</div>
            <div className="text-lg font-bold text-emerald-600">{totalMonthlyPayroll} €</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <div className="text-gray-400 font-medium">Spécialités Enseignées</div>
            <div className="text-lg font-bold text-purple-600">
              {Array.from(new Set(teachers.flatMap(t => t.subjects))).length} disciplines
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, matière, spécialité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-gray-400 font-medium">Statut:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs py-2 bg-gray-50/70 border border-gray-200 rounded-xl px-2.5 focus:outline-hidden focus:border-indigo-500 focus:bg-white font-medium text-gray-700"
          >
            <option value="all">Tous les statuts</option>
            <option value="Active">Actifs uniquement</option>
            <option value="Inactive">Inactifs uniquement</option>
          </select>
        </div>
      </div>

      {/* Table / Grid list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {filteredTeachers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/60 text-gray-400 uppercase tracking-wider text-[10px] font-semibold border-b border-gray-100">
                  <th className="py-3 px-4 font-semibold">Enseignant</th>
                  <th className="py-3 px-4 font-semibold">Diplômes & Qualifications</th>
                  <th className="py-3 px-4 font-semibold">Matières assignées</th>
                  <th className="py-3 px-4 font-semibold">Coordonnées</th>
                  <th className="py-3 px-4 font-semibold">Salaire Mensuel</th>
                  <th className="py-3 px-4 font-semibold text-center">Statut</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-emerald-50 text-emerald-700 font-bold rounded-lg flex items-center justify-center shrink-0">
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-950">
                            {teacher.firstName} {teacher.lastName}
                          </div>
                          <div className="text-[10px] text-gray-400">Arrivé le {teacher.joiningDate}</div>
                        </div>
                      </div>
                    </td>

                    {/* Qualifications */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <GraduationCap className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="font-medium">{teacher.qualification}</span>
                      </div>
                    </td>

                    {/* Assigned Subjects */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.length > 0 ? (
                          teacher.subjects.map((sub, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100/50 rounded-md text-[10px] font-medium">
                              {sub}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-400">Aucune matière</span>
                        )}
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                        <span>{teacher.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                        <Phone className="h-3 w-3 text-gray-400 shrink-0" />
                        <span>{teacher.phone}</span>
                      </div>
                    </td>

                    {/* Salary */}
                    <td className="py-3.5 px-4 font-semibold text-gray-950 font-mono">
                      {teacher.salary} €
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        teacher.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {teacher.status === 'Active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(teacher)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer définitivement l'enseignant ${teacher.firstName} ${teacher.lastName} ?`)) {
                              onDeleteTeacher(teacher.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-gray-400 text-sm">Aucun enseignant ne correspond à votre recherche ou vos filtres.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedStatus('all'); }} 
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-2 flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="h-3 w-3" /> Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-gray-100 overflow-y-auto max-h-[90vh]">
            <h3 className="text-md font-semibold text-gray-900 mb-4">
              {modalMode === 'add' ? "Ajouter un Enseignant" : "Modifier la Fiche Enseignant"}
            </h3>

            <form onSubmit={handleSaveTeacher} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Nom de famille</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@ecole.fr"
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Téléphone de contact</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    placeholder="06 ..."
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Qualification / Titre</label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    placeholder="Ex: Master, CAPES, Agrégation, Doctorat..."
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Salaire Mensuel Brut (€)</label>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Matières Enseignées (séparées par des virgules)</label>
                <input
                  type="text"
                  value={subjectsString}
                  onChange={(e) => setSubjectsString(e.target.value)}
                  placeholder="Ex: Mathématiques, Algèbre, Trigonométrie"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                />
                <p className="text-[10px] text-gray-400 mt-1">Saisir les matières une par une séparées par des virgules.</p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Statut d'activité</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                >
                  <option value="Active">Actif (En Poste)</option>
                  <option value="Inactive">Inactif (Congé / Démission)</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
