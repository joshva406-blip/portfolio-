import { z } from 'zod';
export const contactSchema=z.object({name:z.string().trim().min(2,'Please enter your name.').max(100),email:z.string().trim().email('Please enter a valid email.').max(254),message:z.string().trim().min(10,'Please write at least 10 characters.').max(5000),website:z.string().max(0).optional().default('')}).strict();
