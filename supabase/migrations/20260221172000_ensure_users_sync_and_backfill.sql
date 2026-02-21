-- Ensure public.users exists and stays in sync with auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  hwid TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS hwid TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DROP POLICY IF EXISTS "Users can view their own users row" ON public.users;
CREATE POLICY "Users can view their own users row"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own users row" ON public.users;
CREATE POLICY "Users can update their own users row"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.sync_auth_user_to_users()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, password_hash, created_at, updated_at)
  VALUES (NEW.id, lower(NEW.email), NEW.encrypted_password, now(), now())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_synced_to_public_users ON auth.users;
CREATE TRIGGER on_auth_user_synced_to_public_users
AFTER INSERT OR UPDATE OF email, encrypted_password ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_auth_user_to_users();

-- Backfill existing auth users
INSERT INTO public.users (id, email, password_hash, created_at, updated_at)
SELECT
  au.id,
  lower(au.email),
  au.encrypted_password,
  COALESCE(au.created_at, now()),
  now()
FROM auth.users AS au
WHERE au.email IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = now();
