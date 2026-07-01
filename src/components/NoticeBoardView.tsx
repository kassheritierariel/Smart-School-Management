import React, { useState } from 'react';
import { 
  Bell, 
  Pin, 
  Trash2, 
  Plus, 
  Bookmark, 
  User, 
  Calendar, 
  Layers, 
  Sparkles,
  Info
} from 'lucide-react';
import { Announcement } from '../types';

interface NoticeBoardViewProps {
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Partial<Announcement>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onTogglePinAnnouncement: (id: string) => void;
}

export default function NoticeBoardView({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onTogglePinAnnouncement,
}: NoticeBoardViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Academique' | 'General' | 'Examens' | 'Evenements'>('General');
  const [pinned, setPinned] = useState(false);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddAnnouncement({
      title,
      content,
      category,
      pinned,
      date: new Date().toISOString().split('T')[0],
      author: 'Administration générale'
    });

    setTitle('');
    setContent('');
    setCategory('General');
    setPinned(false);
    setIsModalOpen(false);
  };

  // Sort: pinned first, then by date descending
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.date.localeCompare(a.date);
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Panneau d'Affichage Électronique</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Diffuser les communications, notes administratives et événements de la vie scolaire.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Publier un Message
        </button>
      </div>

      {/* Grid List of Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Render Notices */}
        {sortedAnnouncements.map((notice) => (
          <div 
            key={notice.id}
            className={`p-5 rounded-2xl border text-xs relative flex flex-col justify-between h-56 transition-all hover:shadow-md ${
              notice.pinned 
                ? 'bg-amber-50/20 border-amber-200 shadow-2xs' 
                : 'bg-white border-slate-100 shadow-xs'
            }`}
          >
            <div className="space-y-2.5">
              {/* Header category badge and pinned pin icon */}
              <div className="flex justify-between items-center">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                  notice.category === 'Academique' ? 'bg-blue-100 text-blue-700' :
                  notice.category === 'Examens' ? 'bg-purple-100 text-purple-700' :
                  notice.category === 'Evenements' ? 'bg-pink-100 text-pink-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {notice.category}
                </span>

                <div className="flex items-center gap-1">
                  {/* Pin action toggle */}
                  <button
                    onClick={() => onTogglePinAnnouncement(notice.id)}
                    className={`p-1 rounded-md transition-colors ${
                      notice.pinned ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                    }`}
                    title={notice.pinned ? "Désépingler" : "Épingler en haut"}
                  >
                    <Pin className={`h-3.5 w-3.5 ${notice.pinned ? 'fill-amber-400' : ''}`} />
                  </button>

                  {/* Delete action */}
                  <button
                    onClick={() => {
                      if (confirm("Supprimer définitivement ce message d'annonce ?")) {
                        onDeleteAnnouncement(notice.id);
                      }
                    }}
                    className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    title="Supprimer la note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 flex items-center gap-1">
                {notice.pinned && <Bookmark className="h-3 w-3 fill-amber-400 text-amber-500 shrink-0" />}
                {notice.title}
              </h3>

              {/* Message text */}
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-4 font-medium">
                {notice.content}
              </p>
            </div>

            {/* Footer author and date */}
            <div className="flex items-center justify-between border-t border-slate-50 pt-3.5 mt-2 text-[10px] text-slate-400 font-medium">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 shrink-0" />
                <span>{notice.author}</span>
              </div>
              <div className="flex items-center gap-1 font-mono">
                <Calendar className="h-3 w-3 shrink-0" />
                <span>{notice.date}</span>
              </div>
            </div>
          </div>
        ))}

        {sortedAnnouncements.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <Bell className="h-8 w-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm font-semibold">Aucun message d'annonce affiché sur le panneau actuellement.</p>
          </div>
        )}
      </div>

      {/* Post notice modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
              <Bell className="h-4 w-4 text-blue-600" />
              Rédiger une Note d'Information
            </h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Objet / Titre de l'annonce</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Fermeture exceptionnelle, Devoirs à rendre..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  >
                    <option value="General">Générale</option>
                    <option value="Academique">Académique (Cours/Classes)</option>
                    <option value="Examens">Examens & Devoirs</option>
                    <option value="Evenements">Événements (Kermesse, Fêtes)</option>
                  </select>
                </div>
                <div className="flex items-center pt-5 pl-1.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                      className="h-4.5 w-4.5 accent-blue-600 text-blue-600 border-slate-200 rounded-sm focus:ring-blue-500"
                    />
                    Épingler en haut (Prioritaire)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Texte de l'information (Contenu)</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Saisissez ici le texte explicatif complet destiné aux parents ou aux élèves..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium"
                ></textarea>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  Publier l'Annonce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
