import { Animal, Founder } from './types';

export const FOUNDERS_LIST: Founder[] = [
  // Mohamed Galal is handled specially in the component, but listed here for fallback
  { name: "محمد جلال", role: "admin" },
  { name: "عصام سامي حسنين" },
  { name: "بسمة حسن حمدي" },
  { name: "غفران محمود إبراهيم" },
  { name: "أنهار عبد المقصود أحمد" },
  { name: "هالة عبد الوهاب صالح" },
  { name: "أسماء طارق محمد" },
  { name: "سارة سالم حسين" },
  { name: "مريهان خميس جمعة" },
  { name: "ياسر محمد خليفة" },
  { name: "رضوي عبد الغني أحمد" },
  { name: "زينب محمد نجيب" },
  { name: "شيماء سعد الحسيني" },
  { name: "شرين صابر ازمل" },
  { name: "نور الهدى حسين صديق" },
];

export const WITHDRAWAL_METHODS = [
  { id: 'voda', name: 'فودافون كاش', icon: '📱', color: 'bg-red-600', type: 'wallet' },
  { id: 'etisalat', name: 'اتصالات كاش', icon: '🟢', color: 'bg-green-500', type: 'wallet' },
  { id: 'orange', name: 'أورنج كاش', icon: '🟠', color: 'bg-orange-500', type: 'wallet' },
  { id: 'instapay', name: 'InstaPay', icon: '🏦', color: 'bg-purple-600', type: 'instapay' },
  { id: 'nbe', name: 'البنك الأهلي', icon: '🏦', color: 'bg-green-700', type: 'bank' },
  { id: 'misr', name: 'بنك مصر', icon: '🏦', color: 'bg-red-800', type: 'bank' },
  { id: 'qnb', name: 'QNB', icon: '🏦', color: 'bg-blue-800', type: 'bank' },
];

// Specific Wild Forest Animals (High Quality 3D Render Style)
const ANIMAL_IMAGES = [
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Rabbit.png", // 1. Rabbit
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Deer.png",   // 2. Deer
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Tiger.png",  // 3. Tiger
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Leopard.png",// 4. Leopard/Cheetah
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Lion.png",   // 5. Lion
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Elephant.png",// 6. Elephant
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Crocodile.png",// 7. Crocodile
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Ox.png",      // 8. Buffalo
];

const ANIMAL_NAMES = [
  "أرنب بري", "غزالة", "نمر", "فهد", "أسد", "فيل", "تمساح", "جاموس"
];

const generateLevels = () => {
  const levels: Record<number, Omit<Animal, 'id'>> = {};
  const animalsIcons = ["🐇", "🦌", "🐅", "🐆", "🦁", "🐘", "🐊", "🐃"];
  
  const tiers = ['common', 'rare', 'epic', 'legendary', 'mythical', 'divine'] as const;
  
  // Professional Nature Gradients
  const colors = [
    "bg-gradient-to-t from-[#43a047] to-[#81c784]", // Green
    "bg-gradient-to-t from-[#fb8c00] to-[#ffb74d]", // Orange
    "bg-gradient-to-t from-[#e53935] to-[#e57373]", // Red
    "bg-gradient-to-t from-[#8e24aa] to-[#ba68c8]", // Purple
    "bg-gradient-to-t from-[#1e88e5] to-[#64b5f6]", // Blue
    "bg-gradient-to-t from-[#fdd835] to-[#fff176]"  // Gold
  ];

  for (let i = 1; i <= 60; i++) {
    const tierIndex = Math.floor((i - 1) / 10);
    const animalIndex = (i - 1) % ANIMAL_IMAGES.length;
    
    levels[i] = {
      level: i,
      name: `${ANIMAL_NAMES[animalIndex]} Lv.${i}`,
      icon: animalsIcons[animalIndex],
      image: ANIMAL_IMAGES[animalIndex],
      color: colors[Math.min(tierIndex, colors.length - 1)],
      tier: tiers[Math.min(tierIndex, tiers.length - 1)]
    };
  }
  return levels;
};

export const ANIMAL_LEVELS = generateLevels();