import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  AlertCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { Inquiry, SchoolClass } from '../types';

interface InquiriesViewProps {
  inquiries: Inquiry[];
  classes: SchoolClass[];
  onAddInquiry: (inquiry: Omit<Inquiry, 'id'>) => void;
  onAdmitInquiry: (inquiryId: string) => void;
  onRejectInquiry: (inquiryId: string) => void;
  onDeleteInquiry: (inquiryId: string) => void;
}

export default function InquiriesView({
  inquiries,
  classes,
  onAddInquiry,
  onAdmitInquiry,
  onRejectInquiry,
  onDeleteInquiry
}: InquiriesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [classId, setClassId] = useState('');
  const [message, setMessage] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim() || !classId) return;

    onAddInquiry({
      studentName,
      phone,
      email: email || 'non-renseigne@ecole.fr',
      message: message || 'Intérêt pour l\'inscription.',
      date: new Date().toISOString().split('T')[0],
      classId,
      status: 'Pending'
    });

    // Reset form
    setStudentName('');
    setPhone('');
    setEmail('');
    setClassId('');
    setMessage('');
    setShowAddModal(false);
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inq.phone.includes(searchTerm) || 
                          inq.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || inq.classId === classFilter;
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Demandes d'Admission / Inquiries
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              SM Academic Inquiries
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Suivre les inscriptions potentielles, gérer les demandes des parents et convertir les dossiers qualifiés en élèves inscrits en un clic.
          </p>
        </div>
        <button
          onClick={() => {
            if (classes.length > 0) {
              setClassId(classes[0].id);
            }
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Enregistrer une Demande
        </button>
      </div>

      {/* Info helper block */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-blue-800">
        <Sparkles className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold">Astuce "Pro" pour le Recrutement :</span>
          <p className="text-blue-700 font-medium">
            Lorsqu'une demande d'inscription est validée et marquée comme <span className="font-bold">"Admis"</span>, le système génère instantanément la fiche élève dans le registre de sa classe cible avec une matricule d'entrée automatique.
          </p>
        </div>
      </div>

      {/* Search & filters bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-semibold"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold"
          >
            <option value="all">Toutes les classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold"
          >
            <option value="all">Tous les statuts</option>
            <option value="Pending">En Attente</option>
            <option value="Admitted">Admis (Converti)</option>
            <option value="Rejected">Rejeté</option>
          </select>
        </div>
      </div>

      {/* Inquiries table / grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[9px] font-bold tracking-wider border-b border-slate-100">
                <th className="py-3 px-4">Élève Candidat</th>
                <th className="py-3 px-4">Coordonnées</th>
                <th className="py-3 px-4">Date de Demande</th>
                <th className="py-3 px-4">Classe Souhaitée</th>
                <th className="py-3 px-4">Message / Note</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Actions de Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.map((inq) => {
                const targetClass = classes.find(c => c.id === inq.classId);
                return (
                  <tr key={inq.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 text-xs">
                      {inq.studentName}
                    </td>
                    <td className="py-4 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                        <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                        {inq.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                        <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                        {inq.email}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-semibold text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {inq.date}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-lg font-bold text-[10px]">
                        {targetClass ? targetClass.name : 'Inconnue'}
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex items-start gap-1 text-slate-500 font-medium leading-relaxed italic text-[11px]">
                        <MessageSquare className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2" title={inq.message}>{inq.message}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inq.status === 'Admitted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        inq.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {inq.status === 'Admitted' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {inq.status === 'Rejected' && <XCircle className="h-3.5 w-3.5" />}
                        {inq.status === 'Pending' && <AlertCircle className="h-3.5 w-3.5" />}
                        {inq.status === 'Admitted' ? 'Admis (Inscrit)' :
                         inq.status === 'Rejected' ? 'Rejeté' : 'En Attente'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inq.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => {
                                if (confirm(`Admettre ${inq.studentName} ? Cela l'inscrira automatiquement dans le registre de la classe.`)) {
                                  onAdmitInquiry(inq.id);
                                }
                              }}
                              title="Admettre l'élève"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-lg border border-emerald-100 transition-colors cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Rejeter la demande de ${inq.studentName} ?`)) {
                                  onRejectInquiry(inq.id);
                                }
                              }}
                              title="Rejeter la demande"
                              className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg border border-rose-100 transition-colors cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Voulez-vous supprimer définitivement cette demande d\'admission ?')) {
                              onDeleteInquiry(inq.id);
                            }
                          }}
                          title="Supprimer la demande"
                          className="p-1.5 bg-slate-50 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInquiries.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 italic font-semibold">
                    Aucune demande d'admission ne correspond à vos critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inquiry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
              Créer une Demande d'Admission
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Nom complet du candidat *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean-Pierre Bemba"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Téléphone Tuteur *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 0812345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Ex: tuteur@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Classe ciblée *</label>
                <select
                  value={classId}
                  required
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Message ou Commentaires</label>
                <textarea
                  rows={3}
                  placeholder="Ex: Souhaite intégrer la section S1. Très motivé."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
