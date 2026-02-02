import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Gem, Coins, Zap, 
  Gift, ClipboardList, PlayCircle, TrendingUp,
  X, Info, Volume2, VolumeX, RefreshCw, Star, Crown, PackageOpen, Timer,
  CheckCircle, Calendar, ShieldCheck, BarChart3, UserPlus, ArrowUpCircle, Clock
} from 'lucide-react';
import { ANIMAL_LEVELS } from '../constants';
import { GridSlot } from '../types';
import { Button } from './Button';

interface GameScreenProps {
  onOpenFounders: () => void;
  onOpenWallet: () => void;
  onLogout: () => void;
}

const GRID_SIZE = 12; // 3 rows x 4 cols

// --- Sound Effects ---
const BGM_URL = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3";
const SFX_MERGE = "https://cdn.pixabay.com/audio/2022/03/24/audio_c8c8a73467.mp3";
const SFX_SPAWN = "https://cdn.pixabay.com/audio/2022/03/15/audio_13b53578d8.mp3";
const SFX_LEVELUP = "https://cdn.pixabay.com/audio/2022/03/24/audio_c8c8a73467.mp3"; // Placeholder

export const GameScreen: React.FC<GameScreenProps> = ({ onOpenFounders, onOpenWallet, onLogout }) => {
  const [grid, setGrid] = useState<GridSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  
  // Economy State
  const [coins, setCoins] = useState<number>(1250);
  const [gems, setGems] = useState<number>(50);
  const [pointsToday, setPointsToday] = useState<number>(150);
  
  // Level System
  const [level, setLevel] = useState<number>(5);
  const [exp, setExp] = useState<number>(450);
  const maxExp = level * 150;

  // Modals State
  const [activeModal, setActiveModal] = useState<'wheel' | 'ad' | 'invite' | 'daily' | 'boost' | 'level' | 'spawnLimit' | null>(null);
  
  // UI Effects
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mergeAnim, setMergeAnim] = useState<{show: boolean, x: number, y: number, text: string} | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [autoMergeActive, setAutoMergeActive] = useState(false);
  
  // Spawn Limit Logic
  const [spawnCount, setSpawnCount] = useState(0);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  // Wheel State
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Audio Refs
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const spawnSfxRef = useRef<HTMLAudioElement | null>(null);

  // --- Initialization ---
  useEffect(() => {
    const initialGrid: GridSlot[] = Array.from({ length: GRID_SIZE }, (_, i) => {
      const hasAnimal = Math.random() > 0.4;
      if (hasAnimal) {
        const randomLevel = Math.floor(Math.random() * 3) + 1;
        return {
          id: i,
          animal: { ...ANIMAL_LEVELS[randomLevel], id: `init-${i}` }
        };
      }
      return { id: i, animal: null };
    });
    setGrid(initialGrid);

    bgmRef.current = new Audio(BGM_URL);
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.2;
    sfxRef.current = new Audio(SFX_MERGE);
    spawnSfxRef.current = new Audio(SFX_SPAWN);

    const playMusic = () => bgmRef.current?.play().catch(() => {});
    document.addEventListener('click', playMusic, { once: true });

    return () => bgmRef.current?.pause();
  }, []);

  // Cooldown Timer Logic
  useEffect(() => {
    let interval: number;
    if (cooldownTimer > 0) {
      interval = window.setInterval(() => {
        setCooldownTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTimer]);

  // Remove Merge Anim after delay
  useEffect(() => {
    if (mergeAnim) {
      const timer = setTimeout(() => setMergeAnim(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [mergeAnim]);

  // --- Helpers ---
  const toggleMute = () => {
    if (bgmRef.current) {
      bgmRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const playSfx = (type: 'merge' | 'spawn' = 'merge') => {
    if (isMuted) return;
    const audio = type === 'spawn' ? spawnSfxRef.current : sfxRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Game Mechanics ---
  const handleSlotClick = (slotId: number) => {
    const slot = grid.find(s => s.id === slotId);
    
    if (selectedSlotId === null) {
      if (slot?.animal) {
        setSelectedSlotId(slotId);
        playSfx('spawn'); 
      }
      return;
    }

    if (selectedSlotId === slotId) {
      setSelectedSlotId(null);
      return;
    }

    const sourceSlot = grid.find(s => s.id === selectedSlotId);
    if (!sourceSlot?.animal) return;

    if (!slot?.animal) {
      // Move
      const newGrid = grid.map(s => {
        if (s.id === selectedSlotId) return { ...s, animal: null };
        if (s.id === slotId) return { ...s, animal: sourceSlot.animal };
        return s;
      });
      setGrid(newGrid);
      setSelectedSlotId(null);
    } else {
      // Merge Logic
      if (slot.animal.level === sourceSlot.animal.level && slot.animal.level < 60) {
        const nextLevel = slot.animal.level + 1;
        if (ANIMAL_LEVELS[nextLevel]) {
          const newAnimal = { ...ANIMAL_LEVELS[nextLevel], id: `merged-${Date.now()}` };
          const newGrid = grid.map(s => {
            if (s.id === selectedSlotId) return { ...s, animal: null };
            if (s.id === slotId) return { ...s, animal: newAnimal };
            return s;
          });
          setGrid(newGrid);
          setSelectedSlotId(null);
          
          // Rewards & Effects
          const earnedPoints = nextLevel * 10;
          setCoins(prev => prev + earnedPoints);
          setPointsToday(prev => prev + earnedPoints);
          setExp(prev => prev + (nextLevel * 5));
          
          // Trigger Animation
          setMergeAnim({
              show: true,
              x: 50, // Center relative
              y: 50,
              text: `+${earnedPoints}`
          });
          
          playSfx('merge');
        }
      } else {
        setSelectedSlotId(slotId);
      }
    }
  };

  const handleSpawnClick = () => {
      if (spawnCount >= 3) {
          setCooldownTimer(5);
          setActiveModal('spawnLimit');
          return;
      }
      spawnAnimal();
  };

  const spawnAnimal = () => {
    if (coins >= 100) {
      const emptySlot = grid.find(s => s.animal === null);
      if (emptySlot) {
        setCoins(prev => prev - 100);
        const newAnimal = { ...ANIMAL_LEVELS[1], id: `bought-${Date.now()}` };
        setGrid(prev => prev.map(s => s.id === emptySlot.id ? { ...s, animal: newAnimal } : s));
        setSpawnCount(prev => prev + 1);
        playSfx('spawn');
      } else {
        showToast("القفص ممتلئ!");
      }
    } else {
      showToast("لا يوجد رصيد كافي!");
    }
  };

  const handleWatchAdForSpawn = () => {
      setActiveModal(null);
      setSpawnCount(0);
      showToast("شكراً لمشاهدة الإعلان!");
      spawnAnimal();
  };

  const toggleAutoMerge = () => {
    setAutoMergeActive(!autoMergeActive);
    if (!autoMergeActive) {
      showToast("تم تفعيل الدمج الآلي (30 ثانية)");
      setTimeout(() => setAutoMergeActive(false), 30000);
    } else {
      showToast("تم إيقاف الدمج الآلي");
    }
  };

  // Wheel Spins 10 to 250
  const spinWheel = () => {
    if (isSpinning || coins < 50) return;
    setCoins(prev => prev - 50);
    setIsSpinning(true);
    const randomDeg = Math.floor(Math.random() * 360) + 1800;
    setWheelRotation(randomDeg);
    setTimeout(() => {
        setIsSpinning(false);
        const reward = Math.floor(Math.random() * (250 - 10 + 1)) + 10; // Random 10 to 250
        setCoins(prev => prev + reward);
        setPointsToday(prev => prev + reward);
        showToast(`مبروك! ربحت ${reward} نقطة`);
    }, 4000);
  };

  // --- Components ---

  const SideButton = ({ icon, color, label, notify, onClick, delay = 0 }: any) => (
    <div 
        onClick={onClick} 
        className="flex flex-col items-center gap-1.5 group cursor-pointer mb-6 relative animate-pop transition-transform active:scale-95"
        style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-14 h-14 bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-white shadow-lg flex items-center justify-center ${color.replace('bg-', 'text-')} relative hover:scale-105 transition-all overflow-hidden`}>
        <div className="relative z-10 drop-shadow-sm">
           {icon}
        </div>
        {notify && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white animate-pulse z-20">!</div>}
      </div>
      <span className="text-[10px] font-black text-gray-600 bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm tracking-wide border border-white/50 whitespace-nowrap">{label}</span>
    </div>
  );

  const GenericModal = ({ title, icon: Icon, children, onClose }: any) => (
    <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-[#f8fafc] w-full max-w-sm rounded-[2rem] border border-white flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 border-b border-white/20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl text-white">
                        <Icon size={24} />
                    </div>
                    <h2 className="text-xl font-black text-white">{title}</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <X size={20} />
                </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
                {children}
            </div>
        </div>
    </div>
  );

  return (
    <div className="w-full h-full min-h-screen flex flex-col relative overflow-hidden font-[Cairo] select-none text-gray-800">
      
      {/* --- 1. LIGHT FOREST BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-green-100 to-green-50"></div>
        {/* Sun Ray */}
        <div className="absolute top-0 right-0 w-full h-[60%] bg-gradient-to-b from-yellow-200/40 to-transparent blur-3xl"></div>
        {/* Floating Leaves */}
        {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="leaf opacity-60" style={{ 
                 left: `${Math.random() * 100}%`, 
                 animationDuration: `${8 + Math.random() * 5}s`,
                 animationDelay: `${Math.random() * 5}s`
             }}></div>
        ))}
      </div>

      {/* --- 2. HEADER --- */}
      <div className="relative z-40 pt-4 px-4 flex justify-between items-start">
        
        {/* Left: Level Indicator (NEW REQUEST) */}
        <div onClick={() => setActiveModal('level')} className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform">
             <div className="relative w-14 h-14">
                 <div className="absolute inset-0 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-glow">
                     <Star size={28} className="text-white fill-white" />
                 </div>
                 <div className="absolute -bottom-1 -right-1 bg-green-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                     {level}
                 </div>
             </div>
             <div className="hidden sm:block">
                 <div className="text-xs font-bold text-green-700">المستوى الحالي</div>
                 <div className="w-20 h-2 bg-white rounded-full mt-1 overflow-hidden border border-green-200">
                     <div className="h-full bg-green-500 rounded-full" style={{ width: `${(exp / maxExp) * 100}%` }}></div>
                 </div>
             </div>
        </div>

        {/* Right: Currencies & Settings */}
        <div className="flex gap-2">
            <div className="flex flex-col gap-2 items-end">
                <div onClick={onOpenWallet} className="bg-white/70 backdrop-blur-md rounded-2xl px-4 py-1.5 flex items-center gap-3 border border-white shadow-md cursor-pointer">
                    <span className="font-black text-lg text-yellow-700">{coins}</span>
                    <Coins size={18} className="text-yellow-500 drop-shadow-sm" />
                </div>
            </div>
            
            <button onClick={toggleMute} className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center border border-white shadow-sm">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
        </div>
      </div>

      {/* --- 3. MAIN GAME AREA --- */}
      <div className="flex-1 flex relative z-10 mt-4 pb-28 justify-between px-2">
        
        {/* Left Controls (Updated Sections) */}
        <div className="flex flex-col w-20 items-center z-20 pt-4 gap-1">
             <SideButton icon={<ArrowUpCircle size={22} />} color="text-purple-600" label="زود ربحك" onClick={() => setActiveModal('boost')} delay={100} />
             <SideButton icon={<UserPlus size={22} />} color="text-blue-500" label="دعوة صديق" onClick={() => setActiveModal('invite')} delay={200} />
             <SideButton icon={<BarChart3 size={22} />} color="text-orange-500" label="نقاط اليوم" onClick={() => setActiveModal('daily')} delay={300} />
        </div>

        {/* CENTER: THE HANGING CAGE (Light Oak Professional Design) */}
        <div className="flex-1 flex flex-col items-center justify-center relative max-w-[360px] mx-auto">
            
            {/* Hanging Ropes */}
            <div className="absolute top-0 w-full flex justify-center gap-24">
                <div className="w-1 h-24 bg-[#8D6E63]"></div>
                <div className="w-1 h-24 bg-[#8D6E63]"></div>
            </div>

            {/* Cage Structure */}
            <div className="relative w-full aspect-[3/4.2] animate-sway origin-top z-10 mt-8">
                
                {/* Title Plate - Creative */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#E6D5B8] px-8 py-2 rounded-xl border-4 border-[#8D6E63] shadow-xl flex flex-col items-center z-20 min-w-[200px]">
                     <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#5D4037] rounded-full border border-white"></div>
                     <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#5D4037] rounded-full border border-white"></div>
                     <span className="text-[10px] text-green-700 font-bold tracking-[0.2em] uppercase">Forest</span>
                     <h1 className="text-2xl font-black text-[#5D4037] drop-shadow-sm">CREATIVE</h1>
                </div>

                {/* Main Box - Light Oak Texture */}
                <div className="w-full h-full bg-[#F3E5AB] rounded-[2.5rem] border-[8px] border-[#8D6E63] shadow-[0_25px_60px_rgba(93,64,55,0.25)] relative overflow-hidden flex flex-col pt-12 pb-4 px-3">
                    
                    {/* Background Texture */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-green-500/10 to-transparent"></div>

                    {/* Shelves */}
                    {[0, 1, 2, 3].map((rowIndex) => (
                        <div key={rowIndex} className="flex-1 w-full relative flex items-center justify-between px-1 z-10 border-b-2 border-[#D7CCC8]/50 last:border-0">
                             {/* Shelf Floor */}
                             <div className="absolute bottom-2 w-full h-2 bg-[#D7CCC8] rounded-full opacity-60"></div>

                             {[0, 1, 2].map((colIndex) => {
                                const slotIndex = rowIndex * 3 + colIndex;
                                const slot = grid[slotIndex];
                                
                                return (
                                    <div 
                                        key={slotIndex}
                                        onClick={() => handleSlotClick(slotIndex)}
                                        className={`
                                            flex-1 h-full relative transition-all duration-200 cursor-pointer flex items-end justify-center pb-3
                                            ${selectedSlotId === slotIndex ? 'bg-white/40 rounded-2xl shadow-inner border border-white/50' : ''}
                                        `}
                                    >
                                        {slot?.animal && (
                                            <div className="relative w-full h-full flex flex-col items-center justify-end animate-pop group">
                                                {/* Pure Image */}
                                                <div className={`relative w-22 h-22 transition-transform duration-300 ${selectedSlotId === slotIndex ? 'scale-110 -translate-y-2' : 'group-hover:-translate-y-1'}`}>
                                                    <img 
                                                        src={slot.animal.image} 
                                                        alt={slot.animal.name}
                                                        className="w-full h-full object-contain filter drop-shadow-lg"
                                                        draggable={false}
                                                    />
                                                </div>
                                                
                                                {/* Level Badge */}
                                                <div className={`
                                                    absolute top-1 right-0 text-[10px] font-black text-white px-2 py-0.5 rounded-lg shadow-md border border-white/30
                                                    ${slot.animal.color}
                                                `}>
                                                    {slot.animal.level}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                             })}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Controls (Updated Sections) */}
        <div className="flex flex-col w-20 items-center z-20 pt-4 gap-1">
             <SideButton icon={<PlayCircle size={22} />} color="text-red-600" label="إعلانات" onClick={() => setActiveModal('ad')} delay={400} />
             <SideButton icon={<RefreshCw size={22} />} color="text-rose-500" label="عجلة الحظ" notify onClick={() => setActiveModal('wheel')} delay={500} />
             <SideButton icon={<Users size={22} />} color="text-violet-600" label="فريقنا" onClick={onOpenFounders} delay={600} />
        </div>
      </div>

      {/* --- 4. BOTTOM DOCK --- */}
      <div className="absolute bottom-0 w-full h-32 z-50 px-6 pb-8 flex items-end justify-center gap-8 pointer-events-none bg-gradient-to-t from-green-50 via-green-50/95 to-transparent">
          
          <div className="pointer-events-auto flex flex-col items-center gap-1 mb-2">
               <button onClick={() => setActiveModal('tasks')} className="w-16 h-16 bg-white rounded-3xl border-2 border-blue-200 shadow-xl flex flex-col items-center justify-center active:scale-95 transition-transform group">
                   <ClipboardList size={26} className="text-blue-500" />
                   <span className="text-[10px] font-bold text-blue-600 z-10 mt-1">المهام</span>
               </button>
          </div>

          <div className="pointer-events-auto relative -top-6">
             <div className="absolute inset-0 bg-green-400/30 blur-[40px] animate-pulse rounded-full"></div>
             <button 
                onClick={handleSpawnClick}
                className={`
                    w-28 h-28 bg-gradient-to-b from-green-500 to-green-700 rounded-[3rem] border-b-[8px] border-green-800 shadow-[0_20px_40px_rgba(22,163,74,0.3)] 
                    flex flex-col items-center justify-center relative transition-all active:scale-95 active:border-b-2 active:translate-y-2 group
                    ${coins < 100 ? 'filter grayscale opacity-80' : ''}
                `}
             >
                 <div className="absolute inset-3 rounded-[2.5rem] border-2 border-white/20 pointer-events-none"></div>
                 <div className="relative z-10 transform group-hover:-translate-y-1 transition-transform duration-300">
                    <PackageOpen size={42} className="text-white drop-shadow-lg" />
                 </div>
                 <div className="bg-black/20 px-3 py-1 rounded-full flex items-center gap-1 mt-1 border border-white/20 backdrop-blur-sm">
                    <span className="text-sm font-black text-yellow-300">100</span>
                 </div>
             </button>
          </div>

          <div className="pointer-events-auto flex flex-col items-center gap-1 mb-2">
               <button 
                 onClick={toggleAutoMerge}
                 className="w-16 h-16 bg-white rounded-3xl border-2 border-purple-200 shadow-xl flex flex-col items-center justify-center active:scale-95 transition-transform group overflow-hidden relative"
               >
                   <div className={`absolute inset-0 transition-opacity duration-300 ${autoMergeActive ? 'bg-purple-50' : 'opacity-0'}`}></div>
                   <RefreshCw size={24} className={`z-10 ${autoMergeActive ? 'text-purple-500 animate-spin-slow' : 'text-gray-400'}`} />
                   <span className={`text-[10px] font-bold z-10 mt-1 ${autoMergeActive ? 'text-purple-600' : 'text-gray-400'}`}>
                       {autoMergeActive ? 'AUTO' : 'OFF'}
                   </span>
               </button>
          </div>
      </div>

      {/* --- MERGE ANIMATION OVERLAY --- */}
      {mergeAnim && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none">
              <div className="relative animate-pop flex flex-col items-center">
                  <div className="absolute inset-0 bg-yellow-400 blur-[60px] opacity-40 rounded-full"></div>
                  <div className="text-6xl mb-2 animate-bounce">✨</div>
                  <div className="text-4xl font-black text-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] text-stroke">
                      دمج رائع!
                  </div>
                  <div className="text-5xl font-black text-white drop-shadow-lg mt-2 scale-110">
                      {mergeAnim.text}
                  </div>
              </div>
          </div>
      )}

      {/* --- MODALS --- */}

      {/* LEVEL MODAL (NEW) */}
      {activeModal === 'level' && (
          <GenericModal title={`المستوى ${level}`} icon={Star} onClose={() => setActiveModal(null)}>
              <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-yellow-300 shadow-lg">
                      <Crown size={48} className="text-yellow-600" />
                  </div>
                  <div>
                      <h3 className="text-2xl font-black text-gray-800">مستوى محترف</h3>
                      <p className="text-gray-500 text-sm">استمر في الدمج للوصول للمستوى التالي!</p>
                  </div>
                  
                  <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden border border-gray-200 relative mt-2">
                      <div className="h-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: `${(exp / maxExp) * 100}%` }}></div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm">
                          {exp} / {maxExp} XP
                      </span>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl w-full border border-blue-100">
                      <h4 className="font-bold text-blue-800 mb-2 text-sm">مكافآت المستوى القادم:</h4>
                      <div className="flex justify-around">
                          <div className="flex flex-col items-center">
                              <Coins size={20} className="text-yellow-500" />
                              <span className="text-xs font-bold text-gray-600">+500 كوين</span>
                          </div>
                          <div className="flex flex-col items-center">
                              <Zap size={20} className="text-orange-500" />
                              <span className="text-xs font-bold text-gray-600">سرعة 2x</span>
                          </div>
                      </div>
                  </div>
                  
                  <Button variant="primary" className="w-full" onClick={() => setActiveModal(null)}>إغلاق</Button>
              </div>
          </GenericModal>
      )}

      {/* BOOST MODAL (NEW) */}
      {activeModal === 'boost' && (
          <GenericModal title="زود ربحك" icon={ArrowUpCircle} onClose={() => setActiveModal(null)}>
              <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-4 rounded-2xl border border-orange-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <Zap className="text-orange-500" />
                          <div>
                              <div className="font-black text-gray-800">سرعة مضاعفة x2</div>
                              <div className="text-xs text-gray-500">لمدة 5 دقائق</div>
                          </div>
                      </div>
                      <Button variant="gold" className="px-4 py-2 text-xs">تفعيل (فيديو)</Button>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-4 rounded-2xl border border-purple-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <Coins className="text-purple-500" />
                          <div>
                              <div className="font-black text-gray-800">أرباح x5</div>
                              <div className="text-xs text-gray-500">لكل دمج جديد</div>
                          </div>
                      </div>
                      <Button variant="primary" className="px-4 py-2 text-xs">شراء بـ 200</Button>
                  </div>
              </div>
          </GenericModal>
      )}

      {/* INVITE MODAL (NEW) */}
      {activeModal === 'invite' && (
          <GenericModal title="دعوة الأصدقاء" icon={UserPlus} onClose={() => setActiveModal(null)}>
              <div className="text-center space-y-4">
                  <p className="text-gray-600 text-sm">شارك كود الدعوة مع أصدقائك واحصل على 500 نقطة لكل صديق يسجل!</p>
                  <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                      <span className="font-mono font-black text-xl tracking-widest text-gray-800">MERGE2024</span>
                      <button className="text-blue-600 text-sm font-bold hover:underline">نسخ</button>
                  </div>
                  <Button variant="secondary" className="w-full" icon={<UserPlus size={18} />}>مشاركة الرابط</Button>
              </div>
          </GenericModal>
      )}

      {/* DAILY STATS MODAL (NEW) */}
      {activeModal === 'daily' && (
          <GenericModal title="إحصائيات اليوم" icon={BarChart3} onClose={() => setActiveModal(null)}>
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col items-center">
                      <TrendingUp className="text-green-600 mb-2" />
                      <span className="text-2xl font-black text-green-800">{pointsToday}</span>
                      <span className="text-xs text-green-600">نقاط اليوم</span>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center">
                      <Clock className="text-blue-600 mb-2" />
                      <span className="text-2xl font-black text-blue-800">45د</span>
                      <span className="text-xs text-blue-600">وقت اللعب</span>
                  </div>
              </div>
              <div className="mt-4 bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
                  <span className="text-sm font-bold text-yellow-800">هدفك التالي: 2000 نقطة</span>
                  <div className="w-full bg-yellow-200 h-2 rounded-full mt-2">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '40%' }}></div>
                  </div>
              </div>
          </GenericModal>
      )}

      {/* TASKS MODAL */}
      {activeModal === 'tasks' && (
          <GenericModal title="قائمة المهام اليومية" icon={ClipboardList} onClose={() => setActiveModal(null)}>
              <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                  <ShieldCheck size={16} />
                              </div>
                              <div className="text-right">
                                  <div className="text-sm font-bold text-gray-800">ادمج 10 حيوانات</div>
                                  <div className="text-xs text-gray-500">المكافأة: 50 نقطة</div>
                              </div>
                          </div>
                          <button className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-600 shadow-sm">استلام</button>
                      </div>
                  ))}
                  <div className="text-center text-xs text-gray-400 mt-4">تتجدد المهام كل 24 ساعة</div>
              </div>
          </GenericModal>
      )}

      {/* WHEEL MODAL - Updated to 10-250 Points */}
      {activeModal === 'wheel' && (
        <div className="absolute inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
           <div className="bg-white w-full max-w-sm p-6 rounded-[2rem] border-4 border-yellow-400 flex flex-col items-center gap-6 shadow-2xl relative">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
              <h2 className="text-2xl font-black text-yellow-500 drop-shadow-sm">عجلة الحظ</h2>
              <div className="relative">
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-yellow-600 text-4xl drop-shadow-lg">▼</div>
                 <div 
                    className="w-64 h-64 rounded-full border-8 border-yellow-400 shadow-xl overflow-hidden relative"
                    style={{ transform: `rotate(${wheelRotation}deg)`, transition: isSpinning ? 'transform 4s cubic-bezier(0.1, 0, 0.2, 1)' : 'none' }}
                 >
                     {/* Colorful segments */}
                     <div className="w-full h-full bg-[conic-gradient(from_0deg,#FF8A80_0deg_45deg,#FFD180_45deg_90deg,#FFFF8D_90deg_135deg,#CCFF90_135deg_180deg,#A7FFEB_180deg_225deg,#80D8FF_225deg_270deg,#82B1FF_270deg_315deg,#B388FF_315deg_360deg)] relative"></div>
                     
                     {/* Numbers Overlay on Wheel (Visual Representation) */}
                     {[10, 50, 100, 250, 20, 80, 150, 200].map((num, i) => (
                         <div 
                            key={i} 
                            className="absolute top-1/2 left-1/2 text-xs font-black text-gray-700"
                            style={{ 
                                transform: `translate(-50%, -50%) rotate(${i * 45 + 22}deg) translate(0, -80px) rotate(-${i * 45 + 22}deg)`
                            }}
                         >
                             {num}
                         </div>
                     ))}
                 </div>
                 
                 {/* Center Cap */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-yellow-500 shadow-md flex items-center justify-center z-20">
                     <span className="text-yellow-600 font-bold text-xs">SPIN</span>
                 </div>
              </div>
              
              <div className="text-center text-sm font-bold text-gray-500">
                  اربح ما بين 10 إلى 250 نقطة!
              </div>

              <Button onClick={spinWheel} variant="gold" className="w-full shadow-yellow-200" disabled={isSpinning}>
                  {isSpinning ? 'جاري التدوير...' : 'تدوير (50 نقطة)'}
              </Button>
           </div>
        </div>
      )}

      {/* AD MODAL */}
      {activeModal === 'ad' && (
        <div className="absolute inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
           <div className="bg-white w-full max-w-sm p-6 rounded-[2rem] flex flex-col items-center gap-6 shadow-2xl relative">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-2">
                 <PlayCircle size={32} />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-black text-gray-800 mb-2">شاهد واربح</h2>
                <p className="text-gray-500 text-sm">شاهد فيديو قصير للحصول على 50 عملة ذهبية</p>
              </div>
              
              <Button onClick={() => {
                  setActiveModal(null);
                  setCoins(prev => prev + 50);
                  showToast("تم استلام المكافأة: 50 عملة");
              }} variant="danger" className="w-full shadow-red-200">
                  مشاهدة الفيديو
              </Button>
           </div>
        </div>
      )}

      {/* SPAWN LIMIT MODAL */}
      {activeModal === 'spawnLimit' && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
           <div className="bg-white w-full max-w-sm p-6 rounded-[2rem] flex flex-col items-center gap-6 shadow-2xl relative text-center">
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 animate-pulse">
                 <Timer size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">القفص مشغول!</h2>
                <p className="text-gray-500 text-sm">لقد قمت باستخراج 3 حيوانات متتالية.</p>
              </div>
              
              <div className="flex flex-col gap-3 w-full">
                <Button onClick={handleWatchAdForSpawn} variant="gold" className="w-full shadow-yellow-200 py-4" icon={<PlayCircle size={20} />}>
                    شاهد فيديو (استمرار فوري)
                </Button>
                
                <div className="relative">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full border-t border-gray-200"></div>
                   </div>
                   <div className="relative bg-white px-2 text-xs text-gray-400">أو انتظر</div>
                </div>

                <Button 
                    onClick={() => {
                        setActiveModal(null);
                        setSpawnCount(0);
                        spawnAnimal();
                    }}
                    variant="secondary" 
                    className="w-full shadow-blue-200 py-3"
                    disabled={cooldownTimer > 0}
                >
                    {cooldownTimer > 0 ? `انتظر ${cooldownTimer} ثواني...` : 'استمرار الآن'}
                </Button>
              </div>
           </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[110] bg-white text-gray-800 px-6 py-3 rounded-full shadow-xl animate-pop border border-gray-100 flex items-center gap-2 pointer-events-none">
          <Info size={16} className="text-blue-500" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

    </div>
  );
};