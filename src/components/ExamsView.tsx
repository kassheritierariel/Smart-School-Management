import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Award, 
  Search, 
  Edit, 
  BookOpen, 
  Check, 
  ChevronRight, 
  Printer, 
  TrendingUp, 
  Layers, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Exam, Grade, Student, SchoolClass, Subject, SchoolProfile } from '../types';
import CongoleseBulletinView from './CongoleseBulletinView';

interface ExamsViewProps {
  exams: Exam[];
  grades: Grade[];
  students: Student[];
  classes: SchoolClass[];
  subjects: Subject[];
  schoolProfile?: SchoolProfile;
  onAddExam: (exam: Omit<Exam, 'id'>) => void;
  onSaveGrades: (examId: string, gradeRecords: { [studentId: string]: { marks: number, remarks: string } }) => void;
  onDeleteExam: (id: string) => void;
}

export default function ExamsView({
  exams,
  grades,
  students,
  classes,
  subjects,
  schoolProfile,
  onAddExam,
  onSaveGrades,
  onDeleteExam,
}: ExamsViewProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'all');
  
  // Grading mode
  const [gradingExam, setGradingExam] = useState<Exam | null>(null);
  const [gradingRecords, setGradingRecords] = useState<{ [studentId: string]: { marks: number, remarks: string } }>({});

  // Add exam modal
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [examClassId, setExamClassId] = useState(classes[0]?.id || '');
  const [examSubjectId, setExamSubjectId] = useState(subjects[0]?.id || '');
  const [examMaxMarks, setExamMaxMarks] = useState(20);

  // Transcript report card viewer (Bulletin)
  const [transcriptStudent, setTranscriptStudent] = useState<Student | null>(null);
  const [bulletinType, setBulletinType] = useState<'classic' | 'congolese'>('congolese');

  // Filter exams by class selection
  const filteredExams = exams.filter(e => selectedClassId === 'all' || e.classId === selectedClassId);

  const startGrading = (exam: Exam) => {
    setGradingExam(exam);
    const initialRecords: { [studentId: string]: { marks: number, remarks: string } } = {};
    const classStudents = students.filter(s => s.classId === exam.classId && s.status === 'Active');

    classStudents.forEach(student => {
      const existingGrade = grades.find(g => g.examId === exam.id && g.studentId === student.id);
      initialRecords[student.id] = {
        marks: existingGrade ? existingGrade.marksObtained : 10, // default mid grade
        remarks: existingGrade ? existingGrade.remarks : 'Bon travail'
      };
    });

    setGradingRecords(initialRecords);
  };

  const handleGradeChange = (studentId: string, field: 'marks' | 'remarks', value: any) => {
    setGradingRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveGradesForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingExam) return;

    onSaveGrades(gradingExam.id, gradingRecords);
    alert('Les notes ont été enregistrées avec succès.');
    setGradingExam(null);
  };

  const handleAddExamForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim() || !examClassId || !examSubjectId) return;

    onAddExam({
      name: examName,
      date: examDate,
      classId: examClassId,
      subjectId: examSubjectId,
      maxMarks: examMaxMarks
    });

    setExamName('');
    setIsExamModalOpen(false);
  };

  // Compile full transcript for a student
  const compileTranscript = (student: Student) => {
    const studentGrades = grades.filter(g => g.studentId === student.id);
    const lines = studentGrades.map(g => {
      const exam = exams.find(e => e.id === g.examId);
      const subject = exam ? subjects.find(s => s.id === exam.subjectId) : null;
      return {
        subjectName: subject ? subject.name : 'Inconnu',
        examName: exam ? exam.name : 'Examen',
        marks: g.marksObtained,
        max: exam ? exam.maxMarks : 20,
        remarks: g.remarks,
        ratio: exam ? g.marksObtained / exam.maxMarks : 0.5
      };
    });

    // compute general averages
    const totalMax = lines.reduce((sum, l) => sum + 20, 0);
    const totalScoreScaled = lines.reduce((sum, l) => sum + (l.marks / l.max * 20), 0);
    const generalAverage = lines.length > 0 ? (totalScoreScaled / lines.length).toFixed(2) : null;

    let decision = 'Félicitations du Conseil de Classe';
    if (generalAverage && parseFloat(generalAverage) < 10) {
      decision = 'Avertissement de travail / Revoir la méthodologie';
    } else if (generalAverage && parseFloat(generalAverage) < 14) {
      decision = 'Passage admis - Tableau d\'honneur';
    }

    return { lines, generalAverage, decision };
  };

  return (
    <div className="space-y-6">
      
      {/* If Viewing Transcript / Bulletin card */}
      {transcriptStudent ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100 print:hidden">
            <button
              onClick={() => setTranscriptStudent(null)}
              className="text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-100 px-3 py-1.5 rounded-lg font-bold shadow-2xs cursor-pointer w-fit"
            >
              ← Retour aux examens
            </button>

            {/* Bulletin Type Selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setBulletinType('congolese')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  bulletinType === 'congolese'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulletin de Cotes Congolais (RDC)
              </button>
              <button
                onClick={() => setBulletinType('classic')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  bulletinType === 'classic'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulletin Classique (Trimestriel)
              </button>
            </div>

            {bulletinType === 'classic' && (
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Imprimer le Bulletin Classique
              </button>
            )}
          </div>

          {bulletinType === 'congolese' ? (
            <CongoleseBulletinView
              student={transcriptStudent}
              schoolClass={classes.find(c => c.id === transcriptStudent.classId)}
              classes={classes}
              schoolProfile={schoolProfile}
            />
          ) : (
            /* Official styled transcript template */
            <div className="bg-white rounded-2xl border border-slate-300 p-8 max-w-3xl mx-auto shadow-md space-y-8" id="printable-bulletin">
              {/* School Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-slate-800 pb-5">
                {schoolProfile?.logoUrl && (
                  <img src={schoolProfile.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
                )}
                <div className="space-y-1">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight uppercase">{schoolProfile?.name || "Smart School Management"}</h1>
                  <p className="text-[11px] font-bold text-slate-400">INSTITUTION SCOLAIRE - GESTION NUMÉRIQUE</p>
                  <p className="text-[10px] text-slate-500 font-medium">Adresse: {schoolProfile?.address || "45 Avenue des Écoles, Paris"}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Contact: {schoolProfile?.phone || "+33 1 23 45 67 89"}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-[11px] font-bold text-slate-800 tracking-wider">BULLETIN TRIMESTRIEL D'ÉVALUATION</div>
                  <div className="text-[10px] text-blue-600 font-bold uppercase">Année Scolaire: 2025 - 2026</div>
                  <div className="text-[10px] text-slate-400 font-mono font-bold">Date d'édition: {new Date().toLocaleDateString('fr-FR')}</div>
                </div>
              </div>

              {/* Student metadata */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl text-xs border border-slate-100">
                <div className="space-y-2">
                  <div><span className="text-slate-400 font-semibold">Élève:</span> <span className="font-bold text-slate-900 uppercase">{transcriptStudent.lastName}</span> {transcriptStudent.firstName}</div>
                  <div><span className="text-slate-400 font-semibold">Né(e) le:</span> <span className="font-bold text-slate-800">12/04/2012</span></div>
                  <div><span className="text-slate-400 font-semibold">Matricule:</span> <span className="font-mono font-bold text-slate-700">{transcriptStudent.rollNumber}</span></div>
                </div>
                <div className="space-y-2 text-right">
                  <div><span className="text-slate-400 font-semibold">Classe:</span> <span className="font-bold text-blue-700">{classes.find(c => c.id === transcriptStudent.classId)?.name}</span></div>
                  <div><span className="text-slate-400 font-semibold">Section:</span> <span className="font-bold text-slate-800">{transcriptStudent.section}</span></div>
                  <div><span className="text-slate-400 font-semibold">Tuteur Légal:</span> <span className="font-bold text-slate-800">{transcriptStudent.parentName}</span></div>
                </div>
              </div>

              {/* Grades matrix */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Résultats disciplinaires</h3>
                <table className="w-full text-left border border-slate-200 text-xs rounded-lg overflow-hidden">
                  <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3 border-b border-slate-200">Discipline / Matière</th>
                      <th className="py-2.5 px-3 border-b border-slate-200">Évaluation</th>
                      <th className="py-2.5 px-3 border-b border-slate-200 text-center">Note Élève</th>
                      <th className="py-2.5 px-3 border-b border-slate-200 text-center">Base Note</th>
                      <th className="py-2.5 px-3 border-b border-slate-200 text-right">Appréciations du Professeur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {compileTranscript(transcriptStudent).lines.map((line, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-3 font-semibold text-slate-900">{line.subjectName}</td>
                        <td className="py-3 px-3 text-slate-500 font-medium">{line.examName}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-slate-950">{line.marks}</span>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-400 font-bold">/ {line.max}</td>
                        <td className="py-3 px-3 text-right text-slate-500 italic text-[11px] font-medium">{line.remarks}</td>
                      </tr>
                    ))}

                    {compileTranscript(transcriptStudent).lines.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 italic font-medium">
                          Aucun examen ni note n'a été enregistré pour cet élève au cours de ce trimestre.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* General evaluation */}
              {compileTranscript(transcriptStudent).lines.length > 0 && (
                <div className="border-2 border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="text-center sm:border-r border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Moyenne Générale</div>
                    <div className="text-3xl font-extrabold text-blue-700 mt-1">
                      {compileTranscript(transcriptStudent).generalAverage} <span className="text-sm font-semibold text-slate-400">/20</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 text-xs space-y-1">
                    <div className="text-slate-400 font-bold">Avis et Décision Globale du Conseil de Classe:</div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-amber-500 shrink-0" />
                      {compileTranscript(transcriptStudent).decision}
                    </div>
                    <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100 font-medium">
                      Scolarité validée par le proviseur et l'ensemble des équipes pédagogiques.
                    </p>
                  </div>
                </div>
              )}

              {/* Signature Block */}
              <div className="grid grid-cols-2 gap-10 pt-8 text-[11px] text-center text-slate-500 font-semibold">
                <div className="space-y-12">
                  <div className="font-bold uppercase">Signature des Parents</div>
                  <div className="border-b border-slate-300 w-3/4 mx-auto" />
                </div>
                <div className="space-y-12">
                  <div className="font-bold uppercase text-blue-900">Le Proviseur de l'Académie</div>
                  <div className="font-serif italic text-slate-700">Direction Administrative</div>
                  <div className="border-b border-slate-300 w-3/4 mx-auto" />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : gradingExam ? (
        // Grading View: Saisir les notes
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Saisie des notes pour: <span className="text-blue-600 font-bold">{gradingExam.name}</span></h3>
              <p className="text-xs text-slate-500 mt-0.5 font-semibold">Note maximale: {gradingExam.maxMarks} pts • Classe: {classes.find(c => c.id === gradingExam.classId)?.name}</p>
            </div>

            <button
              onClick={() => setGradingExam(null)}
              className="text-xs bg-white text-slate-600 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg font-bold cursor-pointer"
            >
              Annuler
            </button>
          </div>

          <form onSubmit={handleSaveGradesForm} className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                    <th className="py-3.5 px-4 font-bold">Élève</th>
                    <th className="py-3.5 px-4 font-bold text-center w-40">Note obtenue (sur {gradingExam.maxMarks})</th>
                    <th className="py-3.5 px-4 font-bold">Appréciations administratives & Pédagogiques</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.filter(s => s.classId === gradingExam.classId && s.status === 'Active').map(student => {
                    const studentRecord = gradingRecords[student.id] || { marks: 10, remarks: '' };
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/20">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {student.firstName} {student.lastName}
                          <span className="block font-medium text-[10px] text-slate-400 font-mono mt-0.5">N° Matricule: {student.rollNumber}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            required
                            step="0.25"
                            min="0"
                            max={gradingExam.maxMarks}
                            value={studentRecord.marks}
                            onChange={(e) => handleGradeChange(student.id, 'marks', parseFloat(e.target.value) || 0)}
                            className="w-24 text-center text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold font-mono"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            required
                            value={studentRecord.remarks}
                            placeholder="Ex: Excellent travail, persévérer..."
                            onChange={(e) => handleGradeChange(student.id, 'remarks', e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setGradingExam(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" /> Enregistrer les Notes
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Standard Exams List View
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Examens & Livrets de Notes</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-semibold">Planifier les évaluations, saisir les bulletins d'appréciations continus.</p>
            </div>

            <button
              onClick={() => setIsExamModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Créer un Examen
            </button>
          </div>

          {/* Transcript Quick link / Bulletin Generator list */}
          <div className="bg-gradient-to-tr from-blue-50 to-slate-50 border border-blue-100 p-5 rounded-2xl shadow-2xs space-y-3.5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-blue-950 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Générateur Instantané de Bulletins Scolaires
                </h3>
                <p className="text-xs text-blue-700/80 mt-0.5 font-semibold">
                  Sélectionner un élève pour compiler instantanément ses notes, ses appréciations et sa moyenne générale sous forme de livret imprimable.
                </p>
              </div>
            </div>

            {/* Student selection dropdown to open bulletin */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-center max-w-md">
              <select
                onChange={(e) => {
                  const student = students.find(s => s.id === e.target.value);
                  if (student) setTranscriptStudent(student);
                  e.target.value = ''; // Reset
                }}
                className="w-full text-xs p-2.5 bg-white border border-blue-200 rounded-xl focus:outline-hidden focus:border-blue-500 text-blue-900 font-bold shadow-2xs"
              >
                <option value="">-- Choisir un élève --</option>
                {classes.map(cls => (
                  <optgroup key={cls.id} label={`Classe: ${cls.name}`}>
                    {students.filter(s => s.classId === cls.id && s.status === 'Active').map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Filtering bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-bold text-slate-500">Liste des Examens & Devoirs planifiés</div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
              <span className="text-[11px] text-slate-400 font-bold shrink-0">Classe:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full text-xs py-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 focus:outline-hidden focus:border-blue-500 font-bold text-slate-700"
              >
                <option value="all">Toutes les classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Exams list table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            {filteredExams.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                      <th className="py-3.5 px-4 font-bold">Nom du devoir</th>
                      <th className="py-3.5 px-4 font-bold">Matière</th>
                      <th className="py-3.5 px-4 font-bold text-center">Classe</th>
                      <th className="py-3.5 px-4 font-bold text-center">Barème Max</th>
                      <th className="py-3.5 px-4 font-bold">Date de passage</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExams.map((exam) => {
                      const subject = subjects.find(s => s.id === exam.subjectId);
                      const cls = classes.find(c => c.id === exam.classId);
                      
                      // Count graded students
                      const gradesForExam = grades.filter(g => g.examId === exam.id);
                      const totalStudentsInClass = students.filter(s => s.classId === exam.classId && s.status === 'Active').length;
                      const isGradingComplete = gradesForExam.length === totalStudentsInClass;

                      return (
                        <tr key={exam.id} className="hover:bg-slate-50/20">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {exam.name}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-700 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
                              {subject ? subject.name : 'Matière'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                            {cls ? cls.name : 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-600">
                            / {exam.maxMarks}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-semibold">
                            {exam.date}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Saisir les notes button */}
                              <button
                                onClick={() => startGrading(exam)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border flex items-center gap-1 cursor-pointer ${
                                  isGradingComplete 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                                    : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                                }`}
                              >
                                <FileSpreadsheet className="h-3.5 w-3.5 shrink-0" />
                                {isGradingComplete ? 'Notes saisies' : 'Saisir les notes'}
                              </button>

                              {/* Delete button */}
                              <button
                                onClick={() => {
                                  if (confirm("Supprimer cet examen ainsi que toutes ses notes associées ?")) {
                                    onDeleteExam(exam.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Printer className="h-4 w-4" />
                              </button>
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
                <p className="text-slate-400 text-sm font-semibold">Aucun examen planifié pour cette classe actuellement.</p>
                <button 
                  onClick={() => setSelectedClassId('all')} 
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold mt-2 flex items-center gap-1 mx-auto cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" /> Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
              <Award className="h-4 w-4 text-blue-600" />
              Créer une Nouvelle Évaluation
            </h3>

            <form onSubmit={handleAddExamForm} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nom du Devoir / Évaluation</label>
                <input
                  type="text"
                  required
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="Ex: Contrôle écrit d'Histoire, TP de Chimie..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:bg-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Classe d'évaluation</label>
                  <select
                    value={examClassId}
                    onChange={(e) => setExamClassId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold text-slate-700"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Discipline / Matière</label>
                  <select
                    value={examSubjectId}
                    onChange={(e) => setExamSubjectId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold text-slate-700"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Date d'évaluation</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Barème de notation max</label>
                  <input
                    type="number"
                    required
                    value={examMaxMarks}
                    onChange={(e) => setExamMaxMarks(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  Planifier l'Évaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
