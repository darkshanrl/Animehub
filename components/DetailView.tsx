
import React, { useState } from 'react';
import { X, ExternalLink, Download, Share2, ShieldCheck, Heart, Send, MessageCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ContentEntry } from '../types';

interface DetailViewProps {
  entry: ContentEntry | null;
  onClose: () => void;
  onAddComment: (entryId: string, text: string) => void;
}

const DetailView: React.FC<DetailViewProps> = ({ entry, onClose, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [verifyingLink, setVerifyingLink] = useState<number | null>(null);

  if (!entry) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(entry.id, commentText);
    setCommentText('');
  };

  const simulateVerification = (idx: number) => {
    setVerifyingLink(idx);
    setTimeout(() => setVerifyingLink(null), 1500);
  };

  const getSafetyColor = (rating?: string) => {
    switch(rating) {
      case 'Safe': return 'text-green-400 bg-green-400/10';
      case 'Caution': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] overflow-hidden shadow-2xl relative flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header Action Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getSafetyColor(entry.safetyRating)}`}>
               {entry.safetyRating || 'Unknown'} Content
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
          {/* Main Content Area */}
          <div className="lg:w-2/3 overflow-y-auto p-6 lg:p-10 space-y-8 scrollbar-hide">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-48 flex-shrink-0">
                <img 
                  src={entry.thumbnailUrl} 
                  alt={entry.title}
                  className="w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl shadow-indigo-600/10"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-4xl font-black text-white mb-2 leading-tight">
                  {entry.title}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {entry.tags.map(tag => (
                    <span key={tag} className="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg text-xs font-medium border border-slate-700">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {entry.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-100">
                  <Download className="w-5 h-5 text-indigo-500" /> Download & Watch
                </h3>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Encrypted Links
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {entry.links.map((link, idx) => (
                  <div
                    key={idx}
                    className="relative group flex flex-col p-4 bg-slate-800/40 border border-slate-700 rounded-2xl hover:border-indigo-500 hover:bg-slate-800/60 transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-100">{link.label || `Server ${idx + 1}`}</span>
                      <button 
                        onClick={() => simulateVerification(idx)}
                        className={`text-[10px] px-2 py-0.5 rounded ${verifyingLink === idx ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {verifyingLink === idx ? 'Verifying...' : 'Check Health'}
                      </button>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between mt-2 text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      <span className="truncate text-sm opacity-60 mr-4">{link.url}</span>
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-800/20 border border-slate-800 rounded-2xl flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-slate-100">Safety Disclaimer</h4>
                <p className="text-sm text-slate-400">This content is uploaded by the community. While we verify links, always use a VPN and ad-blocker for the best experience. Report broken links to moderators.</p>
              </div>
            </div>
          </div>

          {/* Social Sidebar */}
          <div className="lg:w-1/3 bg-slate-900/50 border-l border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
               <h3 className="font-bold flex items-center gap-2">
                 <MessageCircle className="w-5 h-5 text-indigo-500" /> Community Hub
               </h3>
               <span className="text-xs text-slate-500">{entry.comments.length} Comments</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {entry.comments.map(comment => (
                <div key={comment.id} className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-indigo-400 tracking-wide uppercase">@{comment.user}</span>
                    <span className="text-[10px] text-slate-500">{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{comment.text}</p>
                </div>
              ))}
              {entry.comments.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 italic py-10">
                  <MessageCircle className="w-12 h-12 mb-2 opacity-10" />
                  <p>Be the first to say something!</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800">
              <form onSubmit={handleSendComment} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button 
                  type="submit"
                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
