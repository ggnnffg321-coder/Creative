export interface Animal {
  id: string;
  level: number;
  name: string;
  icon: string; // Fallback
  image?: string; // 3D Image URL
  color: string;
  tier: 'common' | 'rare' | 'epic' | 'legendary' | 'mythical' | 'divine';
}

export interface Founder {
  name: string;
  role?: string;
}

export type Screen = 'login' | 'game' | 'founders' | 'wallet';

export interface GridSlot {
  id: number;
  animal: Animal | null;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number; // In Points
  egpAmount: number;
  method: string;
  status: 'pending' | 'completed' | 'rejected';
}

export interface DropItem {
  id: number;
  x: number; // Horizontal position %
}
