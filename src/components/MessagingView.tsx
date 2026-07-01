import React, { useState, useMemo } from 'react';
import { 
  MessageCircle, 
  Send, 
  Search, 
  User, 
  Clock, 
  Check, 
  CheckCheck,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Message, Student, Teacher, StaffMember } from '../types';

interface MessagingViewProps {
  messages: Message[];
  user: { role: string; name: string; email: string };
  students: Student[];
  teachers: Teacher[];
  staff: StaffMember[];
  onSendMessage: (msg: Omit<Message, 'id' | 'isRead' | 'date'>) => void;
  onMarkMessageRead: (id: string) => void;
}

export default function MessagingView({
  messages,
  user,
  students,
  teachers,
  staff,
  onSendMessage,
  onMarkMessageRead
}: MessagingViewProps) {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newMessage, setNewMessage] = useState({
    receiverId: '',
    subject: '',
    content: ''
  });

  const currentUserIdentifier = user.email; // Simplified for demo. Usually ID.

  const myMessages = useMemo(() => {
    return messages.filter(m => m.receiverId === currentUserIdentifier || m.senderId === currentUserIdentifier);
  }, [messages, currentUserIdentifier]);

  // Derive conversations
  const conversations = useMemo(() => {
    const convs: Record<string, { contactId: string, contactName: string, contactRole: string, lastMessage: Message, unreadCount: number }> = {};
    
    myMessages.forEach(m => {
      const isOutgoing = m.senderId === currentUserIdentifier;
      const contactId = isOutgoing ? m.receiverId : m.senderId;
      const contactName = isOutgoing ? m.receiverName : m.senderName;
      const contactRole = isOutgoing ? m.receiverRole : m.senderRole;
      
      if (!convs[contactId] || new Date(m.date) > new Date(convs[contactId].lastMessage.date)) {
        convs[contactId] = {
          contactId,
          contactName,
          contactRole,
          lastMessage: m,
          unreadCount: convs[contactId]?.unreadCount || 0
        };
      }
      if (!isOutgoing && !m.isRead) {
        convs[contactId].unreadCount = (convs[contactId].unreadCount || 0) + 1;
      }
    });

    return Object.values(convs).sort((a, b) => new Date(b.lastMessage.date).getTime() - new Date(a.lastMessage.date).getTime());
  }, [myMessages, currentUserIdentifier]);

  // All possible contacts
  const contacts = useMemo(() => {
    const list: { id: string, name: string, role: string, email: string }[] = [];
    if (user.role === 'admin' || user.role === 'teacher' || user.role === 'super_admin') {
      students.forEach(s => list.push({ id: s.email, name: `${s.firstName} ${s.lastName} (Élève)`, role: 'student', email: s.email }));
      students.forEach(s => list.push({ id: `parent_${s.id}`, name: `${s.parentName} (Parent de ${s.firstName})`, role: 'parent', email: `parent_${s.id}` })); // Mock parent email
    }
    if (user.role === 'admin' || user.role === 'student' || user.role === 'super_admin') {
      teachers.forEach(t => list.push({ id: t.email, name: `${t.firstName} ${t.lastName} (Professeur)`, role: 'teacher', email: t.email }));
    }
    return list.filter(c => c.id !== currentUserIdentifier);
  }, [students, teachers, user]);

  const activeConversationMessages = useMemo(() => {
    if (!selectedContact) return [];
    return myMessages
      .filter(m => (m.senderId === selectedContact && m.receiverId === currentUserIdentifier) || 
                   (m.receiverId === selectedContact && m.senderId === currentUserIdentifier))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [myMessages, selectedContact, currentUserIdentifier]);

  // Mark read when opening conversation
  React.useEffect(() => {
    if (selectedContact) {
      activeConversationMessages.forEach(m => {
        if (m.receiverId === currentUserIdentifier && !m.isRead) {
          onMarkMessageRead(m.id);
        }
      });
    }
  }, [selectedContact, activeConversationMessages, currentUserIdentifier, onMarkMessageRead]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.receiverId || !newMessage.content.trim()) return;

    const contact = contacts.find(c => c.id === newMessage.receiverId) || 
                   { name: selectedContact || 'Inconnu', role: 'user' };

    onSendMessage({
      senderId: currentUserIdentifier,
      senderName: user.name,
      senderRole: user.role,
      receiverId: newMessage.receiverId,
      receiverName: contact.name,
      receiverRole: contact.role,
      subject: newMessage.subject || 'Nouveau message',
      content: newMessage.content
    });

    setNewMessage({ receiverId: '', subject: '', content: '' });
    if (showCompose) {
      setShowCompose(false);
      setSelectedContact(newMessage.receiverId);
    }
  };

  const handleSendQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !newMessage.content.trim()) return;
    
    // Find contact info from existing conversations if not in contacts list
    let cName = 'Utilisateur';
    let cRole = 'user';
    const c = contacts.find(c => c.id === selectedContact);
    if (c) {
      cName = c.name;
      cRole = c.role;
    } else {
      const conv = conversations.find(c => c.contactId === selectedContact);
      if (conv) {
        cName = conv.contactName;
        cRole = conv.contactRole;
      }
    }

    onSendMessage({
      senderId: currentUserIdentifier,
      senderName: user.name,
      senderRole: user.role,
      receiverId: selectedContact,
      receiverName: cName,
      receiverRole: cRole,
      subject: 'Re:',
      content: newMessage.content
    });
    setNewMessage({ ...newMessage, content: '' });
  };

  const filteredConversations = conversations.filter(c => 
    c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messagerie Interne</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Communiquez avec les enseignants, élèves et parents.</p>
        </div>
        <button
          onClick={() => {
            setShowCompose(true);
            setSelectedContact(null);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouveau Message
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs flex overflow-hidden">
        
        {/* Sidebar / Inbox */}
        <div className={`w-full md:w-1/3 border-r border-slate-200 flex flex-col ${selectedContact || showCompose ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 font-medium transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium">Aucune conversation</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredConversations.map(conv => (
                  <button
                    key={conv.contactId}
                    onClick={() => {
                      setSelectedContact(conv.contactId);
                      setShowCompose(false);
                    }}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selectedContact === conv.contactId ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold truncate pr-2 ${conv.unreadCount > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                        {conv.contactName}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                        {new Date(conv.lastMessage.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-blue-600' : 'text-slate-500'}`}>
                        {conv.lastMessage.senderId === currentUserIdentifier ? 'Vous: ' : ''}{conv.lastMessage.subject}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col bg-slate-50/50 ${!selectedContact && !showCompose ? 'hidden md:flex' : 'flex'}`}>
          {showCompose ? (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3">
                <button onClick={() => setShowCompose(false)} className="md:hidden p-2 -ml-2 text-slate-500">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="font-bold text-slate-800">Nouveau Message</h2>
              </div>
              <form onSubmit={handleSend} className="p-6 space-y-4 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Destinataire</label>
                  <select
                    required
                    value={newMessage.receiverId}
                    onChange={e => setNewMessage({...newMessage, receiverId: e.target.value})}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 font-medium"
                  >
                    <option value="">Sélectionner un destinataire...</option>
                    {contacts.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Sujet</label>
                  <input
                    type="text"
                    required
                    value={newMessage.subject}
                    onChange={e => setNewMessage({...newMessage, subject: e.target.value})}
                    placeholder="Sujet de votre message"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Message</label>
                  <textarea
                    required
                    rows={8}
                    value={newMessage.content}
                    onChange={e => setNewMessage({...newMessage, content: e.target.value})}
                    placeholder="Écrivez votre message ici..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 font-medium resize-none"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">
                    <Send className="w-4 h-4" />
                    Envoyer le message
                  </button>
                </div>
              </form>
            </div>
          ) : selectedContact ? (
            <div className="flex-1 flex flex-col h-full">
              <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3">
                <button onClick={() => setSelectedContact(null)} className="md:hidden p-2 -ml-2 text-slate-500">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                  {conversations.find(c => c.contactId === selectedContact)?.contactName.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 leading-tight">
                    {conversations.find(c => c.contactId === selectedContact)?.contactName}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {conversations.find(c => c.contactId === selectedContact)?.contactRole}
                  </p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {activeConversationMessages.map(msg => {
                  const isMine = msg.senderId === currentUserIdentifier;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-4 ${isMine ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                        {msg.subject && msg.subject !== 'Re:' && !isMine && (
                          <div className="font-bold text-xs mb-1 opacity-80">{msg.subject}</div>
                        )}
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-[10px] font-medium text-slate-400">
                          {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        {isMine && (
                          msg.isRead ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSendQuick} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newMessage.content}
                    onChange={e => setNewMessage({...newMessage, content: e.target.value})}
                    placeholder="Écrivez votre réponse..."
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 font-medium transition-colors"
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-12 rounded-xl flex items-center justify-center transition-colors">
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4 shadow-xs">
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Vos Messages</h3>
              <p className="text-sm font-medium max-w-sm">Sélectionnez une conversation sur la gauche ou créez un nouveau message pour commencer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
