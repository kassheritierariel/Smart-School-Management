import React, { useState } from 'react';
import { 
  Shield, Check, X, ShieldAlert, KeyRound, Save, AlertCircle,
  Users, UserCog, Calculator, GraduationCap
} from 'lucide-react';

interface RolePermission {
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  admin: boolean;
}

interface RoleConfig {
  id: string;
  name: string;
  description: string;
  permissions: RolePermission[];
  icon?: any;
}

export default function RoleManagementView() {
  const defaultModules = [
    'Dashboard', 'Students', 'Teachers', 'Attendance', 'Exams', 
    'Financials', 'Library', 'Transport', 'Discipline', 'Settings'
  ];

  const generateDefaultPermissions = (level: 'full' | 'high' | 'medium' | 'low' | 'none') => {
    return defaultModules.map(module => ({
      module,
      read: level !== 'none',
      write: level === 'full' ? true : (['high', 'medium'].includes(level) && !['Settings'].includes(module)),
      delete: level === 'full' ? true : (['high'].includes(level) && !['Settings'].includes(module)),
      admin: level === 'full'
    }));
  };

  const [roles, setRoles] = useState<RoleConfig[]>([
    {
      id: 'super_admin',
      name: 'Super Admin',
      description: 'Accès total à toutes les fonctionnalités et configurations système.',
      permissions: generateDefaultPermissions('full'),
      icon: ShieldAlert
    },
    {
      id: 'school_admin',
      name: 'School Admin',
      description: 'Gestion complète d\'un établissement scolaire spécifique.',
      permissions: generateDefaultPermissions('high'),
      icon: UserCog
    },
    {
      id: 'teacher',
      name: 'Enseignant',
      description: 'Accès aux classes assignées, notes et présences.',
      permissions: generateDefaultPermissions('medium'),
      icon: GraduationCap
    },
    {
      id: 'accountant',
      name: 'Comptable',
      description: 'Gestion des paiements et rapports financiers.',
      permissions: defaultModules.map(module => ({
        module,
        read: ['Dashboard', 'Financials', 'Students'].includes(module),
        write: module === 'Financials',
        delete: false,
        admin: false
      })),
      icon: Calculator
    }
  ]);

  const [selectedRole, setSelectedRole] = useState<string>('school_admin');

  const activeRoleConfig = roles.find(r => r.id === selectedRole);

  const handleTogglePermission = (moduleName: string, permType: keyof RolePermission) => {
    if (selectedRole === 'super_admin') {
      alert("Les permissions du Super Admin ne peuvent pas être modifiées.");
      return;
    }

    setRoles(prevRoles => prevRoles.map(role => {
      if (role.id === selectedRole) {
        return {
          ...role,
          permissions: role.permissions.map(p => {
            if (p.module === moduleName) {
              return { ...p, [permType]: !p[permType as keyof RolePermission] };
            }
            return p;
          })
        };
      }
      return role;
    }));
  };

  const handleSave = () => {
    // In a real app, save to backend/Firebase
    alert('Permissions sauvegardées avec succès.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Shield className="h-7 w-7 text-blue-600" />
            Gestion des Rôles & Permissions
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Configurez les droits d'accès pour chaque profil utilisateur.
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Enregistrer les modifications
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Roles List */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Profils
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedRole === role.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {role.icon && <role.icon className={`h-4 w-4 ${selectedRole === role.id ? 'text-blue-600' : 'text-slate-400'}`} />}
                    <span className={`text-sm font-bold ${selectedRole === role.id ? 'text-blue-700' : 'text-slate-700'}`}>
                      {role.name}
                    </span>
                  </div>
                  {role.id === 'super_admin' && <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />}
                </div>
                <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-tight">
                  {role.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{activeRoleConfig?.name}</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{activeRoleConfig?.description}</p>
            </div>
            
            {selectedRole === 'super_admin' ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold border border-rose-100">
                <AlertCircle className="h-4 w-4" />
                Permissions Fixes (Accès Total)
              </div>
            ) : (
              <label className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-xl cursor-pointer transition-colors group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={activeRoleConfig?.permissions.every(p => p.read && p.write && p.delete && p.admin)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRoles(prevRoles => prevRoles.map(role => {
                      if (role.id === selectedRole) {
                        return {
                          ...role,
                          permissions: role.permissions.map(p => ({
                            ...p,
                            read: isChecked ? true : p.read,
                            write: isChecked ? true : p.write,
                            delete: isChecked ? true : p.delete,
                            admin: isChecked ? true : p.admin,
                          }))
                        };
                      }
                      return role;
                    }));
                  }}
                />
                <span className="text-xs font-bold text-blue-800 group-hover:text-blue-900">
                  Tous les privilèges
                </span>
              </label>
            )}
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4">Module</th>
                  <th className="p-4 text-center">Lecture</th>
                  <th className="p-4 text-center">Écriture</th>
                  <th className="p-4 text-center">Suppression</th>
                  <th className="p-4 text-center">Admin</th>
                </tr>
              </thead>
              <tbody>
                {activeRoleConfig?.permissions.map(perm => (
                  <tr key={perm.module} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-700 text-sm">{perm.module}</span>
                    </td>
                    {['read', 'write', 'delete', 'admin'].map((permType) => {
                      const hasPerm = perm[permType as keyof RolePermission] as boolean;
                      const isSuperAdmin = selectedRole === 'super_admin';
                      return (
                        <td key={permType} className="p-4 text-center">
                          <button
                            onClick={() => handleTogglePermission(perm.module, permType as keyof RolePermission)}
                            disabled={isSuperAdmin}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                              hasPerm 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : 'bg-slate-100 text-slate-300'
                            } ${isSuperAdmin ? 'cursor-not-allowed opacity-80' : 'hover:scale-110 cursor-pointer'}`}
                          >
                            {hasPerm ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
