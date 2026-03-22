import { getCurrentUser, getUserActivities, getUserConsumptions } from '@/lib/actions';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userActivities = await getUserActivities();
  const userConsumptions = await getUserConsumptions();

  if (!user) return <div>Caricamento...</div>;

  // --- DAILY: 24h hours in blocks of 4h ---
  const mockDailyImpact = [
    { day: '00-04', energy: 0.1, transport: 0.0, circular: 0.0 },
    { day: '04-08', energy: 0.3, transport: 0.2, circular: 0.0 },
    { day: '08-12', energy: 0.9, transport: 1.2, circular: 0.4 },
    { day: '12-16', energy: 0.6, transport: 0.8, circular: 0.3 },
    { day: '16-20', energy: 1.1, transport: 1.5, circular: 0.6 },
    { day: '20-24', energy: 0.7, transport: 0.3, circular: 0.2 },
  ];

  const mockDailySteps = [
    { day: '00-04', steps: 120 },
    { day: '04-08', steps: 780 },
    { day: '08-12', steps: 3200 },
    { day: '12-16', steps: 2100 },
    { day: '16-20', steps: 1890 },
    { day: '20-24', steps: 340 },
  ];

  // --- WEEKLY: standard 7 days ---
  const mockWeeklyImpact = [
    { day: 'Lun', energy: 0.8, transport: 1.0, circular: 0.3 },
    { day: 'Mar', energy: 1.2, transport: 1.5, circular: 0.8 },
    { day: 'Mer', energy: 0.5, transport: 0.8, circular: 0.5 },
    { day: 'Gio', energy: 1.5, transport: 2.0, circular: 0.7 },
    { day: 'Ven', energy: 1.0, transport: 1.2, circular: 0.7 },
    { day: 'Sab', energy: 2.0, transport: 1.0, circular: 2.0 },
    { day: 'Dom', energy: 1.5, transport: 0.5, circular: 1.8 },
  ];

  const mockWeeklySteps = [
    { day: 'Lun', steps: 6200 },
    { day: 'Mar', steps: 8345 },
    { day: 'Mer', steps: 5120 },
    { day: 'Gio', steps: 11200 },
    { day: 'Ven', steps: 9340 },
    { day: 'Sab', steps: 4450 },
    { day: 'Dom', steps: 8432 },
  ];

  // --- MONTHLY: 4 weeks ---
  const mockMonthlyImpact = [
    { day: 'Sett 1', energy: 6.2, transport: 7.5, circular: 3.8 },
    { day: 'Sett 2', energy: 5.8, transport: 8.1, circular: 4.2 },
    { day: 'Sett 3', energy: 7.1, transport: 6.9, circular: 5.0 },
    { day: 'Sett 4', energy: 6.5, transport: 7.2, circular: 4.7 },
  ];

  const mockMonthlySteps = [
    { day: 'Sett 1', steps: 52000 },
    { day: 'Sett 2', steps: 61000 },
    { day: 'Sett 3', steps: 47000 },
    { day: 'Sett 4', steps: 58000 },
  ];

  // --- CONSUMPTIONS ---
  const mockDailyBudget = { used: 5.4, total: 8.0, unit: 'kWh' };

  const mockWeeklyFasce = {
    lucedistribution: { f1: 42, f2: 33, f3: 25 }, // % distribution
    gasdistribution: { f1: 10, f2: 20, f3: 70 }, // % distribution
  };

  const mockNextActions = [
    { id: 'n1', title: 'Completa la routine differenziata', icon: '♻️', points: 50 },
    { id: 'n2', title: 'Partecipa al meeting Green Committee', icon: '📅', points: 150 },
    { id: 'n3', title: 'Spegni le luci a fine turno', icon: '💡', points: 30 },
  ];

  return (
    <DashboardClient
      currentUser={user}
      userActivities={userActivities}
      dailyImpact={mockDailyImpact}
      weeklyImpact={mockWeeklyImpact}
      monthlyImpact={mockMonthlyImpact}
      dailySteps={mockDailySteps}
      weeklySteps={mockWeeklySteps}
      monthlySteps={mockMonthlySteps}
      dailyBudget={mockDailyBudget}
      weeklyFasce={mockWeeklyFasce}
      userConsumptions={userConsumptions || []}
      nextActions={mockNextActions}
    />
  );
}
