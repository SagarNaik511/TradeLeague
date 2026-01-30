import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
    const img = PlaceHolderImages.find(p => p.id === id);
    if (!img) {
        return {
            id: 'fallback',
            description: 'Fallback image',
            imageUrl: 'https://picsum.photos/seed/fallback/600/400',
            imageHint: 'abstract'
        };
    }
    return img;
}

export type UserProfile = {
  id: string;
  name: string;
  avatarUrl: string;
  avatarHint: string;
  winRate: number;
  winStreak: number;
  totalMatches: number;
  leagueName: string;
  leagueBadgeUrl: string;
  totalProfit: number;
};

export type Asset = {
  id: string;
  name: string;
  description: string;
  risk: 'Low' | 'Medium' | 'High';
  imageUrl: string;
  imageHint: string;
};

export type GameState = 'Lobby' | 'GameSetup' | 'InProgress' | 'Result' | 'Analysis';

export const mockUser: UserProfile = {
  id: 'user-1',
  name: 'Alex Pro',
  avatarUrl: getImage('user-avatar').imageUrl,
  avatarHint: getImage('user-avatar').imageHint,
  winRate: 72,
  winStreak: 4,
  totalMatches: 89,
  leagueName: 'Diamond League',
  leagueBadgeUrl: '/badges/diamond.svg',
  totalProfit: 12560.75,
};

export const mockOpponent: UserProfile = {
    id: 'user-2',
    name: 'Trader Jane',
    avatarUrl: getImage('opponent-avatar').imageUrl,
    avatarHint: getImage('opponent-avatar').imageHint,
    winRate: 68,
    winStreak: 2,
    totalMatches: 112,
    leagueName: 'Diamond League',
    leagueBadgeUrl: '/badges/diamond.svg',
    totalProfit: 9870.50,
};

export const mockAssets: Asset[] = [
  {
    id: 'gold',
    name: 'Gold',
    description: "A precious metal, often seen as a safe-haven asset.",
    risk: 'Low',
    imageUrl: getImage('gold').imageUrl,
    imageHint: getImage('gold').imageHint,
  },
  {
    id: 'silver',
    name: 'Silver',
    description: "A precious metal with industrial and investment demand.",
    risk: 'Low',
    imageUrl: getImage('silver').imageUrl,
    imageHint: getImage('silver').imageHint,
  },
  {
    id: 'crude-oil',
    name: 'Crude Oil',
    description: "A vital global energy commodity with volatile pricing.",
    risk: 'High',
    imageUrl: getImage('crude-oil').imageUrl,
    imageHint: getImage('crude-oil').imageHint,
  },
  {
    id: 'lithium',
    name: 'Lithium',
    description: "Key component in batteries for EVs and electronics.",
    risk: 'Medium',
    imageUrl: getImage('lithium').imageUrl,
    imageHint: getImage('lithium').imageHint,
  },
  {
    id: 'sagar-corporation',
    name: 'Sagar Corporation',
    description: "Diversified conglomerate in shipping and logistics.",
    risk: 'Medium',
    imageUrl: getImage('sagar-corporation').imageUrl,
    imageHint: getImage('sagar-corporation').imageHint,
  },
  {
    id: 'nithin-limited',
    name: 'Nithin Limited',
    description: "A leading fintech platform for retail investors.",
    risk: 'Medium',
    imageUrl: getImage('nithin-limited').imageUrl,
    imageHint: getImage('nithin-limited').imageHint,
  },
  {
    id: 'skyforge-tech',
    name: 'SkyForge Tech',
    description: "Cloud computing and enterprise software innovator.",
    risk: 'High',
    imageUrl: getImage('skyforge-tech').imageUrl,
    imageHint: getImage('skyforge-tech').imageHint,
  },
  {
    id: 'greenpulse-energy',
    name: 'GreenPulse Energy',
    description: "Renewable energy producer in wind and solar power.",
    risk: 'Low',
    imageUrl: getImage('greenpulse-energy').imageUrl,
    imageHint: getImage('greenpulse-energy').imageHint,
  },
  {
    id: 'quantumnest-ai',
    name: 'QuantumNest AI',
    description: "A pioneer in artificial general intelligence research.",
    risk: 'High',
    imageUrl: getImage('quantumnest-ai').imageUrl,
    imageHint: getImage('quantumnest-ai').imageHint,
  },
  {
    id: 'urbankart-retail',
    name: 'UrbanKart Retail',
    description: "A fast-growing e-commerce platform for urban consumers.",
    risk: 'Medium',
    imageUrl: getImage('urbankart-retail').imageUrl,
    imageHint: getImage('urbankart-retail').imageHint,
  },
  {
    id: 'mednova-pharma',
    name: 'MedNova Pharma',
    description: "Developing breakthrough treatments for rare diseases.",
    risk: 'High',
    imageUrl: getImage('mednova-pharma').imageUrl,
    imageHint: getImage('mednova-pharma').imageHint,
  },
  {
    id: 'agronext-india',
    name: 'AgroNext India',
    description: "Agri-tech firm improving crop yields and sustainability.",
    risk: 'Low',
    imageUrl: getImage('agronext-india').imageUrl,
    imageHint: getImage('agronext-india').imageHint,
  },
];
