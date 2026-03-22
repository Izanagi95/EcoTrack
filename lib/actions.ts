'use server';

import { prisma } from './prisma';

import { currentUser as mockCurrentUser } from './mockData';

const CURRENT_USER_ID = 'u1';

export async function getCurrentUser() {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: CURRENT_USER_ID },
      include: { team: true }
    });
    if (!user) return mockCurrentUser;
    
    return {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      ecoScore: user.ecoScore,
      level: user.level,
      stats: {
        co2SavedKg: user.co2SavedKg,
        wasteRecycledKg: user.wasteRecycledKg,
        energySavedKwh: user.energySavedKwh,
        streakDays: user.streakDays,
      },
      teamId: user.teamId || mockCurrentUser.teamId,
      team: user.team || mockCurrentUser.team,
      city: 'Genova',
      neighborhood: 'Bogliasco'
    };
  } catch (e) {
    return mockCurrentUser;
  }
}

export async function getUserActivities() {
  const activities = await prisma.activity.findMany({
    where: { userId: CURRENT_USER_ID },
    orderBy: { date: 'desc' }
  });
  return activities;
}

import { feedActivities as mockFeedActivities } from './mockData';

export async function getFeedActivities() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { date: 'desc' },
      include: { user: true }
    });

    if (activities.length === 0) return mockFeedActivities;

    return activities;
  } catch (e) {
    return mockFeedActivities;
  }
}

import { leaderboards as mockLeaderboards } from './mockData';

export async function getLeaderboard() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { ecoScore: 'desc' },
      take: 10,
      include: { team: true }
    });

    if (users.length === 0) return mockLeaderboards;

    return users.map((u: any, i: number) => ({
      rank: i + 1,
      name: u.name,
      score: u.ecoScore,
      avatarUrl: u.avatarUrl,
      teamId: u.teamId,
      team: u.team,
      city: u.id === 'u4' ? 'Torino' : u.id === 'u5' ? 'Milano' : u.id === 'u99' ? 'Roma' : 'Genova',
      neighborhood: (u.id === 'u1' || u.id === 'u10' || u.id === 'u2') ? 'Bogliasco' : u.id === 'u3' ? 'Albaro' : u.id === 'u4' ? 'Centro' : 'Sturla'
    }));
  } catch (e) {
    return mockLeaderboards;
  }
}

export async function addActivity(data: {
  type: string;
  title: string;
  description: string;
  points: number;
  co2SavedValue?: number;
  wasteRecycledKg?: number;
}) {
  const newActivity = await prisma.activity.create({
    data: {
      userId: CURRENT_USER_ID,
      type: data.type,
      title: data.title,
      description: data.description,
      points: data.points,
      co2SavedValue: data.co2SavedValue || 0,
      date: new Date(),
    }
  });

  await prisma.user.update({
    where: { id: CURRENT_USER_ID },
    data: {
      ecoScore: { increment: data.points },
      co2SavedKg: { increment: data.co2SavedValue || 0 },
      wasteRecycledKg: { increment: data.wasteRecycledKg || 0 }
    }
  });

  return newActivity;
}

export async function addConsumption(data: {
  type: string;
  value: number;
  cost?: number;
  period: Date;
}) {
  return await prisma.consumption.create({
    data: {
      userId: CURRENT_USER_ID,
      type: data.type,
      value: data.value,
      cost: data.cost,
      period: data.period
    }
  });
}

export async function getUserConsumptions() {
  return await prisma.consumption.findMany({
    where: { userId: CURRENT_USER_ID },
    orderBy: { period: 'asc' }
  });
}

export async function getCommunityEvents() {
  return await prisma.communityEvent.findMany({
    orderBy: { date: 'asc' }
  });
}



export async function getSuggestedUsers() {
  const users = await prisma.user.findMany({
    where: { id: { not: CURRENT_USER_ID } },
    take: 8,
    orderBy: { ecoScore: 'desc' }
  });
  return users;
}



