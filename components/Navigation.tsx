'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Feed', path: '/', icon: '🌍' },
    { name: 'Track', path: '/track', icon: '⚡' },
    { name: 'Community', path: '/community', icon: '👥' },
    { name: 'Decalogo', path: '/decalogo', icon: '📜' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];


  return (
    <nav className={styles.navContainer}>
      <div className={styles.brandArea}>
        <img src="/images/brand.png" alt="Piantala! Logo" className={styles.brandLogo} />
        <span className={styles.appName}>Piantala!</span>
      </div>

      <div className={styles.navMenu}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          // Hide Decalogo on mobile bottom bar to keep it 5 items
          const isMobileHidden = item.name === 'Decalogo';

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''} ${isMobileHidden ? styles.mobileHidden : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

