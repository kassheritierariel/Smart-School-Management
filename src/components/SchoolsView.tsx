import React, { useState } from 'react';
import { z } from 'zod';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Trash2, 
  Star,
  Image as ImageIcon,
  MessageCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { SchoolProfile } from '../types';
import Papa from 'papaparse';

const schoolSchema = z.object({
  name: z.string().min(2, "Le nom de l'établissement est obligatoire"),
  phone: z.string().regex(/^[0-9\-\+\s]{8,15}$/, "Numéro de téléphone invalide"),
  whatsappNumber: z.string().regex(/^[0-9\-\+\s]{8,15}$/, "Numéro WhatsApp invalide").optional().or(z.literal('')),
  email: z.string().email("Adresse email invalide"),
  address: z.string().min(5, "L'adresse est obligatoire"),
  logoUrl: z.string().url("L'URL du logo doit être valide").optional().or(z.literal('')),
  exchangeRate: z.number().min(1, "Le taux de change doit être supérieur à 0").optional()
});

interface SchoolsViewProps {
  schools: SchoolProfile[];
  activeSchoolId: string;
  onSelectSchool: (id: string) => void;
  onAddSchool: (school: Omit<SchoolProfile, 'id'>) => void;
  onUpdateSchool: (id: string, updates: Partial<SchoolProfile>) => void;
  onDeleteSchool: (id: string) => void;
}

