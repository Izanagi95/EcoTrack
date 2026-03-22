'use client';

import { useState, useEffect } from 'react';
import styles from './Profile.module.css';

export default function ProfileClient({ currentUser, userActivities }: any) {
  const [isMounted, setIsMounted] = useState(false);

  const [showLevels, setShowLevels] = useState(false);

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
        <h1 className="page-title">Il Tuo Profilo</h1>
      </header>

      <section className={styles.profileCard}>
        <div className={styles.avatarWrapper}>
          <img src={currentUser.avatarUrl} alt={currentUser.name} className={styles.avatar} />
        </div>
        <h2 className={styles.name}>{currentUser.name}</h2>
        <span className={styles.levelBadge}>{currentUser.level}</span>
        
        <button 
          className={`${styles.viewLevelsBtn} btn-glass btn`}
          onClick={() => setShowLevels(!showLevels)}
        >
          {showLevels ? 'Chiudi Livelli' : 'Scopri tutti i Livelli ➔'}
        </button>

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
        
        <div className={styles.ecoScoreBox}>
          <p className={styles.ecoScoreLabel}>EcoScore Totale</p>
          <p className={styles.ecoScoreValue}>{currentUser.ecoScore} <span>pt</span></p>
        </div>
      </section>


      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🌱</span>
          <h3 className={styles.statValue}>{currentUser.stats.co2SavedKg} kg</h3>
          <p className={styles.statLabel}>CO₂ Risparmiata</p>
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
          {userActivities.map((activity: any) => (
            <div key={activity.id} className={`${styles.activityItem} glass animate-fade-in`}>
              <div className={styles.activityIcon}>
                {activity.type === 'energy' ? '⚡' : activity.type === 'recycling' ? '♻️' : '🤝'}
              </div>
              <div className={styles.activityInfo}>
                <h4 className={styles.activityTitle}>{activity.title}</h4>
                <p className={styles.activityDate}>
                  {isMounted ? new Date(activity.date).toLocaleDateString('it-IT') : '...'}
                </p>
              </div>
              <div className={styles.activityImpact}>
                <span className={styles.points}>+{activity.points} pt</span>
                {activity.co2SavedValue && (
                  <span className={styles.co2}>-{activity.co2SavedValue}kg CO₂</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.achievements}>
        <h3 className={styles.sectionTitle}>Badge Recenti</h3>
        <div className={styles.badgeList}>
          <div className={`${styles.badge} glass`}>🏆 Re del Riciclo</div>
          <div className={`${styles.badge} glass`}>🚶 Zero Carbon Commuter</div>
        </div>
      </section>
    </main>
  );
}
