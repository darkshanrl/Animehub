
import React from 'react';
import { Search, PlusSquare, Bell, User as UserIcon, Zap, LogOut, ChevronDown } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onSearch: (term: string) => void;
  onOpenUpload: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onSearch, onOpenUpload, onOpenAuth, onLogout }) => {
  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Zap className="text-white w-6 h-6 fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter hidden sm:block">
            Toon<span className="text-indigo-500">Hub</span>
          </span>
        </div>

        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search anime mirrors on Google Drive..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:border-indigo-500 transition-all outline-none text-slate-100 placeholder-slate-600"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={user ? onOpenUpload : onOpenAuth}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/10"
          >
            <PlusSquare className="w-4 h-4" />
            <span className="hidden lg:inline">Share Anime</span>
          </button>
          
          <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
            {user ? (
              <div className="flex items-center gap-3 group relative">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-100">@{user.username}</p>
                  <p className="text-[10px] text-slate-500 font-bold">Uploader</p>
                </div>
                <div className="relative">
                  <img src={user.avatar} className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-indigo-500/30" alt="avatar" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950" />
                </div>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-4 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl">
                  <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors text-sm font-bold">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
              >
                <UserIcon className="w-4 h-4" /> Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
