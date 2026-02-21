
-- Profiles table (stores public user info)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- License keys table
CREATE TABLE public.license_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  license_key TEXT NOT NULL UNIQUE DEFAULT upper(replace(gen_random_uuid()::text, '-', '-')),
  license_type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  purchaser_name TEXT NOT NULL,
  purchaser_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;

-- Allow insert before user account exists (anonymous purchase)
CREATE POLICY "Anyone can insert license during purchase"
  ON public.license_keys FOR INSERT
  WITH CHECK (true);

-- Users can only see their own license keys
CREATE POLICY "Users can view their own license keys"
  ON public.license_keys FOR SELECT
  USING (auth.uid() = user_id);

-- Allow update to link a license to a user after signup
CREATE POLICY "Users can claim their license"
  ON public.license_keys FOR UPDATE
  USING (purchaser_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Trigger to auto-update profiles updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
