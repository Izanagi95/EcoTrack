export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  ecoScore: number;
  level: string;
  stats: {
    co2SavedKg: number;
    wasteRecycledKg: number;
    energySavedKwh: number;
    streakDays: number;
  };
}

export interface Activity {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  points: number;
  co2SavedValue?: number;
  date: string;
  imageUrl?: string;
}

export const currentUser: User = {
  id: 'u1',
  name: 'Marco Sostenibile',
  avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  ecoScore: 1250,
  level: 'Tree Hero',
  stats: {
    co2SavedKg: 145.2,
    wasteRecycledKg: 32.5,
    energySavedKwh: 210,
    streakDays: 12,
  },
};

export const feedActivities: Activity[] = [
  {
    id: 'a1',
    userId: 'u2',
    type: 'recycling',
    title: 'Riciclo Plastica AMIU',
    description: 'Conferiti 5kg di plastica e lattine al centro di raccolta.',
    points: 50,
    co2SavedValue: 7.5,
    date: '2026-03-21T14:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'a2',
    userId: 'u1',
    type: 'energy',
    title: 'Risparmio Energetico Domestico',
    description: 'Bolletta caricata: -15% rispetto allo scorso mese!',
    points: 120,
    co2SavedValue: 22.4,
    date: '2026-03-20T09:15:00Z',
  },
  {
    id: 'a3',
    userId: 'u3',
    type: 'volunteer',
    title: 'Pulizia Spiaggia',
    description: 'Partecipato all\'evento Plastic Free a Boccadasse.',
    points: 200,
    co2SavedValue: 15.0,
    date: '2026-03-19T10:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80fabe5?auto=format&fit=crop&w=600&q=80',
  }
];

export const leaderboards = [
  { rank: 1, name: 'Giulia V.', score: 3400, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80' },
  { rank: 2, name: 'Marco Sostenibile', score: 1250, avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=256&q=80' },
  { rank: 3, name: 'Andrea B.', score: 1100, avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80' },
];

export const weeklyImpact = [
  { day: 'Lun', co2: 2.1, waste: 0.5 },
  { day: 'Mar', co2: 3.5, waste: 1.2 },
  { day: 'Mer', co2: 1.8, waste: 0.8 },
  { day: 'Gio', co2: 4.2, waste: 2.0 },
  { day: 'Ven', co2: 2.9, waste: 1.5 },
  { day: 'Sab', co2: 5.0, waste: 3.2 },
  { day: 'Dom', co2: 3.8, waste: 2.1 },
];

export const nextActions = [
  { id: 'n1', title: 'Carica bolletta Luce', icon: '⚡', points: 100 },
  { id: 'n2', title: 'Porta vetro al riciclo', icon: '♻️', points: 30 },
  { id: 'n3', title: 'Usa la bici oggi', icon: '🚲', points: 50 },
];

export const userActivities: Activity[] = [
  {
    id: 'ua1',
    userId: 'u1',
    type: 'energy',
    title: 'Risparmio Energetico Gennaio',
    description: 'Caricata bolletta con riduzione del 10% di CO2.',
    points: 150,
    co2SavedValue: 12.5,
    date: '2026-01-15T10:00:00Z',
  },
  {
    id: 'ua2',
    userId: 'u1',
    type: 'recycling',
    title: 'Conferimento Plastica',
    description: 'Portati 8kg di plastica al centro AMIU.',
    points: 40,
    co2SavedValue: 2.4,
    date: '2026-02-10T14:30:00Z',
  },
  {
    id: 'ua3',
    userId: 'u1',
    type: 'volunteer',
    title: 'Pulizia Parco Sempione',
    description: 'Partecipazione attiva all\'evento di pulizia.',
    points: 200,
    co2SavedValue: 5.0,
    date: '2026-03-05T09:00:00Z',
  },
  {
    id: 'ua4',
    userId: 'u1',
    type: 'volunteer',
    title: 'Attività di Volontariato Plastic Free',
    description: 'Raccolta plastica in spiaggia a Bogliasco.',
    points: 250,
    co2SavedValue: 12.5,
    date: '2026-03-22T10:30:00Z',
  }
];



