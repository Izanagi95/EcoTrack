'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './EventsFilter.module.css';

export default function EventsFilterClient({ initialEvents }: { initialEvents: any[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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




  const types = useMemo(() => ['All', ...Array.from(new Set(initialEvents.map(e => e.type)))], [initialEvents]);
  const cities = useMemo(() => ['All', ...Array.from(new Set(initialEvents.map(e => e.city)))], [initialEvents]);

  const filteredEvents = useMemo(() => {
    return initialEvents.filter(e => {
      const eventDate = new Date(e.date);
      const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                            e.location.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === 'All' || e.type === selectedType;
      const matchesCity = selectedCity === 'All' || e.city === selectedCity;
      
      const matchesDate = (!startDate || eventDate >= new Date(startDate)) && 
                          (!endDate || eventDate <= new Date(endDate));

      return matchesSearch && matchesType && matchesCity && matchesDate;
    });
  }, [initialEvents, search, selectedType, selectedCity, startDate, endDate]);


  return (
    <main className={styles.container}>
      <header className="page-header glass">
        <Link href="/community" className={styles.backBtn}>← Community</Link>
        <h1 className="page-title">Archivio Eventi</h1>
      </header>

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Cerca per titolo o luogo..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label>Tipo di attività</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className={styles.select}>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Città</label>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className={styles.select}>
              {cities.map(c => <option key={String(c)} value={String(c)}>{String(c)}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.dateRangeRow}>
          <div className={styles.filterGroup}>
            <label>Da data</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={styles.dateInput} />
          </div>
          <div className={styles.filterGroup}>
            <label>A data</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={styles.dateInput} />
          </div>
          <button className={`${styles.resetBtn} btn-glass`} onClick={() => { setStartDate(''); setEndDate(''); }}>Reset Date</button>

        </div>

        
        <p className={styles.resultsCount}>
          Trovati {filteredEvents.length} eventi
        </p>
      </div>

      <div className={styles.eventsList}>
        {filteredEvents.map((event, i) => {
          const date = new Date(event.date);
          const day = date.getDate();
          const month = isMounted ? date.toLocaleDateString('it-IT', { month: 'short' }) : '...';
          
          return (
            <div key={event.id} className={`${styles.eventRow} glass animate-fade-in`} style={{ animationDelay: `${(i % 10) * 0.05}s` }}>
              <div className={styles.eventDate}>
                <span className={styles.day}>{day}</span>
                <span className={styles.month}>{month}</span>
              </div>
              <div className={styles.eventMain}>
                <div className={styles.topRow}>
                  <div className={styles.logoBadge}>
                    <span className={styles.partnerLogo}>{getPartnerLogo(event.organizer, event.title)}</span>

                    <span className={`${styles.badge} ${event.organizer === 'Blue District' ? styles.blue : ''}`}>
                      {event.type}
                    </span>
                  </div>
                  <span className={styles.cityLabel}>{event.city}</span>
                </div>

                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.location}>📍 {event.location}</p>
                <div className={styles.footer}>
                  <span className={styles.organizer}>Organizzato da: {event.organizer}</span>
                  <button className={`${styles.joinBtn} btn-premium`}>Dettagli</button>

                </div>
              </div>
            </div>
          );
        })}
        {filteredEvents.length === 0 && (
          <div className={styles.emptyState}>
            🔍 Nessun evento corrisponde ai filtri selezionati.
          </div>
        )}
      </div>
    </main>
  );
}
