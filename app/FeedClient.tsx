'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { getCO2Equivalent } from '@/lib/helpers';

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'energy': return { icon: '⚡', label: 'Energia' };
    case 'recycling': return { icon: '♻️', label: 'Riciclo' };
    case 'volunteer': return { icon: '🤝', label: 'Volontariato' };
    case 'circular': return { icon: '🔄', label: 'Econ. Circolare' };
    case 'mobility': return { icon: '🚲', label: 'Mobilità' };
    default: return { icon: '🌱', label: 'Azione Eco' };
  }
};

export default function FeedClient({ activities, suggestedUsers }: any) {

  const [isMounted, setIsMounted] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <main className={styles.container}>
      <header className="page-header glass">
        <h1 className="page-title page-title-gradient">Community Feed</h1>
      </header>

      <div className={styles.feed}>
        <div 
          className={`${styles.createPostCard} animate-fade-in`} 
          onClick={() => router.push('/track')}
        >
          <div className={styles.createAvatar}>+</div>
          <div className={styles.createInputMock}>
            Condividi una nuova azione ecosostenibile...
          </div>
        </div>

        {activities.map((activity: any, index: number) => {
          const typeConfig = getTypeConfig(activity.type);
          const isLiked = likedPosts.has(activity.id);

          return (
            <article 
              key={activity.id} 
              className={`${styles.post} animate-fade-in`}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className={styles.postHeader}>
                <div className={styles.userInfo}>
                  <img 
                    src={activity.user?.avatarUrl || 'https://i.pravatar.cc/150?u=anon'} 
                    alt={activity.user?.name || 'User'} 
                    className={styles.avatar} 
                  />
                  <div className={styles.userMeta}>
                    <h3 className={styles.userName}>{activity.user?.name || 'Utente Eroe'}</h3>
                    <span className={styles.postTime}>
                      {isMounted ? new Date(activity.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '...'}
                    </span>
                  </div>
                </div>
                <div className={styles.typeBadge}>
                  {typeConfig.icon} {typeConfig.label}
                </div>
              </div>

              <div className={styles.postContent}>
                <h4 className={styles.activityTitle}>{activity.title}</h4>
                <p className={styles.activityDesc}>{activity.description}</p>
                
                <div className={styles.impactBadge}>
                  <span className={styles.points}>+{activity.points} pt</span>
                  {activity.co2SavedValue > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span className={styles.co2}>• -{activity.co2SavedValue}kg CO₂</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                        {getCO2Equivalent(activity.co2SavedValue)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {activity.imageUrl && (
                <div className={styles.imageContainer}>
                  <img src={activity.imageUrl} alt="Attività" className={styles.postImage} />
                </div>
              )}

              <div className={styles.postActions}>
                <button 
                  className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
                  onClick={() => toggleLike(activity.id)}
                >
                  {isLiked ? '❤️ Apprezzato' : '🤍 Apprezza'}
                </button>
                <button className={styles.actionBtn}>
                  💬 Commenta
                </button>
                <button className={styles.actionBtn}>
                  ↗️ Condividi
                </button>
              </div>
            </article>
          );
        })}

      </div>
    </main>
  );
}
