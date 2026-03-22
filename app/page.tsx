import { getFeedActivities, getSuggestedUsers } from '@/lib/actions';
import FeedClient from './FeedClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const activities = await getFeedActivities();
  const suggestedUsers = await getSuggestedUsers();

  return <FeedClient activities={activities} suggestedUsers={suggestedUsers} />;
}

