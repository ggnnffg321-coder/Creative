import React from 'react';
import { ArrowRight, Mail, MessageCircle, Phone, Facebook, Instagram, Twitter, Linkedin, Star, Code } from 'lucide-react';
import { FOUNDERS_LIST } from '../constants';
import { Button } from './Button';

interface FoundersScreenProps {
  onBack: () => void;
}

export const FoundersScreen: React.FC<FoundersScreenProps> = ({ onBack }) => {
  // Filter Mohamed Galal out of the general list to show him specially
  const team = FOUNDERS_LIST.filter(f => f.name !== "محمد جلال");

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex flex-col font-[Cairo]">
      
      {/* Header */}
      <div className="bg-white p-4 pb-8 rounded-b-[2.5rem] shadow-xl relative shrink-0 z-20">
        <div className="flex items-center justify-between relative z-10">
          <div className="w-10"></div>
          <h2 className="text-2xl font-black text-gray-800 border-b-4 border-green-500 pb-1">
             فريق كريتيف
          </h2>
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition-all shadow-sm"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Content - Scrollable Area */}
      <div className="flex-1 overflow-y-auto pt-6 px-4 pb-24 scrollbar-hide space-y-8">
        
        {/* --- HERO SECTION: Mohamed Galal --- */}
        <div className="relative mt-4">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-lg opacity-20 animate-pulse"></div>
             <div className="bg-white rounded-3xl p-6 shadow-2xl border border-blue-100 relative overflow-hidden flex flex-col items-center text-center transform hover:scale-[1.02] transition-transform duration-500">
                
                {/* Badge */}
                <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
                    <Code size={12} />
                    <span>OFFICIAL DEV</span>
                </div>

                {/* Avatar */}
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-4 animate-glow">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" 
                            alt="Developer" 
                            className="w-20 h-20 object-cover"
                        />
                    </div>
                </div>

                {/* Name & Titles */}
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
                    محمد جلال
                </h1>
                <h2 className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg mb-2">
                    مبرمج التطبيق الرسمي
                </h2>
                <span className="text-xs text-gray-500 mb-6">Founder & Lead Engineer</span>

                {/* Social Grid */}
                <div className="grid grid-cols-4 gap-3 w-full max-w-xs">
                     {[
                         { icon: Facebook, color: "text-blue-600", bg: "bg-blue-50", label: "Facebook" },
                         { icon: Instagram, color: "text-pink-600", bg: "bg-pink-50", label: "Instagram" },
                         { icon: MessageCircle, color: "text-green-500", bg: "bg-green-50", label: "WhatsApp" },
                         { icon: Twitter, color: "text-black", bg: "bg-gray-100", label: "X" },
                         { icon: Phone, color: "text-indigo-600", bg: "bg-indigo-50", label: "Phone" },
                         { icon: Mail, color: "text-red-500", bg: "bg-red-50", label: "Email" },
                         { icon: Linkedin, color: "text-blue-700", bg: "bg-blue-50", label: "LinkedIn" },
                         { icon: Star, color: "text-yellow-500", bg: "bg-yellow-50", label: "TikTok" },
                     ].map((social, i) => (
                         <button key={i} className={`flex flex-col items-center justify-center p-2 rounded-xl ${social.bg} hover:scale-110 transition-transform`}>
                             <social.icon size={20} className={social.color} />
                         </button>
                     ))}
                </div>
             </div>
        </div>

        {/* --- TEAM LIST --- */}
        <div>
            <h3 className="text-lg font-bold text-gray-600 mb-4 px-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                فريق التأسيس
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {team.map((founder, index) => (
                <div 
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300"
                >
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-lg shadow-sm ${index % 2 === 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
                    {index % 2 === 0 ? '👤' : '🦁'}
                    </div>
                    <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">{founder.name}</span>
                    <span className="text-[10px] text-gray-400">عضو فريق التأسيس</span>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors">
                    <MessageCircle size={14} />
                    </button>
                </div>
                </div>
            ))}
            </div>
        </div>
        
        <div className="text-center text-gray-400 text-xs pb-4">
          © 2024 Creative Team. Developed by Mohamed Galal.
        </div>
      </div>
    </div>
  );
};