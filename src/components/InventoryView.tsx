import React, { useState, useMemo } from 'react';
import { InventoryItem, InventoryMovement } from '../types';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Plus, Search, Filter, History, Download } from 'lucide-react';
import Papa from 'papaparse';

interface InventoryViewProps {
  items: InventoryItem[];
  movements: InventoryMovement[];
  activeSchoolId: string;
  currentUser: { id: string, firstName: string, lastName: string } | null;
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onRecordMovement: (movement: Omit<InventoryMovement, 'id' | 'date' | 'userId' | 'userName'>) => void;
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
}

export default function InventoryView({
  items,
  movements,
  activeSchoolId,
  currentUser,
  onAddItem,
  onRecordMovement,
  onUpdateItem
}: InventoryViewProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  
  // Add item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fournitures');
  const [unit, setUnit] = useState('pièce');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  
  // Movement form
  const [selectedItemId, setSelectedItemId] = useState('');
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [movementQuantity, setMovementQuantity] = useState(1);
  const [movementReason, setMovementReason] = useState('');

  const schoolItems = useMemo(() => items.filter(i => i.schoolId === activeSchoolId), [items, activeSchoolId]);
  
  const filteredItems = useMemo(() => {
    return schoolItems.filter(i => {
      const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || i.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [schoolItems, searchTerm, categoryFilter]);

  const schoolMovements = useMemo(() => {
    const itemIds = new Set(schoolItems.map(i => i.id));
    return movements.filter(m => itemIds.has(m.itemId)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [movements, schoolItems]);

  const lowStockItems = schoolItems.filter(i => i.quantity <= i.lowStockThreshold);
  const outOfStockItems = schoolItems.filter(i => i.quantity === 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem({
      name,
      category,
      quantity: 0,
      unit,
      lowStockThreshold,
      schoolId: activeSchoolId
    });
    setName('');
    setIsAddModalOpen(false);
  };

  const handleRecordMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;
    
    const item = schoolItems.find(i => i.id === selectedItemId);
    if (!item) return;

    if (movementType === 'OUT' && item.quantity < movementQuantity) {
      alert("Quantité en stock insuffisante.");
      return;
    }

    onRecordMovement({
      itemId: selectedItemId,
      type: movementType,
      quantity: movementQuantity,
      reason: movementReason
    });

    setMovementQuantity(1);
    setMovementReason('');
    setIsMovementModalOpen(false);
  };

  const exportHistory = () => {
    const data = schoolMovements.map(m => {
      const item = schoolItems.find(i => i.id === m.itemId);
      return {
        Date: new Date(m.date).toLocaleString(),
        Article: item?.name || 'Inconnu',
        Type: m.type === 'IN' ? 'Entrée' : 'Sortie',
        Quantité: m.quantity,
        Utilisateur: m.userName,
        Motif: m.reason || ''
      };
    });
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historique_stock_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Gestion des Stocks</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Fournitures, équipements et alertes de réapprovisionnement.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMovementModalOpen(true)}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Entrée/Sortie
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Nouvel Article
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Package className="h-5 w-5" />
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Articles</div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{schoolItems.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Faible</div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{lowStockItems.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rupture</div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600">{outOfStockItems.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-center">
          <button 
            onClick={() => setActiveTab(activeTab === 'dashboard' ? 'history' : 'dashboard')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {activeTab === 'dashboard' ? <History className="h-4 w-4" /> : <Package className="h-4 w-4" />}
            {activeTab === 'dashboard' ? 'Historique' : 'Inventaire'}
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 appearance-none font-semibold text-slate-700"
              >
                <option value="all">Toutes les catégories</option>
                <option value="Fournitures">Fournitures</option>
                <option value="Livres">Livres</option>
                <option value="Uniformes">Uniformes</option>
                <option value="Équipement">Équipement</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-bold text-slate-900">Article</th>
                    <th className="py-3 px-4 font-bold text-slate-900">Catégorie</th>
                    <th className="py-3 px-4 font-bold text-slate-900">En stock</th>
                    <th className="py-3 px-4 font-bold text-slate-900">Seuil d'alerte</th>
                    <th className="py-3 px-4 font-bold text-slate-900 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map(item => {
                    const isOutOfStock = item.quantity === 0;
                    const isLowStock = item.quantity > 0 && item.quantity <= item.lowStockThreshold;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono">
                          {item.lowStockThreshold} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-rose-100">
                              Rupture
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-amber-100">
                              Stock Faible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-emerald-100">
                              En Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                        Aucun article trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
             <button
              onClick={exportHistory}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Exporter CSV
            </button>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-bold text-slate-900">Date</th>
                    <th className="py-3 px-4 font-bold text-slate-900">Article</th>
                    <th className="py-3 px-4 font-bold text-slate-900 text-center">Type</th>
                    <th className="py-3 px-4 font-bold text-slate-900">Quantité</th>
                    <th className="py-3 px-4 font-bold text-slate-900">Utilisateur</th>
                    <th className="py-3 px-4 font-bold text-slate-900">Motif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schoolMovements.map(m => {
                    const item = schoolItems.find(i => i.id === m.itemId);
                    return (
                      <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-slate-500 font-mono text-xs">
                          {new Date(m.date).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {item?.name || 'Inconnu'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {m.type === 'IN' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                              <TrendingUp className="h-3 w-3" /> Entrée
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                              <TrendingDown className="h-3 w-3" /> Sortie
                            </span>
                          )}
                        </td>
                        <td className={`py-3 px-4 font-mono font-bold ${m.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {m.type === 'IN' ? '+' : '-'}{m.quantity}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium text-xs">
                          {m.userName}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-xs">
                          {m.reason || '-'}
                        </td>
                      </tr>
                    );
                  })}
                  {schoolMovements.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                        Aucun mouvement enregistré.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-900 mb-4 uppercase tracking-wider">Nouvel Article</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nom de l'article</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-slate-700"
                  >
                    <option value="Fournitures">Fournitures</option>
                    <option value="Livres">Livres</option>
                    <option value="Uniformes">Uniformes</option>
                    <option value="Équipement">Équipement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Unité</label>
                  <input
                    type="text"
                    required
                    placeholder="pièce, carton..."
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Seuil d'alerte (Stock faible)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={lowStockThreshold}
                  onChange={e => setLowStockThreshold(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-mono font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  Ajouter l'article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movement Modal */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-md font-bold text-slate-900 mb-4 uppercase tracking-wider">Mouvement de stock</h3>
            <form onSubmit={handleRecordMovement} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Article</label>
                <select
                  required
                  value={selectedItemId}
                  onChange={e => setSelectedItemId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-slate-700"
                >
                  <option value="">-- Sélectionner --</option>
                  {schoolItems.map(item => (
                    <option key={item.id} value={item.id}>{item.name} ({item.quantity} en stock)</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Type d'opération</label>
                  <select
                    value={movementType}
                    onChange={e => setMovementType(e.target.value as 'IN' | 'OUT')}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-slate-700"
                  >
                    <option value="IN">Entrée (+)</option>
                    <option value="OUT">Sortie (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Quantité</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={movementQuantity}
                    onChange={e => setMovementQuantity(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Motif (Optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: Réception livraison, Donné à l'élève..."
                  value={movementReason}
                  onChange={e => setMovementReason(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-slate-700"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!selectedItemId}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
