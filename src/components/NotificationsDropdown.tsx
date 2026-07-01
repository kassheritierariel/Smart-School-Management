import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, FileText, Receipt } from 'lucide-react';
import { Announcement } from '../types';

interface NotificationsDropdownProps {
  announcements: Announcement[];
  onNavigate: (view: string) => void;
}

export default function NotificationsDropdown({ announcements, onNavigate }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Mock unread count

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notification-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Mark as read when opened
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Exam':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'Schedule':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Financial':
        return <Receipt className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-orange-500" />;
    }
  };

  // Create some dynamic mock notifications based on requirements:
  // "pour informer en temps réel des nouvelles notes, des changements d’horaires et des paiements"
  const recentNotifications = [
    {
      id: 'n1',
      title: 'Nouvelles Notes Publiées',
      message: 'Les résultats de l\'examen de Mathématiques sont disponibles.',
      time: 'Il y a 10 min',
      category: 'Exam',
      link: 'exams'
    },
    {
      id: 'n2',
      title: 'Changement d\'Horaire',
      message: 'Le cours de Physique-Chimie de demain est décalé à 14h00.',
      time: 'Il y a 1 heure',
      category: 'Schedule',
      link: 'timetable'
    },
    {
      id: 'n3',
      title: 'Confirmation de Paiement',
      message: 'Le paiement des frais de scolarité (T1) a été bien reçu.',
      time: 'Il y a 2 heures',
      category: 'Financial',
      link: 'financials'
    }
  ];

  return (
    <div className="relative notification-container">
      <button 
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {recentNotifications.length} nouvelles
            </span>
          </div>
          
          <div className="max-h-[320px] overflow-y-auto">
            {recentNotifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => {
                  setIsOpen(false);
                  onNavigate(notif.link);
                }}
                className="flex gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="mt-1 shrink-0 bg-white shadow-sm p-1.5 rounded-lg border border-slate-100">
                  {getIcon(notif.category)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{notif.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 font-medium mt-2 block">
                    {notif.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
            <button 
              onClick={() => {
                setIsOpen(false);
                onNavigate('notices');
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Voir toutes les annonces
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
