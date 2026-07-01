import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Plus, 
  Trash2, 
  Award, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Info, 
  Save, 
  Check, 
  Users,
  Building
} from 'lucide-react';
import { Student, SchoolClass, SchoolProfile } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CongoleseBulletinViewProps {
  student: Student;
  schoolClass: SchoolClass | undefined;
  classes: SchoolClass[];
  schoolProfile?: SchoolProfile;
}

interface CongoleseSubject {
  id: string;
  name: string;
  maxima: number; // Period Max (e.g. 10 or 20)
  p1: number;
  p2: number;
  ex1: number; // Semester 1 Exam (Max is maxima * 2)
  p3: number;
  p4: number;
  ex2: number; // Semester 2 Exam (Max is maxima * 2)
}

const DEFAULT_CONGOLESE_SUBJECTS: CongoleseSubject[] = [
  { id: 'csub1', name: 'Français (Oral & Écrit)', maxima: 20, p1: 14, p2: 15, ex1: 28, p3: 13, p4: 16, ex2: 30 },
  { id: 'csub2', name: 'Anglais', maxima: 10, p1: 7, p2: 8, ex1: 15, p3: 8, p4: 7, ex2: 16 },
  { id: 'csub3', name: 'Mathématiques', maxima: 20, p1: 16, p2: 18, ex1: 34, p3: 15, p4: 17, ex2: 35 },
  { id: 'csub4', name: 'Physique', maxima: 10, p1: 8, p2: 7, ex1: 16, p3: 8, p4: 9, ex2: 15 },
  { id: 'csub5', name: 'Chimie', maxima: 10, p1: 7, p2: 8, ex1: 14, p3: 7, p4: 8, ex2: 14 },
  { id: 'csub6', name: 'Biologie & Sciences de la Vie', maxima: 10, p1: 9, p2: 8, ex1: 17, p3: 8, p4: 8, ex2: 16 },
  { id: 'csub7', name: 'Histoire', maxima: 10, p1: 8, p2: 8, ex1: 15, p3: 9, p4: 8, ex2: 17 },
  { id: 'csub8', name: 'Géographie', maxima: 10, p1: 7, p2: 9, ex1: 16, p3: 8, p4: 8, ex2: 15 },
  { id: 'csub9', name: 'Éducation Civique & Nouvelle Citoyenneté', maxima: 10, p1: 9, p2: 9, ex1: 18, p3: 9, p4: 10, ex2: 19 },
  { id: 'csub10', name: 'Dessin & Travaux Pratiques', maxima: 10, p1: 8, p2: 8, ex1: 16, p3: 8, p4: 8, ex2: 16 },
  { id: 'csub11', name: 'Éducation Physique et Sportive', maxima: 10, p1: 9, p2: 10, ex1: 19, p3: 10, p4: 9, ex2: 18 },
  { id: 'csub12', name: 'Religion & Morale', maxima: 10, p1: 8, p2: 9, ex1: 16, p3: 9, p4: 9, ex2: 17 },
];

