import { prisma } from './prisma';

export function getSupabaseUserIdFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const id = authHeader.slice('Bearer '.length).trim();
  return id || null;
}

export async function isAdminOfHotel(supabaseUserId: string | null, hotelId: string): Promise<boolean> {
  if (supabaseUserId === null) return false;
  const user = await prisma.user.findUnique({ where: { supabaseUserId } });
  return user !== null && user.hotelId === hotelId;
}
