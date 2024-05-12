import { z } from "zod";

export const signupInput = z.object({
  email: z.string().email(),
  username: z.string(),
  name: z.string(),
  password: z.string().min(8),
});

export type SignupType = z.infer<typeof signupInput>;

export const signinInput = z.object({
  username: z.string(),
  password: z.string(),
});

export type SigninType = z.infer<typeof signinInput>;

export const createPostInput = z.object({
  title: z.string().refine((value) => value.trim() !== '', {
    message: 'Title cannot be empty',
    path: ['title'],
  }),
  content: z.string().refine((value) => value.trim() !== '', {
    message: 'Content cannot be empty',
    path: ['content'],
  }),
  imagePreview: z.string().url(),
  tags: z.array(z.string())
});


export type CreatePostType = z.infer<typeof createPostInput>;

export const updatePostInput = z.object({
  title: z.string().optional().refine((value) => !value || value.trim() !== '', {
    message: 'Title cannot be empty',
    path: ['title'],
  }),
  content: z.string().optional().refine((value) => !value || value.trim() !== '', {
    message: 'Content cannot be empty',
    path: ['content'],
  }),
  imagePreview: z.string().url().optional(),
  tags: z.array(z.string()).optional()
});


export type UpdatePostInput = z.infer<typeof updatePostInput>;
