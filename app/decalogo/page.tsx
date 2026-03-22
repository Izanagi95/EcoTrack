'use client';

import { useState, useEffect } from 'react';
import styles from './Decalogo.module.css';
import Link from 'next/link';

const decalogoPoints = [
  {
    icon: '♻️',
    title: 'Riduci, Riusa, Ricicla',
    desc: 'La regola d\'oro. Prima di riciclare, prova a ridurre i rifiuti alla fonte e a dare una seconda vita agli oggetti.'
  },
  {
    icon: '🚲',
    title: 'Mobilità Dolce',
    desc: 'Scegli la bici, i piedi o i mezzi pubblici. Ogni chilometro senza auto è un respiro per il pianeta.'
  },
  {
    icon: '⚡',
    title: 'Energia Consapevole',
    desc: 'Spegni le luci inutili, usa lampadine LED e preferisci elettrodomestici ad alta efficienza energetica.'
  },
  {
    icon: '🥗',
    title: 'Alimentazione Green',
    desc: 'Riduci il consumo di carne, scegli prodotti locali, di stagione e possibilmente a km zero.'
  },
  {
    icon: '🥤',
    title: 'Stop alla Plastica',
    desc: 'Elimina l\'uso di plastica monouso. Usa borracce, sacchetti di tela e contenitori riutilizzabili.'
  },
  {
    icon: '💧',
    title: 'Risparmio Idrico',
    desc: 'L\'acqua è preziosa. Chiudi il rubinetto mentre lavi i denti e preferisci la doccia al bagno.'
  },
  {
    icon: '🔄',
    title: 'Economia Circolare',
    desc: 'Ripara ciò che è rotto prima di sostituirlo. Sostieni il mercato dell\'usato e del ricondizionato.'
  },
  {
    icon: '📧',
    title: 'Digital Clean-up',
    desc: 'Anche il digitale inquina. Cancella le email inutili e limita il cloud per ridurre il consumo dei server.'
  },
  {
    icon: '👕',
    title: 'Moda Sostenibile',
    desc: 'Scegli abiti di qualità che durino nel tempo. Preferisci fibre naturali e marchi etici.'
  },
  {
    icon: '🤝',
    title: 'Comunità & Educazione',
    desc: 'Condividi le tue buone pratiche. Una community informata è il motore del cambiamento reale.'
  }
];

export default function DecalogoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className={styles.container}>
      <header className={`${styles.header} glass animate-fade-in`}>
        <Link href="/dashboard" className={styles.backBtn}>← Torna alla Dashboard</Link>
        <h1 className={styles.title}>Decalogo della Sostenibilità</h1>
        <p className={styles.subtitle}>10 passi quotidiani per fare la differenza, un'azione alla volta.</p>
      </header>

      <div className={styles.grid}>
        {decalogoPoints.map((point, index) => (
          <div 
            key={index} 
            className={`${styles.card} glass animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>{point.icon}</span>
              <span className={styles.number}>{index + 1}</span>
            </div>
            <div className={styles.content}>
              <h2 className={styles.pointTitle}>{point.title}</h2>
              <p className={styles.pointDesc}>{point.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <footer className={`${styles.footer} glass animate-fade-in`}>
        <p>Ogni grande cambiamento inizia da un piccolo gesto. Grazie per essere parte della nostra community!</p>
        <Link href="/track" className="btn-premium">Inizia a Tracciare</Link>
      </footer>
    </main>
  );
}
