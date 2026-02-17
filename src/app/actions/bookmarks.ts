'use server';

import { createClient } from '@/utils/supabase/server';
import { bookmarkSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function addBookmark(formData: FormData) {
  const supabase = await createClient();

  // 1. Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 2. Validate input
  const rawData = {
    url: formData.get('url'),
    title: formData.get('title'),
  };

  const validatedData = bookmarkSchema.safeParse(rawData);

  if (!validatedData.success) {
    return { error: validatedData.error.flatten().fieldErrors };
  }

  // 3. Insert into Supabase
  const { error } = await supabase.from('bookmarks').insert({
    ...validatedData.data,
    user_id: user.id,
  });

  if (error) return { error: { server: [error.message] } };

  // 4. Refresh the page data
  revalidatePath('/');
  return { success: true };
}
