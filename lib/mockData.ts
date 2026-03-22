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
  teamId?: string;
  team?: any;
  city?: string;
  neighborhood?: string;
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
  user?: any;
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
  teamId: 'team-1',
  team: { id: 'team-1', name: 'Green Warriors', points: 5850 },
  city: 'Genova',
  neighborhood: 'Bogliasco'
};

export const feedActivities: Activity[] = [
  {
    id: 'a1',
    userId: 'u2',
    user: { name: 'Giulia V.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80' },
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
    user: { name: 'Marco Sostenibile', avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80' },
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
    user: { name: 'Andrea B.', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80' },
    type: 'volunteer',
    title: 'Pulizia Spiaggia',
    description: 'Partecipato all\'evento Plastic Free a Boccadasse.',
    points: 200,
    co2SavedValue: 15.0,
    date: '2026-03-19T10:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80fabe5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'a4',
    userId: 'u4',
    user: { name: 'EcoHero 4', avatarUrl: 'https://i.pravatar.cc/150?u=u4' },
    type: 'mobility',
    title: 'Al lavoro in bici',
    description: 'Oggi ho lasciato a casa la macchina. 10km in bicicletta!',
    points: 60,
    co2SavedValue: 2.1,
    date: '2026-03-21T08:30:00Z',
  },
  {
    id: 'a5',
    userId: 'u10',
    user: { name: 'Luca G.', avatarUrl: 'https://i.pravatar.cc/150?u=u10' },
    type: 'circular',
    title: 'Acquisto Second Hand',
    description: 'Ho comprato una giacca vintage fantastica invece di una nuova.',
    points: 80,
    co2SavedValue: 10.5,
    date: '2026-03-22T09:45:00Z',
  },
  {
    id: 'a6',
    userId: 'u5',
    user: { name: 'EcoHero 5', avatarUrl: 'https://i.pravatar.cc/150?u=u5' },
    type: 'energy',
    title: 'Installazione Pannelli Solari',
    description: 'Finalmente ho terminato i lavori! Da oggi la mia casa è alimentata dal sole.',
    points: 500,
    co2SavedValue: 150.0,
    date: '2026-03-18T16:20:00Z',
  }
];

export const leaderboards = [
  { rank: 1, name: 'Giulia V. (Global)', score: 4500, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80', city: 'Milano', neighborhood: 'Navigli' },
  { rank: 2, name: 'Andrea B. (Global)', score: 4200, avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80', city: 'Roma', neighborhood: 'Trastevere' },
  { rank: 3, name: 'EcoMaster 99', score: 3800, avatarUrl: 'https://i.pravatar.cc/150?u=u99', city: 'Torino', neighborhood: 'Centro' },
  { rank: 4, name: 'Marco Sostenibile', score: 2250, avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80', teamId: 'team-1', city: 'Genova', neighborhood: 'Bogliasco' },
  { rank: 5, name: 'Giulia V.', score: 1950, avatarUrl: 'https://i.pravatar.cc/150?u=u2', teamId: 'team-1', city: 'Genova', neighborhood: 'Bogliasco' },
  { rank: 6, name: 'Andrea B.', score: 1650, avatarUrl: 'https://i.pravatar.cc/150?u=u3', teamId: 'team-1', city: 'Genova', neighborhood: 'Albaro' },
  { rank: 7, name: 'Luca G.', score: 1400, avatarUrl: 'https://i.pravatar.cc/150?u=u10', city: 'Genova', neighborhood: 'Bogliasco' },
  { rank: 8, name: 'EcoHero 4', score: 1100, avatarUrl: 'https://i.pravatar.cc/150?u=u4', city: 'Genova', neighborhood: 'Sturla' },
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

export const quizQuestionsBank = [
  { id: 'q1', text: 'Quale tra i seguenti gas è il principale responsabile dell\'effetto serra antropico?', options: ['Argon', 'Anidride carbonica', 'Ozono troposferico', 'Metano'], correctAnswer: 1 },
  { id: 'q2', text: "Cosa si intende con il termine 'Impronta Idrica' (Water Footprint)?", options: ['Il volume totale di acqua dolce utilizzato per produrre beni e servizi', 'La velocità di scioglimento dei ghiacciai', 'Il livello di inquinamento dei mari', 'La quantità di pioggia che cade in un anno'], correctAnswer: 0 },
  { id: 'q3', text: 'Qual è l\'obiettivo principale dell\'Accordo di Parigi del 2015?', options: ['Rendere obbligatorio il trasporto pubblico gratuito', 'Limitare il riscaldamento globale ben al di sotto dei 2°C', 'Incentivare l’esplorazione spaziale', 'Eliminare completamente la plastica entro il 2020'], correctAnswer: 1 },
  { id: 'q4', text: 'Quale settore è responsabile del consumo di circa il 70% delle risorse di acqua dolce nel mondo?', options: ['L\'uso domestico (docce, cucina)', 'Il settore tecnologico', 'L\'agricoltura', 'L\'industria della moda'], correctAnswer: 2 },
  { id: 'q5', text: 'Che cos\'è l\'Earth Overshoot Day?', options: ['Una festa mondiale per piantare nuovi alberi', 'Il giorno in cui l\'umanità ha consumato tutte le risorse prodotte dalla Terra per quell\'anno', 'Il giorno dell\'eclissi solare totale', 'Il giorno in cui la Terra è più vicina al Sole'], correctAnswer: 1 },
  { id: 'q7', text: 'Quale fonte energetica è considerata \'rinnovabile\'?', options: ['Gas Naturale', 'Nucleare', 'Eolico', 'Carbone'], correctAnswer: 2 },
  { id: 'q8', text: 'Perché le microplastiche sono pericolose per l\'ecosistema marino?', options: ['Perché rendono l\'acqua acida', 'Perché attirano gli animali vicino alle coste', 'Perché vengono ingerite dagli organismi entrando nella catena alimentare', 'Perché abbassano la temperatura degli oceani'], correctAnswer: 2 },
  { id: 'q9', text: 'Quale di queste azioni quotidiane contribuisce maggiormente al risparmio idrico in casa?', options: ['Usare piatti di plastica per non lavare quelli in ceramica', 'Fare una doccia di 20 minuti invece di un bagno', 'Chiudere il rubinetto mentre ci si lava i denti', 'Lavare la frutta sotto l\'acqua corrente'], correctAnswer: 2 },
  { id: 'q10', text: 'In termini di impatto ambientale, qual è il vantaggio principale del consumo di prodotti \'a chilometro zero\'?', options: ['Il fatto che i prodotti costino sempre molto meno', 'La certezza che il prodotto sia biologico', 'La riduzione delle emissioni di CO2 legate al trasporto', 'L\'assenza totale di imballaggi'], correctAnswer: 2 },
  { id: 'q11', text: 'Dove va gettato uno scontrino della spesa (di tipo termico)?', options: ['Nell\'umido', 'Nella plastica', 'Nella carta', 'Nell\'indifferenziato'], correctAnswer: 3 },
  { id: 'q12', text: 'Qual è il settore che, a livello globale, consuma la maggiore quantità di acqua dolce?', options: ['Il settore turistico', 'L\'industria manifatturiera', 'L\'agricoltura e l\'allevamento', 'L\'uso domestico (bagno, cucina, pulizia)'], correctAnswer: 2 },
  { id: 'q14', text: 'Che cosa indica l\'etichetta energetica su un elettrodomestico (dalla A alla G)?', options: ['Il livello di rumore prodotto', 'La velocità dell\'apparecchio', 'La durata della garanzia', 'Il consumo di energia elettrica in rapporto alle prestazioni'], correctAnswer: 3 },
  { id: 'q15', text: 'Cosa indica il termine \'Albedo\' in fisica del clima?', options: ['La capacità di una superficie di riflettere la radiazione solare', 'La velocità di scioglimento dei ghiacciai', 'L\'intensità delle piogge acide', 'La concentrazione di sale negli oceani'], correctAnswer: 0 },
  { id: 'q16', text: 'Dal punto di vista chimico, perché l\'eccesso di CO2 causa l\'acidificazione degli oceani?', options: ['Perché uccide i pesci che rilasciano tossine', 'Perché la CO2 è un acido forte', 'Perché reagisce con l\'acqua formando acido carbonico', 'Perché aumenta la temperatura dell\'acqua'], correctAnswer: 2 },
  { id: 'q17', text: 'Qual è il principale gas serra naturalmente presente nell\'atmosfera terrestre?', options: ['Vapore acqueo (H2O)', 'Elio (He)', 'Biossido di carbonio (CO2)', 'Monossido di carbonio (CO)'], correctAnswer: 0 },
  { id: 'q19', text: 'Quale settore a livello globale contribuisce maggiormente alle emissioni di gas serra?', options: ['Moda e abbigliamento', 'Aviazione civile', 'Gestione dei rifiuti', 'Produzione di energia e calore'], correctAnswer: 3 },
  { id: 'q20', text: 'Il \'Punto di non ritorno\' (Tipping Point) climatico si riferisce a:', options: ['L\'anno in cui la popolazione smette di crescere', 'Il momento in cui finisce il petrolio', 'La massima temperatura registrata in un anno', 'Un cambiamento irreversibile nel sistema climatico'], correctAnswer: 3 }
];

export const initialGroupChallengeHistory = [
  {
    id: 'ch1',
    opponentName: 'EcoCampioni',
    date: '2026-03-20T14:00:00Z',
    result: 'win',
    pointsChange: 200,
  },
  {
    id: 'ch2',
    opponentName: 'Genova Green Squad',
    date: '2026-03-15T18:30:00Z',
    result: 'loss',
    pointsChange: -20,
  }
];
