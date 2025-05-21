
import { supabase } from '@/lib/supabase-client';

/**
 * Mark a module as completed by the user
 */
export async function completeModule(userId: string, courseId: string): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) {
      throw new Error('User not authenticated');
      return false;
    }
    
    // Check if course progress exists
    const { data: existingProgress } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('course_id', courseId)
      .maybeSingle();
    
    if (existingProgress) {
      // Update existing progress
      const modulesCompleted = existingProgress.modules_completed || [];
      if (!modulesCompleted.includes(userId)) {
        modulesCompleted.push(userId);
        
        await supabase
          .from('course_progress')
          .update({
            modules_completed: modulesCompleted,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
      }
    } else {
      // Create new progress entry
      await supabase
        .from('course_progress')
        .insert({
          user_id: user.user.id,
          course_id: courseId,
          lessons_watched: [],
          modules_completed: [userId],
          is_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
    
    console.log(`Module ${userId} marked as completed for course ${courseId}`);
    return true;
  } catch (error) {
    console.error('Error completing module:', error);
    return false;
  }
}
