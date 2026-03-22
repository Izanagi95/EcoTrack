'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Community.module.css';

export default function CommunityClient({ leaderboards, communityEvents }: any) {
  const [hasJoined, setHasJoined] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getPartnerLogo = (organizer: string, title?: string) => {
    const combined = `${organizer} ${title || ''}`.toLowerCase();
    if (combined.includes('plastic free')) return <img src="/images/plastic-free-logo.png" alt="Plastic Free" className={styles.logoImg} />;
    if (combined.includes('blue district')) return <img src="/images/blue-district-logo.png" alt="Blue District" className={styles.logoImg} />;
    if (combined.includes('legambiente')) return <img src="/images/legambiente.svg" alt="Legambiente" className={styles.logoImg} />;
    if (combined.includes('posidonia')) return '🌿';
    return '🌱';
  };


  // Today/Tomorrow filter for Genova

  const today = new Date('2026-03-22');
  const tomorrow = new Date('2026-03-23');

  const nearbyEvents = communityEvents.filter((event: any) => {
    const eventDate = new Date(event.date);
    const isTodayOrTomorrow = (
      (eventDate.getDate() === today.getDate() && eventDate.getMonth() === today.getMonth()) ||
      (eventDate.getDate() === tomorrow.getDate() && eventDate.getMonth() === tomorrow.getMonth())
    );
    const isNearGenova = event.city.toLowerCase().includes('genova') || event.city.toLowerCase().includes('bogliasco');
    return isTodayOrTomorrow && isNearGenova;
  }).slice(0, 4); // Show up to 4 highlights


  // Podium logic
  const podium = leaderboards.slice(0, 3);
  const rest = leaderboards.slice(3);

  return (
    <main className={styles.container}>
      <header className="page-header glass">
        <h1 className="page-title page-title-gradient">Community & Sfide</h1>
      </header>

      {/* Podium Section */}
      <section className={`${styles.podiumSection} animate-fade-in`}>

        <div className={styles.podium}>
          {podium[1] && (
            <div className={`${styles.podiumPlace} ${styles.second}`}>
              <div className={styles.podiumAvatar}>
                <img src={podium[1].avatarUrl} alt={podium[1].name} />
                <span className={styles.rankBadge}>2</span>
              </div>
              <span className={styles.podiumName}>{podium[1].name}</span>
              <span className={styles.podiumScore}>{podium[1].score} pt</span>
            </div>
          )}
          {podium[0] && (
            <div className={`${styles.podiumPlace} ${styles.first}`}>
              <div className={styles.crown}>👑</div>
              <div className={styles.podiumAvatar}>
                <img src={podium[0].avatarUrl} alt={podium[0].name} />
                <span className={styles.rankBadge}>1</span>
              </div>
              <span className={styles.podiumName}>{podium[0].name}</span>
              <span className={styles.podiumScore}>{podium[0].score} pt</span>
            </div>
          )}
          {podium[2] && (
            <div className={`${styles.podiumPlace} ${styles.third}`}>
              <div className={styles.podiumAvatar}>
                <img src={podium[2].avatarUrl} alt={podium[2].name} />
                <span className={styles.rankBadge}>3</span>
              </div>
              <span className={styles.podiumName}>{podium[2].name}</span>
              <span className={styles.podiumScore}>{podium[2].score} pt</span>
            </div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <section className={styles.eventsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📍 Eventi a Genova (Oggi e Domani)</h2>
          <Link href="/community/events" className={styles.viewAll}>Vedi tutti</Link>
        </div>

        <div className={styles.eventsGrid}>
          {nearbyEvents.length === 0 ? (
            <p className={styles.emptyState}>Nessun evento a Genova oggi o domani. Guarda tutti gli eventi per altre date!</p>
          ) : (
            nearbyEvents.map((event: any, i: number) => {

              const date = new Date(event.date);
              const day = date.getDate();
              const month = isMounted ? date.toLocaleDateString('it-IT', { month: 'short' }) : '...';
              return (
                <div key={event.id} className={`${styles.eventCard} glass animate-fade-in`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={styles.eventDate}>
                    <span className={styles.day}>{day}</span>
                    <span className={styles.month}>{month}</span>
                  </div>
                  <div className={styles.eventInfo}>
                    <div className={styles.logoRow}>
                      <span className={styles.partnerLogo}>{getPartnerLogo(event.organizer, event.title)}</span>

                      <span className={`${styles.eventTypeBadge} ${event.organizer === 'Blue District' ? styles.blue : ''}`}>
                        {event.type}
                      </span>
                    </div>
                    <h3 className={styles.eventTitle}>{event.city}</h3>

                    <p className={styles.eventLoc}>📍 {event.location}</p>
                    <div className={styles.eventFooter}>
                      <span className={styles.organizer}>Organizzato da: {event.organizer}</span>
                      <Link href={`/track?type=volunteer&event=${encodeURIComponent(event.title)}`} className={styles.joinTinyBtn}>
                        Partecipa
                      </Link>
                    </div>

                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      <div className={styles.mainGrid}>
        {/* Left Column: Challenges */}
        <section className={styles.challengesColumn}>
          <h2 className={styles.sectionTitle}>🏆 Sfide Tracciabili</h2>
          <div className={`${styles.challengeCard} glass animate-fade-in`}>
            <div className={styles.challengeHeader}>
              <div className={styles.challengeIconBox}>♻️</div>
              <div className={styles.challengeMeta}>
                <h3 className={styles.challengeTitle}>Riciclo Master</h3>
                <p className={styles.challengeDesc}>Registra 10 attività di riciclo questa settimana per guadagnare 500 punti.</p>
              </div>
            </div>
            <div className={styles.challengeProgress}>
              <div className={styles.progressHeader}>
                <span>Progresso attuale</span>
                <span className={styles.progressVal}>40%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '40%' }}></div>
              </div>
              <span className={styles.progressSub}>4/10 attività registrate</span>
            </div>
            <button 
              className={`${styles.joinBtn} btn-premium`}
              onClick={() => setHasJoined(true)}
              disabled={hasJoined}
            >
              {hasJoined ? 'Sfida Attivata' : 'Inizia Sfida'}
            </button>

          </div>
        </section>


        {/* Right Column: Rest of Leaderboard */}
        <section className={styles.leaderboardColumn}>
          <h2 className={styles.sectionTitle}>📊 Classifica Generale</h2>
          <div className={styles.leaderboardList}>
            {rest.map((user: any, index: number) => (
              <div 
                key={user.id} 
                className={`${styles.leaderboardItem} glass animate-fade-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >

                <span className={styles.rank}>#{user.rank || index + 4}</span>
                <img src={user.avatarUrl} alt={user.name} className={styles.avatar} />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.score}>{user.score} pt</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
