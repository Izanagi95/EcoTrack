'use server';

import { prisma } from './prisma';

const CURRENT_USER_ID = 'u1';

export async function getCurrentUser() {
  const user = await prisma.user.findUnique({ where: { id: CURRENT_USER_ID } });
  if (!user) return null;
  
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
    }
  };
}

export async function getUserActivities() {
  const activities = await prisma.activity.findMany({
    where: { userId: CURRENT_USER_ID },
    orderBy: { date: 'desc' }
  });
  return activities;
}

export async function getFeedActivities() {
  const activities = await prisma.activity.findMany({
    orderBy: { date: 'desc' },
    include: { user: true }
  });

  // Map to the shape expected by UI if needed
  // UI might not expect 'user' relation but we can pass it
  return activities;
}

export async function getLeaderboard() {
  const users = await prisma.user.findMany({
    orderBy: { ecoScore: 'desc' },
    take: 10
  });

  return users.map((u: any, i: number) => ({
    rank: i + 1,
    name: u.name,
    score: u.ecoScore,
    avatarUrl: u.avatarUrl,
  }));
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



