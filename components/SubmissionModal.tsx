
import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Loader2, Link2, FileText, Tags, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { ContentEntry, ShortLink, User } from '../types';
import { generateContentInfo } from '../services/geminiService';

interface SubmissionModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: ContentEntry) => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ user, isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Anime' | 'Cartoon' | 'App' | 'Game'>('Anime');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [links, setLinks] = useState<ShortLink[]>([{ label: 'GDrive Direct', url: '' }]);
  const [tagsString, setTagsString] = useState('');
  const [safetyRating, setSafetyRating] = useState<'Safe' | 'Caution' | 'Unknown'>('Unknown');

  const validateDriveLink = (url: string) => url.includes('drive.google.com');

  const handleAiAutofill = async () => {
    if (!title) return alert('Enter a title first!');
    setLoading(true);
    try {
      const data = await generateContentInfo(title, category);
      setDescription(data.description);
      setTagsString(data.tags.join(', '));
      setThumbnail(`https://images.unsplash.com/photo-1578632738981-4330ce5b5022?auto=format&fit=crop&q=80&w=400&q=${data.suggestedThumbnail}`);
      setSafetyRating(data.safetyRating as any);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addLinkField = () => setLinks([...links, { label: '', url: '' }]);
  const removeLinkField = (index: number) => setLinks(links.filter((_, i) => i !== index));
  const updateLink = (index: number, field: keyof ShortLink, value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Session expired. Please login again.');
    
    const invalidLinks = links.filter(l => !validateDriveLink(l.url));
    if (invalidLinks.length > 0) {
      return alert('Only Google Drive links are allowed!');
    }

    const newEntry: ContentEntry = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      category,
      description,
      thumbnailUrl: thumbnail || 'https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&q=80&w=400',
      tags: tagsString.split(',').map(t => t.trim()).filter(t => t),
      links: links.filter(l => l.url),
      authorId: user.id,
      authorName: user.username,
      createdAt: Date.now(),
      rating: 4.5,
      views: 0,
      comments: [],
      safetyRating
    };
    onSubmit(newEntry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-4xl shadow-2xl relative animate-in fade-in slide-in-from-bottom-8 duration-500 overflow-hidden">
        
        <div className="p-10 md:p-14">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 text-indigo-500 mb-2">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verified Upload Mode</span>
              </div>
              <h2 className="text-4xl font-black text-white">Share GDrive Mirror</h2>
            </div>
            <button onClick={onClose} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Anime Title</label>
                  <div className="relative group">
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-800 border-2 border-slate-700/50 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 transition-all font-bold text-slate-100"
                      placeholder="e.g. Demon Slayer: Kimetsu no Yaiba"
                    />
                    <button
                      type="button"
                      onClick={handleAiAutofill}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all flex items-center gap-2 font-black text-[10px] tracking-widest disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AUTOFILL
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-slate-800 border-2 border-slate-700/50 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 font-bold text-slate-100 appearance-none"
                    >
                      <option>Anime</option>
                      <option>Cartoon</option>
                      <option>App</option>
                      <option>Game</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Uploader</label>
                    <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 font-bold text-indigo-400 text-sm">
                      @{user?.username}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cover Image URL</label>
                  <input
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700/50 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 font-medium text-slate-400 text-xs"
                    placeholder="Unsplash or Image URL"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mirrors (Drive Only)</label>
                  <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scroll">
                    {links.map((link, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            placeholder="Mirror Name"
                            className="w-1/3 bg-slate-800 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-xs font-black uppercase text-slate-300 outline-none"
                            value={link.label}
                            onChange={(e) => updateLink(idx, 'label', e.target.value)}
                          />
                          <div className="relative flex-1">
                            <input
                              placeholder="Google Drive URL"
                              className={`w-full bg-slate-800 border-2 rounded-xl px-4 py-3 text-xs font-medium outline-none transition-all ${
                                link.url ? (validateDriveLink(link.url) ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400') : 'border-slate-700/50 text-slate-400'
                              }`}
                              value={link.url}
                              onChange={(e) => updateLink(idx, 'url', e.target.value)}
                            />
                            {link.url && !validateDriveLink(link.url) && (
                              <div className="absolute top-full left-0 mt-1 flex items-center gap-1 text-red-500 text-[9px] font-bold">
                                <AlertCircle className="w-3 h-3" /> Drive link required
                              </div>
                            )}
                          </div>
                          {links.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLinkField(idx)}
                              className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addLinkField}
                    className="w-full py-3 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-indigo-400 hover:bg-slate-700 transition-all uppercase tracking-widest"
                  >
                    + Add Mirror Link
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-800 border-2 border-slate-700/50 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 font-medium text-slate-300 resize-none text-sm leading-relaxed"
                    placeholder="Generated description will appear here..."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-6 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-5 bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-750 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30"
              >
                Confirm Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
