
-- Create the documents table that the useDocuments hook expects
CREATE TABLE public.documents (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  conteudo TEXT,
  tipo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for now
CREATE POLICY "Allow all operations on documents" ON public.documents
  FOR ALL USING (true) WITH CHECK (true);

-- Create a test user with email 'teste@teste.com' and password 'teste'
-- Note: This creates the user in Supabase Auth, not a custom table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'teste@teste.com',
  crypt('teste', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Teste"}',
  false,
  '',
  '',
  '',
  ''
);
