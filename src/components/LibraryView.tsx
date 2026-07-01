import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  BookMarked, 
  CheckCircle, 
  AlertTriangle,
  Library
} from 'lucide-react';
import { Book } from '../types';

interface LibraryViewProps {
  books: Book[];
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onUpdateBookCopies: (id: string, totalCopies: number, availableCopies: number) => void;
  onDeleteBook: (id: string) => void;
}

export default function LibraryView({
  books,
  onAddBook,
  onUpdateBookCopies,
  onDeleteBook
}: LibraryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('');
  const [totalCopies, setTotalCopies] = useState(5);

  const categories = Array.from(new Set(books.map(b => b.category)));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    onAddBook({
      title,
      author,
      isbn: isbn || 'N/A',
      category: category || 'Général',
      totalCopies,
      availableCopies: totalCopies
    });

    setTitle('');
    setAuthor('');
    setIsbn('');
    setCategory('');
    setTotalCopies(5);
    setShowAddModal(false);
  };

  const handleBorrowBook = (book: Book) => {
    if (book.availableCopies > 0) {
      onUpdateBookCopies(book.id, book.totalCopies, book.availableCopies - 1);
    } else {
      alert("Aucun exemplaire de ce livre n'est actuellement disponible.");
    }
  };

  const handleReturnBook = (book: Book) => {
    if (book.availableCopies < book.totalCopies) {
      onUpdateBookCopies(book.id, book.totalCopies, book.availableCopies + 1);
    } else {
      alert("Tous les exemplaires de ce livre ont déjà été retournés.");
    }
  };

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.isbn.includes(searchTerm);
    const matchesCat = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Gestion de la Bibliothèque / SM Library
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              SM Books Catalog
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Enregistrer les ouvrages scolaires et de littérature, gérer les stocks disponibles et assurer le suivi des prêts élèves & staff.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Ajouter un Ouvrage
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Library className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Références</div>
            <div className="text-lg font-bold text-slate-900">{books.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <BookMarked className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Exemplaires Totaux</div>
            <div className="text-lg font-bold text-slate-900">
              {books.reduce((acc, b) => acc + b.totalCopies, 0)}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">En Circulation / Prêt</div>
            <div className="text-lg font-bold text-indigo-700">
              {books.reduce((acc, b) => acc + (b.totalCopies - b.availableCopies), 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Search & filters bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, auteur, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-semibold"
          />
        </div>

        {/* Filters */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Books list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[9px] font-bold tracking-wider border-b border-slate-100">
                <th className="py-3 px-4">Titre de l'ouvrage</th>
                <th className="py-3 px-4">Auteur</th>
                <th className="py-3 px-4">ISBN</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4 text-center">Exemplaires Libres</th>
                <th className="py-3 px-4 text-center">État Stock</th>
                <th className="py-3 px-4 text-right">Mouvements / Prêts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {filteredBooks.map((book) => {
                const availabilityPct = (book.availableCopies / book.totalCopies) * 100;
                return (
                  <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-950 text-xs">
                      {book.title}
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-[11px]">
                      {book.author}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono text-[10px]">
                      {book.isbn}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-slate-900">{book.availableCopies}</span>
                      <span className="text-slate-400"> / {book.totalCopies}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-[100px] mx-auto space-y-1">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              availabilityPct === 0 ? 'bg-rose-500' :
                              availabilityPct < 30 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${availabilityPct}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-center text-slate-400">
                          {availabilityPct === 0 ? 'Rupture' : `${Math.round(availabilityPct)}% dispo`}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleBorrowBook(book)}
                          disabled={book.availableCopies === 0}
                          className="px-2 py-1 text-[10px] bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white disabled:bg-slate-100 disabled:text-slate-400 rounded-md font-bold transition-colors cursor-pointer"
                        >
                          Prêter
                        </button>
                        <button
                          onClick={() => handleReturnBook(book)}
                          disabled={book.availableCopies === book.totalCopies}
                          className="px-2 py-1 text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white disabled:bg-slate-100 disabled:text-slate-400 rounded-md font-bold transition-colors cursor-pointer"
                        >
                          Retourner
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Supprimer cet ouvrage définitivement de la bibliothèque ?')) {
                              onDeleteBook(book.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 italic font-semibold">
                    Aucun livre ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
              Enregistrer un Nouvel Ouvrage
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Titre du livre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Les Misérables"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Auteur *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Victor Hugo"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Code ISBN</label>
                  <input
                    type="text"
                    placeholder="Ex: 978-2253006121"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Catégorie / Discipline</label>
                  <input
                    type="text"
                    placeholder="Ex: Littérature, Mathématiques"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Nombre d'exemplaires en stock *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(parseInt(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
