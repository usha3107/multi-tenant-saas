-- Fix missing super_admin in user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
