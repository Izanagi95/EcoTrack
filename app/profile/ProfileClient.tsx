'use client';

import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { getCO2Equivalent } from '@/lib/helpers';
import { useTheme } from '@/components/ThemeProvider';

export default function ProfileClient({ currentUser, userActivities }: any) {
  const { theme, toggle } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const [showLevels, setShowLevels] = useState(false);
  const [userTeam, setUserTeam] = useState(currentUser.team);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const levels = [
    { name: 'Seedling', min: 0, icon: '🌱', color: '#94a3b8' },
    { name: 'Sprout', min: 500, icon: '🌿', color: '#10b981' },
    { name: 'Sapling', min: 1000, icon: '🌳', color: '#059669' },
    { name: 'Tree Hero', min: 2000, icon: '🌲', color: '#047857' },
    { name: 'Forest Guardian', min: 5000, icon: '🛡️', color: '#1e3a8a' },
    { name: 'Eco Legend', min: 10000, icon: '👑', color: '#7e22ce' },
  ];


  return (
    <main className={styles.container}>
      <header className="page-header glass">
        <h1 className="page-title page-title-gradient">Il Tuo Profilo</h1>
      </header>

      <section className={`${styles.profileCard} animate-fade-in`}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            <img src={currentUser.avatarUrl} alt={currentUser.name} className={styles.avatar} />
          </div>
          <div className={styles.mainInfo}>
            <h2 className={styles.name}>{currentUser.name}</h2>
            <div className={styles.badgeRow}>
              <span className={styles.levelBadge}>{currentUser.level}</span>
              <div className={styles.miniBadges}>
                <span className={styles.miniBadge} title="Re del Riciclo">🏆</span>
                <span className={styles.miniBadge} title="Zero Carbon Commuter">🚶</span>
              </div>
            </div>
          </div>
          <div className={styles.scoreHighlight}>
            <span className={styles.scoreLabel}>EcoScore</span>
            <span className={styles.scoreValue}>{currentUser.ecoScore}</span>
            <span className={styles.scoreUnit}>pt</span>
          </div>
        </div>

        <div className={styles.profileActions}>
          <button 
            className={`${styles.viewLevelsBtn} btn-glass btn`}
            onClick={() => setShowLevels(!showLevels)}
          >
            {showLevels ? 'Chiudi Livelli' : 'Progressione Livelli ➔'}
          </button>
          
          <div className={styles.teamAction}>
            {userTeam ? (
              <div className={styles.teamCard}>
                <div className={styles.teamHeader}>
                  <span className={styles.teamIcon}>👥</span>
                  <div className={styles.teamInfo}>
                    <span className={styles.teamName}>{userTeam.name}</span>
                    <span className={styles.teamRank}>#12 in Classifica</span>
                  </div>
                </div>
                <div className={styles.teamStats}>
                  <span>{userTeam.points} pt totali</span>
                  <button 
                    className={styles.leaveTeamBtn}
                    onClick={() => {
                      // Simple toggle for demo or custom UI
                      setUserTeam(null);
                    }}
                  >
                    Abbandona
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.noTeam}>
                <p>Non fai ancora parte di un team.</p>
                <button className={`${styles.createTeamBtn} btn-premium`} onClick={() => setUserTeam({ name: 'Nuovo Team', points: 0 })}>
                  👥 Crea il Tuo Team
                </button>
              </div>
            )}
          </div>
        </div>

        {showLevels && (
          <div className={`${styles.levelsLevels} animate-fade-in`}>
            {levels.map((lvl) => (
              <div 
                key={lvl.name} 
                className={`${styles.levelItem} ${currentUser.level === lvl.name ? styles.currentLvl : ''}`}
              >
                <span className={styles.lvlIcon}>{lvl.icon}</span>
                <div className={styles.lvlInfo}>
                  <span className={styles.lvlName}>{lvl.name}</span>
                  <span className={styles.lvlPoints}>{lvl.min} pt</span>
                </div>
                {currentUser.ecoScore >= lvl.min && <span className={styles.check}>✓</span>}
              </div>
            ))}
          </div>
        )}
      </section>


      <section className={`${styles.statsGrid} animate-fade-in animate-delay-2`}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🌱</span>
          <h3 className={styles.statValue}>{currentUser.stats.co2SavedKg} kg</h3>
          <p className={styles.statLabel}>CO₂ Risparmiata</p>
          <span className={styles.co2Equiv}>{getCO2Equivalent(currentUser.stats.co2SavedKg)}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>♻️</span>
          <h3 className={styles.statValue}>{currentUser.stats.wasteRecycledKg} kg</h3>
          <p className={styles.statLabel}>Rifiuti Riciclati</p>
        </div>
      </section>
      
      <section className={styles.historySection}>
        <h3 className={styles.sectionTitle}>Storico Attività</h3>
        <div className={styles.activityList}>
          {userActivities.map((activity: any, i: number) => {
             const getIcon = (type: string) => {
               switch(type) {
                 case 'energy': return '⚡';
                 case 'recycling': return '♻️';
                 case 'volunteer': return '🤝';
                 case 'circular': return '🔄';
                 case 'mobility': return '🚲';
                 default: return '🌱';
               }
             };
             return (
               <div 
                 key={activity.id} 
                 className={`${styles.activityItem} glass animate-fade-in`}
                 style={{ animationDelay: `${(i + 3) * 0.1}s` }}
               >
                 <div className={styles.activityIcon}>
                   {getIcon(activity.type)}
                 </div>
                 <div className={styles.activityInfo}>
                   <h4 className={styles.activityTitle}>{activity.title}</h4>
                   <p className={styles.activityDate}>
                     {isMounted ? new Date(activity.date).toLocaleDateString('it-IT') : '...'}
                   </p>
                 </div>
                 <div className={styles.activityImpact}>
                   <span className={styles.points}>+{activity.points} pt</span>
                   {activity.co2SavedValue > 0 && (
                     <span className={styles.co2}>-{activity.co2SavedValue}kg CO₂</span>
                   )}
                 </div>
               </div>
             );
          })}
        </div>
      </section>

      <section className={styles.achievements}>
        <h3 className={styles.sectionTitle}>I Tuoi Badge</h3>
        <div className={styles.badgeGrid}>
          <div className={`${styles.badgeFull} glass`}>
            <span className={styles.badgeIcon}>🏆</span>
            <div className={styles.badgeInfo}>
              <strong>Re del Riciclo</strong>
              <span>10 attività di riciclo completate</span>
            </div>
          </div>
          <div className={`${styles.badgeFull} glass`}>
            <span className={styles.badgeIcon}>🚶</span>
            <div className={styles.badgeInfo}>
              <strong>Zero Carbon Commuter</strong>
              <span>5 giorni senza auto</span>
            </div>
          </div>
          <div className={`${styles.badgeFull} ${styles.locked} glass`}>
            <span className={styles.badgeIcon}>⚡</span>
            <div className={styles.badgeInfo}>
              <strong>Energy Ninja</strong>
              <span>Riduci i consumi del 10%</span>
            </div>
          </div>
        </div>
      </section>
      <section className={`${styles.themeSection} glass animate-fade-in`}>
        <div className={styles.themeInfo}>
          <span style={{ fontSize: '1.5rem' }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
          <div>
            <h4>{theme === 'dark' ? 'Modalità Scura' : 'Modalità Chiara'}</h4>
            <p>Personalizza l’aspetto dell’app</p>
          </div>
        </div>
        <button
          className={`${styles.themeToggle} ${theme === 'dark' ? styles.themeDark : ''}`}
          onClick={toggle}
          aria-label="Cambia tema"
        >
          <span className={styles.themeKnob} />
        </button>
      </section>
    </main>
  );
}
