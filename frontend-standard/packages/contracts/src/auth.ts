import { z } from 'zod';
export const roleSchema = z.enum(['FARMER', 'TRADER', 'ADMIN']);
export type Role = z.infer<typeof roleSchema>;
export const tokenPairSchema = z.object({
  accountId: z.uuid(),
  role: roleSchema,
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  tokenType: z.literal('Bearer'),
  expiresIn: z.number().positive(),
});
export type TokenPair = z.infer<typeof tokenPairSchema>;
export interface LoginRequest {
  username: string;
  password: string;
}
export type Session = { accountId: string; role: Role; tokens: TokenPair | null; isDemo: boolean };
