'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';
import { getCO2Equivalent } from '@/lib/helpers';

type ActivityFilter = 'all' | 'energy' | 'recycling' | 'volunteer';
type TimePeriod = 'day' | 'week' | 'month';

export default function DashboardClient({
  currentUser,
  userActivities,
  dailyImpact,
  weeklyImpact,
  monthlyImpact,
  dailySteps,
  weeklySteps,
  monthlySteps,
  dailyBudget,
  weeklyFasce,
  userConsumptions,
  nextActions,
}: any) {

  const [isMounted, setIsMounted] = useState(false);
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const [period, setPeriod] = useState<TimePeriod>('week');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nextLevelScore = 2000;
  const progress = (currentUser.ecoScore / nextLevelScore) * 100;

  // Select impact & steps data based on period
  const impactData = period === 'day' ? dailyImpact : period === 'week' ? weeklyImpact : monthlyImpact;
  const stepsData = period === 'day' ? dailySteps : period === 'week' ? weeklySteps : monthlySteps;

  const impactChartTitle =
    period === 'day' ? '📊 CO₂ Risparmiata Oggi' :
    period === 'week' ? '📊 CO₂ Risparmiata in Settimana' :
    '📊 CO₂ Risparmiata nel Mese';

  const stepsChartTitle =
    period === 'day' ? '👣 Passi per Fascia Oraria' :
    period === 'week' ? '👣 Storico Passi Settimanale' :
    '👣 Passi per Settimana';

  // Max value for normalised chart heights
  const impactMax = useMemo(() => {
    if (!impactData?.length) return 1;
    return Math.max(...impactData.map((d: any) => d.energy + d.transport + d.circular), 1);
  }, [impactData]);

  const stepsMax = useMemo(() => {
    if (!stepsData?.length) return 1;
    return Math.max(...stepsData.map((d: any) => d.steps), 1);
  }, [stepsData]);

  // Filter activities based on period
  const filteredActivities = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();

    if (period === 'day') {
      cutoff.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      cutoff.setDate(now.getDate() - 7);
      cutoff.setHours(0, 0, 0, 0);
    } else {
      cutoff.setDate(now.getDate() - 30);
      cutoff.setHours(0, 0, 0, 0);
    }

    return userActivities.filter((act: any) => {
      const actDate = new Date(act.date);
      const matchesFilter = filter === 'all' || act.type === filter;
      const isInPeriod = actDate >= cutoff;
      return matchesFilter && isInPeriod;
    });
  }, [userActivities, filter, period]);

  // Consumption trends
  const consumptionTrends = useMemo(() => {
    if (period === 'month') {
      if (!userConsumptions || userConsumptions.length === 0) return null;
      const sorted = [...userConsumptions].sort((a, b) =>
        new Date(b.period).getTime() - new Date(a.period).getTime()
      );
      const luce = sorted.filter(c => c.type === 'Luce');
      const gas = sorted.filter(c => c.type === 'Gas');
      const maxVal = Math.max(...userConsumptions.map((c: any) => c.value), 1);
      return {
        type: 'monthly',
        history: luce.slice(0, 4).map(l => ({
          ...l,
          gasValue: gas.find(g => g.period === l.period)?.value || 0
        })).reverse(),
        maxVal
      };
    } else if (period === 'week') {
      return {
        type: 'weekly',
        data: weeklyFasce
      };
    } else {
      return {
        type: 'daily',
        data: dailyBudget
      };
    }
  }, [userConsumptions, dailyBudget, weeklyFasce, period]);

  // Period-aware quick stats
  const periodStats = useMemo(() => {
    const totalCO2 = impactData?.reduce((acc: number, d: any) => acc + d.energy + d.transport + d.circular, 0) ?? 0;
    const totalSteps = stepsData?.reduce((acc: number, d: any) => acc + d.steps, 0) ?? 0;
    const label = period === 'day' ? 'Oggi' : period === 'week' ? 'Settimana' : 'Mese';
    return { totalCO2: totalCO2.toFixed(1), totalSteps: totalSteps.toLocaleString('it-IT'), label };
  }, [impactData, stepsData, period]);

  const periodLabels: Record<TimePeriod, string> = {
    day: 'Giornaliero',
    week: 'Settimanale',
    month: 'Mensile',
  };

  return (
    <main className={styles.container}>
      <header className="page-header glass">
        <h1 className="page-title">Dashboard</h1>
        {/* Period Switcher */}
        <div className={styles.periodSwitcher}>
          {(['day', 'week', 'month'] as TimePeriod[]).map((p) => (
            <button
              key={p}
              className={`${styles.periodBtn} ${period === p ? styles.periodBtnActive : ''}`}
              onClick={() => setPeriod(p)}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
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
              <span>{isMounted ? currentUser.ecoScore.toLocaleString('it-IT') : '--'} pt</span>
              <span>Obiettivo: {nextLevelScore} pt</span>
            </div>
          </div>
        </div>

        <div className={`${styles.statsHighlight} glass`}>
          <div className={styles.statMini}>
            <span className={styles.statIcon}>🌱</span>
            <div className={styles.statText}>
              <span className={styles.statVal}>{isMounted ? periodStats.totalCO2 : '--'}kg</span>
              <span className={styles.statLab}>CO₂ {periodStats.label}</span>
            </div>
          </div>
          <div className={styles.statMini}>
            <span className={styles.statIcon}>👣</span>
            <div className={styles.statText}>
              <span className={styles.statVal}>{isMounted ? periodStats.totalSteps : '--'}</span>
              <span className={styles.statLab}>Passi {periodStats.label}</span>
            </div>
          </div>
        </div>
      </section>


      <div className={styles.mainGrid}>

        {/* TIER 1: IMPACT CHART (Full Width) */}
        <section className={`${styles.impactSectionFull} glass animate-fade-in`}>
          <div className={styles.areaHeader}>
            <h3 className={styles.areaTitle}>{impactChartTitle}</h3>
            <div className={styles.impactLegend}>
              <span className={styles.legEnergy}>Energia</span>
              <span className={styles.legTransport}>Mobilità</span>
              <span className={styles.legCircular}>Circolare</span>
            </div>
          </div>
          <div className={styles.stackedChartLarge}>
            <div className={styles.chartAreaWrapper}>
              <div className={styles.yAxis}>
                <span>{isMounted ? impactMax.toLocaleString('it-IT', { maximumFractionDigits: 1 }) : '--'}</span>
                <span>{isMounted ? (impactMax / 2).toLocaleString('it-IT', { maximumFractionDigits: 1 }) : '--'}</span>
                <span>0</span>
              </div>
              <div className={styles.chartArea}>
                {impactData.map((d: any) => {
                  const total = d.energy + d.transport + d.circular;
                  const chartHeight = 150; // px available for bars
                  const eH = (d.energy / impactMax) * chartHeight;
                  const tH = (d.transport / impactMax) * chartHeight;
                  const cH = (d.circular / impactMax) * chartHeight;

                  return (
                    <div key={d.day} className={styles.barGroup}>
                      <div className={styles.barStack}>
                        <div className={styles.segmentEnergy} style={{ height: `${eH}px` }} title={`Energia: ${d.energy}kg`}></div>
                        <div className={styles.segmentTransport} style={{ height: `${tH}px` }} title={`Mobilità: ${d.transport}kg`}></div>
                        <div className={styles.segmentCircular} style={{ height: `${cH}px` }} title={`Circolarità: ${d.circular}kg`}></div>
                        <span className={styles.barTooltip}>{isMounted ? `${total.toFixed(1)}kg` : ''}</span>
                      </div>
                      <span className={styles.barLabel}>{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* TIER 2: STATS BAR */}
        <section className={`${styles.statsBarContainer} glass animate-fade-in`}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>👣</span>
            <div className={styles.statInfo}>
              <strong>{isMounted ? periodStats.totalSteps : '--'}</strong>
              <span>Passi {periodStats.label}</span>
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>🌍</span>
            <div className={styles.statInfo}>
              <strong>{isMounted ? `${periodStats.totalCO2}kg` : '--'}</strong>
              <span>CO₂ {periodStats.label}</span>
              {isMounted && parseFloat(periodStats.totalCO2) > 0 && (
                <span className={styles.co2Equiv}>{getCO2Equivalent(parseFloat(periodStats.totalCO2))}</span>
              )}
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>📋</span>
            <div className={styles.statInfo}>
              <strong>{filteredActivities.length}</strong>
              <span>Attività {periodStats.label}</span>
            </div>
          </div>
        </section>

        {/* TIER 3: STEP HISTORY & CONSUMPTION GRID */}
        <div className={styles.secondaryGrid}>
          <section className={`${styles.stepHistoryCard} glass animate-fade-in`}>
            <div className={styles.areaHeader}>
              <h3 className={styles.areaTitle}>{stepsChartTitle}</h3>
            </div>
            <div className={styles.chartAreaWrapper}>
              <div className={styles.yAxis}>
                <span>{isMounted ? stepsMax.toLocaleString('it-IT') : '--'}</span>
                <span>{isMounted ? Math.round(stepsMax / 2).toLocaleString('it-IT') : '--'}</span>
                <span>0</span>
              </div>
              <div className={styles.chartArea}>
                {stepsData.map((d: any, i: number) => {
                  const chartHeight = 150; // px available for bars
                  const h = (d.steps / stepsMax) * chartHeight;
                  return (
                    <div key={d.day} className={styles.barGroup}>
                      <div
                        className={styles.barSingle}
                        style={{ height: `${h}px`, animationDelay: `${i * 0.05}s` }}
                      >
                        <span className={styles.stepTooltip}>{isMounted ? d.steps.toLocaleString('it-IT') : ''}</span>
                      </div>
                      <span className={styles.barLabel}>{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className={`${styles.miniConsumptionCard} glass animate-fade-in`}>
            <div className={styles.areaHeader}>
              <h3 className={styles.areaTitle}>
                {period === 'day' ? '🎯 Budget Odierno' : period === 'week' ? '📊 Fasce Orarie' : '⚡ Trend Mensile'}
              </h3>
            </div>
            
            {!consumptionTrends ? (
              <p className={styles.emptySmall}>Dati non disponibili</p>
            ) : consumptionTrends.type === 'daily' ? (
              <div className={styles.budgetView}>
                <div className={styles.donutContainer}>
                  <svg viewBox="0 0 36 36" className={styles.donut}>
                    <path className={styles.donutRing} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path 
                      className={styles.donutSegment} 
                      strokeDasharray={`${(consumptionTrends.data.used / consumptionTrends.data.total) * 100}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    />
                    <text x="18" y="21" className={styles.donutText}>
                      {isMounted ? `${Math.round((consumptionTrends.data.used / consumptionTrends.data.total) * 100)}%` : ''}
                    </text>
                  </svg>
                </div>
                <div className={styles.budgetText}>
                  <strong>{consumptionTrends.data.used} / {consumptionTrends.data.total} {consumptionTrends.data.unit}</strong>
                  <span>Consumati oggi (stima)</span>
                </div>
              </div>
            ) : consumptionTrends.type === 'weekly' ? (
              <div className={styles.fasceView}>
                <div className={styles.fasceItem}>
                  <div className={styles.fasceLabel}>
                    <span>⚡ Luce</span>
                    <div className={styles.fasceLegend}>
                      <span title="F1 (Peak)"></span>
                      <span title="F2 (Mid)"></span>
                      <span title="F3 (Off)"></span>
                    </div>
                  </div>
                  <div className={styles.fasceBar}>
                    <div style={{ width: `${consumptionTrends.data.lucedistribution.f1}%`, background: '#3b82f6' }} title="F1"></div>
                    <div style={{ width: `${consumptionTrends.data.lucedistribution.f2}%`, background: '#10b981' }} title="F2"></div>
                    <div style={{ width: `${consumptionTrends.data.lucedistribution.f3}%`, background: '#f59e0b' }} title="F3"></div>
                  </div>
                </div>
                <div className={styles.fasceItem}>
                  <div className={styles.fasceLabel}><span>🔥 Gas</span></div>
                  <div className={styles.fasceBar}>
                    <div style={{ width: `${consumptionTrends.data.gasdistribution.f1}%`, background: '#3b82f6' }}></div>
                    <div style={{ width: `${consumptionTrends.data.gasdistribution.f2}%`, background: '#10b981' }}></div>
                    <div style={{ width: `${consumptionTrends.data.gasdistribution.f3}%`, background: '#f59e0b' }}></div>
                  </div>
                </div>
                <p className={styles.fasceHint}>Distribuzione per fasce F1/F2/F3</p>
              </div>
            ) : (
              <div className={styles.miniTrends}>
                <div className={styles.microChartWrapper}>
                  <div className={styles.microYAxis}>
                    <span>{(consumptionTrends as any).maxVal}</span>
                    <span>0</span>
                  </div>
                  <div className={styles.microChart}>
                    {(consumptionTrends as any).history?.map((c: any) => {
                      const h = (c.value / (consumptionTrends as any).maxVal) * 45;
                      const gh = (c.gasValue / (consumptionTrends as any).maxVal) * 45;
                      return (
                        <div key={c.id} className={styles.microBarGroup}>
                          <div className={styles.microBarStack}>
                            <div className={styles.microBarLuce} style={{ height: `${h}px` }} title={`Luce: ${c.value}kWh`}></div>
                            <div className={styles.microBarGas} style={{ height: `${gh}px` }} title={`Gas: ${c.gasValue}smc`}></div>
                          </div>
                          <span className={styles.microDate}>
                            {isMounted ? new Date(c.period).toLocaleDateString('it-IT', { month: 'short' }) : '...'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            <p className={styles.consumptionNote}>* I dati delle bollette si riferiscono ai consumi del mese precedente</p>
          </section>
        </div>


        {/* BOTTOM ROW: HISTORY & SUGGESTIONS */}
        <div className={styles.bottomGrid}>
          <section className={`${styles.historyCard} glass animate-fade-in`}>
            <div className={styles.areaHeader}>
              <h3 className={styles.areaTitle}>
                📋 {period === 'day' ? 'Attività Oggi' : period === 'week' ? 'Storico Settimanale' : 'Storico Mensile'}
              </h3>
              <div className={styles.filterPills}>
                {(['all', 'energy', 'recycling', 'volunteer'] as ActivityFilter[]).map((f) => (
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
                <p className={styles.emptySmall}>Nessuna attività nel periodo selezionato.</p>
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
