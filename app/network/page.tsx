import type { Metadata } from 'next';
import NetworkClient from './NetworkClient';

export const metadata: Metadata = {
  title: 'Il nostro Network - Piantala!',
  description: 'Scopri le associazioni e i partner attivi sul territorio che supportano le nostre sfide di sostenibilità.',
};

export default function NetworkPage() {
  return <NetworkClient />;
}
