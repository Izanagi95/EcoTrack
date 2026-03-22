'use client';

import Link from 'next/link';
import styles from './Network.module.css';

export default function NetworkClient() {
  const networkPartners = [
    { name: 'The Black Bag', desc: 'Siamo un\'associazione no profit nata a Genova specializzata nella pulizia di spiagge e fondali marini per salvaguardare i nostri ecosistemi costieri.', icon: '🎒', site: 'https://theblackbag.org' },
    { name: 'Plastic Free', desc: 'Associazione di volontariato impegnata in eventi di CleanUp in tutta Italia, sensibilizzazione nelle scuole e salvataggio delle tartarughe marine.', icon: '🐢', site: 'https://www.plasticfreeonlus.it/' },
    { name: 'Legambiente', desc: 'La più grande associazione ambientalista in Italia, impegnata da decenni in campagne di sensibilizzazione, tutela del territorio ed economia circolare.', icon: '🦢', site: 'https://www.legambiente.it/' },
    { name: 'WWF Genova e Liguria', desc: 'Sezione locale del celebre fondo mondiale, dedicata alla protezione della natura, conservazione della biodiversità locale e monitoraggio specie protette.', icon: '🐼', site: 'https://www.wwf.it/' },
    { name: 'ProNatura Genova', desc: 'Fondata con l\'obiettivo di tutelare flora, fauna e bellezze paesaggistiche del territorio ligure attraverso informazione, prevenzione ed escursioni didattiche.', icon: '🌿', site: 'https://pronatura.it/' },
    { name: 'CEAS', desc: 'I Centri Educazione Ambientale promuovono la sostenibilità nelle scuole, l\'educazione civica e laboratori partecipativi per la riduzione dell\'impatto ambientale.', icon: '📚', site: '#' }
  ];

  return (
    <main className={styles.container}>
      <header className="page-header glass animate-fade-in">
        <Link href="/community" className={styles.backBtn}>← Torna alla Community</Link>
        <h1 className="page-title page-title-gradient" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          🤝 Il nostro Network Locale
        </h1>
        <p className={styles.subtitle}>
          In EcoTrack collaboriamo con le eccellenze del panorama ambientale per portare un impatto reale e misurabile. 
          Unisciti alle loro iniziative per guadagnare EcoScore aggiuntivo!
        </p>
      </header>

      <section className={styles.gridSection}>
        {networkPartners.map((partner, i) => (
          <div key={i} className={`${styles.card} glass animate-fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={styles.iconBox}>{partner.icon}</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{partner.name}</h3>
              <p className={styles.cardDesc}>{partner.desc}</p>
              {partner.site !== '#' && (
                <a href={partner.site} target="_blank" rel="noopener noreferrer" className={styles.siteLink}>
                  Visita il sito
                </a>
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
