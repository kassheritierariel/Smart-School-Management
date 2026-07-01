import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Shield, 
  Activity, 
  Clock, 
  Edit, 
  Save, 
  X,
  Camera,
  MapPin
} from 'lucide-react';
import { AppUser, AuditLog } from '../types';

// Mock data for the current user
const mockUser: AppUser = {
  id: 'u1',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@smartschool.edu',
  phone: '+243 81 000 0000',
  role: 'Super Admin',
  department: 'Direction Générale',
  status: 'Active',
  lastLogin: '2026-07-01T13:30:00Z',
  photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

// Mock data for user's recent activity
const mockUserLogs: AuditLog[] = [
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

interface UserProfileViewProps {
  user: any;
  auditLogs: AuditLog[];
}

export default function UserProfileView({ user: currentUser, auditLogs }: UserProfileViewProps) {
  // If user prop is just { name, email, role }, we adapt it
  const adaptedUser: AppUser = {
    id: currentUser?.id || currentUser?.email || 'u1',
    firstName: currentUser?.name?.split(' ')[0] || 'Admin',
    lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    role: currentUser?.role || 'Super Admin',
    department: currentUser?.department || 'Direction Générale',
    status: 'Active',
    lastLogin: new Date().toISOString()
  };

  const [user, setUser] = useState<AppUser>(adaptedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(adaptedUser);
  
  const userLogs = auditLogs.filter(l => l.userId === user.id).slice(0, 10);

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mon Profil</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez vos informations personnelles et consultez votre activité</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Edit className="h-4 w-4" />
            Modifier le profil
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden relative">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="px-6 pb-6 relative">
              <div className="relative w-24 h-24 -mt-12 mx-auto mb-4">
                <img 
                  src={user.photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                  alt={`${user.firstName} ${user.lastName}`} 
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-sm bg-white"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm border-2 border-white">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900">{user.firstName} {user.lastName}</h2>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-sm text-blue-600 font-semibold bg-blue-50 w-fit mx-auto px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4" />
                  {user.role}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{user.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{user.department || 'Non spécifié'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Statistiques d'Activité</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Actions ce mois-ci</span>
                  <span className="font-bold text-slate-900">124</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4" />
                Dernière connexion: <span className="font-medium text-slate-900">{user.lastLogin ? formatDate(user.lastLogin) : 'Inconnue'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form or Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Modifier les informations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Prénom</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Nom</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Téléphone</label>
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Département</label>
                  <input
                    type="text"
                    value={editForm.department || ''}
                    onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={handleCancel}
                  className="px-5 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Mon Historique d'Actions
                </h3>
              </div>
              
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                {userLogs.length > 0 ? userLogs.map((log) => (
                  <div key={log.id} className="relative pl-6">
                    <div className={`absolute -left-2.5 top-1 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center ${
                      log.actionType === 'CREATE' ? 'bg-emerald-500' :
                      log.actionType === 'UPDATE' ? 'bg-blue-500' :
                      log.actionType === 'DELETE' ? 'bg-rose-500' :
                      'bg-slate-400'
                    }`}></div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-900">{log.details}</h4>
                      <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md shrink-0">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {log.entityType}
                      </span>
                      {log.entityId && (
                        <span className="text-xs text-slate-400 font-mono">#{log.entityId}</span>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-slate-500 py-4">Aucune activité récente.</div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Voir tout l'historique
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
