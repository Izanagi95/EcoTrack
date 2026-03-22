import { getLeaderboard, getCommunityEvents } from '@/lib/actions';
import CommunityClient from './CommunityClient';

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const leaderboardData = await getLeaderboard();
  const communityEvents = await getCommunityEvents();
  
  return <CommunityClient leaderboards={leaderboardData} communityEvents={communityEvents} />;
}
