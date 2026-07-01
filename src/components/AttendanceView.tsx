import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Save, 
  Search, 
  Calendar, 
  Users, 
  BookOpen, 
  Filter,
  Check,
  Award
} from 'lucide-react';
import { Student, SchoolClass, Attendance } from '../types';

interface AttendanceViewProps {
  students: Student[];
  classes: SchoolClass[];
  attendances: Attendance[];
  onSaveAttendance: (attendance: Attendance) => void;
}

export default function AttendanceView({
  students,
  classes,
  attendances,
  onSaveAttendance,
}: AttendanceViewProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Find existing attendance sheet
  const attendanceSheetId = `${selectedClassId}_${selectedDate}`;
  const existingSheet = attendances.find(att => att.classId === selectedClassId && att.date === selectedDate);

  // local state for records before saving
  const classStudents = students.filter(s => s.classId === selectedClassId && s.status === 'Active');

  // Load or initialize local records
  const [localRecords, setLocalRecords] = useState<{ [studentId: string]: 'Present' | 'Absent' | 'Late' }>({});
  // Track which class/date we loaded last to know when to sync/re-initialize state
  const [lastLoadedKey, setLastLoadedKey] = useState('');

  const currentKey = `${selectedClassId}_${selectedDate}`;
  if (lastLoadedKey !== currentKey) {
    setLastLoadedKey(currentKey);
    const initialRecords: { [studentId: string]: 'Present' | 'Absent' | 'Late' } = {};
    classStudents.forEach(student => {
      if (existingSheet && existingSheet.records[student.id]) {
        initialRecords[student.id] = existingSheet.records[student.id];
      } else {
        initialRecords[student.id] = 'Present'; // default
      }
    });
    setLocalRecords(initialRecords);
  }

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setLocalRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status: 'Present' | 'Absent' | 'Late') => {
    const updated = { ...localRecords };
    classStudents.forEach(s => {
      updated[s.id] = status;
    });
    setLocalRecords(updated);
  };

  const handleSave = () => {
    onSaveAttendance({
      id: attendanceSheetId,
      classId: selectedClassId,
      date: selectedDate,
      records: localRecords
    });
    alert(`La feuille d'émargement pour la date du ${selectedDate} a été enregistrée avec succès.`);
  };

  // Filter student listing by search
  const filteredStudents = classStudents.filter(s => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Stats calculation
  const totalStudents = classStudents.length;
  const presents = classStudents.filter(s => localRecords[s.id] === 'Present').length;
  const lates = classStudents.filter(s => localRecords[s.id] === 'Late').length;
  const absents = classStudents.filter(s => localRecords[s.id] === 'Absent').length;

  const presentPercentage = totalStudents > 0 ? Math.round(((presents + lates) / totalStudents) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Registre de Présences</h2>
          <p className="text-xs text-gray-500 mt-0.5">Saisir les présences quotidiennes des élèves par classe et par date.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={totalStudents === 0}
            className={`flex items-center justify-center gap-2 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors ${
              totalStudents === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <Save className="h-4 w-4" />
            Enregistrer l'Appel
          </button>
        </div>
      </div>

      {/* Control Panel: Class & Date selections */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Class Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sélectionner la Classe</label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-indigo-500 font-medium text-gray-700"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} - Section {c.section}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sélectionner la Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-indigo-500 font-medium text-gray-700 h-[38px]"
            />
          </div>
        </div>

        {/* Search within class */}
        <div className="flex flex-col gap-1.5 pt-1 md:pt-0">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Filtrer l'Élève</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Stats and Quick Actions Row */}
      {totalStudents > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Quick Stats: Present */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Taux de présence</span>
              <div className="text-xl font-bold text-indigo-600">{presentPercentage}%</div>
            </div>
            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
              {presents + lates}/{totalStudents}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Présents</span>
              <div className="text-xl font-bold text-emerald-600">{presents}</div>
            </div>
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Retards</span>
              <div className="text-xl font-bold text-amber-500">{lates}</div>
            </div>
            <AlertCircle className="h-6 w-6 text-amber-500" />
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Absents</span>
              <div className="text-xl font-bold text-rose-500">{absents}</div>
            </div>
            <XCircle className="h-6 w-6 text-rose-500" />
          </div>
        </div>
      )}

      {/* Attendance Sheet List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {totalStudents > 0 ? (
          <div>
            {/* Quick Actions to mark all */}
            <div className="p-3.5 bg-gray-50/60 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2.5 text-xs">
              <span className="font-semibold text-gray-700">Remplissage rapide:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleMarkAll('Present')}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-[10px] flex items-center gap-1 border border-emerald-100 transition-colors"
                >
                  <Check className="h-3 w-3" /> Tout Présent
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('Absent')}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-[10px] flex items-center gap-1 border border-rose-100 transition-colors"
                >
                  Tout Absent
                </button>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
              {filteredStudents.map((student) => {
                const currentStatus = localRecords[student.id] || 'Present';
                return (
                  <div key={student.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/30 transition-colors text-xs">
                    
                    {/* Student details */}
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-gray-100 text-gray-600 font-bold rounded-lg flex items-center justify-center shrink-0">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-[11px] text-gray-400">Matricule: {student.rollNumber}</div>
                      </div>
                    </div>

                    {/* Selector Buttons */}
                    <div className="flex items-center gap-1">
                      {/* Present Button */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Present')}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all border ${
                          currentStatus === 'Present'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                            : 'bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        Présent
                      </button>

                      {/* Late Button */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Late')}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all border ${
                          currentStatus === 'Late'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-2xs'
                            : 'bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        Retard
                      </button>

                      {/* Absent Button */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Absent')}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all border ${
                          currentStatus === 'Absent'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs'
                            : 'bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        <XCircle className="h-3.5 w-3.5 shrink-0" />
                        Absent
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <Users className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 text-sm">Aucun élève actif dans cette classe</h4>
            <p className="text-gray-400 text-xs mt-1">Vous devez d'abord inscrire des élèves actifs dans cette classe pour pouvoir faire l'appel.</p>
          </div>
        )}
      </div>

    </div>
  );
}
