import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Clock, 
  User, 
  PlusCircle, 
  Edit, 
  Trash2, 
  LogIn,
  LogOut,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AuditLog } from '../types';

// Mock data
const mockLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'u1',
    userName: 'Jean Dupont',
    userRole: 'Super Admin',
    actionType: 'UPDATE',
    entityType: 'STUDENT',
    entityId: 'std-123',
    details: 'Mise à jour du profil de l\'élève (changement d\'adresse)',
    timestamp: '2026-07-01T10:15:30Z'
  },
  {
    id: 'log-2',
    userId: 'u2',
    userName: 'Marie Curie',
    userRole: 'Directeur',
    actionType: 'CREATE',
    entityType: 'INVOICE',
    entityId: 'inv-456',
    details: 'Création d\'une facture de scolarité pour le trimestre 1',
    timestamp: '2026-07-01T09:45:12Z'
  },
  {
    id: 'log-3',
    userId: 'u1',
    userName: 'Jean Dupont',
    userRole: 'Super Admin',
    actionType: 'DELETE',
    entityType: 'TEACHER',
    entityId: 'tch-789',
    details: 'Suppression du dossier enseignant (départ à la retraite)',
    timestamp: '2026-06-30T16:20:00Z'
  },
  {
    id: 'log-4',
    userId: 'u3',
    userName: 'Paul Valéry',
    userRole: 'Comptable',
    actionType: 'LOGIN',
    entityType: 'SYSTEM',
    details: 'Connexion réussie',
    timestamp: '2026-07-01T08:00:05Z'
  },
  {
    id: 'log-5',
    userId: 'u1',
    userName: 'Jean Dupont',
    userRole: 'Super Admin',
    actionType: 'OTHER',
    entityType: 'SETTINGS',
    details: 'Modification des privilèges du rôle Comptable',
    timestamp: '2026-06-29T14:30:22Z'
  }
];

interface AuditLogViewProps {
  logs: AuditLog[];
}

export default function AuditLogView({ logs }: AuditLogViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const getActionIcon = (type: AuditLog['actionType']) => {
    switch (type) {
      case 'CREATE': return <PlusCircle className="h-4 w-4 text-emerald-500" />;
      case 'UPDATE': return <Edit className="h-4 w-4 text-blue-500" />;
      case 'DELETE': return <Trash2 className="h-4 w-4 text-rose-500" />;
      case 'LOGIN': return <LogIn className="h-4 w-4 text-indigo-500" />;
      case 'LOGOUT': return <LogOut className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-amber-500" />;
    }
  };

  const getActionColor = (type: AuditLog['actionType']) => {
    switch (type) {
      case 'CREATE': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'UPDATE': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'DELETE': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'LOGIN': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'LOGOUT': return 'bg-gray-50 text-gray-700 border-gray-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.entityType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'ALL' || log.actionType === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Journal d\'Activité (Audit Log)</h1>
          <p className="text-sm text-slate-500 mt-1">Traçabilité complète des actions système</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur, une action, une entité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="ALL">Toutes les actions</option>
              <option value="CREATE">Créations</option>
              <option value="UPDATE">Modifications</option>
              <option value="DELETE">Suppressions</option>
              <option value="LOGIN">Connexions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4">Horodatage</th>
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entité</th>
                <th className="p-4">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-slate-400" />
                      {formatDate(log.timestamp)}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {log.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{log.userName}</div>
                        <div className="text-xs text-slate-500">{log.userRole}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold ${getActionColor(log.actionType)}`}>
                      {getActionIcon(log.actionType)}
                      {log.actionType}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      {log.entityType}
                    </span>
                    {log.entityId && (
                      <span className="text-[10px] text-slate-400 ml-2 font-mono">#{log.entityId}</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-700 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Aucun journal d'activité ne correspond à vos critères.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
          <div>Affichage de {filteredLogs.length} sur {logs.length} résultats</div>
          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-50"><ChevronLeft className="h-5 w-5" /></button>
            <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-50"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
