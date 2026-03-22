import { getCommunityEvents } from '@/lib/actions';
import EventsFilterClient from './EventsFilterClient';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await getCommunityEvents();

  return <EventsFilterClient initialEvents={events} />;
}
