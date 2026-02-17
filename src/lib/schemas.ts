import { z } from 'zod';

export const bookmarkSchema = z.object({
  url: z
    .string()
    .url({ message: 'Please enter a valid URL (e.g., https://google.com)' }),
  title: z.string().min(1, { message: 'Title is required' }).max(100),
});

export type BookmarkInput = z.infer<typeof bookmarkSchema>;
