import React, { useState } from 'react';
import { 
  Calendar, 
  Check, 
  X, 
  Trash2, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { StudentLeave, Student, SchoolClass } from '../types';

interface StudentLeavesViewProps {
  leaves: StudentLeave[];
  students: Student[];
  classes: SchoolClass[];
  onAddLeave: (leave: Omit<StudentLeave, 'id'>) => void;
  onUpdateLeaveStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  onDeleteLeave: (id: string) => void;
}

export default function StudentLeavesView({
  leaves,
  students,
  classes,
  onAddLeave,
  onUpdateLeaveStatus,
  onDeleteLeave
}: StudentLeavesViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !startDate || !endDate || !reason.trim()) return;

    onAddLeave({
      studentId,
      startDate,
      endDate,
      reason,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0]
    });

    setStudentId('');
    setStartDate('');
    setEndDate('');
    setReason('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Demandes d'Absence Élèves / Student Leaves
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              SM Leaves Board
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Suivre les demandes d'absence justifiées soumises par les parents d'élèves, accorder les autorisations et archiver les motifs.
          </p>
        </div>
        <button
          onClick={() => {
            if (students.length > 0) {
              setStudentId(students[0].id);
            }
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Déclarer une Absence
        </button>
      </div>

      {/* Grid count cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Absences en Attente</div>
            <div className="text-lg font-bold text-slate-900">
              {leaves.filter(l => l.status === 'Pending').length}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Absences Autorisées</div>
            <div className="text-lg font-bold text-slate-900">
              {leaves.filter(l => l.status === 'Approved').length}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Absences Rejetées / Non Justifiées</div>
            <div className="text-lg font-bold text-slate-900">
              {leaves.filter(l => l.status === 'Rejected').length}
            </div>
          </div>
        </div>
      </div>

      {/* Leave request table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[9px] font-bold tracking-wider border-b border-slate-100">
                <th className="py-3 px-4">Élève</th>
                <th className="py-3 px-4">Classe</th>
                <th className="py-3 px-4">Période d'Absence</th>
                <th className="py-3 px-4">Date Demande</th>
                <th className="py-3 px-4">Justification / Motif</th>
                <th className="py-3 px-4 text-center">Décision</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {leaves.map((leave) => {
                const student = students.find(s => s.id === leave.studentId);
                const cls = student ? classes.find(c => c.id === student.classId) : null;
                return (
                  <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-950 text-xs">
                      {student ? `${student.firstName} ${student.lastName}` : 'Élève Inconnu'}
                    </td>
                    <td className="py-4 px-4">
                      {cls ? (
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                          {cls.name}
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-slate-700 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>du {leave.startDate} au {leave.endDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono text-[10px]">
                      {leave.requestDate}
                    </td>
                    <td className="py-4 px-4 max-w-xs text-slate-500 font-medium italic text-[11px] leading-relaxed truncate" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        leave.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {leave.status === 'Approved' ? 'Autorisé' :
                         leave.status === 'Rejected' ? 'Refusé' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {leave.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => {
                                if (confirm("Autoriser cette absence pour cet élève ?")) {
                                  onUpdateLeaveStatus(leave.id, 'Approved');
                                }
                              }}
                              className="p-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-md border border-emerald-100 transition-colors cursor-pointer"
                              title="Valider / Autoriser"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Refuser cette demande d'autorisation d'absence ?")) {
                                  onUpdateLeaveStatus(leave.id, 'Rejected');
                                }
                              }}
                              className="p-1 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-md border border-rose-100 transition-colors cursor-pointer"
                              title="Refuser / Rejeter"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Voulez-vous supprimer définitivement cet enregistrement ?')) {
                              onDeleteLeave(leave.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Supprimer la demande"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {leaves.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 italic font-semibold">
                    Aucune demande d'autorisation d'absence n'a été enregistrée pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Leave Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
              Enregistrer une Autorisation d'Absence
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Sélectionner l'élève *</label>
                <select
                  value={studentId}
                  required
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold"
                >
                  <option value="">Sélectionner un élève...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.lastName} {s.firstName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Date de début *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Date de fin *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Motif / Justification *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Raisons de santé avec rendez-vous pédiatrique programmé."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
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
