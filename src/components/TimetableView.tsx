import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Trash2, 
  Layers, 
  BookOpen, 
  LayoutGrid,
  Filter
} from 'lucide-react';
import { ScheduleItem, SchoolClass, Subject, Teacher } from '../types';

interface TimetableViewProps {
  schedules: ScheduleItem[];
  classes: SchoolClass[];
  subjects: Subject[];
  teachers: Teacher[];
  onAddScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  onDeleteScheduleItem: (id: string) => void;
}

const DAYS: ('Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi')[] = [
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
];

const PERIODS = [
  '08:30 - 09:30',
  '09:30 - 10:30',
  '10:45 - 11:45',
  '11:45 - 12:45',
  '14:00 - 15:30',
  '15:30 - 17:00'
];

export default function TimetableView({
  schedules,
  classes,
  subjects,
  teachers,
  onAddScheduleItem,
  onDeleteScheduleItem,
}: TimetableViewProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  
  // Add schedule slot modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [day, setDay] = useState<'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi'>('Lundi');
  const [period, setPeriod] = useState(PERIODS[0]);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [room, setRoom] = useState('Salle 101');

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !teacherId || !selectedClassId) return;

    onAddScheduleItem({
      classId: selectedClassId,
      day,
      period,
      subjectId,
      teacherId,
      room
    });

    setIsModalOpen(false);
  };

  // Filter schedules for the selected class
  const classSchedules = schedules.filter(s => s.classId === selectedClassId);

  // Helper to find slot for a day and period
  const getSlot = (dayName: string, periodRange: string) => {
    return classSchedules.find(s => s.day === dayName && s.period === periodRange);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Emploi du Temps Scolaire</h2>
          <p className="text-xs text-gray-500 mt-0.5">Organiser, visualiser et éditer le planning des cours de l'école.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          Planifier un Cours
        </button>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <LayoutGrid className="h-4 w-4" />
          </span>
          <div className="text-xs">
            <div className="text-gray-400 font-medium">Classe sélectionnée</div>
            <div className="font-bold text-gray-800">
              {classes.find(c => c.id === selectedClassId)?.name || 'Aucune classe'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider shrink-0">Emploi du temps de:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full sm:w-48 text-xs py-2 bg-gray-50 border border-gray-200 rounded-xl px-2.5 focus:outline-hidden focus:border-indigo-500 font-medium text-gray-700 h-[36px]"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} (Section {c.section})</option>
            ))}
          </select>
        </div>
      </div>

      {/* TIMETABLE GRID SHEET */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs table-fixed min-w-[750px]">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100">
                <th className="py-4 px-4 w-28 font-bold border-r border-gray-100">Période / Jour</th>
                {DAYS.map(dayName => (
                  <th key={dayName} className="py-4 px-3 font-bold text-center">
                    {dayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PERIODS.map(pRange => (
                <tr key={pRange} className="hover:bg-gray-50/10">
                  {/* Period Time Column */}
                  <td className="py-4 px-4 font-semibold text-gray-900 bg-gray-50/50 border-r border-gray-100 flex items-start gap-1.5 flex-col justify-center h-full">
                    <span className="text-indigo-600 font-semibold font-mono text-[10px]">{pRange.split(' ')[0]}</span>
                    <span className="text-gray-400 font-mono text-[9px]">à {pRange.split(' ')[2]}</span>
                  </td>

                  {/* Days columns */}
                  {DAYS.map(dayName => {
                    const slot = getSlot(dayName, pRange);
                    const sub = slot ? subjects.find(s => s.id === slot.subjectId) : null;
                    const teach = slot ? teachers.find(t => t.id === slot.teacherId) : null;

                    return (
                      <td key={dayName} className="py-3 px-2 text-center align-top border-r border-gray-100 last:border-r-0">
                        {slot ? (
                          <div className="bg-indigo-50/70 border border-indigo-100/50 hover:bg-indigo-50 hover:border-indigo-200 p-2.5 rounded-xl transition-all relative group text-xs text-left shadow-2xs space-y-1">
                            {/* Subject */}
                            <div className="font-bold text-indigo-900 leading-tight truncate" title={sub ? sub.name : 'Matière'}>
                              {sub ? sub.name : 'Inconnu'}
                            </div>

                            {/* Teacher details */}
                            <div className="text-[10px] text-indigo-700/80 font-medium truncate flex items-center gap-1">
                              <User className="h-3 w-3 shrink-0" />
                              {teach ? `${teach.firstName[0]}. ${teach.lastName}` : 'N/A'}
                            </div>

                            {/* Room */}
                            <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {slot.room}
                            </div>

                            {/* Delete button (hover only) */}
                            <button
                              onClick={() => {
                                if (confirm("Retirer ce cours de l'emploi du temps ?")) {
                                  onDeleteScheduleItem(slot.id);
                                }
                              }}
                              className="absolute -top-1.5 -right-1.5 p-1 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Retirer le cours"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-20 border border-dashed border-gray-100 rounded-xl flex items-center justify-center bg-gray-50/20 text-[10px] text-gray-300 font-medium">
                            Libre
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-indigo-600" />
              Planifier un Créneau Horaire
            </h3>

            <form onSubmit={handleAddSlot} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Jour de la Semaine</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    {DAYS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Plage Horaire (Période)</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    {PERIODS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Matière à Enseigner</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium"
                  >
                    <option value="">Sélectionner...</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Professeur en Charge</label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="">Sélectionner...</option>
                    {teachers.filter(t => t.status === 'Active').map(t => (
                      <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Numéro de Salle</label>
                <input
                  type="text"
                  required
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Ex: Salle 103, Labo 2"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
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
                  Ajouter au Planning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