export default function CongoleseBulletinView({
  student,
  schoolClass,
  classes,
  schoolProfile
}: CongoleseBulletinViewProps) {
  // Configurable School details
  const [province, setProvince] = useState('KINSHASA - LUKUNGA');
  const [schoolName, setSchoolName] = useState(schoolProfile?.name || 'Smart School Management');
  const [schoolCode, setSchoolCode] = useState('110245');
  const [nationalId, setNationalId] = useState('01-0245-A74');
  const [commune, setCommune] = useState('Gombe');
  const [academicYear, setAcademicYear] = useState('2025 - 2026');
  const [schoolOption, setSchoolOption] = useState('Scientifique (Biologie-Chimie)');
  const [placeOfBirth, setPlaceOfBirth] = useState('Kinshasa');
  const [dateOfBirth, setDateOfBirth] = useState('12/04/2012');

  // Subjects state
  const [subjects, setSubjects] = useState<CongoleseSubject[]>([]);

  // Behavioral evaluations
  const [apprec1S, setApprec1S] = useState<'Excellent' | 'Très Bien' | 'Bien' | 'Assez Bien' | 'Médiocre'>('Très Bien');
  const [apprec2S, setApprec2S] = useState<'Excellent' | 'Très Bien' | 'Bien' | 'Assez Bien' | 'Médiocre'>('Excellent');
  
  const [conduite1S, setConduite1S] = useState<'Excellent' | 'Très Bien' | 'Bien' | 'Assez Bien' | 'Médiocre'>('Bien');
  const [conduite2S, setConduite2S] = useState<'Excellent' | 'Très Bien' | 'Bien' | 'Assez Bien' | 'Médiocre'>('Très Bien');

  const [absences1S, setAbsences1S] = useState(0);
  const [absences2S, setAbsences2S] = useState(0);

  const [rank1S, setRank1S] = useState('3ème');
  const [rank2S, setRank2S] = useState('2ème');

  const [juryDecision, setJuryDecision] = useState('PROMU(E) AVEC SATISFACTION');

  // Form states for adding subject
  const [newSubName, setNewSubName] = useState('');
  const [newSubMaxima, setNewSubMaxima] = useState(10);

  // Load from local storage on mount
  useEffect(() => {
    const key = `sms_congolese_bulletin_${student.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProvince(parsed.province || 'KINSHASA - LUKUNGA');
        setSchoolName(parsed.schoolName || 'Smart School Management');
        setSchoolCode(parsed.schoolCode || '110245');
        setNationalId(parsed.nationalId || '01-0245-A74');
        setCommune(parsed.commune || 'Gombe');
        setAcademicYear(parsed.academicYear || '2025 - 2026');
        setSchoolOption(parsed.schoolOption || 'Scientifique (Biologie-Chimie)');
        setPlaceOfBirth(parsed.placeOfBirth || 'Kinshasa');
        setDateOfBirth(parsed.dateOfBirth || '12/04/2012');
        setSubjects(parsed.subjects || DEFAULT_CONGOLESE_SUBJECTS);
        setApprec1S(parsed.apprec1S || 'Très Bien');
        setApprec2S(parsed.apprec2S || 'Excellent');
        setConduite1S(parsed.conduite1S || 'Bien');
        setConduite2S(parsed.conduite2S || 'Très Bien');
        setAbsences1S(parsed.absences1S || 0);
        setAbsences2S(parsed.absences2S || 0);
        setRank1S(parsed.rank1S || '3ème');
        setRank2S(parsed.rank2S || '2ème');
        setJuryDecision(parsed.juryDecision || 'PROMU(E) AVEC SATISFACTION');
      } catch (e) {
        setSubjects(DEFAULT_CONGOLESE_SUBJECTS);
      }
    } else {
      setSubjects(DEFAULT_CONGOLESE_SUBJECTS);
    }
  }, [student.id]);

  // Save to local storage helper
  const saveToLocalStorage = (updatedSubjects: CongoleseSubject[]) => {
    const key = `sms_congolese_bulletin_${student.id}`;
    const dataToSave = {
      province,
      schoolName,
      schoolCode,
      nationalId,
      commune,
      academicYear,
      schoolOption,
      placeOfBirth,
      dateOfBirth,
      subjects: updatedSubjects,
      apprec1S,
      apprec2S,
      conduite1S,
      conduite2S,
      absences1S,
      absences2S,
      rank1S,
      rank2S,
      juryDecision
    };
    localStorage.setItem(key, JSON.stringify(dataToSave));
  };

  // Trigger save on details change
  const triggerSaveWithCurrentSubjects = () => {
    saveToLocalStorage(subjects);
  };

  // Handle value editing
  const handleMarkChange = (subjectId: string, period: 'p1' | 'p2' | 'ex1' | 'p3' | 'p4' | 'ex2' | 'maxima', val: number) => {
    const updated = subjects.map(s => {
      if (s.id === subjectId) {
        // Enforce boundaries
        let maxLimit = s.maxima;
        if (period === 'ex1' || period === 'ex2') {
          maxLimit = s.maxima * 2;
        }
        if (period === 'maxima') {
          maxLimit = 100;
        }

        const cleanVal = Math.min(Math.max(0, val), maxLimit);

        return {
          ...s,
          [period]: cleanVal
        };
      }
      return s;
    });
    setSubjects(updated);
    // Persist
    const key = `sms_congolese_bulletin_${student.id}`;
    const dataToSave = {
      province,
      schoolName,
      schoolCode,
      nationalId,
      commune,
      academicYear,
      schoolOption,
      placeOfBirth,
      dateOfBirth,
      subjects: updated,
      apprec1S,
      apprec2S,
      conduite1S,
      conduite2S,
      absences1S,
      absences2S,
      rank1S,
      rank2S,
      juryDecision
    };
    localStorage.setItem(key, JSON.stringify(dataToSave));
  };

  // Add customized subject
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const newSub: CongoleseSubject = {
      id: `csub_${Date.now()}`,
      name: newSubName.trim(),
      maxima: newSubMaxima,
      p1: Math.round(newSubMaxima * 0.7),
      p2: Math.round(newSubMaxima * 0.75),
      ex1: Math.round(newSubMaxima * 2 * 0.72),
      p3: Math.round(newSubMaxima * 0.72),
      p4: Math.round(newSubMaxima * 0.8),
      ex2: Math.round(newSubMaxima * 2 * 0.78),
    };

    const updated = [...subjects, newSub];
    setSubjects(updated);
    saveToLocalStorage(updated);
    setNewSubName('');
    alert(`Matière "${newSub.name}" ajoutée avec succès.`);
  };

  // Delete custom subject
  const handleDeleteSubject = (id: string) => {
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
    saveToLocalStorage(updated);
  };

  // Revert / Reset standard subjects
  const handleReset = () => {
    if (confirm("Réinitialiser les cotes et matières aux valeurs d'origine pour cet élève ?")) {
      setSubjects(DEFAULT_CONGOLESE_SUBJECTS);
      const key = `sms_congolese_bulletin_${student.id}`;
      localStorage.removeItem(key);
      alert("Cotes réinitialisées.");
    }
  };

  const handleGeneratePDF = async () => {
    const element = document.getElementById('printable-bulletin-rdc');
    if (!element) return;
    
    try {
      // Create a style element to hide print:hidden elements during capture
      const style = document.createElement('style');
      style.innerHTML = '.print\\:hidden { display: none !important; }';
      document.head.appendChild(style);

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      
      // Remove style
      document.head.removeChild(style);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bulletin_${student.lastName}_${student.firstName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Erreur lors de la génération du PDF.');
    }
  };

  // calculations
  const calculateTotals = () => {
    let maxP1 = 0, obtP1 = 0;
    let maxP2 = 0, obtP2 = 0;
    let maxEX1 = 0, obtEX1 = 0;
    let maxTot1S = 0, obtTot1S = 0;

    let maxP3 = 0, obtP3 = 0;
    let maxP4 = 0, obtP4 = 0;
    let maxEX2 = 0, obtEX2 = 0;
    let maxTot2S = 0, obtTot2S = 0;

    let maxTotalAnnuel = 0, obtTotalAnnuel = 0;

    subjects.forEach(s => {
      // Period Maxima
      maxP1 += s.maxima;
      maxP2 += s.maxima;
      maxEX1 += s.maxima * 2;
      maxTot1S += s.maxima * 4;

      maxP3 += s.maxima;
      maxP4 += s.maxima;
      maxEX2 += s.maxima * 2;
      maxTot2S += s.maxima * 4;

      maxTotalAnnuel += s.maxima * 8;

      // Obtained values
      obtP1 += s.p1;
      obtP2 += s.p2;
      obtEX1 += s.ex1;
      obtTot1S += (s.p1 + s.p2 + s.ex1);

      obtP3 += s.p3;
      obtP4 += s.p4;
      obtEX2 += s.ex2;
      obtTot2S += (s.p3 + s.p4 + s.ex2);

      obtTotalAnnuel += (s.p1 + s.p2 + s.ex1 + s.p3 + s.p4 + s.ex2);
    });

    const pct1S = maxTot1S > 0 ? ((obtTot1S / maxTot1S) * 100).toFixed(2) : '0';
    const pct2S = maxTot2S > 0 ? ((obtTot2S / maxTot2S) * 100).toFixed(2) : '0';
    const pctAnnuel = maxTotalAnnuel > 0 ? ((obtTotalAnnuel / maxTotalAnnuel) * 100).toFixed(2) : '0';

    return {
      maxP1, obtP1,
      maxP2, obtP2,
      maxEX1, obtEX1,
      maxTot1S, obtTot1S, pct1S,
      maxP3, obtP3,
      maxP4, obtP4,
      maxEX2, obtEX2,
      maxTot2S, obtTot2S, pct2S,
      maxTotalAnnuel, obtTotalAnnuel, pctAnnuel
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">

      {/* Interactive Control Panel - NOT PRINTED */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4 print:hidden">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Configuration du Bulletin Congolais (RDC)</span>
              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-sm">MODE SÉLECTIONNÉ</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Saisissez directement les cotes dans le tableau officiel ci-dessous. Les totaux, les moyennes et le pourcentage se recalculent instantanément.
            </p>
          </div>
        </div>

        {/* Accordion form for school meta info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Province Éducationnelle</label>
            <input
              type="text"
              value={province}
              onChange={(e) => { setProvince(e.target.value); }}
              onBlur={triggerSaveWithCurrentSubjects}
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nom de l'école</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => { setSchoolName(e.target.value); }}
              onBlur={triggerSaveWithCurrentSubjects}
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Code Établissement</label>
            <input
              type="text"
              value={schoolCode}
              onChange={(e) => { setSchoolCode(e.target.value); }}
              onBlur={triggerSaveWithCurrentSubjects}
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ID National</label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => { setNationalId(e.target.value); }}
              onBlur={triggerSaveWithCurrentSubjects}
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Commune / Ville</label>
            <input
              type="text"
              value={commune}
              onChange={(e) => { setCommune(e.target.value); }}
              onBlur={triggerSaveWithCurrentSubjects}
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Option / Section</label>
            <input
              type="text"
              value={schoolOption}
              onChange={(e) => { setSchoolOption(e.target.value); }}
              onBlur={triggerSaveWithCurrentSubjects}
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lieu de Naissance</label>
            <input
              type="text"
              value={placeOfBirth}
              onChange={(e) => { setPlaceOfBirth(e.target.value); }}
              onBlur={triggerSaveWithCurrentSubjects}
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date de Naissance</label>
            <input
              type="text"
              value={dateOfBirth}
              onChange={(e) => { setDateOfBirth(e.target.value); }}
              onBlur={triggerSaveWithCurrentSubjects}
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        {/* Interactive form to add raw custom subject */}
        <div className="flex flex-col md:flex-row gap-4 items-end p-4 bg-blue-50/40 rounded-xl border border-blue-100">
          <form onSubmit={handleAddSubject} className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Nom de la nouvelle matière / Discipline</label>
              <input
                type="text"
                required
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="Ex: Informatique, Électricité, Dessin..."
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Maxima Périodique (Base)</label>
              <select
                value={newSubMaxima}
                onChange={(e) => setNewSubMaxima(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold"
              >
                <option value={10}>10 points (Examen sur 20)</option>
                <option value={20}>20 points (Examen sur 40)</option>
                <option value={40}>40 points (Examen sur 80)</option>
                <option value={50}>50 points (Examen sur 100)</option>
              </select>
            </div>
          </form>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGeneratePDF}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 shrink-0"
            >
              <FileText className="h-3.5 w-3.5" /> Exporter PDF
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Réinitialiser
            </button>
            <button
              onClick={handleAddSubject}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter Matière
            </button>
          </div>
        </div>
      </div>

      {/* OFFICIAL CONGOLESE BULLETIN SHEET TEMPLATE */}
      <div 
        className="bg-white rounded-2xl border-4 border-double border-slate-900 p-8 max-w-4xl mx-auto shadow-md space-y-6 print:p-0 print:border-none print:shadow-none"
        id="printable-bulletin-rdc"
      >
        {/* DRC State Symbol Header & Ministry */}
        <div className="flex justify-between items-center border-b-2 border-slate-950 pb-4">
          <div className="text-left space-y-0.5">
            <h1 className="text-xs font-extrabold text-slate-950 tracking-wide uppercase">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h1>
            <p className="text-[9px] text-slate-600 font-black uppercase">MINISTÈRE DE L'ENSEIGNEMENT PRIMAIRE, SECONDAIRE</p>
            <p className="text-[9px] text-slate-600 font-black uppercase">ET TECHNIQUE (EPST)</p>
            <p className="text-[9px] font-extrabold text-indigo-900 uppercase mt-1">PROVINCE ÉDUCATIONNELLE : {province}</p>
          </div>

          <div className="text-center px-4 py-1.5 border-2 border-dashed border-slate-900 rounded-lg">
            <span className="text-[8px] font-black uppercase text-slate-500 block">ID. NAT. N°</span>
            <span className="text-xs font-mono font-black text-slate-900">{nationalId}</span>
            <span className="text-[8px] font-black uppercase text-slate-500 block mt-1">CODE ÉCOLE</span>
            <span className="text-xs font-mono font-black text-slate-950">{schoolCode}</span>
          </div>

          <div className="text-right space-y-0.5 flex flex-col items-end">
            {schoolProfile?.logoUrl && (
              <img src={schoolProfile.logoUrl} alt="Logo École" className="h-10 mb-1 object-contain" />
            )}
            <h2 className="text-xs font-extrabold text-slate-950 uppercase">{schoolName}</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase">COMMUNE DE : {commune}</p>
            <p className="text-[9px] text-blue-800 font-black uppercase">Option: {schoolOption}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase">ANNÉE SCOLAIRE : {academicYear}</p>
          </div>
        </div>

        {/* Student Congolese ID Sheet Card */}
        <div className="text-center py-2 bg-slate-900 text-white rounded-lg uppercase tracking-wider text-xs font-black">
          BULLETIN DE COTES ET D'APPRÉCIATIONS (PROGRAMME RDC)
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl text-[11px] border border-slate-200">
          <div className="space-y-1.5">
            <div><span className="text-slate-400 font-bold uppercase">Élève:</span> <span className="font-extrabold text-slate-950 uppercase">{student.lastName}</span> {student.firstName}</div>
            <div><span className="text-slate-400 font-bold uppercase">Sexe:</span> <span className="font-bold text-slate-800">{student.gender || 'M'}</span></div>
            <div><span className="text-slate-400 font-bold uppercase">Né(e) à:</span> <span className="font-bold text-slate-800">{placeOfBirth}</span></div>
          </div>
          <div className="space-y-1.5">
            <div><span className="text-slate-400 font-bold uppercase">Le:</span> <span className="font-bold text-slate-800">{dateOfBirth}</span></div>
            <div><span className="text-slate-400 font-bold uppercase">Numéro Matricule:</span> <span className="font-mono font-black text-blue-700">{student.rollNumber}</span></div>
            <div><span className="text-slate-400 font-bold uppercase">Classe RDC:</span> <span className="font-bold text-slate-900">{schoolClass ? schoolClass.name : 'Classe de Base'} {student.section}</span></div>
          </div>
          <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4 flex flex-col justify-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase block">Décision du Jury</span>
            <span className="text-xs font-black text-emerald-800 uppercase leading-snug">{juryDecision}</span>
          </div>
        </div>

        {/* COLES TABLE - RDC STRUCTURE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[10px] border border-slate-400">
            <thead>
              <tr className="bg-slate-100 font-bold text-slate-900 border-b border-slate-400 text-center uppercase">
                <th className="p-1.5 border-r border-slate-400 text-left w-48" rowSpan={2}>Branches / Disciplines</th>
                <th className="p-1 border-r border-slate-400 w-14" rowSpan={2}>Max<br/>Période</th>
                <th className="p-1 border-r border-slate-400" colSpan={4}>Premier Semestre</th>
                <th className="p-1 border-r border-slate-400" colSpan={4}>Second Semestre</th>
                <th className="p-1 border-r border-slate-400 w-16" rowSpan={2}>Total<br/>Général</th>
                <th className="p-1 border-r border-slate-400 w-14" rowSpan={2}>Pourc.<br/>%</th>
                <th className="p-1 print:hidden" rowSpan={2}>Suppr.</th>
              </tr>
              <tr className="bg-slate-50 font-bold text-slate-800 border-b border-slate-400 text-center uppercase">
                <th className="p-1 border-r border-slate-400 w-11">P1</th>
                <th className="p-1 border-r border-slate-400 w-11">P2</th>
                <th className="p-1 border-r border-slate-400 w-14">Ex.1</th>
                <th className="p-1 border-r border-slate-400 w-14 font-black bg-slate-100">Tot.1</th>
                <th className="p-1 border-r border-slate-400 w-11">P3</th>
                <th className="p-1 border-r border-slate-400 w-11">P4</th>
                <th className="p-1 border-r border-slate-400 w-14">Ex.2</th>
                <th className="p-1 border-r border-slate-400 w-14 font-black bg-slate-100">Tot.2</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, idx) => {
                const subTot1S = sub.p1 + sub.p2 + sub.ex1;
                const subTot2S = sub.p3 + sub.p4 + sub.ex2;
                const subTotGeneral = subTot1S + subTot2S;
                const subMaxTotal = sub.maxima * 8;
                const subPct = subMaxTotal > 0 ? ((subTotGeneral / subMaxTotal) * 100).toFixed(0) : '0';

                // Class styles for grades
                const p1Red = sub.p1 < sub.maxima * 0.5;
                const p2Red = sub.p2 < sub.maxima * 0.5;
                const ex1Red = sub.ex1 < sub.maxima;
                const tot1Red = subTot1S < sub.maxima * 2;
                
                const p3Red = sub.p3 < sub.maxima * 0.5;
                const p4Red = sub.p4 < sub.maxima * 0.5;
                const ex2Red = sub.ex2 < sub.maxima;
                const tot2Red = subTot2S < sub.maxima * 2;

                const totGenRed = subTotGeneral < sub.maxima * 4;

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/40 border-b border-slate-300">
                    <td className="p-1.5 border-r border-slate-400 font-black text-slate-900 flex justify-between items-center">
                      <span>{sub.name}</span>
                      <span className="text-[8px] font-mono font-medium text-slate-400">(Max Ex. {sub.maxima * 2})</span>
                    </td>
                    
                    {/* Period Max */}
                    <td className="p-1 border-r border-slate-400 text-center font-bold bg-slate-50/55">
                      <input
                        type="number"
                        value={sub.maxima}
                        onChange={(e) => handleMarkChange(sub.id, 'maxima', Number(e.target.value))}
                        className="w-10 text-center bg-transparent border-none font-bold text-slate-900 focus:ring-1 focus:ring-blue-500 rounded p-0 print:border-none"
                      />
                    </td>

                    {/* P1 */}
                    <td className={`p-1 border-r border-slate-400 text-center font-mono font-bold ${p1Red ? 'text-red-600 bg-red-50/40' : 'text-slate-800'}`}>
                      <input
                        type="number"
                        value={sub.p1}
                        max={sub.maxima}
                        onChange={(e) => handleMarkChange(sub.id, 'p1', Number(e.target.value))}
                        className="w-8 text-center bg-transparent border-none font-bold focus:ring-1 focus:ring-blue-500 rounded p-0 print:border-none"
                      />
                    </td>

                    {/* P2 */}
                    <td className={`p-1 border-r border-slate-400 text-center font-mono font-bold ${p2Red ? 'text-red-600 bg-red-50/40' : 'text-slate-800'}`}>
                      <input
                        type="number"
                        value={sub.p2}
                        max={sub.maxima}
                        onChange={(e) => handleMarkChange(sub.id, 'p2', Number(e.target.value))}
                        className="w-8 text-center bg-transparent border-none font-bold focus:ring-1 focus:ring-blue-500 rounded p-0 print:border-none"
                      />
                    </td>

                    {/* EX1 */}
                    <td className={`p-1 border-r border-slate-400 text-center font-mono font-bold ${ex1Red ? 'text-red-600 bg-red-50/40' : 'text-slate-800'}`}>
                      <input
                        type="number"
                        value={sub.ex1}
                        max={sub.maxima * 2}
                        onChange={(e) => handleMarkChange(sub.id, 'ex1', Number(e.target.value))}
                        className="w-10 text-center bg-transparent border-none font-bold focus:ring-1 focus:ring-blue-500 rounded p-0 print:border-none"
                      />
                    </td>

                    {/* TOTAL 1er SEMESTRE */}
                    <td className={`p-1 border-r border-slate-400 text-center font-mono font-black bg-slate-100 ${tot1Red ? 'text-red-600' : 'text-slate-950'}`}>
                      {subTot1S} <span className="text-[8px] font-normal text-slate-400">/{sub.maxima * 4}</span>
                    </td>

                    {/* P3 */}
                    <td className={`p-1 border-r border-slate-400 text-center font-mono font-bold ${p3Red ? 'text-red-600 bg-red-50/40' : 'text-slate-800'}`}>
                      <input
                        type="number"
                        value={sub.p3}
                        max={sub.maxima}
                        onChange={(e) => handleMarkChange(sub.id, 'p3', Number(e.target.value))}
                        className="w-8 text-center bg-transparent border-none font-bold focus:ring-1 focus:ring-blue-500 rounded p-0 print:border-none"
                      />
                    </td>

                    {/* P4 */}
                    <td className={`p-1 border-r border-slate-400 text-center font-mono font-bold ${p4Red ? 'text-red-600 bg-red-50/40' : 'text-slate-800'}`}>
                      <input
                        type="number"
                        value={sub.p4}
                        max={sub.maxima}
                        onChange={(e) => handleMarkChange(sub.id, 'p4', Number(e.target.value))}
                        className="w-8 text-center bg-transparent border-none font-bold focus:ring-1 focus:ring-blue-500 rounded p-0 print:border-none"
                      />
                    </td>

                    {/* EX2 */}
                    <td className={`p-1 border-r border-slate-400 text-center font-mono font-bold ${ex2Red ? 'text-red-600 bg-red-50/40' : 'text-slate-800'}`}>
                      <input
                        type="number"
                        value={sub.ex2}
                        max={sub.maxima * 2}
                        onChange={(e) => handleMarkChange(sub.id, 'ex2', Number(e.target.value))}
                        className="w-10 text-center bg-transparent border-none font-bold focus:ring-1 focus:ring-blue-500 rounded p-0 print:border-none"
                      />
                    </td>

                    {/* TOTAL 2e SEMESTRE */}
                    <td className={`p-1 border-r border-slate-400 text-center font-mono font-black bg-slate-100 ${tot2Red ? 'text-red-600' : 'text-slate-950'}`}>
                      {subTot2S} <span className="text-[8px] font-normal text-slate-400">/{sub.maxima * 4}</span>
                    </td>

                    {/* ANNUAL TOTAL */}
                    <td className={`p-1 border-r border-slate-400 text-center font-mono font-black bg-slate-200 ${totGenRed ? 'text-red-600' : 'text-slate-950'}`}>
                      {subTotGeneral} <span className="text-[8px] font-bold text-slate-500">/{subMaxTotal}</span>
                    </td>

                    {/* PERCENTAGE */}
                    <td className="p-1 border-r border-slate-400 text-center font-mono font-bold">
                      <span className={`px-1.5 py-0.5 rounded-sm ${Number(subPct) >= 50 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                        {subPct}%
                      </span>
                    </td>

                    {/* DELETE */}
                    <td className="p-1 text-center print:hidden">
                      <button
                        onClick={() => handleDeleteSubject(sub.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                        title="Retirer cette branche"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* TOTALS MATRIX FOOTER ROW */}
              <tr className="bg-slate-900 text-white font-extrabold uppercase border-t border-slate-400">
                <td className="p-1.5 text-left font-black">Totaux Généraux de l'Élève</td>
                <td className="p-1 text-center font-mono text-[9px]">P:{totals.maxP1}</td>
                <td className="p-1 text-center font-mono text-emerald-300">{totals.obtP1}</td>
                <td className="p-1 text-center font-mono text-emerald-300">{totals.obtP2}</td>
                <td className="p-1 text-center font-mono text-emerald-300">{totals.obtEX1}</td>
                <td className="p-1 text-center font-mono text-emerald-400 bg-white/10">{totals.obtTot1S} <span className="text-[8px] text-slate-400">/{totals.maxTot1S}</span></td>
                <td className="p-1 text-center font-mono text-emerald-300">{totals.obtP3}</td>
                <td className="p-1 text-center font-mono text-emerald-300">{totals.obtP4}</td>
                <td className="p-1 text-center font-mono text-emerald-300">{totals.obtEX2}</td>
                <td className="p-1 text-center font-mono text-emerald-400 bg-white/10">{totals.obtTot2S} <span className="text-[8px] text-slate-400">/{totals.maxTot2S}</span></td>
                <td className="p-1 text-center font-mono text-yellow-300 bg-white/20">{totals.obtTotalAnnuel} <span className="text-[8px] text-slate-300">/{totals.maxTotalAnnuel}</span></td>
                <td className="p-1 text-center font-mono text-yellow-400">{totals.pctAnnuel}%</td>
                <td className="p-1 print:hidden"></td>
              </tr>

              {/* PERCENTAGE SEMESTRIAL ROW */}
              <tr className="bg-slate-100 text-slate-900 font-bold uppercase border-t border-slate-400">
                <td className="p-1.5 text-left">Pourcentage Semestriel</td>
                <td className="p-1 border-r border-slate-400" colSpan={4}></td>
                <td className="p-1 border-r border-slate-400 text-center font-mono font-black text-indigo-700 bg-indigo-50">{totals.pct1S}%</td>
                <td className="p-1 border-r border-slate-400" colSpan={4}></td>
                <td className="p-1 border-r border-slate-400 text-center font-mono font-black text-indigo-700 bg-indigo-50">{totals.pct2S}%</td>
                <td className="p-1" colSpan={2}></td>
                <td className="p-1 print:hidden"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Behavioral Ratings & Place - Congolese Official Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-slate-950">
          
          {/* Rank, conduct, application, absences */}
          <div className="space-y-3.5 text-[11px] font-bold text-slate-800">
            <h3 className="text-xs font-black uppercase text-slate-950 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <Award className="h-4 w-4 text-amber-500 shrink-0" />
              ÉVALUATION ADMINISTRATIVE & CONDUITE
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-extrabold text-indigo-900 uppercase text-[9px]">Premier Semestre</div>
                <div className="flex items-center justify-between">
                  <span>Rang en classe:</span>
                  <input
                    type="text"
                    value={rank1S}
                    onChange={(e) => setRank1S(e.target.value)}
                    onBlur={triggerSaveWithCurrentSubjects}
                    className="w-16 text-center text-xs p-1 bg-white border border-slate-200 rounded font-black text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Application:</span>
                  <select
                    value={apprec1S}
                    onChange={(e) => setApprec1S(e.target.value as any)}
                    onBlur={triggerSaveWithCurrentSubjects}
                    className="text-xs p-1 bg-white border border-slate-200 rounded font-bold text-slate-700 focus:outline-hidden"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Très Bien">Très Bien</option>
                    <option value="Bien">Bien</option>
                    <option value="Assez Bien">Assez Bien</option>
                    <option value="Médiocre">Médiocre</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span>Conduite RDC:</span>
                  <select
                    value={conduite1S}
                    onChange={(e) => setConduite1S(e.target.value as any)}
                    onBlur={triggerSaveWithCurrentSubjects}
                    className="text-xs p-1 bg-white border border-slate-200 rounded font-bold text-slate-700 focus:outline-hidden"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Très Bien">Très Bien</option>
                    <option value="Bien">Bien</option>
                    <option value="Assez Bien">Assez Bien</option>
                    <option value="Médiocre">Médiocre</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span>Absences (Jours):</span>
                  <input
                    type="number"
                    value={absences1S}
                    onChange={(e) => setAbsences1S(Number(e.target.value))}
                    onBlur={triggerSaveWithCurrentSubjects}
                    className="w-12 text-center text-xs p-1 bg-white border border-slate-200 rounded font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-extrabold text-indigo-900 uppercase text-[9px]">Second Semestre</div>
                <div className="flex items-center justify-between">
                  <span>Rang en classe:</span>
                  <input
                    type="text"
                    value={rank2S}
                    onChange={(e) => setRank2S(e.target.value)}
                    onBlur={triggerSaveWithCurrentSubjects}
                    className="w-16 text-center text-xs p-1 bg-white border border-slate-200 rounded font-black text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Application:</span>
                  <select
                    value={apprec2S}
                    onChange={(e) => setApprec2S(e.target.value as any)}
                    onBlur={triggerSaveWithCurrentSubjects}
                    className="text-xs p-1 bg-white border border-slate-200 rounded font-bold text-slate-700 focus:outline-hidden"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Très Bien">Très Bien</option>
                    <option value="Bien">Bien</option>
                    <option value="Assez Bien">Assez Bien</option>
                    <option value="Médiocre">Médiocre</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span>Conduite RDC:</span>
                  <select
                    value={conduite2S}
                    onChange={(e) => setConduite2S(e.target.value as any)}
                    onBlur={triggerSaveWithCurrentSubjects}
                    className="text-xs p-1 bg-white border border-slate-200 rounded font-bold text-slate-700 focus:outline-hidden"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Très Bien">Très Bien</option>
                    <option value="Bien">Bien</option>
                    <option value="Assez Bien">Assez Bien</option>
                    <option value="Médiocre">Médiocre</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span>Absences (Jours):</span>
                  <input
                    type="number"
                    value={absences2S}
                    onChange={(e) => setAbsences2S(Number(e.target.value))}
                    onBlur={triggerSaveWithCurrentSubjects}
                    className="w-12 text-center text-xs p-1 bg-white border border-slate-200 rounded font-bold focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Decision and summary */}
          <div className="space-y-3.5 text-[11px] font-bold text-slate-800">
            <h3 className="text-xs font-black uppercase text-slate-950 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <FileText className="h-4 w-4 text-blue-600 shrink-0" />
              DÉCISION DU JURY ET OBSERVATIONS
            </h3>

            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
              <div>
                <label className="block text-[10px] text-indigo-900 uppercase font-bold mb-1">Décision Finale de Passage / Jury de classe</label>
                <select
                  value={juryDecision}
                  onChange={(e) => setJuryDecision(e.target.value)}
                  onBlur={triggerSaveWithCurrentSubjects}
                  className="w-full text-xs p-2.5 bg-white border border-indigo-200 rounded-lg font-black text-indigo-950 focus:outline-hidden"
                >
                  <option value="PROMU(E) AVEC GRANDE DISTINCTION">PROMU(E) AVEC GRANDE DISTINCTION (≥ 80%)</option>
                  <option value="PROMU(E) AVEC DISTINCTION">PROMU(E) AVEC DISTINCTION (70% - 79%)</option>
                  <option value="PROMU(E) AVEC SATISFACTION">PROMU(E) AVEC SATISFACTION (50% - 69%)</option>
                  <option value="ADMIS(E) À L'EXAMEN DE REPÊCHAGE">ADMIS(E) À L'EXAMEN DE REPÊCHAGE</option>
                  <option value="ÉCHOUÉ(E) - DOUBLE LA CLASSE">ÉCHOUÉ(E) - DOUBLE LA CLASSE (&lt; 50%)</option>
                </select>
              </div>

              <div className="text-[10px] text-slate-500 space-y-1 bg-white p-2.5 rounded-lg border border-indigo-100/50 font-medium">
                <div>• Le pourcentage annuel minimal de passage de classe en RDC est fixé à <span className="font-bold text-indigo-900">50%</span>.</div>
                <div>• Tout élève n'ayant pas atteint les 50% généraux ou ayant des échecs graves dans des branches clés est soumis aux décisions souveraines du Conseil des professeurs de l'établissement.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Official triple Signature Block for RDC cards */}
        <div className="grid grid-cols-3 gap-4 pt-10 text-[9px] text-center text-slate-500 font-bold border-t-2 border-slate-900">
          <div className="space-y-16">
            <div className="uppercase">Signature de l'Élève</div>
            <div className="border-b border-slate-300 w-3/4 mx-auto" />
          </div>
          <div className="space-y-16">
            <div className="uppercase text-slate-900">Le Titulaire de Classe</div>
            <div className="font-serif italic text-slate-600">Sceau & Date</div>
            <div className="border-b border-slate-300 w-3/4 mx-auto" />
          </div>
          <div className="space-y-16">
            <div className="uppercase text-indigo-950 font-black">Le Chef d'Établissement</div>
            <div className="text-[8px] text-slate-400 font-normal">Pour approbation et visa de l'Inspecteur</div>
            <div className="border-b-2 border-slate-900 border-double w-3/4 mx-auto" />
          </div>
        </div>

        {/* Footer legal mention */}
        <div className="text-[8px] text-slate-400 font-medium text-center pt-4 border-t border-slate-100">
          Document scolaire officiel conforme aux directives du Secrétariat Général à l'Enseignement Primaire, Secondaire et Technique de la République Démocratique du Congo.
        </div>

      </div>

      {/* Printer styles and clean trigger button */}
      <div className="flex justify-center pt-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase px-6 py-3 rounded-xl cursor-pointer shadow-md tracking-wider"
        >
          <Printer className="h-4 w-4" />
          Imprimer le Bulletin de Cotes Officiel (RDC)
        </button>
      </div>

    </div>
  );
}
