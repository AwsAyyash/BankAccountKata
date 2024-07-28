// src/validation.ts

import { z } from 'zod';

// Schema for creating an account
export const createAccountSchema = z.object({
    account_number: z.string(),
    account_type: z.enum(['iban', 'other']),
    balance: z.number().min(0).optional(), // Ensure balance is a non-negative number
});

// Schema for updating an account

export const updateAccountSchema = z.object({
    balance: z.number({
        invalid_type_error: 'Balance must be a number',
    }).min(0, 'Balance must be a non-negative number').optional(),
});
