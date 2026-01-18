
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AnimeCard from './components/AnimeCard';
import SubmissionModal from './components/SubmissionModal';
import DetailView from './components/DetailView';
import AuthModal from './components/AuthModal';
import { ContentEntry, Category, Comment, User } from './types';
import { supabase } from './lib/supabase';

const INITIAL_DATA: ContentEntry[] = [];

const App: React.FC = () => {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Initial Session Check
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'user',
            avatar: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
          });
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };

    initSession();

    // 2. Real-time Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          username: session.user.email?.split('@')[0] || 'user',
          avatar: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
        });
      } else {
        setUser(null);
      }
    });

    // 3. Load Entries
    const saved = localStorage.getItem('toonhub_v2_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      setEntries(INITIAL_DATA);
    }

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('toonhub_v2_entries', JSON.stringify(entries));
  }, [entries]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser);
    setIsAuthOpen(false);
  };

  const handleUpload = (newEntry: ContentEntry) => {
    setEntries([newEntry, ...entries]);
  };

  const handleAddComment = (entryId: string, text: string) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        const newComment: Comment = {
          id: Math.random().toString(36).substr(2, 9),
          user: user?.username || 'Guest',
          text,
          timestamp: Date.now()
        };
        return { ...entry, comments: [newComment, ...entry.comments] };
      }
      return entry;
    }));
  };

  const incrementViews = (entryId: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, views: entry.views + 1 } : entry
    ));
    setSelectedEntryId(entryId);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedEntry = entries.find(e => e.id === selectedEntryId) || null;
  const categories: Category[] = ['All', 'Anime', 'Cartoon', 'App', 'Game'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans']">
      <Navbar 
        user={user}
        onSearch={setSearchTerm} 
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Banner Section */}
        <section className="mb-20 relative overflow-hidden rounded-[3rem] bg-indigo-600 p-12 md:p-24 text-center shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-800 opacity-95" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-8 animate-pulse">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Mirror Registry Active</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 text-white tracking-tighter leading-tight">
              SHARE YOUR <br/> <span className="text-indigo-200">PROJECTS</span>
            </h1>
            <p className="text-xl text-indigo-100 font-medium mb-12 max-w-2xl mx-auto opacity-90 leading-relaxed">
              ToonHub is the community gateway for anime mirrors and custom app registries. 
              Secure, fast, and driven by contributors like you.
            </p>
            {!user ? (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="bg-white text-indigo-600 px-12 py-5 rounded-[2rem] font-black text-lg hover:scale-105 transition-all shadow-2xl active:scale-95"
              >
                Join the Hub
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <button onClick={() => setIsUploadOpen(true)} className="bg-white text-indigo-600 px-10 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl">
                   New Deployment
                 </button>
                 <div className="flex items-center gap-3 bg-slate-950/40 backdrop-blur-md px-8 py-4 rounded-[2.5rem] border border-white/10">
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="font-black text-xs text-white uppercase tracking-widest">Signed in as @{user.username}</span>
                 </div>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-900/40 p-2 rounded-[2.5rem] border border-slate-800">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4 mt-4 px-6">Categories</h2>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-6 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${
                      selectedCategory === cat 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                      : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-900/20 border border-slate-800 rounded-[2.5rem]">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Live Mirrors</span>
                  <span className="text-xs font-black text-white">{entries.length}</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[45%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-3">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredEntries.map(entry => (
                <AnimeCard 
                  key={entry.id} 
                  entry={entry} 
                  onSelect={(e) => incrementViews(e.id)}
                />
              ))}
              {filteredEntries.length === 0 && (
                <div className="col-span-full py-48 text-center bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-slate-800/50">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-500 mb-2">Registry Empty</h3>
                  <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Be the first to share a mirror in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SubmissionModal 
        user={user}
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSubmit={handleUpload}
      />
      <DetailView 
        entry={selectedEntry} 
        onClose={() => setSelectedEntryId(null)} 
        onAddComment={handleAddComment}
      />
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

// Re-importing zap for the empty state icon
import { Zap } from 'lucide-react';

export default App;
