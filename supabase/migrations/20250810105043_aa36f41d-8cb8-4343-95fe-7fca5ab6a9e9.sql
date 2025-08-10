-- Secure function search_path and fix bodies where needed
-- 1) deactivate_expired_promotions
CREATE OR REPLACE FUNCTION public.deactivate_expired_promotions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.promotions
    SET active = false
    WHERE end_time < NOW() AND active = true;
END;
$$;

-- 2) update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3) handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- 4) create_demo_accounts
CREATE OR REPLACE FUNCTION public.create_demo_accounts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    demo_user_id uuid := '11111111-1111-1111-1111-111111111111';
    demo_merchant_id uuid := '22222222-2222-2222-2222-222222222222';
BEGIN
    -- Create demo user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demouser@antiapp.com') THEN
        -- Insert into auth.users
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_user_meta_data
        )
        VALUES (
            demo_user_id,
            'demouser@antiapp.com',
            crypt('anti123!', gen_salt('bf')),
            NOW(),
            jsonb_build_object('full_name', 'Demo User')
        );
        
        -- Insert into profiles
        INSERT INTO public.profiles (
            id,
            email,
            full_name,
            account_type
        )
        VALUES (
            demo_user_id,
            'demouser@antiapp.com',
            'Demo User',
            'user'
        );
    END IF;

    -- Create demo merchant if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demomerchant@antiapp.com') THEN
        -- Insert into auth.users
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_user_meta_data
        )
        VALUES (
            demo_merchant_id,
            'demomerchant@antiapp.com',
            crypt('anti123!', gen_salt('bf')),
            NOW(),
            jsonb_build_object(
                'full_name', 'Demo Merchant',
                'account_type', 'merchant'
            )
        );
        
        -- Insert into profiles
        INSERT INTO public.profiles (
            id,
            email,
            full_name,
            account_type,
            verification_status
        )
        VALUES (
            demo_merchant_id,
            'demomerchant@antiapp.com',
            'Demo Merchant',
            'merchant',
            'approved'
        );
        
        -- Insert into merchant_profiles
        INSERT INTO public.merchant_profiles (
            id,
            business_name,
            contact_email
        )
        VALUES (
            demo_merchant_id,
            'Demo Business',
            'demomerchant@antiapp.com'
        );
    END IF;
END;
$$;

-- 5) get_secret
CREATE OR REPLACE FUNCTION public.get_secret(secret_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    secret_value text;
BEGIN
    -- Get the secret value from pg_settings
    SELECT current_setting('app.settings.' || secret_name, true) INTO secret_value;
    
    IF secret_value IS NULL THEN
        RETURN json_build_object('secret', NULL);
    END IF;
    
    RETURN json_build_object('secret', secret_value);
END;
$$;

-- 6) handle_merchant_registration
CREATE OR REPLACE FUNCTION public.handle_merchant_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'account_type' = 'merchant' THEN
    INSERT INTO public.profiles (id, email, full_name, account_type, verification_status)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'full_name',
      'merchant',
      'pending'
    );
    
    INSERT INTO public.merchant_profiles (id)
    VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

-- 7) log_admin_action (schema-qualify profiles)
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND account_type = 'admin'
    ) THEN
        INSERT INTO public.admin_logs (admin_id, table_name, action, target_id)
        VALUES (auth.uid(), TG_TABLE_NAME, TG_OP, 
            CASE 
                WHEN TG_OP = 'DELETE' THEN OLD.id 
                ELSE NEW.id 
            END
        );
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers for updated_at columns
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='updated_at') THEN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
      DROP TRIGGER update_profiles_updated_at ON public.profiles;
    END IF;
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='merchant_profiles' AND column_name='updated_at') THEN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_merchant_profiles_updated_at') THEN
      DROP TRIGGER update_merchant_profiles_updated_at ON public.merchant_profiles;
    END IF;
    CREATE TRIGGER update_merchant_profiles_updated_at
    BEFORE UPDATE ON public.merchant_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='review_responses' AND column_name='updated_at') THEN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_review_responses_updated_at') THEN
      DROP TRIGGER update_review_responses_updated_at ON public.review_responses;
    END IF;
    CREATE TRIGGER update_review_responses_updated_at
    BEFORE UPDATE ON public.review_responses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_cafes_amenities ON public.cafes USING gin (amenities);
CREATE INDEX IF NOT EXISTS idx_cafes_tags ON public.cafes USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_cafes_title_lower ON public.cafes (lower(title));
CREATE INDEX IF NOT EXISTS idx_cafes_address_lower ON public.cafes (lower(address));

-- RLS hardening: restrict UPDATE on cafes to admins only for now
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'cafes' AND policyname = 'Users can update their own cafes'
  ) THEN
    DROP POLICY "Users can update their own cafes" ON public.cafes;
  END IF;
END $$;

CREATE POLICY IF NOT EXISTS "Admins can update cafes"
ON public.cafes
FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND account_type = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND account_type = 'admin'));
