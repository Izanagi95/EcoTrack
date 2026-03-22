import { getCurrentUser, getUserActivities } from '@/lib/actions';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const userActivities = await getUserActivities();

  if (!user) return <div>Caricamento profilo...</div>;

  return <ProfileClient currentUser={user} userActivities={userActivities} />;
}
