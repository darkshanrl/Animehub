
import React from 'react';
import { Layers, Clock, Star, Eye, Shield } from 'lucide-react';
import { ContentEntry } from '../types';

interface AnimeCardProps {
  entry: ContentEntry;
  onSelect: (entry: ContentEntry) => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ entry, onSelect }) => {
  const safetyColors = {
    Safe: 'text-green-400 bg-green-400/20',
    Caution: 'text-yellow-400 bg-yellow-400/20',
    Unknown: 'text-slate-400 bg-slate-400/20'
  };

  return (
    <div 
      onClick={() => onSelect(entry)}
      className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 transform hover:-translate-y-2"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img 
          src={entry.thumbnailUrl} 
          alt={entry.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-indigo-600 text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-widest backdrop-blur-md">
            {entry.category}
          </span>
          {entry.safetyRating && (
            <span className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md ${safetyColors[entry.safetyRating]}`}>
              <Shield className="w-2.5 h-2.5" />
              {entry.safetyRating}
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 shadow-xl">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-[10px] font-bold text-slate-100">{(entry.rating || 4.5).toFixed(1)}</span>
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 space-y-2 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
           <div className="flex items-center gap-3 text-[10px] font-bold text-slate-300">
              <span className="flex items-center gap-1 bg-slate-950/40 px-2 py-1 rounded-full backdrop-blur-md">
                <Eye className="w-3 h-3" /> {entry.views}
              </span>
              <span className="flex items-center gap-1 bg-slate-950/40 px-2 py-1 rounded-full backdrop-blur-md">
                <Clock className="w-3 h-3" /> {new Date(entry.createdAt).toLocaleDateString()}
              </span>
           </div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-b from-slate-900 to-slate-950">
        <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 text-lg tracking-tight">
          {entry.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 h-8 leading-relaxed">
          {entry.description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex gap-1.5 overflow-hidden">
            {entry.tags.slice(0, 1).map(tag => (
              <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700/50">
                {tag}
              </span>
            ))}
            {entry.tags.length > 1 && <span className="text-[10px] text-slate-600 font-bold">+{entry.tags.length - 1}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
