
import React, { useState } from 'react';
import { X, Lock, User, Eye, EyeOff, LogIn, UserPlus, Github, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { User as UserType } from '../types';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSocialLogin = async (provider: 'github') => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setError("GitHub redirect failed. If you're in a preview window, try opening the app in a full browser tab.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError('Please fill all fields');
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          onAuthSuccess({
            id: data.user.id,
            username: data.user.email?.split('@')[0] || 'user',
            avatar: data.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`
          });
          onClose();
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Registration successful! Please check your email for a confirmation link.');
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        
        <div className="p-10 md:p-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-white mb-1">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">ToonHub Secure Gateway</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-400 text-sm animate-in fade-in zoom-in duration-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <button 
              onClick={() => handleSocialLogin('github')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700 disabled:opacity-50"
            >
              <Github className="w-4 h-4" /> 
              {loading ? 'Connecting...' : 'Continue with GitHub'}
            </button>
            <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-tighter">
              Note: Social login requires a full browser tab
            </p>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <span className="relative bg-slate-900 px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">OR USE EMAIL</span>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all font-bold text-slate-100 text-sm"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-indigo-500 transition-all font-bold text-slate-100 text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-indigo-400 transition-colors"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
            
            <div className="pt-4 border-t border-slate-800">
               <a 
                href="https://supabase.com/docs/guides/auth/social-login/auth-github" 
                target="_blank" 
                className="text-[9px] text-slate-600 hover:text-indigo-400 flex items-center justify-center gap-1 font-bold uppercase tracking-widest"
               >
                 Auth Configuration Help <ExternalLink className="w-2.5 h-2.5" />
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
