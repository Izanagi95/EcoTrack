'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';


type ActivityFilter = 'all' | 'energy' | 'recycling' | 'volunteer';

export default function DashboardClient({ currentUser, userActivities, userConsumptions, weeklyImpact, nextActions, stepHistory }: any) {

  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState<ActivityFilter>('all');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nextLevelScore = 2000;
  const progress = (currentUser.ecoScore / nextLevelScore) * 100;

  const filteredActivities = userActivities.filter(
    (act: any) => filter === 'all' || act.type === filter
  );

  // Group and process consumptions for trends
  const consumptionTrends = useMemo(() => {
    if (!userConsumptions || userConsumptions.length === 0) return null;
    
    // Sort by date (desc)
    const sorted = [...userConsumptions].sort((a, b) => 
      new Date(b.period).getTime() - new Date(a.period).getTime()
    );

    const luce = sorted.filter(c => c.type === 'Luce');
    const gas = sorted.filter(c => c.type === 'Gas');

    const getTrend = (list: any[]) => {
      if (list.length < 2) return null;
      const current = list[0].value;
      const previous = list[1].value;
      const diff = ((current - previous) / previous) * 100;
      return { 
        current, 
        previous, 
        diff: Math.round(diff), 
        isUp: diff > 0,
        unit: list[0].type === 'Luce' ? 'kWh' : 'smc'
      };
    };

    return {
      luceTrend: getTrend(luce),
      gasTrend: getTrend(gas),
      luceHistory: luce.slice(0, 4).reverse(), // Last 4 for chart
      gasHistory: gas.slice(0, 4).reverse()
    };
  }, [userConsumptions]);



  return (
    <main className={styles.container}>
      <header className="page-header glass">
        <h1 className="page-title">Dashboard</h1>
      </header>

      <section className={styles.summaryRow}>
        <div className={`${styles.compactCard} glass`}>
          <div className={styles.compactMain}>
            <span className={styles.compactLabel}>Livello Attuale</span>
            <h2 className={styles.compactValue}>{currentUser.level}</h2>
          </div>
          <div className={styles.compactProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>
            <div className={styles.progressText}>
              <span>{currentUser.ecoScore} pt</span>
              <span>Obiettivo: {nextLevelScore} pt</span>
            </div>
          </div>
        </div>
        
        <div className={`${styles.statsHighlight} glass`}>
          <div className={styles.statMini}>
            <span className={styles.statIcon}>🌱</span>
            <div className={styles.statText}>
              <span className={styles.statVal}>32.5kg</span>
              <span className={styles.statLab}>CO₂ Totale</span>
            </div>
          </div>
          <div className={styles.statMini}>
            <span className={styles.statIcon}>🏆</span>
            <div className={styles.statText}>
              <span className={styles.statVal}>#4</span>
              <span className={styles.statLab}>Classifica</span>
            </div>
          </div>
        </div>
      </section>

      
      <div className={styles.mainGrid}>

        {/* TIER 1: HIGH LEVEL IMPACT (Full Width) */}
        <section className={`${styles.impactSectionFull} glass animate-fade-in`}>
          <div className={styles.areaHeader}>
            <h3 className={styles.areaTitle}>📊 Impatto Settimanale (kg CO₂)</h3>
            <div className={styles.impactLegend}>
              <span className={styles.legEnergy}>Energia</span>
              <span className={styles.legTransport}>Mobilità</span>
              <span className={styles.legCircular}>Circolare</span>
            </div>
          </div>
          <div className={styles.stackedChartLarge}>
            {weeklyImpact.map((data: any) => {
              const total = data.energy + data.transport + data.circular;
              return (
                <div key={data.day} className={styles.barGroupLarge}>
                  <div className={styles.barStackImpact}>
                    <div className={styles.segmentEnergy} style={{ height: `${data.energy * 30}px` }} title={`Energia: ${data.energy}kg`}></div>
                    <div className={styles.segmentTransport} style={{ height: `${data.transport * 30}px` }} title={`Mobilità: ${data.transport}kg`}></div>
                    <div className={styles.segmentCircular} style={{ height: `${data.circular * 30}px` }} title={`Circolarità: ${data.circular}kg`}></div>
                    <span className={styles.barTooltip}>{total.toFixed(1)}kg</span>
                  </div>
                  <span className={styles.dayLabelLarge}>{data.day}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* TIER 2: AUTOMATED STATS BAR (Full Width) */}
        <section className={`${styles.statsBarContainer} glass animate-fade-in`}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>👣</span>
            <div className={styles.statInfo}>
              <strong>8.432</strong>
              <span>Passi Oggi</span>
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>🌍</span>
            <div className={styles.statInfo}>
              <strong>1.2kg</strong>
              <span>CO₂ Salvata</span>
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>🕒</span>
            <div className={styles.statInfo}>
              <strong>45m</strong>
              <span>Attività</span>
            </div>
          </div>
        </section>

        {/* TIER 3: STEP HISTORY & CONSUMPTION GRID */}
        <div className={styles.secondaryGrid}>
          <section className={`${styles.stepHistoryCard} glass animate-fade-in`}>
            <div className={styles.areaHeader}>
              <h3 className={styles.areaTitle}>👣 Storico Passi Settimanale</h3>
            </div>
            <div className={styles.stepChart}>
              {stepHistory.map((data: any, i: number) => (
                <div key={data.day} className={styles.stepBarGroup}>
                  <div className={styles.stepBar} style={{ height: `${(data.steps / 12000) * 85}px`, animationDelay: `${i * 0.05}s` }}>
                    <span className={styles.stepTooltip}>{data.steps}</span>
                  </div>
                  <span className={styles.stepDayLabel}>{data.day}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={`${styles.miniConsumptionCard} glass animate-fade-in`}>
            <h3 className={styles.areaTitle}>⚡ Trend Consumi</h3>
            {!consumptionTrends ? (
              <p className={styles.emptySmall}>Dati non disponibili</p>
            ) : (
              <div className={styles.miniTrends}>
                <div className={styles.trendBubbles}>
                  {consumptionTrends.luceTrend && (
                    <div className={`${styles.trendBubble} ${consumptionTrends.luceTrend.isUp ? styles.up : styles.down}`}>
                      <span>⚡ Luce</span>
                      <strong>{consumptionTrends.luceTrend.diff > 0 ? '+' : ''}{consumptionTrends.luceTrend.diff}%</strong>
                    </div>
                  )}
                  {consumptionTrends.gasTrend && (
                    <div className={`${styles.trendBubble} ${consumptionTrends.gasTrend.isUp ? styles.up : styles.down}`}>
                      <span>🔥 Gas</span>
                      <strong>{consumptionTrends.gasTrend.diff > 0 ? '+' : ''}{consumptionTrends.gasTrend.diff}%</strong>
                    </div>
                  )}
                </div>
                
                <div className={styles.microChart}>
                  {consumptionTrends.luceHistory.map((c: any) => {
                    const gasMatch = consumptionTrends.gasHistory.find((g: any) => g.period === c.period);
                    return (
                      <div key={c.id} className={styles.microBarGroup}>
                        <div className={styles.microBarStack}>
                          <div className={styles.microBarLuce} style={{ height: `${(c.value / 400) * 60}px` }} title={`Luce: ${c.value}kWh`}></div>
                          {gasMatch && (
                            <div className={styles.microBarGas} style={{ height: `${(gasMatch.value / 150) * 60}px` }} title={`Gas: ${gasMatch.value}smc`}></div>
                          )}
                        </div>
                        <span className={styles.microDate}>
                          {isMounted ? new Date(c.period).toLocaleDateString('it-IT', { month: 'short' }) : '...'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            )}
          </section>
        </div>


        {/* BOTTOM ROW: HISTORY & SUGGESTIONS */}
        <div className={styles.bottomGrid}>
          <section className={`${styles.historyCard} glass animate-fade-in`}>
            <div className={styles.areaHeader}>
              <h3 className={styles.areaTitle}>📋 Storico Attività</h3>
              <div className={styles.filterPills}>
                {['all', 'energy', 'recycling', 'volunteer'].map((f: any) => (
                  <button 
                    key={f} 
                    className={`${styles.filterPill} ${filter === f ? styles.activePill : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'Tutte' : f === 'energy' ? '⚡' : f === 'recycling' ? '♻️' : '🤝'}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.activityScroll}>
              {filteredActivities.length === 0 ? (
                <p className={styles.emptySmall}>Nessuna attività.</p>
              ) : (
                filteredActivities.map((activity: any, index: number) => (
                  <div key={activity.id} className={styles.activityItemRow} style={{ animationDelay: `${index * 0.05}s` }}>

                    <div className={styles.actIcon}>{activity.type === 'energy' ? '⚡' : activity.type === 'recycling' ? '♻️' : '🤝'}</div>
                    <div className={styles.actInfo}>
                      <span className={styles.actTitle}>{activity.title}</span>
                      <span className={styles.actDate}>{isMounted ? new Date(activity.date).toLocaleDateString('it-IT') : '...'}</span>
                    </div>
                    <div className={styles.actPoints}>+{activity.points}</div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={`${styles.suggestionCard} glass animate-fade-in`}>
            <h3 className={styles.areaTitle}>🎯 Obiettivi</h3>
            <div className={styles.suggList}>
              {nextActions.map((action: any) => (
                <div key={action.id} className={styles.suggItem}>
                  <span className={styles.suggIcon}>{action.icon}</span>
                  <div className={styles.suggInfo}>
                    <p>{action.title}</p>
                    <span>+{action.points} pt</span>
                  </div>
                  <Link href="/track" className={styles.suggLink}>➔</Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