export default function SchoolsView({
  schools,
  activeSchoolId,
  onSelectSchool,
  onAddSchool,
  onUpdateSchool,
  onDeleteSchool
}: SchoolsViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [exchangeRate, setExchangeRate] = useState<number>(2800);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string | number) => {
    try {
      if (field === 'name') schoolSchema.shape.name.parse(value);
      if (field === 'phone') schoolSchema.shape.phone.parse(value);
      if (field === 'whatsappNumber') schoolSchema.shape.whatsappNumber?.parse(value);
      if (field === 'email') schoolSchema.shape.email.parse(value);
      if (field === 'address') schoolSchema.shape.address.parse(value);
      if (field === 'logoUrl') schoolSchema.shape.logoUrl?.parse(value);
      if (field === 'exchangeRate') schoolSchema.shape.exchangeRate?.parse(value);
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (err: any) {
      if (err && typeof err === 'object' && 'errors' in err) {
        setErrors(prev => ({ ...prev, [field]: err.errors[0].message }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      schoolSchema.parse({ name, phone, whatsappNumber, email, address, logoUrl, exchangeRate });
      
      onAddSchool({
        name,
        phone,
        whatsappNumber: whatsappNumber || undefined,
        email,
        address,
        logoUrl: logoUrl || undefined,
        exchangeRate,
        status: 'Active'
      });

      setName('');
      setPhone('');
      setWhatsappNumber('');
      setEmail('');
      setAddress('');
      setLogoUrl('');
      setExchangeRate(2800);
      setErrors({});
      setShowAddModal(false);
    } catch (err: any) {
      if (err && typeof err === 'object' && 'errors' in err) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e: any) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let successCount = 0;
        let errorCount = 0;
        
        results.data.forEach((row: any) => {
          try {
            if (!row.name || !row.email) {
              errorCount++;
              return;
            }

            onAddSchool({
              name: row.name,
              phone: row.phone || '',
              whatsappNumber: row.whatsappNumber || undefined,
              email: row.email,
              address: row.address || 'Adresse à préciser',
              logoUrl: row.logoUrl || undefined,
              exchangeRate: row.exchangeRate ? Number(row.exchangeRate) : 2800,
              status: 'Active'
            });
            successCount++;
          } catch (err) {
            errorCount++;
          }
        });
        
        alert(`Import terminé : ${successCount} écoles ajoutées. ${errorCount} erreurs ignorées.`);
      },
      error: (error) => {
        alert("Erreur lors de la lecture du fichier CSV: " + error.message);
      }
    });
    
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Gestion Multi-Établissements
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              SM Schools Panel
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Gérer les différents campus, branches scolaires ou filiales de l'institution et basculer d'une instance à l'autre de manière centralisée.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => document.getElementById('csv-upload-schools')?.click()}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Import (CSV)
          </button>
          <input 
            type="file" 
            id="csv-upload-schools" 
            accept=".csv" 
            className="hidden" 
            onChange={handleCSVUpload} 
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Enregistrer un Établissement
          </button>
        </div>
      </div>

      {/* Grid listing the schools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => {
          const isActive = school.id === activeSchoolId;
          return (
            <div 
              key={school.id}
              onClick={() => onSelectSchool(school.id)}
              className={`rounded-2xl border p-6 transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col justify-between min-h-[230px] group ${
                isActive 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/10 scale-[1.02]' 
                  : 'bg-white text-slate-800 border-slate-150 hover:border-blue-200 hover:shadow-md'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-bl-xl flex items-center gap-1 z-10">
                  <Star className="h-3 w-3 fill-white" />
                  Branche Active
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${
                    isActive ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all'
                  }`}>
                    {school.logoUrl ? (
                      <img src={school.logoUrl} alt={school.name} className="w-full h-full object-cover bg-white" />
                    ) : (
                      <Building2 className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase tracking-tight line-clamp-1">{school.name}</h3>
                    <p className={`text-[10px] font-bold ${isActive ? 'text-blue-200' : 'text-slate-400'} uppercase mt-0.5`}>
                      Statut: {school.status === 'Active' ? 'Actif' : 'Inactif'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-blue-200' : 'text-slate-400'}`} />
                    <span className="font-semibold">{school.phone}</span>
                  </div>
                  {school.whatsappNumber && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-blue-200' : 'text-emerald-500'}`} />
                      <span className="font-semibold">{school.whatsappNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-blue-200' : 'text-slate-400'}`} />
                    <span className="font-semibold truncate">{school.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${isActive ? 'text-blue-200' : 'text-slate-400'}`} />
                    <span className="font-medium line-clamp-2 leading-relaxed">{school.address}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed justify-between" style={{
                    borderColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(226,232,240,1)'
                  }}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[10px] uppercase tracking-wider opacity-70">Taux du jour:</span>
                      <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded flex items-center gap-1 ${
                        isActive ? 'bg-blue-700/50 text-white' : 'bg-slate-100 text-slate-800'
                      }`}>
                        1$ = {school.exchangeRate || 2800} FC
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const newRate = prompt(`Entrez le nouveau taux du jour pour ${school.name} (ex: 2850)`, String(school.exchangeRate || 2800));
                        if (newRate && !isNaN(Number(newRate))) {
                          onUpdateSchool(school.id, { exchangeRate: Number(newRate) });
                        }
                      }}
                      className={`text-[10px] px-2 py-1 rounded transition-colors flex items-center gap-1 shadow-xs border ${
                        isActive 
                          ? 'bg-blue-700/50 border-blue-500/50 text-white hover:bg-blue-700' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      title="Mettre à jour le taux de change"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed mt-4 pt-4 flex items-center justify-between shrink-0" style={{
                borderColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(226,232,240,1)'
              }}>
                <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-blue-100' : 'text-blue-600'}`}>
                  {isActive ? '✓ Sélectionnée' : 'Sélectionner pour administrer'}
                </span>

                {!isActive && schools.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Voulez-vous supprimer l'établissement "${school.name}" ?`)) {
                        onDeleteSchool(school.id);
                      }
                    }}
                    title="Supprimer cet établissement"
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Enregistrer un Établissement
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Configurez les informations officielles de la nouvelle école.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs flex-1 overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Section 1: Informations Générales */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Identité de l'établissement
                </h4>
                
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Nom officiel de l'établissement *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Institut Supérieur du Commerce"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      validateField('name', e.target.value);
                    }}
                    onBlur={() => validateField('name', name)}
                    className={`w-full text-xs p-2.5 bg-white border ${errors.name ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-lg focus:outline-hidden font-semibold transition-colors`}
                  />
                  {errors.name && <p className="text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block font-bold text-slate-600 mb-1">URL du Logo Officiel (Optionnel)</label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="url"
                          placeholder="https://exemple.com/logo.png"
                          value={logoUrl}
                          onChange={(e) => {
                            setLogoUrl(e.target.value);
                            validateField('logoUrl', e.target.value);
                          }}
                          onBlur={() => validateField('logoUrl', logoUrl)}
                          className={`w-full text-xs p-2.5 pl-9 bg-white border ${errors.logoUrl ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-lg focus:outline-hidden font-semibold transition-colors`}
                        />
                      </div>
                      {errors.logoUrl && <p className="text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.logoUrl}</p>}
                    </div>
                    {logoUrl && !errors.logoUrl && (
                      <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden shrink-0 bg-white">
                        <img src={logoUrl} alt="Aperçu logo" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Adresse */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Coordonnées & Localisation
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Téléphone de contact *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: +33 1 23 45 67 89"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        validateField('phone', e.target.value);
                      }}
                      onBlur={() => validateField('phone', phone)}
                      className={`w-full text-xs p-2.5 bg-white border ${errors.phone ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-lg focus:outline-hidden font-semibold transition-colors`}
                    />
                    {errors.phone && <p className="text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1 flex items-center gap-1">
                      Numéro WhatsApp
                      <span className="text-[9px] font-medium text-slate-400 bg-slate-200 px-1.5 rounded-full">Notifications</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: +33 6 12 34 56 78"
                      value={whatsappNumber}
                      onChange={(e) => {
                        setWhatsappNumber(e.target.value);
                        validateField('whatsappNumber', e.target.value);
                      }}
                      onBlur={() => validateField('whatsappNumber', whatsappNumber)}
                      className={`w-full text-xs p-2.5 bg-white border ${errors.whatsappNumber ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-lg focus:outline-hidden font-semibold transition-colors`}
                    />
                    {errors.whatsappNumber && <p className="text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.whatsappNumber}</p>}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Email officiel *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: direction@ecole.fr"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateField('email', e.target.value);
                    }}
                    onBlur={() => validateField('email', email)}
                    className={`w-full text-xs p-2.5 bg-white border ${errors.email ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-lg focus:outline-hidden font-semibold transition-colors`}
                  />
                  {errors.email && <p className="text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.email}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Adresse physique complète *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Ex: 45 Avenue des Écoles, 75005 Paris"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      validateField('address', e.target.value);
                    }}
                    onBlur={() => validateField('address', address)}
                    className={`w-full text-xs p-2.5 bg-white border ${errors.address ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-lg focus:outline-hidden font-semibold transition-colors`}
                  />
                  {errors.address && <p className="text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.address}</p>}
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Taux de change (CDF pour 1$ USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={exchangeRate}
                    onChange={(e) => {
                      setExchangeRate(Number(e.target.value));
                      validateField('exchangeRate', Number(e.target.value));
                    }}
                    onBlur={() => validateField('exchangeRate', exchangeRate)}
                    className={`w-full text-xs p-2.5 bg-white border ${errors.exchangeRate ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-lg focus:outline-hidden font-semibold transition-colors`}
                  />
                  {errors.exchangeRate && <p className="text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.exchangeRate}</p>}
                </div>
              </div>
              
              <div className="flex gap-3 justify-end pt-4 mt-auto">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={Object.values(errors).some(err => err !== '')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Enregistrer l'établissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
