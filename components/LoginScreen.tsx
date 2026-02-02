import React, { useState, useEffect } from 'react';
import { User, Lock, Phone, Mail, Play, Leaf } from 'lucide-react';
import { Button } from './Button';

interface LoginScreenProps {
  onLogin: () => void;
}

const SLOGANS = [
  "العب واكسب 💸",
  "سلّي وقتك 🎮",
  "تحدى الملل 🦁",
  "اربح كاش حقيقي 💰"
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'manual' | 'phone'>('manual');
  const [sloganIndex, setSloganIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Rotating Slogans Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setSloganIndex((prev) => (prev + 1) % SLOGANS.length);
        setFade(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-green-100 to-green-50">
      
      {/* Light Forest Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sun */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-[60px] opacity-40 animate-pulse"></div>
        
        {/* Abstract Trees */}
        <div className="absolute bottom-0 w-full h-1/2 bg-[url('https://raw.githubusercontent.com/gist/zadvski/3a65230303d865529432/raw/forest_silhouette.png')] bg-cover opacity-10 mix-blend-multiply text-green-800"></div>
        
        {/* Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="absolute text-green-500/40 animate-float" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            transform: `scale(${Math.random() * 0.5 + 0.5})`
          }}>
            <Leaf size={24} />
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-11/12 max-w-md bg-white/70 backdrop-blur-xl rounded-[3rem] p-8 flex flex-col gap-6 items-center border border-white shadow-[0_20px_60px_rgba(34,197,94,0.15)]">
        
        {/* Animated Title & Slogan */}
        <div className="flex flex-col items-center -mt-12 mb-4 w-full">
          <div className="relative mb-2 text-center">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 drop-shadow-sm tracking-wider font-[Cairo]">
              CREATIVE
            </h1>
            <h2 className="text-3xl font-bold text-gray-700 text-center mt-[-5px] tracking-[0.5em] opacity-80">
              كريتيف
            </h2>
          </div>
          
          {/* Animated Slogan Text */}
          <div className="h-10 flex items-center justify-center w-full bg-green-50 rounded-full border border-green-100 mt-2 shadow-inner">
            <span className={`text-green-700 font-bold text-lg transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              {SLOGANS[sloganIndex]}
            </span>
          </div>
        </div>

        {/* Login Method Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl w-full shadow-inner">
            <button 
              onClick={() => setMethod('manual')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${method === 'manual' ? 'bg-white text-green-700 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              حساب يدوي
            </button>
            <button 
              onClick={() => setMethod('phone')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${method === 'phone' ? 'bg-white text-green-700 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              رقم الهاتف
            </button>
        </div>

        {/* Inputs Area */}
        <div className="w-full space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
          {method === 'manual' ? (
            <>
              <div className="relative group">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"><User size={20} /></div>
                <input type="text" placeholder="اسم المستخدم أو البريد" className="w-full bg-white border-2 border-green-50 rounded-2xl py-4 pr-12 pl-4 text-right text-gray-700 placeholder-gray-400 focus:border-green-400 focus:bg-white outline-none transition-all shadow-sm" />
              </div>
              <div className="relative group">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"><Lock size={20} /></div>
                <input type="password" placeholder="كلمة المرور" className="w-full bg-white border-2 border-green-50 rounded-2xl py-4 pr-12 pl-4 text-right text-gray-700 placeholder-gray-400 focus:border-green-400 focus:bg-white outline-none transition-all shadow-sm" />
              </div>
            </>
          ) : (
             <div className="relative group">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"><Phone size={20} /></div>
                <input type="tel" placeholder="رقم الموبايل" className="w-full bg-white border-2 border-green-50 rounded-2xl py-4 pr-12 pl-4 text-right text-gray-700 placeholder-gray-400 focus:border-green-400 focus:bg-white outline-none transition-all shadow-sm" />
              </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <Button onClick={onLogin} variant="gold" className="w-full py-4 text-xl shadow-yellow-200">
             دخـول الغـابـة
          </Button>
          
          <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-400 text-xs">أو سجل عبر</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <button onClick={onLogin} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-sm active:scale-95">
             <Mail size={20} className="text-red-500" />
             <span>Google تسجيل بحساب</span>
          </button>
        </div>

      </div>
    </div>
  );
};