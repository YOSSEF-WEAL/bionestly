import { createClient } from '@/lib/server';

export async function ensureUserProfile(userId, userMetadata) {
  const supabase = await createClient();
  
  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (existingProfile) {
    return existingProfile;
  }

  // Create new profile
  const profileData = {
    id: userId,
    full_name: userMetadata?.full_name || userMetadata?.name || '',
    avatar_url: userMetadata?.avatar_url || userMetadata?.picture || '',
    email: userMetadata?.email || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: newProfile, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return newProfile;
}
