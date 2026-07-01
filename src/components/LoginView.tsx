import React, { useState } from 'react';
import { 
  Shield, 
  UserCheck, 
  GraduationCap, 
  Coins, 
  PhoneCall, 
  BookOpen, 
  User, 
  Users, 
  Eye, 
  EyeOff,
  BookMarked,
  Smartphone,
  HelpCircle,
  LogIn
} from 'lucide-react';
import { auth, googleAuthProvider, db } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SchoolProfile } from '../types';

interface LoginViewProps {
  onLogin: (role: string, name: string, email: string, uid?: string) => void;
  currentSchool?: SchoolProfile | null;
}

export default function LoginView({ onLogin, currentSchool }: LoginViewProps) {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let role = 'student'; // Default role
      
      if (userDoc.exists()) {
        role = userDoc.data().role || 'student';
      } else {
        // Create new user profile in Firestore
        // Set first user as super_admin if this is the first login in the system? 
        // For this demo, let's just make the very first user a superadmin or fallback to student.
        // For simplicity, we just set a student, unless the email contains "admin".
        if (user.email === 'kassheritier@telgroups.org') {
          role = 'super_admin';
        } else if (user.email?.toLowerCase().includes('admin')) {
          role = 'school_admin';
        }
        
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || 'Utilisateur',
          role: role,
          createdAt: new Date().toISOString()
        });
      }
      
      // Override role if it is kassheritier for safety
      if (user.email === 'kassheritier@telgroups.org') {
        role = 'super_admin';
      }
      
      onLogin(role, user.displayName || 'Utilisateur', user.email || '', user.uid);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Erreur lors de la connexion via Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGoogleLogin();
  };

  const handleRoleQuickLogin = (roleId: string, label: string, name: string, email: string) => {
    onLogin(roleId, name, email);
  };

  const roles = [
    { id: 'super_admin', label: 'Super Admin', icon: Shield, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-100', defaultEmail: 'superadmin@school.com', defaultName: 'Directeur Général' },
    { id: 'school_admin', label: 'School Admin', icon: UserCheck, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-100', defaultEmail: 'admin@school.com', defaultName: 'Directeur Académique' },
    { id: 'teacher', label: 'Enseignant', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-100', defaultEmail: 'teacher@school.com', defaultName: 'Prof. Jean Dupont' },
    { id: 'accountant', label: 'Comptable', icon: Coins, color: 'text-pink-600 bg-pink-50 hover:bg-pink-100 border-pink-100', defaultEmail: 'finance@school.com', defaultName: 'Marc Lefebvre' },
    { id: 'receptionist', label: 'Réceptionniste', icon: PhoneCall, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-100', defaultEmail: 'reception@school.com', defaultName: 'Clara Rousseau' },
    { id: 'librarian', label: 'Bibliothécaire', icon: BookOpen, color: 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border-cyan-100', defaultEmail: 'library@school.com', defaultName: 'Thierry Morel' },
    { id: 'student', label: 'Élève', icon: User, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-100', defaultEmail: 'thomas@school.com', defaultName: 'Thomas Lemaire' },
    { id: 'parent', label: 'Tuteur / Parent', icon: Users, color: 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-100', defaultEmail: 'parent@school.com', defaultName: 'Sophie Lemaire' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-y-auto" style={{
      backgroundImage: `radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)`
    }}>
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row my-6">
        
        {/* Left Welcome Panel */}
        <div className="md:w-5/12 bg-blue-600 p-8 flex flex-col justify-between text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-16 translate-y-16" />
          
          <div className="space-y-2 relative z-10">
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md overflow-hidden">
              {currentSchool?.logoUrl ? (
                <img src={currentSchool.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <BookMarked className="h-8 w-8 text-white" />
              )}
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight pt-4">
              {currentSchool?.name || "Smart School Management"}
            </h2>
            <p className="text-blue-100 text-xs">Le portail académique de référence de l'enseignement d'excellence.</p>
          </div>

          <div className="space-y-4 pt-12 relative z-10">
            <div className="border-l-2 border-blue-400 pl-3">
              <p className="text-[10px] text-blue-200 uppercase font-semibold">Session Active</p>
              <p className="text-xs font-bold">Année Académique 2026-2027</p>
            </div>
            <div className="border-l-2 border-blue-400 pl-3">
              <p className="text-[10px] text-blue-200 uppercase font-semibold">Technologie</p>
              <p className="text-xs font-bold">Portail Cloud Sécurisé avec Firebase</p>
            </div>
          </div>

          <p className="text-[10px] text-blue-200/80 pt-6 font-medium">© 2026 {currentSchool?.name || "Smart School Inc"}. Tous droits réservés.</p>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Connexion Sécurisée
              </span>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight mt-2">Bienvenue sur votre espace</h1>
              <p className="text-xs text-slate-400 font-medium">Connectez-vous via Google pour accéder à l'application.</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-blue-200 text-slate-700 rounded-xl text-sm font-bold transition-all cursor-pointer mt-8"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
              {loading ? 'Connexion en cours...' : 'Se connecter avec Google'}
            </button>
            
            <div className="mt-6 text-center text-xs text-slate-500 font-medium">
              <p>Seul le <span className="font-bold text-purple-600">Super Admin</span> a le contrôle total.</p>
              <p className="mt-1">Les autres rôles sont limités.</p>
            </div>
            
            <div className="border-t border-slate-100 pt-5 mt-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
                Connexion rapide par rôle (Démo)
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleQuickLogin(role.id, role.label, role.defaultName, role.defaultEmail)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-[11px] font-bold transition-all hover:-translate-y-0.5 shadow-3xs hover:shadow-xs text-left cursor-pointer ${role.color}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Support Links */}
      <div className="flex gap-4 text-xs text-slate-400 mt-2 font-bold">
        <a 
          href="#help" 
          onClick={() => alert('Guide de l\'administrateur : Seul l\'utilisateur "super_admin" a accès à tous les onglets.')} 
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <HelpCircle className="h-4 w-4 text-blue-400" />
          Manuel d'aide
        </a>
      </div>
    </div>
  );
}

