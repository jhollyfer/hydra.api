import z from 'zod';

export const SignInSchema = z.object({
  email: z.string().trim(),
  password: z.string().trim(),
});
