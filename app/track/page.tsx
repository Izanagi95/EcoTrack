'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Track.module.css';

import { addActivity, addConsumption } from '@/lib/actions';
import { analyzeImageWithAI } from '@/lib/gemini';


type TrackingType = 'energy' | 'recycling' | 'volunteer' | 'circular' | 'mobility' | null;
type VolunteerMode = 'manual' | 'scan' | 'show';

export default function TrackPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <TrackContent />
    </Suspense>
  );
}

function TrackContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') as TrackingType;
  
  const [selectedType, setSelectedType] = useState<TrackingType>(null);
  const [volunteerMode, setVolunteerMode] = useState<VolunteerMode>('manual');

  const [isSuccess, setIsSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activityPhoto, setActivityPhoto] = useState<string | null>(null);


  useEffect(() => {
    setIsMounted(true);
    if (typeParam) {
      setSelectedType(typeParam);
    }
  }, [typeParam]);


  
  // AI State
  const [file, setFile] = useState<File | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const trackingOptions = [
    { id: 'energy' as const, title: 'Energia Domestica', icon: '⚡', desc: 'Carica bollette e riduci i consumi con AI' },
    { id: 'recycling' as const, title: 'Riciclo Certificato', icon: '♻️', desc: 'Scannerizza QR al centro raccolta' },
    { id: 'volunteer' as const, title: 'Volontariato e attività', icon: '🤝', desc: 'Partecipa a eventi e valida con QR' },
    { id: 'circular' as const, title: 'Economia Circolare', icon: '🔄', desc: 'Visita centri riuso o mercatini' },
    { id: 'mobility' as const, title: 'Bici e Monopattini', icon: '🚲', desc: 'Registra percorsi in bici o monopattino elettrico' }

  ];

  const currentOption = trackingOptions.find(o => o.id === selectedType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setAiAnalyzing(true);
    setAiResult(null);
    
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await analyzeImageWithAI(base64, selectedFile.name, selectedType || 'energy');
        if (res.success) {
          setAiResult(res.data);
        }

      } catch (err) {
        console.error(err);
        alert("Errore durante l'analisi della bolletta.");
      } finally {
        setAiAnalyzing(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleActivityPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setActivityPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !currentOption) return;
    
    setIsSubmitting(true);
    
    let points = 50;
    let co2 = 5.0;
    let title = currentOption.title;
    let desc = 'Azione registrata tramite app EcoTrack.';
    
    if (selectedType === 'energy') {
      if (!aiResult) {
        alert("Carica la bolletta prima di procedere.");
        setIsSubmitting(false);
        return;
      }
      points = aiResult.earnedPoints;
      co2 = aiResult.estimatedCo2Saved;
      title = `Bolletta ${aiResult.type} analizzata`;
      desc = aiResult.insights;
      
      try {
        await addConsumption({
          type: aiResult.type,
          value: aiResult.consumptionValue,
          cost: aiResult.costEur,
          period: new Date()
        });
      } catch (e) {
        console.error("Errore salvataggio consumo:", e);
      }
    } else if ((selectedType === 'circular' || selectedType === 'mobility') && aiResult) {
       points = aiResult.earnedPoints;
       co2 = aiResult.estimatedCo2Saved;
       title = aiResult.type;
       desc = aiResult.insights;
    } else if (selectedType === 'volunteer') {
      points = 200;
      co2 = 0;
      title = 'Attività di Volontariato Plastic Free';
      desc = 'Validata tramite scansione QR sul campo.';
    }


    try {
      await addActivity({
        type: selectedType,
        title,
        description: desc,
        points,
        co2SavedValue: co2,
      });
      setIsSuccess(true);
      setFile(null);
      setAiResult(null);
    } catch (err) {
      console.error(err);
      alert("Errore di connessione al database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSuccess) {
      timeout = setTimeout(() => {
        setIsSuccess(false);
        setSelectedType(null);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isSuccess]);

  return (
    <main className={styles.container}>
      {isSuccess ? (
        <div className={`${styles.successScreen} animate-fade-in`} key="success">
          <div className={styles.successIcon}>🎉</div>
          <h2 className={styles.successTitle}>Azione Registrata!</h2>
          <p className={styles.successDesc}>Ottimo lavoro, azione salvata con successo nel tuo storico.</p>
          <button onClick={() => { setIsSuccess(false); setSelectedType(null); }} className={styles.primaryButton}>
            Torna Indietro
          </button>
        </div>
      ) : selectedType ? (
        <div className="animate-fade-in" key="form">
          <header className="page-header glass">
            <button onClick={() => { setSelectedType(null); setAiResult(null); setFile(null); }} className={styles.backButton}>←</button>
            <h1 className="page-title">{currentOption?.title}</h1>
          </header>
          
          <form className={styles.form} onSubmit={handleTrackSubmit}>
            {selectedType === 'energy' && (
              <div className={styles.fieldGroup}>
                <p className={styles.formHint}>Usa l'intelligenza artificiale per estrarre in automatico i consumi dalla tua bolletta.</p>
                <label>Carica PDF/Foto Bolletta</label>
                
                {!file && !aiAnalyzing && (
                  <div className={styles.uploadBox}>
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={handleFileUpload} 
                      className={styles.fileInput} 
                      id="billUpload"
                    />
                    <label htmlFor="billUpload" className={styles.uploadLabel}>
                      📸 Scatta o Scegli Bolletta
                    </label>
                  </div>
                )}

                {aiAnalyzing && (
                  <div className={styles.aiAnalyzing}>
                    <div className={styles.spinner}></div>
                    <p>Gemini sta leggendo la tua bolletta...</p>
                  </div>
                )}

                {aiResult && (
                  <div className={`${styles.aiResultBox} glass animate-fade-in`}>
                    <h3 className={styles.aiResultTitle}>✨ Dati Estratti da Gemini</h3>
                    <div className={styles.aiResultGrid}>
                      <div className={styles.aiStat}>
                        <span>Fornitore</span>
                        <strong>{aiResult.provider}</strong>
                      </div>
                      <div className={styles.aiStat}>
                        <span>Tipo</span>
                        <strong>{aiResult.type}</strong>
                      </div>
                      <div className={styles.aiStat}>
                        <span>Consumo</span>
                        <strong>{aiResult.consumptionValue} {aiResult.unit}</strong>
                      </div>
                      <div className={styles.aiStat}>
                        <span>Costo</span>
                        <strong>€{aiResult.costEur}</strong>
                      </div>
                    </div>
                    <div className={styles.aiInsights}>
                      <p><strong>💡 Il parere dell'AI:</strong> {aiResult.insights}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {selectedType === 'recycling' && (
              <div className={styles.fieldGroup}>
                <p className={styles.formHint}>Inquadra il QR Code presente sull'isola ecologica o sulla tessera AMIU.</p>
                <div className={styles.qrScannerMock}>
                  <div className={styles.qrFrame} />
                  <p>In attesa della fotocamera...</p>
                </div>
                <label>Inserimento manuale codice (opzionale)</label>
                <input type="text" placeholder="es. AMIU-12345" className={styles.input} />
              </div>
            )}

            {selectedType === 'volunteer' && (
              <div className={styles.fieldGroup}>
                <p className={styles.formHint}>Seleziona come vuoi validare la tua partecipazione all'evento.</p>
                
                <div className={styles.modeTabs}>
                  <button type="button" onClick={() => setVolunteerMode('manual')} className={volunteerMode === 'manual' ? styles.activeTab : ''}>Codice</button>
                  <button type="button" onClick={() => setVolunteerMode('scan')} className={volunteerMode === 'scan' ? styles.activeTab : ''}>Scan QR</button>
                  <button type="button" onClick={() => setVolunteerMode('show')} className={volunteerMode === 'show' ? styles.activeTab : ''}>Mio QR</button>
                </div>

                {volunteerMode === 'manual' && (
                  <div className="animate-fade-in" key="manual">
                    <label>Codice Validazione Evento</label>
                    <input type="text" placeholder="Richiedi allo staff" className={styles.input} required />
                  </div>
                )}

                {volunteerMode === 'scan' && (
                  <div className={`${styles.qrScannerMock} animate-fade-in`} key="scan">
                    <div className={styles.qrFrame} />
                    <p>Inquadra il QR Code dell'organizzatore</p>
                  </div>
                )}

                {volunteerMode === 'show' && (
                  <div className={`${styles.myQrBox} glass animate-fade-in`} key="show">

                    <div className={styles.mockQrImage}>
                      {/* Using a generated QR style background */}
                      <div className={styles.qrPattern} />
                    </div>
                    <p className={styles.qrId}>ID: ECO-7429-UX</p>
                    <p className={styles.qrHint}>Mostra questo codice allo staff per la scansione</p>
                  </div>
                )}
                
                <label>Aggiungi una foto dell'attività (opzionale)</label>
                <div className={styles.uploadBox}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleActivityPhoto} 
                    className={styles.fileInput} 
                    id="activityPhoto"
                  />
                  <label htmlFor="activityPhoto" className={styles.uploadLabel}>
                    {activityPhoto ? (
                      <div className={styles.previewContainer}>
                        <img src={activityPhoto} alt="Anteprima" className={styles.previewImg} />
                        <span className={styles.changeHint}>Toccala per cambiare foto</span>
                      </div>
                    ) : (
                      <>📸 Carica Foto</>
                    )}
                  </label>
                </div>
              </div>
            )}

            {selectedType === 'circular' && (
              <div className={styles.fieldGroup}>
                <p className={styles.formHint}>Carica lo scontrino di un mercatino, negozio dell'usato o centro riuso per validare l'azione.</p>
                <label>Carica Scontrino / Foto Oggetto</label>
                {!file && !aiAnalyzing && (
                  <div className={styles.uploadBox}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className={styles.fileInput} 
                      id="receiptUpload"
                    />
                    <label htmlFor="receiptUpload" className={styles.uploadLabel}>
                      📸 Scansiona Scontrino
                    </label>
                  </div>
                )}
                
                {aiAnalyzing && (
                  <div className={styles.aiAnalyzing}>
                    <div className={styles.spinner}></div>
                    <p>Gemini sta analizzando lo scontrino...</p>
                  </div>
                )}

                {aiResult && (
                  <div className={`${styles.aiResultBox} glass animate-fade-in`}>
                    <h3 className={styles.aiResultTitle}>♻️ Validazione Circolare</h3>
                    <div className={styles.aiResultGrid}>
                      <div className={styles.aiStat}>
                        <span>Negozio</span>
                        <strong>{aiResult.provider}</strong>
                      </div>
                      <div className={styles.aiStat}>
                        <span>Articoli</span>
                        <strong>{aiResult.items?.length || 1}</strong>
                      </div>
                    </div>
                    <div className={styles.aiInsights}>
                      <p><strong>💡 Impatto:</strong> {aiResult.insights}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedType === 'mobility' && (
              <div className={styles.fieldGroup}>
                <p className={styles.formHint}>Carica il biglietto del treno, bus o ricevuta sharing per calcolare la CO₂ risparmiata.</p>
                <label>Carica Biglietto / Ricevuta</label>
                {!file && !aiAnalyzing && (
                  <div className={styles.uploadBox}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className={styles.fileInput} 
                      id="ticketUpload"
                    />
                    <label htmlFor="ticketUpload" className={styles.uploadLabel}>
                      🎫 Scansiona Biglietto
                    </label>
                  </div>
                )}

                {aiAnalyzing && (
                  <div className={styles.aiAnalyzing}>
                    <div className={styles.spinner}></div>
                    <p>Calcolo emissioni in corso...</p>
                  </div>
                )}

                {aiResult && (
                  <div className={`${styles.aiResultBox} glass animate-fade-in`}>
                    <h3 className={styles.aiResultTitle}>🚲 Viaggio Sostenibile</h3>
                    <div className={styles.aiResultGrid}>
                      <div className={styles.aiStat}>
                        <span>Vettore</span>
                        <strong>{aiResult.provider}</strong>
                      </div>
                      <div className={styles.aiStat}>
                        <span>Risparmio</span>
                        <strong>-{aiResult.estimatedCo2Saved}kg CO₂</strong>
                      </div>
                    </div>
                    <div className={styles.aiInsights}>
                      <p><strong>🌍 Nota:</strong> {aiResult.insights}</p>
                    </div>
                  </div>
                )}


              </div>
            )}

            <button 
              type="submit" 
              className={`${styles.submitBtn} btn-premium`} 
              disabled={isSubmitting || (selectedType === 'energy' && !aiResult)}
            >
              {isSubmitting ? 'Registrazione in corso...' : 'Registra Azione'}
            </button>

          </form>
        </div>
      ) : (
        <div key="list">
          <header className="page-header glass">
            <h1 className="page-title page-title-gradient">Traccia Attività</h1>
          </header>
          
          <section className={styles.content}>
            <p className={`${styles.subtitle} animate-fade-in animate-delay-1`}>
              Registra una nuova azione sostenibile per aumentare il tuo EcoScore e migliorare l'ambiente.
            </p>

            <div className={styles.optionsList}>
              {trackingOptions.map((opt, i) => (
                <button 
                  key={opt.id} 
                  onClick={() => setSelectedType(opt.id)}
                  className={`${styles.optionCard} animate-fade-in`} 
                  style={{ animationDelay: `${(i + 2) * 0.1}s` }}
                >
                  <div className={styles.iconBox}>{opt.icon}</div>
                  <div className={styles.optText}>
                    <h3 className={styles.optTitle}>{opt.title}</h3>
                    <p className={styles.optDesc}>{opt.desc}</p>
                  </div>
                  <div className={styles.chevron}>›</div>
                </button>
              ))}
            </div>
          </section>

        </div>
      )}
    </main>
  );
}
