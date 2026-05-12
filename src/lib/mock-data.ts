export type PlantStatus = "thriving" | "growing" | "struggling" | "dead" | "pending";

export interface Plant {
  id: string;
  species: string;
  scientificName: string;
  type: "seed" | "sapling";
  plantedAt: string;
  location: string;
  lat: number;
  lng: number;
  status: PlantStatus;
  photo: string;
  lastUpdate?: string;
  daysOld: number;
  needsCheckup: boolean;
  notes?: string;
}

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  category: "native" | "fast-growing" | "drought-resistant" | "fruit";
  successRate: number;
  growthMonths: number;
  description: string;
  image: string;
}

export const mockPlants: Plant[] = [
  {
    id: "p1",
    species: "Neem",
    scientificName: "Azadirachta indica",
    type: "sapling",
    plantedAt: "2025-12-12",
    location: "Cubbon Park, Bengaluru",
    lat: 12.9763,
    lng: 77.5929,
    status: "thriving",
    photo: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600",
    lastUpdate: "2026-04-20",
    daysOld: 152,
    needsCheckup: false,
  },
  {
    id: "p2",
    species: "Banyan",
    scientificName: "Ficus benghalensis",
    type: "sapling",
    plantedAt: "2026-02-08",
    location: "Lalbagh, Bengaluru",
    lat: 12.9507,
    lng: 77.5848,
    status: "growing",
    photo: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600",
    daysOld: 93,
    needsCheckup: true,
  },
  {
    id: "p3",
    species: "Mango",
    scientificName: "Mangifera indica",
    type: "seed",
    plantedAt: "2026-03-15",
    location: "Hesaraghatta Lake",
    lat: 13.1391,
    lng: 77.4781,
    status: "growing",
    photo: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600",
    daysOld: 58,
    needsCheckup: false,
  },
  {
    id: "p4",
    species: "Peepal",
    scientificName: "Ficus religiosa",
    type: "sapling",
    plantedAt: "2025-11-02",
    location: "Bannerghatta Road",
    lat: 12.8003,
    lng: 77.5773,
    status: "struggling",
    photo: "https://images.unsplash.com/photo-1444392061186-9fc38f84f726?w=600",
    daysOld: 191,
    needsCheckup: true,
  },
];

export const mockSpecies: Species[] = [
  {
    id: "s1",
    name: "Neem",
    scientificName: "Azadirachta indica",
    category: "native",
    successRate: 87,
    growthMonths: 18,
    description: "Hardy native tree with medicinal value, thrives in dry climates.",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600",
  },
  {
    id: "s2",
    name: "Banyan",
    scientificName: "Ficus benghalensis",
    category: "native",
    successRate: 91,
    growthMonths: 36,
    description: "Iconic Indian shade tree with sprawling aerial roots.",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600",
  },
  {
    id: "s3",
    name: "Gulmohar",
    scientificName: "Delonix regia",
    category: "fast-growing",
    successRate: 74,
    growthMonths: 24,
    description: "Fast-growing flowering tree with brilliant red blooms.",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600",
  },
  {
    id: "s4",
    name: "Tamarind",
    scientificName: "Tamarindus indica",
    category: "drought-resistant",
    successRate: 82,
    growthMonths: 48,
    description: "Drought-tolerant evergreen yielding tangy edible pods.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600",
  },
];

export const userStats = {
  name: "Arjun",
  treesPlanted: 24,
  survivalRate: 78,
  daysActive: 184,
  rank: 12,
  community: "Bengaluru South",
  achievements: 6,
};

export const communityFeed = [
  { id: "a1", user: "Priya M.", action: "planted a Mango sapling", time: "2h ago", area: "JP Nagar" },
  { id: "a2", user: "Ravi K.", action: "updated Neem to Thriving", time: "5h ago", area: "Whitefield" },
  { id: "a3", user: "Schools United", action: "completed 50-tree drive", time: "1d ago", area: "Jayanagar" },
  { id: "a4", user: "Meera S.", action: "earned Forest Guardian badge", time: "1d ago", area: "Indiranagar" },
];

export const statusMeta: Record<PlantStatus, { label: string; color: string; dot: string }> = {
  thriving: { label: "Thriving", color: "bg-success/15 text-success", dot: "bg-success" },
  growing: { label: "Growing", color: "bg-primary/15 text-primary", dot: "bg-primary" },
  struggling: { label: "Struggling", color: "bg-warning/15 text-[oklch(0.5_0.17_65)]", dot: "bg-warning" },
  dead: { label: "Dead", color: "bg-destructive/15 text-destructive", dot: "bg-destructive" },
  pending: { label: "Needs check-up", color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
};
