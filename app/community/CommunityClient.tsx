'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Community.module.css';
import { quizQuestionsBank, initialGroupChallengeHistory } from '@/lib/mockData';

export default function CommunityClient({ leaderboards, communityEvents, currentUser }: any) {
  const [hasJoined, setHasJoined] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'global' | 'group' | 'city' | 'neighborhood'>('global');

  // Quiz states
  const [challengeHistory, setChallengeHistory] = useState(initialGroupChallengeHistory);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResult, setQuizResult] = useState<'win' | 'loss' | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const startQuiz = () => {
    const shuffled = [...quizQuestionsBank].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 10));
    setQuizOpen(true);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizResult(null);
  };

  const handleAnswer = (selectedIdx: number) => {
    const isCorrect = selectedIdx === quizQuestions[quizIndex].correctAnswer;
    const currentScore = isCorrect ? quizScore + 1 : quizScore;
    if (isCorrect) setQuizScore(currentScore);

    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(i => i + 1);
    } else {
      // Fine quiz
      const isWin = currentScore >= 6; // win with 6 or more out of 10
      setQuizResult(isWin ? 'win' : 'loss');
      
      const newHistoryItem = {
        id: `ch_${Date.now()}`,
        opponentName: 'EcoCampioni',
        date: new Date().toISOString(),
        result: isWin ? 'win' : 'loss',
        pointsChange: isWin ? 200 : -20,
      };
      setChallengeHistory([newHistoryItem, ...challengeHistory]);
    }
  };

  const closeQuiz = () => {
    setQuizOpen(false);
    setQuizResult(null);
  };


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
  const userCity = currentUser?.city || 'Genova';
  const userNeighborhood = currentUser?.neighborhood || 'Bogliasco';

  const groupMembers = leaderboards.filter((u: any) => u.teamId === currentUser?.teamId); 
  const cityMembers = leaderboards.filter((u: any) => u.city === userCity);
  const neighborhoodMembers = leaderboards.filter((u: any) => u.neighborhood === userNeighborhood);

  let activeLeaderboard = leaderboards;
  if (viewMode === 'group') activeLeaderboard = groupMembers;
  else if (viewMode === 'city') activeLeaderboard = cityMembers;
  else if (viewMode === 'neighborhood') activeLeaderboard = neighborhoodMembers;

  const podium = activeLeaderboard.slice(0, 3);
  const rest = activeLeaderboard.slice(3);

  return (
    <main className={styles.container}>
      <header className="page-header glass">
        <h1 className="page-title page-title-gradient">Community & Sfide</h1>
        <div className={styles.viewToggle}>
          <button 
            className={`${styles.toggleBtn} ${viewMode === 'global' ? styles.activeToggle : ''}`}
            onClick={() => setViewMode('global')}
          >
            🌎 Globale
          </button>
          <button 
            className={`${styles.toggleBtn} ${viewMode === 'city' ? styles.activeToggle : ''}`}
            onClick={() => setViewMode('city')}
          >
            🌆 Città
          </button>
          <button 
            className={`${styles.toggleBtn} ${viewMode === 'neighborhood' ? styles.activeToggle : ''}`}
            onClick={() => setViewMode('neighborhood')}
          >
            🏘️ Quartiere
          </button>
          <button 
            className={`${styles.toggleBtn} ${viewMode === 'group' ? styles.activeToggle : ''}`}
            onClick={() => setViewMode('group')}
          >
            👥 Il Mio Gruppo
          </button>
        </div>
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

      {/* Network Banner */}
      <section className={`${styles.networkBanner} glass animate-fade-in`}>
        <div className={styles.bannerInfo}>
          <h3>🤝 Il nostro Network Locale</h3>
          <p>Scopri le associazioni, come WWF e Legambiente, con cui collaboriamo per le nostre sfide.</p>
        </div>
        <Link href="/network" className={`${styles.joinBtn} btn-secondary`} style={{ width: 'auto', padding: '0.8rem 1.5rem', whiteSpace: 'nowrap' }}>
          Esplora il Network
        </Link>
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

          <div className={`${styles.challengeCard} glass animate-fade-in`} style={{ marginTop: '1rem' }}>
            <div className={styles.challengeHeader}>
              <div className={styles.challengeIconBox}>⚔️</div>
              <div className={styles.challengeMeta}>
                <h3 className={styles.challengeTitle}>Sfida di Gruppo: EcoCampioni</h3>
                <p className={styles.challengeDesc}>Sfida a quiz contro un altro team. Rispondi col tuo gruppo per vincere 200 pt o perderne 20!</p>
              </div>
            </div>
            <button 
              className={`${styles.joinBtn} btn-primary`}
              onClick={startQuiz}
            >
              Avvia Sfida a Quiz
            </button>
          </div>

          <h2 className={styles.sectionTitle} style={{ marginTop: '2.5rem' }}>📜 Storico Sfide di Gruppo</h2>
          <div className={styles.historyList}>
            {challengeHistory.map((item: any, idx: number) => (
              <div key={item.id} className={`${styles.historyItem} glass animate-fade-in`} style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className={styles.historyMeta}>
                  <strong>vs {item.opponentName}</strong>
                  <span className={styles.historyDate}>
                    {isMounted ? new Date(item.date).toLocaleDateString('it-IT') : ''}
                  </span>
                </div>
                <div className={`${styles.historyResult} ${item.result === 'win' ? styles.win : styles.loss}`}>
                  <span>{item.result === 'win' ? 'Vittoria 🏆' : 'Sconfitta ❌'}</span>
                  <span className={styles.historyPoints}>
                    {item.pointsChange > 0 ? `+${item.pointsChange}` : item.pointsChange} pt
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Right Column: Rest of Leaderboard */}
        <section className={styles.leaderboardColumn}>
          <h2 className={styles.sectionTitle}>
            📊 Classifica {
              viewMode === 'global' ? 'Generale' : 
              viewMode === 'city' ? `di ${userCity}` :
              viewMode === 'neighborhood' ? `di ${userNeighborhood}` :
              'del Tuo Gruppo'
            }
          </h2>
          <div className={styles.leaderboardList}>
            {rest.length > 0 ? (
              rest.map((user: any, index: number) => (
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
              ))
            ) : (
              <p className={styles.emptySmall} style={{ textAlign: 'center', opacity: 0.7, padding: '1rem' }}>
                {viewMode === 'group' 
                  ? '🏆 Tutti i membri del tuo gruppo sono sul podio!' 
                  : viewMode === 'neighborhood'
                  ? 'Non ci sono altri utenti nel tuo quartiere.'
                  : viewMode === 'city'
                  ? 'Non ci sono altri utenti nella tua città.'
                  : 'Nessun altro utente in classifica.'}
              </p>
            )}
          </div>
        </section>
      </div>

      {quizOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.quizModal} glass animate-fade-in`}>
            {!quizResult ? (
              <div className={styles.quizContent}>
                <h3 className={styles.quizProgress}>Domanda {quizIndex + 1} di {quizQuestions.length}</h3>
                <p className={styles.quizQuestion}>{quizQuestions[quizIndex].text}</p>
                <div className={styles.quizOptions}>
                  {quizQuestions[quizIndex].options.map((opt: string, idx: number) => (
                    <button 
                      key={idx} 
                      className={styles.quizOptionBtn}
                      onClick={() => handleAnswer(idx)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.quizResultBox}>
                <h3 className={styles.quizResultTitle}>{quizResult === 'win' ? 'Hai Vinto! 🏆' : 'Hai Perso 😔'}</h3>
                <p className={styles.quizResultDesc}>Il tuo gruppo ha risposto correttamente a {quizScore} domande su {quizQuestions.length}.</p>
                <p className={quizResult === 'win' ? styles.winText : styles.lossText}>
                  {quizResult === 'win' ? '+200 punti per il tuo gruppo!' : '-20 punti per il tuo gruppo.'}
                </p>
                <button className={`${styles.joinBtn} btn-primary`} style={{ marginTop: '1.5rem' }} onClick={closeQuiz}>
                  Chiudi e torna alla Community
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
