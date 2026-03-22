const fs = require('fs');

const pageCss = `
/* ── Tiny Screens (≤380px) ───────────────────────────────── */
@media (max-width: 380px) {
  .feed {
    padding: 0 0.5rem 3rem;
  }

  .createPostCard {
    padding: 1rem;
    gap: 0.75rem;
  }

  .createAvatar {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }

  .createInputMock {
    font-size: 0.85rem;
  }

  .postHeader {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
  }

  .userInfo {
    gap: 0.75rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
  }

  .typeBadge {
    align-self: flex-start;
    font-size: 0.6rem;
    padding: 0.25rem 0.6rem;
  }

  .postContent {
    padding: 0 1rem 1rem;
  }

  .activityTitle {
    font-size: 1.05rem;
  }
}
`;

fs.appendFileSync('app/page.module.css', pageCss);
console.log('Appended tiny screen to page.module.css');
