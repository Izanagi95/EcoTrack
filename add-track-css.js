const fs = require('fs');

const trackCss = `
/* ── Tiny Screens (≤380px) ───────────────────────────────── */
@media (max-width: 380px) {
  .optionCard {
    padding: 1.25rem;
    gap: 1rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .iconBox {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }

  .optTitle {
    font-size: 1.1rem;
  }

  .optDesc {
    font-size: 0.85rem;
  }

  .myQrBox {
    padding: 1.5rem;
  }

  .mockQrImage {
    width: 150px;
    height: 150px;
  }
}
`;

fs.appendFileSync('app/track/Track.module.css', trackCss);
console.log('Appended tiny screen to Track.module.css');
