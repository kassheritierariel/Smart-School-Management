import React, { useState } from 'react';
import { 
  Scale, 
  ShieldAlert, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Printer, 
  User, 
  Filter, 
  Calendar, 
  Check, 
  X, 
  FileText, 
  ArrowLeft,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { DisciplinaryIncident, Student, SchoolClass, SchoolProfile } from '../types';

interface DisciplineViewProps {
  incidents: DisciplinaryIncident[];
  students: Student[];
  classes: SchoolClass[];
  currentSchool?: SchoolProfile | null;
  onAddIncident: (incident: Omit<DisciplinaryIncident, 'id'>) => void;
  onUpdateIncidentStatus: (id: string, status: DisciplinaryIncident['status'], correctiveAction?: string, actionDate?: string) => void;
  onDeleteIncident: (id: string) => void;
}

export default function DisciplineView({
  incidents,
  students,
  classes,
  currentSchool,
  onAddIncident,
  onUpdateIncidentStatus,
  onDeleteIncident
}: DisciplineViewProps) {
  // Tabs: 'all' (Tous les signalements) or 'register' (Registre par élève)
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'register'>('all');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState<DisciplinaryIncident | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState<string | null>(null); // studentId for register print preview

  // Add Incident Form state
  const [studentId, setStudentId] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [severity, setSeverity] = useState<'Faible' | 'Moyenne' | 'Grave'>('Moyenne');
  const [infractionType, setInfractionType] = useState<DisciplinaryIncident['infractionType']>('Non-respect du règlement');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [actionDate, setActionDate] = useState('');
  const [status, setStatus] = useState<DisciplinaryIncident['status']>('Signalé');

  // Search/Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('Tous');
  const [filterStatus, setFilterStatus] = useState<string>('Tous');
  const [filterType, setFilterType] = useState<string>('Tous');

  // Resolve form state
  const [resolveAction, setResolveAction] = useState('');
  const [resolveStatus, setResolveStatus] = useState<DisciplinaryIncident['status']>('Résolu');
  const [resolveDate, setResolveDate] = useState(new Date().toISOString().split('T')[0]);

  // Selected Student for the specific Register View
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Handle logging new incident
  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !incidentDate || !description.trim() || !reportedBy.trim()) {
      alert("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    onAddIncident({
      studentId,
      incidentDate,
      severity,
      infractionType,
      description,
      reportedBy,
      correctiveAction,
      actionDate: correctiveAction ? (actionDate || incidentDate) : undefined,
      status
    });

    // Reset fields
    setStudentId('');
    setIncidentDate(new Date().toISOString().split('T')[0]);
    setSeverity('Moyenne');
    setInfractionType('Non-respect du règlement');
    setDescription('');
    setReportedBy('');
    setCorrectiveAction('');
    setActionDate('');
    setStatus('Signalé');
    setShowAddModal(false);
  };

  // Handle resolving infraction
  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResolveModal) return;

    onUpdateIncidentStatus(
      showResolveModal.id,
      resolveStatus,
      resolveAction,
      resolveDate
    );

    setShowResolveModal(null);
    setResolveAction('');
    setResolveStatus('Résolu');
  };

  // Help functions to map names
  const getStudentName = (id: string) => {
    const student = students.find(s => s.id === id);
    return student ? `${student.firstName} ${student.lastName}` : 'Élève inconnu';
  };

  const getStudentClass = (id: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return 'Non assigné';
    const cl = classes.find(c => c.id === student.classId);
    return cl ? cl.name : 'Non assigné';
  };

  const getStudentRollNumber = (id: string) => {
    const student = students.find(s => s.id === id);
    return student ? student.rollNumber : '';
  };

  // Get list of severity-based tailwind colors
  const getSeverityBadge = (sev: 'Faible' | 'Moyenne' | 'Grave') => {
    switch (sev) {
      case 'Faible':
        return <span className="text-[10px] font-bold uppercase bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-md">Faible</span>;
      case 'Moyenne':
        return <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md">Moyenne</span>;
      case 'Grave':
        return <span className="text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-md animate-pulse">Grave</span>;
    }
  };

  const getStatusBadge = (st: DisciplinaryIncident['status']) => {
    switch (st) {
      case 'Signalé':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" /> Signalé
          </span>
        );
      case 'En cours':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3 animate-spin" /> En cours
          </span>
        );
      case 'Résolu':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle className="h-3 w-3" /> Résolu
          </span>
        );
      case 'Classé sans suite':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
            <XCircle className="h-3 w-3" /> Classé sans suite
          </span>
        );
    }
  };

  // Filtered incidents for 'all' list
  const filteredIncidents = incidents.filter(inc => {
    const sName = getStudentName(inc.studentId).toLowerCase();
    const sClass = getStudentClass(inc.studentId).toLowerCase();
    const typeMatches = filterType === 'Tous' || inc.infractionType === filterType;
    const severityMatches = filterSeverity === 'Tous' || inc.severity === filterSeverity;
    const statusMatches = filterStatus === 'Tous' || inc.status === filterStatus;
    const searchMatches = sName.includes(searchTerm.toLowerCase()) || 
                          sClass.includes(searchTerm.toLowerCase()) || 
                          inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatches && severityMatches && statusMatches && searchMatches;
  });

  // Calculate stats
  const totalCount = incidents.length;
  const graveCount = incidents.filter(i => i.severity === 'Grave').length;
  const unresolvedCount = incidents.filter(i => i.status === 'Signalé' || i.status === 'En cours').length;
  const resolvedCount = incidents.filter(i => i.status === 'Résolu').length;

  // For Disciplinary register view per student
  const studentsWithIncidents = students.filter(st => incidents.some(inc => inc.studentId === st.id));
  const activeRegisterStudentId = selectedStudentId || (studentsWithIncidents[0]?.id || '');
  const activeStudentRegisterIncidents = incidents
    .filter(inc => inc.studentId === activeRegisterStudentId)
    .sort((a, b) => b.incidentDate.localeCompare(a.incidentDate));

  const activeStudentInfo = students.find(s => s.id === activeRegisterStudentId);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="h-6 w-6 text-rose-600" />
            Gestion de la Discipline Scolaire
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
              Registre Disciplinaire
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Suivre les infractions des élèves, appliquer des mesures correctives et générer un casier/registre disciplinaire individuel.
          </p>
        </div>
        <button
          onClick={() => {
            if (students.length > 0) {
              setStudentId(students[0].id);
            }
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 border border-rose-500"
        >
          <Plus className="h-4 w-4" />
          Signaler une Infraction
        </button>
      </div>

      {/* KPI statistics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total incidents */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Signalements</span>
            <div className="text-2xl font-black text-slate-900">{totalCount}</div>
            <div className="text-[10px] text-slate-500 font-semibold">Infractions enregistrées</div>
          </div>
          <div className="p-3 bg-slate-50 text-slate-700 rounded-xl">
            <Scale className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Serious incidents */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cas Graves (!!)</span>
            <div className="text-2xl font-black text-rose-600">{graveCount}</div>
            <div className="text-[10px] text-rose-500 font-semibold">Nécessite action urgente</div>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Pending review */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dossiers en cours</span>
            <div className="text-2xl font-black text-amber-600">{unresolvedCount}</div>
            <div className="text-[10px] text-amber-600 font-semibold">Mesures correctives requises</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl animate-pulse">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: Resolved */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incidents Résolus</span>
            <div className="text-2xl font-black text-emerald-600">{resolvedCount}</div>
            <div className="text-[10px] text-emerald-500 font-semibold">Taux de résolution: {totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 100}%</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'all'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Tous les Signalements ({filteredIncidents.length})
        </button>
        <button
          onClick={() => setActiveSubTab('register')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'register'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Registre Disciplinaire par Élève
        </button>
      </div>

      {/* TAB 1: ALL REPORTS & MANAGEMENT */}
      {activeSubTab === 'all' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Rechercher un élève, classe, motif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Filter selectors */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs text-slate-600">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-[11px] text-slate-400 uppercase">Gravité:</span>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="bg-transparent border-none text-slate-700 font-bold focus:outline-hidden text-xs cursor-pointer"
                >
                  <option value="Tous">Tous</option>
                  <option value="Faible">Faible</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Grave">Grave</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs text-slate-600">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-[11px] text-slate-400 uppercase">Statut:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent border-none text-slate-700 font-bold focus:outline-hidden text-xs cursor-pointer"
                >
                  <option value="Tous">Tous</option>
                  <option value="Signalé">Signalé</option>
                  <option value="En cours">En cours</option>
                  <option value="Résolu">Résolu</option>
                  <option value="Classé sans suite">Classé sans suite</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs text-slate-600">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-[11px] text-slate-400 uppercase">Type:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-transparent border-none text-slate-700 font-bold focus:outline-hidden text-xs cursor-pointer"
                >
                  <option value="Tous">Tous</option>
                  <option value="Retard répété">Retard répété</option>
                  <option value="Absence injustifiée">Absence injustifiée</option>
                  <option value="Bagarre">Bagarre</option>
                  <option value="Tricherie">Tricherie</option>
                  <option value="Non-respect du règlement">Non-respect du règlement</option>
                  <option value="Insolence">Insolence</option>
                  <option value="Vandalisme">Vandalisme</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
          </div>

          {/* Incidents Registry List */}
          {filteredIncidents.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              <Scale className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Aucun signalement disciplinaire trouvé</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Aucune infraction ne correspond à vos filtres de recherche. Utilisez le bouton ci-dessus pour déclarer une nouvelle infraction.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                      <th className="p-4">Élève</th>
                      <th className="p-4">Classe / ID</th>
                      <th className="p-4">Date de l'Incident</th>
                      <th className="p-4">Infraction / Motif</th>
                      <th className="p-4">Gravité</th>
                      <th className="p-4">Rapporté Par</th>
                      <th className="p-4">Statut</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredIncidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-extrabold text-slate-950">{getStudentName(inc.studentId)}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{getStudentRollNumber(inc.studentId)}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md">
                            {getStudentClass(inc.studentId)}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-semibold flex items-center gap-1.5 mt-2.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {inc.incidentDate}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{inc.infractionType}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5" title={inc.description}>
                            {inc.description}
                          </div>
                        </td>
                        <td className="p-4">{getSeverityBadge(inc.severity)}</td>
                        <td className="p-4 text-slate-500 font-medium">{inc.reportedBy}</td>
                        <td className="p-4">{getStatusBadge(inc.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Update action status */}
                            <button
                              onClick={() => {
                                setResolveAction(inc.correctiveAction || '');
                                setResolveStatus(inc.status);
                                if (inc.actionDate) setResolveDate(inc.actionDate);
                                setShowResolveModal(inc);
                              }}
                              className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Décider d'une action correctrice / Résoudre"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>

                            {/* View history / print single report */}
                            <button
                              onClick={() => {
                                setSelectedStudentId(inc.studentId);
                                setActiveSubTab('register');
                              }}
                              className="p-1.5 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Voir le registre de l'élève"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete record */}
                            <button
                              onClick={() => {
                                if (confirm("Êtes-vous sûr de vouloir supprimer définitivement cet enregistrement disciplinaire ?")) {
                                  onDeleteIncident(inc.id);
                                }
                              }}
                              className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Supprimer la fiche"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DISCIPLINARY REGISTER BY STUDENT */}
      {activeSubTab === 'register' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: student selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs space-y-4 h-fit">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Sélectionner un Élève</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {students.map((st) => {
                const count = incidents.filter(i => i.studentId === st.id).length;
                const graves = incidents.filter(i => i.studentId === st.id && i.severity === 'Grave').length;
                const isActive = st.id === activeRegisterStudentId;

                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStudentId(st.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? 'border-rose-500 bg-rose-50/30 ring-1 ring-rose-500/20' 
                        : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">{st.firstName} {st.lastName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{st.rollNumber} • {getStudentClass(st.id)}</div>
                    </div>

                    <div className="flex gap-1">
                      {count > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700" title={`${count} signalement(s)`}>
                          {count}
                        </span>
                      )}
                      {graves > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse" title={`${graves} grave(s) !`}>
                          {graves} G
                        </span>
                      )}
                      {count === 0 && (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          Vierge
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Timeline of infractions & summary */}
          <div className="lg:col-span-2 space-y-6">
            {activeStudentInfo ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs space-y-6">
                
                {/* Student summary banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 bg-rose-50 text-rose-700 rounded-2xl flex items-center justify-center font-black text-sm">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">{activeStudentInfo.firstName} {activeStudentInfo.lastName}</h2>
                      <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1 mt-0.5 font-semibold">
                        <span>Matricule: <span className="font-mono font-bold text-slate-700">{activeStudentInfo.rollNumber}</span></span>
                        <span>Classe: <span className="font-bold text-slate-700">{getStudentClass(activeStudentInfo.id)}</span></span>
                        <span>Sexe: <span className="font-bold text-slate-700">{activeStudentInfo.gender}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPrintPreview(activeStudentInfo.id)}
                      className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Imprimer Registre
                    </button>
                  </div>
                </div>

                {/* Scorecard or warnings indicator */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Total Infractions</div>
                    <div className="text-lg font-black text-slate-800 mt-1">{activeStudentRegisterIncidents.length}</div>
                  </div>

                  <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl">
                    <div className="text-[10px] text-rose-500 font-bold uppercase">Mesures Graves</div>
                    <div className="text-lg font-black text-rose-700 mt-1">
                      {activeStudentRegisterIncidents.filter(i => i.severity === 'Grave').length}
                    </div>
                  </div>

                  <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                    <div className="text-[10px] text-emerald-600 font-bold uppercase">Comportement Général</div>
                    <div className="text-xs font-bold text-slate-800 mt-2">
                      {activeStudentRegisterIncidents.filter(i => i.severity === 'Grave').length >= 2 ? (
                        <span className="text-rose-600 uppercase">Avertissement de conduite</span>
                      ) : activeStudentRegisterIncidents.length > 0 ? (
                        <span className="text-amber-600 uppercase">Sous surveillance</span>
                      ) : (
                        <span className="text-emerald-600 uppercase">Excellent</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chronological timeline */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Registre Chronologique</h3>
                  
                  {activeStudentRegisterIncidents.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                      <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">Dossier disciplinaire vierge</p>
                      <p className="text-[11px] text-slate-400 mt-1">Cet élève fait preuve d'un comportement exemplaire.</p>
                    </div>
                  ) : (
                    <div className="relative border-l border-slate-200 ml-3 pl-6 space-y-6">
                      {activeStudentRegisterIncidents.map((inc) => (
                        <div key={inc.id} className="relative">
                          {/* Timeline dot */}
                          <span className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center ${
                            inc.severity === 'Grave' ? 'bg-rose-500 ring-4 ring-rose-100' :
                            inc.severity === 'Moyenne' ? 'bg-amber-500 ring-4 ring-amber-100' :
                            'bg-sky-500 ring-4 ring-sky-100'
                          }`} />

                          {/* Incident Card */}
                          <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl p-4 transition-all space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-800 text-xs">{inc.infractionType}</span>
                                {getSeverityBadge(inc.severity)}
                              </div>
                              <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" />
                                {inc.incidentDate}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                              {inc.description}
                            </p>

                            <div className="border-t border-slate-100/80 pt-2 mt-2 flex flex-col gap-1.5 text-[11px]">
                              <div>
                                <span className="text-slate-400 font-bold uppercase">Rapporté par : </span>
                                <span className="text-slate-700 font-semibold">{inc.reportedBy}</span>
                              </div>
                              {inc.correctiveAction ? (
                                <div className="bg-white/80 p-2.5 rounded-lg border border-slate-100/50 mt-1">
                                  <span className="text-rose-600 font-bold uppercase">Mesure Corrective : </span>
                                  <p className="text-xs font-bold text-slate-800 mt-1">{inc.correctiveAction}</p>
                                  {inc.actionDate && (
                                    <span className="text-[10px] text-slate-400 font-bold block mt-1">
                                      Appliquée le : {inc.actionDate}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="text-rose-500 font-bold italic mt-1 flex items-center gap-1">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Aucune mesure corrective décidée pour l'instant.
                                </div>
                              )}
                              <div className="mt-1 flex justify-between items-center">
                                <div>
                                  <span className="text-slate-400 font-bold uppercase">Statut : </span>
                                  {getStatusBadge(inc.status)}
                                </div>
                                
                                {/* Quick edit resolve */}
                                <button
                                  onClick={() => {
                                    setResolveAction(inc.correctiveAction || '');
                                    setResolveStatus(inc.status);
                                    if (inc.actionDate) setResolveDate(inc.actionDate);
                                    setShowResolveModal(inc);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-1 cursor-pointer"
                                >
                                  Mettre à jour <Edit className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 border border-slate-100 rounded-2xl text-center text-slate-400">
                Sélectionnez un élève à gauche pour consulter son registre de discipline.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD DISCIPLINARY INCIDENT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between bg-slate-900 text-white px-5 py-4">
              <h3 className="font-bold text-sm tracking-tight uppercase flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                Signaler une nouvelle Infraction
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitIncident} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student list */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Élève concerné *
                  </label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-semibold cursor-pointer"
                    required
                  >
                    <option value="" disabled>-- Sélectionner un élève --</option>
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.firstName} {st.lastName} ({getStudentClass(st.id)}) - {st.rollNumber}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Infraction Type */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Motif / Infraction *
                  </label>
                  <select
                    value={infractionType}
                    onChange={(e) => setInfractionType(e.target.value as DisciplinaryIncident['infractionType'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-bold cursor-pointer"
                    required
                  >
                    <option value="Retard répété">Retard répété</option>
                    <option value="Absence injustifiée">Absence injustifiée</option>
                    <option value="Bagarre">Bagarre</option>
                    <option value="Tricherie">Tricherie</option>
                    <option value="Non-respect du règlement">Non-respect du règlement</option>
                    <option value="Insolence">Insolence</option>
                    <option value="Vandalisme">Vandalisme</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Niveau de Gravité *
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as 'Faible' | 'Moyenne' | 'Grave')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-bold cursor-pointer"
                    required
                  >
                    <option value="Faible">Faible (Avertissement simple)</option>
                    <option value="Moyenne">Moyenne (Heure de colle / retenue)</option>
                    <option value="Grave">Grave (Exclusion / Convocation de conseil)</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Date de l'incident *
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-semibold"
                    required
                  />
                </div>

                {/* Reported By */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Signalé par (Nom) *
                  </label>
                  <input
                    type="text"
                    placeholder="M. Dupont, Surveillant, etc."
                    value={reportedBy}
                    onChange={(e) => setReportedBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                  Description détaillée des faits *
                </label>
                <textarea
                  rows={3}
                  placeholder="Expliquer précisément ce qu'il s'est passé..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-medium"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                  Statut initial
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DisciplinaryIncident['status'])}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-bold cursor-pointer"
                >
                  <option value="Signalé">Signalé (En attente d'instruction)</option>
                  <option value="En cours">En cours de traitement</option>
                  <option value="Résolu">Résolu (Mesure appliquée)</option>
                  <option value="Classé sans suite">Classé sans suite</option>
                </select>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-4">
                <h4 className="text-[10px] font-black uppercase text-rose-500 tracking-wider mb-2">Décider d'une action corrective immédiate (Optionnel)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                      Sanction / Mesure correctrice
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Retenue de 2h, exclusion temporaire..."
                      value={correctiveAction}
                      onChange={(e) => setCorrectiveAction(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                      Date d'application
                    </label>
                    <input
                      type="date"
                      value={actionDate}
                      onChange={(e) => setActionDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer shadow-md shadow-rose-500/20"
                >
                  Enregistrer l'Infraction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESOLVE / UPDATE DISCIPLINARY INCIDENT */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between bg-slate-950 text-white px-5 py-4">
              <h3 className="font-bold text-sm tracking-tight uppercase flex items-center gap-2">
                <Edit className="h-4.5 w-4.5 text-blue-500" />
                Mettre à jour la fiche de discipline
              </h3>
              <button 
                onClick={() => setShowResolveModal(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="p-5 space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Élève</span>
                <span className="text-xs font-black text-slate-900">{getStudentName(showResolveModal.studentId)}</span>
                <span className="text-xs font-semibold text-slate-400 ml-1">({getStudentClass(showResolveModal.studentId)})</span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Infraction signalée</span>
                <span className="text-xs font-bold text-slate-800">{showResolveModal.infractionType} ({showResolveModal.incidentDate})</span>
                <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium">
                  "{showResolveModal.description}"
                </p>
              </div>

              {/* Sanction input */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                  Sanction / Mesure correctrice prise *
                </label>
                <textarea
                  rows={2}
                  placeholder="Décrire la mesure décidée (avertissement, retenue, colle, conseil de discipline, exclusion...)"
                  value={resolveAction}
                  onChange={(e) => setResolveAction(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date resolution */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Date de la mesure *
                  </label>
                  <input
                    type="date"
                    value={resolveDate}
                    onChange={(e) => setResolveDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-semibold"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Statut du Dossier *
                  </label>
                  <select
                    value={resolveStatus}
                    onChange={(e) => setResolveStatus(e.target.value as DisciplinaryIncident['status'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden font-bold cursor-pointer"
                    required
                  >
                    <option value="Signalé">Signalé</option>
                    <option value="En cours">En cours de traitement</option>
                    <option value="Résolu">Résolu (Mesure appliquée)</option>
                    <option value="Classé sans suite">Classé sans suite</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer shadow-md"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PRINT PREVIEW MODAL */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-slate-950 text-white px-6 py-4 print:hidden">
              <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
                <Printer className="h-4.5 w-4.5 text-blue-500" />
                Aperçu Avant Impression : Casier Disciplinaire
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-blue-500 shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Imprimer Maintenant
                </button>
                <button 
                  onClick={() => setShowPrintPreview(null)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Area */}
            <div className="p-8 space-y-6 bg-white text-slate-900 print:p-0 print:text-black font-sans">
              
              {/* Official School Header */}
              <div className="border-b-4 border-slate-900 pb-5 flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  {currentSchool?.logoUrl && (
                    <img src={currentSchool.logoUrl} alt="Logo" className="h-16 w-16 object-contain" />
                  )}
                  <div className="space-y-1">
                    <h1 className="text-xl font-black uppercase tracking-tight text-slate-950">MINISTÈRE DE L'ENSEIGNEMENT PRIMAIRE & SECONDAIRE</h1>
                    <h2 className="text-sm font-extrabold text-slate-800 uppercase">{currentSchool?.name || "SMART SCHOOL SYSTEM"} - REPRÉSENTATION ACADÉMIQUE</h2>
                    <p className="text-[10px] text-slate-500 font-bold font-mono">{currentSchool?.address || "B.P. 10443"} • {currentSchool?.email || "direction@ecole.edu"}</p>
                  </div>
                </div>
                <div className="text-right space-y-1 font-semibold text-xs text-slate-500">
                  <div>Réf : <span className="font-mono font-bold text-slate-800">DISC-{Date.now().toString().slice(-6)}</span></div>
                  <div>Date : <span className="font-bold text-slate-800">{new Date().toLocaleDateString('fr-FR')}</span></div>
                </div>
              </div>

              <div className="text-center space-y-1.5 py-2">
                <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 bg-slate-100 py-1.5 rounded-lg border border-slate-200">
                  FICHE D'ÉVALUATION & REGISTRE DISCIPLINAIRE
                </h2>
                <p className="text-xs text-slate-400 italic">Dossier de suivi interne et confidentiel de l'élève</p>
              </div>

              {/* Student Metadata box */}
              {(() => {
                const prStud = students.find(s => s.id === showPrintPreview);
                if (!prStud) return null;
                const prIncs = incidents.filter(i => i.studentId === prStud.id).sort((a,b) => b.incidentDate.localeCompare(a.incidentDate));
                const prGrave = prIncs.filter(i => i.severity === 'Grave').length;

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[9px]">Nom complet de l'élève</span>
                          <span className="font-black text-slate-950 text-sm">{prStud.firstName} {prStud.lastName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[9px]">Matricule académique</span>
                          <span className="font-mono font-bold text-slate-800">{prStud.rollNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[9px]">Classe actuelle</span>
                          <span className="font-bold text-slate-800">{getStudentClass(prStud.id)}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[9px]">Tuteur principal</span>
                          <span className="font-bold text-slate-800">{prStud.parentName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[9px]">Téléphone tuteur</span>
                          <span className="font-mono font-bold text-slate-800">{prStud.parentPhone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[9px]">Nombre total de signalements</span>
                          <span className="font-extrabold text-slate-800">{prIncs.length} (dont {prGrave} de gravité élevée)</span>
                        </div>
                      </div>
                    </div>

                    {/* Table of incidents */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black uppercase text-slate-950 border-b border-slate-900 pb-1">
                        Historique Détaillé des Infractions
                      </h3>
                      
                      {prIncs.length === 0 ? (
                        <div className="p-12 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                          Aucune infraction inscrite au registre disciplinaire de cet élève. Comportement exemplaire.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {prIncs.map((inc, index) => (
                            <div key={inc.id} className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-slate-50/20">
                              <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 pb-1.5">
                                <span className="text-slate-950">Incident #{prIncs.length - index} : {inc.infractionType}</span>
                                <span className="font-mono text-slate-500">{inc.incidentDate}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-500 py-1">
                                <div>Gravité : <span className="text-slate-900 font-bold uppercase">{inc.severity}</span></div>
                                <div>Rapporté par : <span className="text-slate-900">{inc.reportedBy}</span></div>
                                <div>Statut : <span className="text-slate-900">{inc.status}</span></div>
                              </div>
                              <div className="text-[11px] leading-relaxed text-slate-700">
                                <span className="font-bold text-slate-800 block mb-0.5">Description des faits :</span>
                                "{inc.description}"
                              </div>
                              {inc.correctiveAction && (
                                <div className="text-[11px] leading-relaxed bg-white p-2 rounded-lg border border-slate-100">
                                  <span className="font-bold text-rose-700 block mb-0.5">Décision administrative / Mesure corrective :</span>
                                  <p className="font-bold text-slate-950">{inc.correctiveAction}</p>
                                  {inc.actionDate && (
                                    <span className="text-[10px] text-slate-400 block mt-0.5">Date d'application : {inc.actionDate}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Signatures block */}
                    <div className="grid grid-cols-2 gap-12 pt-12 text-center text-xs">
                      <div className="space-y-16">
                        <span className="font-black text-slate-900 uppercase block">Le Tuteur de l'Élève</span>
                        <div className="text-[11px] text-slate-400 italic">Signature précédée de la mention "Lu et approuvé"</div>
                      </div>
                      <div className="space-y-16">
                        <span className="font-black text-slate-900 uppercase block">Le Directeur Académique</span>
                        <div className="text-[11px] text-slate-400 italic">Signature et sceau de l'établissement</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
