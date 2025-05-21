
import { supabase } from '@/lib/supabase-client';
import { Badge, UserBadge } from './types';

/**
 * Get user's badges
 */
export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  try {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        id,
        earned_at,
        badge_id,
        badge:community_badges(
          id,
          name,
          description,
          icon,
          points_required
        )
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }
    
    // Transform the data to match our UserBadge type
    const formattedData = data?.map(item => {
      // First check if badge exists and is an object before using it
      if (item.badge && typeof item.badge === 'object' && !Array.isArray(item.badge)) {
        return {
          id: item.id,
          earned_at: item.earned_at,
          badge: item.badge as Badge
        } as UserBadge;
      }
      // Return a fallback object if badge is missing or malformed
      return {
        id: item.id,
        earned_at: item.earned_at,
        badge: {
          id: item.badge_id,
          name: 'Unknown Badge',
          description: 'Badge information unavailable',
          icon: 'award',
          points_required: 0
        }
      } as UserBadge;
    }) || [];
    
    return formattedData;
  } catch (error) {
    console.error('Exception in getUserBadges:', error);
    return [];
  }
}

/**
 * Get all available badges
 */
export async function getAllBadges(): Promise<Badge[]> {
  try {
    const { data, error } = await supabase
      .from('community_badges')
      .select('*')
      .order('points_required', { ascending: true });
    
    if (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
    
    return (data as Badge[]) || [];
  } catch (error) {
    console.error('Exception in getAllBadges:', error);
    return [];
  }
}
