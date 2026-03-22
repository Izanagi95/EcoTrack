import { PrismaClient } from '@prisma/client';
import { currentUser, feedActivities, userActivities } from '../lib/mockData';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create a team
  const group = await prisma.team.upsert({
    where: { id: 'team-1' },
    update: {},
    create: {
      id: 'team-1',
      name: 'Green Warriors',
      description: 'Il gruppo più attivo di Genova! 🌿',
      points: 5850,
    },
  });
  console.log(`Created team: ${group.name}`);

  // Create current user
  const user = await prisma.user.upsert({
    where: { id: currentUser.id },
    update: { teamId: 'team-1' },
    create: {
      id: currentUser.id,
      name: currentUser.name,
      avatarUrl: currentUser.avatarUrl,
      ecoScore: currentUser.ecoScore,
      level: currentUser.level,
      co2SavedKg: currentUser.stats.co2SavedKg,
      wasteRecycledKg: currentUser.stats.wasteRecycledKg,
      energySavedKwh: currentUser.stats.energySavedKwh,
      streakDays: currentUser.stats.streakDays,
      teamId: 'team-1',
    },
  });
  console.log(`Created user with id: ${user.id}`);

  // Create other users safely
  const uniqueUserIds = Array.from(new Set([
    ...feedActivities.map(a => a.userId),
    ...userActivities.map(a => a.userId)
  ]));

  for (const uid of uniqueUserIds) {
    if (uid !== currentUser.id) {
      await prisma.user.upsert({
        where: { id: uid },
        update: { teamId: (uid === 'u2' || uid === 'u3') ? 'team-1' : null },
        create: {
          id: uid,
          name: uid === 'u2' ? 'Giulia V.' : uid === 'u3' ? 'Andrea B.' : `User ${uid}`,
          avatarUrl: `https://i.pravatar.cc/150?u=${uid}`,
          ecoScore: Math.floor(Math.random() * 2000) + 500,
          teamId: (uid === 'u2' || uid === 'u3') ? 'team-1' : null,
        },
      });
      console.log(`Created user with id: ${uid}`);
    }
  }

  // Create 10 more random users for a full leaderboard
  for (let i = 4; i <= 15; i++) {
    const uid = `u${i}`;
    await prisma.user.upsert({
      where: { id: uid },
      update: {},
      create: {
        id: uid,
        name: `EcoHero ${i}`,
        avatarUrl: `https://i.pravatar.cc/150?u=${uid}`,
        ecoScore: Math.floor(Math.random() * 1000) + 100,
      },
    });
  }


  // Insert Feed Activities
  for (const activity of feedActivities) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {},
      create: {
        id: activity.id,
        userId: activity.userId,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        points: activity.points,
        co2SavedValue: activity.co2SavedValue || 0,
        imageUrl: activity.imageUrl || null,
        date: new Date(activity.date),
      },
    });
  }

  // Insert Personal Activities
  for (const activity of userActivities) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {},
      create: {
        id: activity.id,
        userId: activity.userId,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        points: activity.points,
        co2SavedValue: activity.co2SavedValue || 0,
        imageUrl: activity.imageUrl || null,
        date: new Date(activity.date),
      },
    });
  }

  // Insert Community Events from JSON
  const eventsPath = path.join(__dirname, 'events.json');
  if (fs.existsSync(eventsPath)) {
    const rawEvents = fs.readFileSync(eventsPath, 'utf8');
    const events = JSON.parse(rawEvents);
    console.log(`Loading ${events.length} community events...`);
    
    // Clear existing events to avoid duplicates during re-seed if preferred, 
    // or use upsert if we had IDs. Since cleanup is safer for a massive fresh list:
    await prisma.communityEvent.deleteMany({});

    for (const event of events) {
      await prisma.communityEvent.create({
        data: {
          type: event.type,
          title: event.title,
          date: new Date(event.date),
          city: event.city,
          location: event.location,
          organizer: event.organizer,
        }
      });
    }
    console.log(`Successfully seeded ${events.length} events.`);
  } else {
    console.warn('events.json not found, skipping community events seed.');
  }

  // Insert Consumptions for user u1 (historical data)
  const consumptions = [
    { type: 'Luce', value: 250, cost: 60, period: new Date('2026-01-01') },
    { type: 'Gas', value: 150, cost: 200, period: new Date('2026-01-01') },
    { type: 'Luce', value: 210, cost: 50, period: new Date('2026-02-01') },
    { type: 'Gas', value: 130, cost: 180, period: new Date('2026-02-01') },
    { type: 'Luce', value: 190, cost: 45, period: new Date('2026-03-01') },
    { type: 'Gas', value: 90, cost: 120, period: new Date('2026-03-01') },
  ];

  console.log('Seeding consumption data...');
  // Clear existing consumptions for user u1 to avoid duplicates on re-seed
  await prisma.consumption.deleteMany({ where: { userId: 'u1' } });
  
  for (const c of consumptions) {
    await prisma.user.update({
      where: { id: 'u1' },
      data: {
        consumptions: {
          create: {
            type: c.type,
            value: c.value,
            cost: c.cost,
            period: c.period,
          }
        }
      }
    });
  }



  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
