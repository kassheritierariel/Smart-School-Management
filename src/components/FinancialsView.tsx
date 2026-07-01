import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  User,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Invoice, Student, SchoolClass, SchoolProfile } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FinancialsViewProps {
  invoices: Invoice[];
  students: Student[];
  classes: SchoolClass[];
  schoolProfile?: SchoolProfile;
  onAddInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  onRecordPayment: (invoiceId: string, amount: number) => void;
}

export default function FinancialsView({
  invoices,
  students,
  classes,
  schoolProfile,
  onAddInvoice,
  onRecordPayment,
}: FinancialsViewProps) {
  const formatCurrency = (usdAmount: number) => {
    const rate = schoolProfile?.exchangeRate || 2800;
    return `${usdAmount.toLocaleString('en-US')} $ (${(usdAmount * rate).toLocaleString('fr-FR')} Fc)`;
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Record payment state
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Manual invoice creation state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [amount, setAmount] = useState(450);
  const [type, setType] = useState<'Scolarité' | 'Examen' | 'Transport' | 'Bibliothèque' | 'Activités'>('Scolarité');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });

  // Calculate high-level metrics
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = totalBilled - totalCollected;

  const paymentPercentage = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100;

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    if (paymentAmount <= 0) {
      alert("Le montant du paiement doit être supérieur à 0.");
      return;
    }

    const maxAllowed = payingInvoice.amount - payingInvoice.paidAmount;
    if (paymentAmount > maxAllowed) {
      alert(`Le montant du versement dépasse le reste à payer de ${formatCurrency(maxAllowed)}.`);
      return;
    }

    onRecordPayment(payingInvoice.id, paymentAmount);
    setPayingInvoice(null);
    setPaymentAmount(0);
    alert("Paiement enregistré avec succès.");
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;

    onAddInvoice({
      studentId,
      amount,
      paidAmount: 0,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'Unpaid',
      type
    });

    setIsInvoiceModalOpen(false);
    alert("La facture a été émise et ajoutée au registre.");
  };

  // Filter invoices listing
  const filteredInvoices = invoices.filter(inv => {
    const student = students.find(s => s.id === inv.studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
    
    const matchesSearch = studentName.includes(searchTerm.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesType = typeFilter === 'all' || inv.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExportReceipt = async (inv: Invoice) => {
    const student = students.find(s => s.id === inv.studentId);
    const cls = student ? classes.find(c => c.id === student.classId) : null;
    
    const pdf = new jsPDF('p', 'mm', 'a5');
    
    // Header
    let startY = 20;

    if (schoolProfile?.logoUrl) {
      try {
        pdf.addImage(schoolProfile.logoUrl, 'JPEG', 15, 10, 20, 20);
        startY = 35;
      } catch (e) {
        console.warn("Could not load logo for PDF", e);
      }
    }
    
    pdf.setFontSize(16);
    pdf.text("REÇU DE PAIEMENT", 15, startY);
    
    pdf.setFontSize(9);
    if (schoolProfile) {
      pdf.text(schoolProfile.name, 15, startY + 8);
      pdf.text(`Tel: ${schoolProfile.phone}`, 15, startY + 13);
      if (schoolProfile.whatsappNumber) pdf.text(`WhatsApp: ${schoolProfile.whatsappNumber}`, 15, startY + 18);
      pdf.text(`Email: ${schoolProfile.email}`, 15, startY + (schoolProfile.whatsappNumber ? 23 : 18));
      startY += schoolProfile.whatsappNumber ? 30 : 25;
    } else {
      startY += 10;
    }
    
    pdf.setFontSize(10);
    pdf.text(`Référence: #${inv.id}`, 15, startY);
    pdf.text(`Date d'émission: ${inv.date}`, 15, startY + 6);
    
    pdf.text(`Élève: ${student ? student.firstName + ' ' + student.lastName : 'N/A'}`, 15, startY + 18);
    pdf.text(`Classe: ${cls ? cls.name : 'N/A'}`, 15, startY + 24);
    
    autoTable(pdf, {
      startY: startY + 35,
      head: [['Description', 'Montant']],
      body: [
        [`Frais: ${inv.type}`, formatCurrency(inv.amount)],
        ['Montant payé', formatCurrency(inv.paidAmount)],
        ['Reste à payer', formatCurrency(inv.amount - inv.paidAmount)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    pdf.text("Signature & Cachet: _______________________", 15, (pdf as any).lastAutoTable.finalY + 30);
    
    pdf.save(`Recu_${inv.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Gestion des Frais & Facturation</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Émettre des factures, enregistrer les règlements et suivre les arriérés de scolarité.</p>
        </div>

        <button
          onClick={() => setIsInvoiceModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Émettre une Facture
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Billed */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Masse Facturée</div>
          <div className="text-xl font-extrabold text-slate-900">{formatCurrency(totalBilled)}</div>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">Cumulé sur l'année en cours</p>
        </div>

        {/* Total Collected */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Encaissé</div>
          <div className="text-xl font-extrabold text-emerald-600">{formatCurrency(totalCollected)}</div>
          <p className="text-[10px] text-emerald-500 font-semibold mt-1">Taux de recouvrement: {paymentPercentage}%</p>
        </div>

        {/* Total Outstanding */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1 font-semibold">Reste à Recouvrer</div>
          <div className="text-xl font-extrabold text-rose-500">{formatCurrency(totalOutstanding)}</div>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">Échéances non réglées</p>
        </div>

        {/* Progress chart mini */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-center space-y-2">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-500">Recouvrement</span>
            <span className="text-blue-600">{paymentPercentage}%</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-1000"
              style={{ width: `${paymentPercentage}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Objectif de l'exercice: 100%</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom d'élève ou référence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors font-medium"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-slate-500 font-medium">
            <span>Règlement:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 focus:outline-hidden focus:border-blue-500 font-semibold text-slate-700"
            >
              <option value="all">Tous</option>
              <option value="Paid">Payées</option>
              <option value="Unpaid">Non payées</option>
              <option value="Partial">Partiels</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-slate-500 font-medium">
            <span>Type de frais:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 focus:outline-hidden focus:border-blue-500 font-semibold text-slate-700"
            >
              <option value="all">Tous types</option>
              <option value="Scolarité">Frais de Scolarité</option>
              <option value="Transport">Transport</option>
              <option value="Examen">Examen</option>
              <option value="Bibliothèque">Bibliothèque</option>
              <option value="Activités">Activités</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                  <th className="py-3.5 px-4 font-bold">Référence</th>
                  <th className="py-3.5 px-4 font-bold">Élève & Classe</th>
                  <th className="py-3.5 px-4 font-bold">Type de Charge</th>
                  <th className="py-3.5 px-4 font-bold text-center">Montant Dû</th>
                  <th className="py-3.5 px-4 font-bold text-center">Montant Encaissé</th>
                  <th className="py-3.5 px-4 font-bold text-center">Reste à payer</th>
                  <th className="py-3.5 px-4 font-bold">Échéance</th>
                  <th className="py-3.5 px-4 font-bold text-center">Statut</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const student = students.find(s => s.id === inv.studentId);
                  const cls = student ? classes.find(c => c.id === student.classId) : null;
                  const balance = inv.amount - inv.paidAmount;

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/20">
                      {/* Ref */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                        #{inv.id}
                      </td>

                      {/* Student */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {student ? `${student.firstName} ${student.lastName}` : 'Inconnu'}
                        <span className="block font-medium text-[10px] text-slate-400 mt-0.5">
                          {cls ? cls.name : 'N/A'} • N° Matricule: {student?.rollNumber}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-100 font-semibold text-slate-700 rounded-md">
                          {inv.type}
                        </span>
                      </td>

                      {/* Amount Due */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-950 font-mono">
                        {formatCurrency(inv.amount)}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 text-center text-emerald-600 font-bold font-mono">
                        {formatCurrency(inv.paidAmount)}
                      </td>

                      {/* Rest to pay */}
                      <td className="py-3.5 px-4 text-center text-rose-500 font-bold font-mono">
                        {formatCurrency(balance)}
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-4 text-slate-400 font-semibold">
                        {inv.dueDate}
                      </td>

                      {/* Status badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          inv.status === 'Partial' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {inv.status === 'Paid' ? 'Solder' : inv.status === 'Partial' ? 'Partiel' : 'Arriéré'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleExportReceipt(inv)}
                            className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50"
                            title="Exporter le reçu (PDF)"
                          >
                            <Receipt className="h-4 w-4" />
                          </button>
                          
                          {inv.status !== 'Paid' ? (
                            <button
                              onClick={() => {
                                setPayingInvoice(inv);
                                setPaymentAmount(inv.amount - inv.paidAmount);
                              }}
                              className="text-[10px] font-bold bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 rounded-lg px-2.5 py-1.5 uppercase transition-all cursor-pointer"
                            >
                              Encaisser
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic font-medium px-2.5 py-1.5">Réglée</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-slate-400 text-sm font-semibold">Aucune facture enregistrée pour ces critères.</p>
            <button 
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); setTypeFilter('all'); }} 
              className="text-xs text-blue-600 hover:text-blue-800 font-bold mt-2 flex items-center gap-1 mx-auto cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" /> Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-900 mb-2">Enregistrer un Versement d'Argent</h3>
            <p className="text-xs text-slate-400 mb-4 font-semibold">
              Enregistrer le paiement pour la facture #{payingInvoice.id} ({payingInvoice.type})
            </p>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bénéficiaire:</span>
                  <span className="font-bold text-slate-900">
                    {students.find(s => s.id === payingInvoice.studentId)?.firstName} {students.find(s => s.id === payingInvoice.studentId)?.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Facturé:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(payingInvoice.amount)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span className="font-bold">Déjà réglé:</span>
                  <span className="font-bold">{formatCurrency(payingInvoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-rose-500 font-bold border-t border-slate-200/60 pt-1 mt-1">
                  <span>Solde restant:</span>
                  <span>{formatCurrency(payingInvoice.amount - payingInvoice.paidAmount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Montant Encaissé ($ USD)</label>
                <input
                  type="number"
                  required
                  step="1"
                  min="1"
                  max={payingInvoice.amount - payingInvoice.paidAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold font-mono"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  Enregistrer l'Encaissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Invoice Creation Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
              <Receipt className="h-4 w-4 text-blue-600" />
              Émettre un appel de fonds (Facture)
            </h3>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Sélectionner l'Élève</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-slate-700"
                >
                  {classes.map(cls => (
                    <optgroup key={cls.id} label={`Classe: ${cls.name}`}>
                      {students.filter(s => s.classId === cls.id && s.status === 'Active').map(s => (
                        <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (Matricule: {s.rollNumber})</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Type de Redevance</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-slate-700"
                  >
                    <option value="Scolarité">Frais de Scolarité</option>
                    <option value="Transport">Transport Scolaire</option>
                    <option value="Examen">Frais d'Examen</option>
                    <option value="Bibliothèque">Bibliothèque</option>
                    <option value="Activités">Activités</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Montant Facturé ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Date d'Échéance (Limite de paiement)</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-slate-700"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  Valider & Émettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
