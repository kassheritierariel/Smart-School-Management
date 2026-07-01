import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, Legend, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Activity, Filter, Download, 
  BookOpen, Users, Award, AlertTriangle
} from 'lucide-react';
import { Exam, Grade, Student, SchoolClass, Subject } from '../types';

interface ExamAnalyticsViewProps {
  exams: Exam[];
  grades: Grade[];
  students: Student[];
  classes: SchoolClass[];
  subjects: Subject[];
}

export default function ExamAnalyticsView({ exams, grades, students, classes, subjects }: ExamAnalyticsViewProps) {
  const [selectedSemester, setSelectedSemester] = useState<string>('S1');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // MOCK DATA GENERATION FOR ANALYTICS (In a real app, this would be computed from grades & exams)
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#14b8a6'];

  const performanceTrendsData = [
    { subject: 'Mathématiques', S1: 14.5, S2: 15.2, failRate: 15 },
    { subject: 'Français', S1: 13.0, S2: 14.1, failRate: 12 },
    { subject: 'Physique', S1: 11.5, S2: 12.8, failRate: 25 },
    { subject: 'Chimie', S1: 12.0, S2: 13.5, failRate: 20 },
    { subject: 'Anglais', S1: 15.5, S2: 16.0, failRate: 5 },
    { subject: 'Histoire', S1: 14.0, S2: 13.5, failRate: 10 },
  ];

  const overallAverages = [
    { month: 'Sep', avg: 13.2 },
    { month: 'Oct', avg: 13.8 },
    { month: 'Nov', avg: 14.5 },
    { month: 'Dec', avg: 14.1 },
    { month: 'Jan', avg: 14.8 },
    { month: 'Feb', avg: 15.3 },
  ];

  const gradeDistribution = [
    { name: 'Excellent (16-20)', value: 15 },
    { name: 'Bien (14-15.9)', value: 35 },
    { name: 'Assez Bien (12-13.9)', value: 25 },
    { name: 'Passable (10-11.9)', value: 15 },
    { name: 'Insuffisant (<10)', value: 10 },
  ];

  let averagesByClass = classes.map(cls => {
    const classStudents = students.filter(s => s.classId === cls.id);
    let classTotal = 0;
    let gradesCount = 0;
    classStudents.forEach(student => {
      const studentGrades = grades.filter(g => g.studentId === student.id);
      studentGrades.forEach(g => {
        const exam = exams.find(e => e.id === g.examId);
        if (exam) {
          classTotal += (g.marksObtained / exam.maxMarks) * 20;
          gradesCount++;
        }
      });
    });
    
    return {
      className: cls.name,
      average: gradesCount > 0 ? Number((classTotal / gradesCount).toFixed(2)) : 0
    };
  }).filter(c => c.average > 0);

  if (averagesByClass.length === 0) {
    averagesByClass = [
      { className: '6ème A', average: 14.5 },
      { className: '6ème B', average: 13.8 },
      { className: '5ème A', average: 12.5 },
      { className: '5ème B', average: 11.2 },
      { className: '4ème A', average: 15.1 },
      { className: '4ème B', average: 13.5 },
    ];
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border-none rounded-xl p-3 shadow-xl">
          <p className="text-white font-bold text-xs mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-[11px] mb-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-slate-300">{entry.name}:</span>
              <span className="text-white font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Analytiques Scolaires</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Tendances et performances académiques des élèves.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center shadow-xs w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 ml-2" />
            <select 
              className="bg-transparent border-none text-sm font-semibold text-slate-700 p-2 focus:ring-0 focus:outline-hidden w-full"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">Toutes les classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <select 
              className="bg-transparent border-none text-sm font-semibold text-slate-700 p-2 focus:ring-0 focus:outline-hidden w-full"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="S1">Semestre 1</option>
              <option value="S2">Semestre 2</option>
              <option value="Year">Année Complète</option>
            </select>
          </div>
          <button className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-100 transition-colors shadow-xs">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Moyenne Générale</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">14.2<span className="text-sm text-slate-500 font-medium">/20</span></span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">+0.4 pt</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taux de Réussite</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">85%</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">+2%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meilleure Matière</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-800 truncate">Anglais</span>
            <span className="text-xs font-bold text-slate-500">15.8/20</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Élèves en difficulté</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">12</span>
            <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">Moy. &lt; 10</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Subject */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Moyennes par Matière (S1 vs S2)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" />
                <YAxis domain={[0, 20]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569', paddingTop: '20px' }} />
                <Bar dataKey="S1" name="Semestre 1" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="S2" name="Semestre 2" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolution sur l'année */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Évolution Moyenne Générale</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overallAverages} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[10, 20]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="avg" name="Moyenne" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution des Moyennes par Classe */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Distribution des moyennes par classe</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={averagesByClass} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="className" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 20]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="average" name="Moyenne" radius={[4, 4, 0, 0]} barSize={32}>
                  {
                    averagesByClass.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.average < 10 ? '#ef4444' : entry.average < 12 ? '#f59e0b' : '#10b981'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Failure Rates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Taux d'Échec par Matière (%)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceTrendsData.sort((a, b) => b.failRate - a.failRate)} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="subject" type="category" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="failRate" name="Échecs (<10/20)" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={16}>
                  {
                    performanceTrendsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.failRate > 15 ? '#ef4444' : '#f59e0b'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Répartition des Mentions</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
