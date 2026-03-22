import { getCurrentUser, getUserActivities, getUserConsumptions } from '@/lib/actions';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userActivities = await getUserActivities();
  const userConsumptions = await getUserConsumptions();

  if (!user) return <div>Caricamento...</div>;

  const mockWeeklyImpact = [
    { day: 'Lun', energy: 0.8, transport: 1.0, circular: 0.3 },
    { day: 'Mar', energy: 1.2, transport: 1.5, circular: 0.8 },
    { day: 'Mer', energy: 0.5, transport: 0.8, circular: 0.5 },
    { day: 'Gio', energy: 1.5, transport: 2.0, circular: 0.7 },
    { day: 'Ven', energy: 1.0, transport: 1.2, circular: 0.7 },
    { day: 'Sab', energy: 2.0, transport: 1.0, circular: 2.0 },
    { day: 'Dom', energy: 1.5, transport: 0.5, circular: 1.8 },
  ];


  const mockNextActions = [
    { id: 'n1', title: 'Completa la routine differenziata', icon: '♻️', points: 50 },
    { id: 'n2', title: 'Partecipa al meeting Green Committee', icon: '📅', points: 150 },
    { id: 'n3', title: 'Spegni le luci a fine turno', icon: '💡', points: 30 },
  ];

  const mockStepHistory = [
    { day: 'Lun', steps: 6200 },
    { day: 'Mar', steps: 8345 },
    { day: 'Mer', steps: 5120 },
    { day: 'Gio', steps: 11200 },
    { day: 'Ven', steps: 9340 },
    { day: 'Sab', steps: 4450 },
    { day: 'Dom', steps: 8432 }, // current today match
  ];


  return (
    <DashboardClient 
      currentUser={user} 
      userActivities={userActivities} 
      userConsumptions={userConsumptions || []}
      weeklyImpact={mockWeeklyImpact} 
      nextActions={mockNextActions} 
      stepHistory={mockStepHistory}
    />

  );
}
