import React, { useState } from 'react';
import { 
  Bus, MapPin, Users, Plus, Trash2, Edit3, UserCircle2, Info, CheckCircle2, AlertCircle, Phone, 
  Map, CalendarClock, Car, FileText 
} from 'lucide-react';
import { TransportRoute, Driver, TransportStudent, Student } from '../types';

interface TransportViewProps {
  routes: TransportRoute[];
  drivers: Driver[];
  transportStudents: TransportStudent[];
  allStudents: Student[];
  onAddRoute: (route: Omit<TransportRoute, 'id'>) => void;
  onDeleteRoute: (id: string) => void;
  onAddDriver: (driver: Omit<Driver, 'id'>) => void;
  onDeleteDriver: (id: string) => void;
  onAssignStudent: (assignment: Omit<TransportStudent, 'id'>) => void;
  onRemoveStudent: (id: string) => void;
}

export default function TransportView({
  routes, drivers, transportStudents, allStudents,
  onAddRoute, onDeleteRoute, onAddDriver, onDeleteDriver,
  onAssignStudent, onRemoveStudent
}: TransportViewProps) {
  const [activeTab, setActiveTab] = useState<'routes' | 'drivers' | 'students'>('routes');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states for Route
  const [routeName, setRouteName] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [vehicleType, setVehicleType] = useState('Bus');
  const [vehicleRegistration, setVehicleRegistration] = useState('');
  const [capacity, setCapacity] = useState<number>(30);

  // Form states for Driver
  const [driverFirstName, setDriverFirstName] = useState('');
  const [driverLastName, setDriverLastName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [driverRouteId, setDriverRouteId] = useState('');

  // Form states for Student Assignment
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [pickupPoint, setPickupPoint] = useState('');
  const [fee, setFee] = useState<number>(0);

  const resetForms = () => {
    setRouteName(''); setStartPoint(''); setEndPoint(''); setVehicleRegistration(''); setCapacity(30);
    setDriverFirstName(''); setDriverLastName(''); setDriverPhone(''); setLicenseNumber(''); setDriverRouteId('');
    setSelectedStudentId(''); setSelectedRouteId(''); setPickupPoint(''); setFee(0);
    setShowAddForm(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'routes') {
      if (!routeName.trim() || !startPoint.trim() || !endPoint.trim()) return;
      onAddRoute({ routeName, startPoint, endPoint, vehicleType, vehicleRegistration, capacity });
    } else if (activeTab === 'drivers') {
      if (!driverFirstName.trim() || !driverLastName.trim() || !licenseNumber.trim()) return;
      onAddDriver({ firstName: driverFirstName, lastName: driverLastName, phone: driverPhone, licenseNumber, routeId: driverRouteId || undefined });
    } else if (activeTab === 'students') {
      if (!selectedStudentId || !selectedRouteId || !pickupPoint.trim()) return;
      onAssignStudent({ studentId: selectedStudentId, routeId: selectedRouteId, pickupPoint, fee });
    }
    resetForms();
  };

  const getAssignedStudentsCount = (routeId: string) => {
    return transportStudents.filter(ts => ts.routeId === routeId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Transport Scolaire</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Gérez les lignes de bus, chauffeurs et affectations d'élèves.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {activeTab === 'routes' ? 'Nouvelle Ligne' : activeTab === 'drivers' ? 'Nouveau Chauffeur' : 'Inscrire un Élève'}
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button onClick={() => {setActiveTab('routes'); setShowAddForm(false);}} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'routes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:bg-slate-200'}`}>Lignes & Bus</button>
        <button onClick={() => {setActiveTab('drivers'); setShowAddForm(false);}} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'drivers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:bg-slate-200'}`}>Chauffeurs</button>
        <button onClick={() => {setActiveTab('students'); setShowAddForm(false);}} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:bg-slate-200'}`}>Élèves Inscrits</button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              {activeTab === 'routes' ? 'Créer une Ligne de Transport' : activeTab === 'drivers' ? 'Ajouter un Chauffeur' : 'Inscrire un Élève au Transport'}
            </h2>
            <button onClick={resetForms} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            {activeTab === 'routes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nom de la Ligne</label>
                  <input type="text" required value={routeName} onChange={e => setRouteName(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium" placeholder="Ex: Ligne A - Centre" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Point de Départ</label>
                  <input type="text" required value={startPoint} onChange={e => setStartPoint(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Point d'Arrivée (École)</label>
                  <input type="text" required value={endPoint} onChange={e => setEndPoint(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Type de Véhicule</label>
                  <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium">
                    <option value="Bus">Bus</option>
                    <option value="Minibus">Minibus</option>
                    <option value="Van">Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Immatriculation</label>
                  <input type="text" required value={vehicleRegistration} onChange={e => setVehicleRegistration(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium" placeholder="AB-123-CD" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Capacité (Places)</label>
                  <input type="number" min="1" required value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium" />
                </div>
              </div>
            )}

            {activeTab === 'drivers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Prénom</label>
                  <input type="text" required value={driverFirstName} onChange={e => setDriverFirstName(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nom</label>
                  <input type="text" required value={driverLastName} onChange={e => setDriverLastName(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Téléphone</label>
                  <input type="text" required value={driverPhone} onChange={e => setDriverPhone(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">N° Permis de Conduire</label>
                  <input type="text" required value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Assigner à une ligne (Optionnel)</label>
                  <select value={driverRouteId} onChange={e => setDriverRouteId(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium">
                    <option value="">-- Aucune ligne --</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.routeName} ({r.vehicleRegistration})</option>)}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Élève</label>
                  <select required value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium">
                    <option value="">-- Sélectionner --</option>
                    {allStudents.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.rollNumber})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Ligne de Transport</label>
                  <select required value={selectedRouteId} onChange={e => setSelectedRouteId(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium">
                    <option value="">-- Sélectionner --</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.routeName} ({getAssignedStudentsCount(r.id)}/{r.capacity} places)</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Point de Ramassage</label>
                  <input type="text" required value={pickupPoint} onChange={e => setPickupPoint(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Frais Mensuels (€)</label>
                  <input type="number" min="0" required value={fee} onChange={e => setFee(Number(e.target.value))} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium" />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lists */}
      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {routes.map(route => {
            const assignedCount = getAssignedStudentsCount(route.id);
            const utilization = Math.round((assignedCount / route.capacity) * 100);
            return (
              <div key={route.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Bus className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{route.routeName}</h3>
                        <p className="text-xs text-slate-500 font-medium">{route.vehicleType} • {route.vehicleRegistration}</p>
                      </div>
                    </div>
                    <button onClick={() => onDeleteRoute(route.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <span>{route.startPoint}</span>
                      <span className="text-slate-300">→</span>
                      <span>{route.endPoint}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">Capacité Utilisée</span>
                      <span className={utilization > 90 ? 'text-red-600' : 'text-emerald-600'}>{assignedCount} / {route.capacity} ({utilization}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${utilization > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min(utilization, 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <UserCircle2 className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">
                    Chauffeur: {drivers.find(d => d.routeId === route.id) ? `${drivers.find(d => d.routeId === route.id)?.firstName} ${drivers.find(d => d.routeId === route.id)?.lastName}` : 'Non assigné'}
                  </span>
                </div>
              </div>
            );
          })}
          {routes.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <Bus className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Aucune ligne de transport</h3>
              <p className="text-xs text-slate-500 mt-1">Créez votre première ligne pour commencer.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Chauffeur</th>
                <th className="p-4">Téléphone</th>
                <th className="p-4">Permis</th>
                <th className="p-4">Ligne Assignée</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {drivers.map((driver) => {
                const assignedRoute = routes.find(r => r.id === driver.routeId);
                return (
                  <tr key={driver.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 font-bold text-slate-800">
                      {driver.firstName} {driver.lastName}
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {driver.phone}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{driver.licenseNumber}</td>
                    <td className="p-4">
                      {assignedRoute ? (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">
                          {assignedRoute.routeName}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium italic">Aucune</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => onDeleteDriver(driver.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {drivers.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">Aucun chauffeur enregistré.</div>
          )}
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Élève</th>
                <th className="p-4">Ligne de Transport</th>
                <th className="p-4">Point de Ramassage</th>
                <th className="p-4">Frais Mensuels</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transportStudents.map((assignment) => {
                const student = allStudents.find(s => s.id === assignment.studentId);
                const route = routes.find(r => r.id === assignment.routeId);
                if (!student || !route) return null;
                return (
                  <tr key={assignment.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{student.firstName} {student.lastName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{student.rollNumber}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Bus className="h-4 w-4 text-blue-500" />
                        <span className="font-bold text-slate-700">{route.routeName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {assignment.pickupPoint}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-700">{assignment.fee} €</td>
                    <td className="p-4 text-right">
                      <button onClick={() => onRemoveStudent(assignment.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Retirer du transport">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {transportStudents.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">Aucun élève inscrit au transport scolaire.</div>
          )}
        </div>
      )}
    </div>
  );
}
