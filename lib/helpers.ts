export const getCO2Equivalent = (kg: number) => {
  if (kg === 0) return 'Inizia a tracciare! 🌱';
  if (kg < 1) return `📱 ≈ ${Math.round(kg * 122)} ricariche smarpthone`;
  // Let's use simpler text for small badges
  if (kg < 5) return `🚗 ≈ ${Math.max(1, Math.round(kg * 5))} km in auto evitati`;
  if (kg < 20) return `🌳 ≈ ${Math.max(1, Math.round(kg / 20 * 12))} mesi di un albero`;
  if (kg < 50) return `💡 ≈ ${Math.round(kg / 1.5)} giorni di elettricità`;
  return `✈️ ≈ 1 volo Roma-Milano`;
};
