'use client';

import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Search, Archive, CheckCircle, Trash2, Activity, MapPin, Globe, Mail, Fingerprint } from 'lucide-react';
import { ContactWithVisitor } from './page';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactsClient({ initialContacts }: { initialContacts: ContactWithVisitor[] }) {
  const [contacts, setContacts] = useState<ContactWithVisitor[]>(initialContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('unread');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(initialContacts[0]?.id || null);

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedContact = contacts.find(c => c.id === selectedId);

  const updateContact = async (id: string, updates: Partial<ContactWithVisitor>) => {
    setLoadingAction(id);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-[#E4002B] text-[#E4002B] border-[#E4002B]/30';
      case 'archived': return 'bg-amber-500 text-amber-500 border-amber-500/30';
      default: return 'bg-emerald-500 text-emerald-500 border-emerald-500/30';
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-6 pb-6">
      
      {/* Master View (Left Pane) */}
      <div className="w-full md:w-1/3 flex flex-col bg-background border border-surface rounded-sm overflow-hidden h-[800px] md:h-auto">
        <div className="p-4 border-b border-surface bg-surface/5 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
             <h2 className="text-xs font-mono tracking-widest uppercase text-foreground">Inbox</h2>
             <div className="flex gap-2">
               {['unread', 'read', 'archived', 'all'].map(s => (
                 <button 
                   key={s} 
                   onClick={() => setFilterStatus(s)}
                   className={`text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-1 rounded-sm border transition-colors ${filterStatus === s ? 'bg-foreground text-background border-foreground' : 'text-muted border-surface hover:border-surface-strong'}`}
                 >
                   {s}
                 </button>
               ))}
             </div>
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Query Contacts..." 
              className="w-full bg-surface/10 border border-surface rounded-sm pl-8 pr-4 py-2 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground transition-colors"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredContacts.length > 0 ? (
            <div className="divide-y divide-surface">
              {filteredContacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedId(contact.id)}
                  className={`w-full text-left p-4 transition-all relative group flex flex-col gap-2 ${selectedId === contact.id ? 'bg-surface/10' : 'hover:bg-surface/5'}`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${contact.status === 'unread' ? 'bg-[#E4002B]' : 'bg-transparent'}`}></div>
                  <div className="flex justify-between items-start w-full px-2">
                     <span className="font-semibold text-sm text-foreground truncate">{contact.name}</span>
                     <span className="text-[10px] font-mono text-muted whitespace-nowrap ml-2">
                       {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}
                     </span>
                  </div>
                  <div className="flex items-center gap-2 px-2 text-[9px] font-mono uppercase tracking-widest">
                     <span className={`px-1.5 py-0.5 border rounded-sm ${getStatusColor(contact.status).replace('bg-', 'bg-opacity-10 bg-')}`}>{contact.status}</span>
                     <span className="text-muted border border-surface px-1.5 py-0.5 rounded-sm">{contact.intent}</span>
                  </div>
                  <p className="text-xs text-muted truncate px-2 mt-1">{contact.message}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted">
              <Mail size={32} className="opacity-20 mb-4" />
              <p className="font-mono text-[10px] uppercase tracking-widest">Inbox Zero</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail View (Right Pane) */}
      <div className="w-full md:w-2/3 bg-background border border-surface rounded-sm flex flex-col h-[800px] md:h-auto overflow-hidden">
        {selectedContact ? (
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedContact.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-col h-full overflow-y-auto custom-scrollbar"
            >
              {/* Header Actions */}
              <div className="p-4 border-b border-surface flex justify-between items-center bg-surface/5 sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(selectedContact.status).replace('text-', 'bg-').split(' ')[0]}`}></span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">{selectedContact.status} Message</span>
                </div>
                <div className="flex gap-2">
                  {selectedContact.status === 'unread' && (
                    <button 
                      onClick={() => updateContact(selectedContact.id, { status: 'read' })}
                      disabled={loadingAction === selectedContact.id}
                      className="flex items-center gap-2 text-[9px] font-mono text-foreground hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 tracking-[0.1em] uppercase border border-surface px-3 py-1.5 rounded-sm transition-colors"
                    >
                      <CheckCircle size={10} /> Mark Read
                    </button>
                  )}
                  {selectedContact.status === 'archived' ? (
                    <button 
                      onClick={() => updateContact(selectedContact.id, { status: 'read' })}
                      disabled={loadingAction === selectedContact.id}
                      className="flex items-center gap-2 text-[9px] font-mono text-foreground hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 tracking-[0.1em] uppercase border border-surface px-3 py-1.5 rounded-sm transition-colors"
                    >
                      <Archive size={10} /> Unarchive
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateContact(selectedContact.id, { status: 'archived' })}
                      disabled={loadingAction === selectedContact.id}
                      className="flex items-center gap-2 text-[9px] font-mono text-foreground hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30 tracking-[0.1em] uppercase border border-surface px-3 py-1.5 rounded-sm transition-colors"
                    >
                      <Archive size={10} /> Archive
                    </button>
                  )}
                  <button 
                    onClick={async () => {
                      setLoadingAction(selectedContact.id);
                      try {
                        const res = await fetch(`/api/contact/${selectedContact.id}`, { method: 'DELETE' });
                        if (res.ok) {
                          setContacts(prev => prev.filter(c => c.id !== selectedContact.id));
                          setSelectedId(null);
                        } else {
                          alert('Failed to delete contact');
                        }
                      } catch {
                        alert('Error deleting contact');
                      } finally {
                        setLoadingAction(null);
                      }
                    }}
                    disabled={loadingAction === selectedContact.id}
                    className="flex items-center gap-2 text-[9px] font-mono text-foreground hover:bg-[#E4002B]/10 hover:text-[#E4002B] hover:border-[#E4002B]/30 tracking-[0.1em] uppercase border border-surface px-3 py-1.5 rounded-sm transition-colors"
                  >
                    <Trash2 size={10} /> Delete
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-8 space-y-8 flex-1">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-2">{selectedContact.name}</h1>
                  <a href={`mailto:${selectedContact.email}`} className="text-sm font-mono text-muted hover:text-foreground transition-colors flex items-center gap-2">
                    <Mail size={12} /> {selectedContact.email}
                  </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-surface">
                   <div className="space-y-1">
                     <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Intent</p>
                     <p className="font-mono text-xs text-foreground uppercase">{selectedContact.intent}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Received</p>
                     <p className="font-mono text-xs text-foreground">{format(new Date(selectedContact.created_at), 'MMM dd, HH:mm')}</p>
                   </div>
                   <div className="space-y-1 md:col-span-2">
                     <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Context</p>
                     <p className="font-mono text-xs text-foreground truncate">{selectedContact.context_info || 'None Provided'}</p>
                   </div>
                </div>

                <div className="prose prose-invert max-w-none text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              {/* Visitor Intelligence Card */}
              {selectedContact.visitor ? (
                <div className="bg-surface/5 border-t border-surface p-6 shrink-0">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-4 flex items-center gap-2">
                    <Fingerprint size={12} className="text-emerald-500" /> Visitor Context Correlated
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-muted flex items-center gap-1.5"><MapPin size={10}/> Location</p>
                      <p className="text-xs font-mono text-foreground truncate" title={`${selectedContact.visitor.city}, ${selectedContact.visitor.country}`}>
                        {selectedContact.visitor.city}, {selectedContact.visitor.country}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-muted flex items-center gap-1.5"><Globe size={10}/> Environment</p>
                      <p className="text-xs font-mono text-foreground truncate" title={`${selectedContact.visitor.browser} on ${selectedContact.visitor.os}`}>
                        {selectedContact.visitor.browser} on {selectedContact.visitor.os}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-muted flex items-center gap-1.5"><Activity size={10}/> Engagement</p>
                      <p className="text-xs font-mono text-foreground">
                        {selectedContact.visitor.total_visits} Total Visits
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-muted flex items-center gap-1.5"><Fingerprint size={10}/> IP Address</p>
                      <p className="text-xs font-mono text-foreground">
                        {/* @ts-expect-error public_ip exists on visitor */}
                        {selectedContact.visitor.public_ip || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-surface/50">
                    <p className="text-[8px] font-mono uppercase tracking-widest text-muted">
                      Visitor ID: {selectedContact.visitor.visitor_id}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-surface/5 border-t border-surface p-6 shrink-0 flex items-center justify-center">
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted flex items-center gap-2">
                    <Fingerprint size={12} /> No telemetry context correlated for this message.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted p-8 text-center bg-surface/5">
            <Mail size={48} className="opacity-10 mb-6" />
            <p className="font-mono text-xs uppercase tracking-widest text-foreground mb-2">Select a Message</p>
            <p className="text-[10px] font-mono uppercase tracking-widest">Select an item from the master list to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
