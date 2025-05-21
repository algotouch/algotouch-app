-- Add unique constraint to phone column in profiles table
ALTER TABLE profiles
  ADD CONSTRAINT profiles_phone_key UNIQUE (phone);
