// lib/zod.ts
import { z } from 'zod';
export const registerSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email({ message: 'Enter a valid email address' })
        .max(254, { message: 'Email must be at most 254 characters' })
        .transform((s) => s.toLowerCase()),
    firstName: z
        .string({ required_error: 'First name is required' })
        .trim()
        .min(1, { message: 'First name cannot be empty' })
        .max(100, { message: 'First name must be at most 100 characters' }),
    lastName: z
        .string({ required_error: 'Last name is required' })
        .trim()
        .min(1, { message: 'Last name cannot be empty' })
        .max(100, { message: 'Last name must be at most 100 characters' }),
    phoneNumber: z
        .string({ required_error: 'Phone number is required' })
        .trim()
        .regex(/^\+?[0-9]{10,15}$/, {
            message: 'Enter a valid phone number (10–15 digits, optional +)',
        }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(128, { message: 'Password must be at most 128 characters' }),
    confirmPassword: z
        .string({ required_error: 'Confirm password is required' })
        .min(8, { message: 'Confirm password must be at least 8 characters' })
        .max(128, { message: 'Confirm password must be at most 128 characters' }),
    terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
});

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})
export const resetRequestSchema = z.object({ email: z.string().email() });
export const resetSchema = z.object({
    token: z.string().min(10),
    password: z.string().min(12).max(128),
});
export const verifySchema = z.object({ token: z.string().min(10) });
export type RegisterInput = z.infer<typeof registerSchema>;



