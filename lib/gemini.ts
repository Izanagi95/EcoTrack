'use server';

export async function analyzeImageWithAI(base64Image: string, fileName: string, category: string) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  if (category === 'energy') {
    const isGas = fileName.toLowerCase().includes('gas');
    const type = isGas ? 'Gas' : 'Luce';
    const unit = isGas ? 'smc' : 'kWh';

    return {
      success: true,
      data: {
        provider: 'Enel Energia Verde',
        type: type,
        consumptionValue: isGas ? 45.2 : 120.5,
        unit: unit,
        costEur: isGas ? 65.0 : 42.50,
        insights: `Ottimo lavoro! I tuoi consumi di ${type} sono inferiori del 15% rispetto alla media.`,
        estimatedCo2Saved: isGas ? 12 : 18.5,
        earnedPoints: 150
      }
    };
  } else if (category === 'circular') {
    return {
      success: true,
      data: {
        provider: 'Humana Vintage Genova',
        type: 'Second Hand',
        items: ['Cappotto lana', 'Jeans vintage'],
        costEur: 45.0,
        insights: "Acquistare prodotti circolari evita la produzione di nuovi rifiuti tessili e riduce l'impronta di carbonio della moda.",
        estimatedCo2Saved: 8.5,
        earnedPoints: 200
      }
    };
  } else if (category === 'mobility') {
    return {
      success: true,
      data: {
        provider: 'Trenitalia / AMT',
        type: 'Trasporto Pubblico',
        insights: "Ogni viaggio in treno o bus risparmia circa l'80% di emissioni rispetto all'auto privata.",
        estimatedCo2Saved: 5.2,
        earnedPoints: 100
      }
    };
  }

  return { success: false, error: 'Categoria non supportata' };
}

