-- Add PIN column to profiles table for cook authentication
ALTER TABLE public.profiles ADD COLUMN pin TEXT;

-- Create function to authenticate cooks with username and PIN
CREATE OR REPLACE FUNCTION public.authenticate_cook(username_input TEXT, pin_input TEXT)
RETURNS TABLE(user_id UUID, organization_id UUID, role TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.organizacao_id, p.role
  FROM public.profiles p
  WHERE p.username = username_input 
    AND p.pin = pin_input 
    AND p.role = 'cozinheiro';
END;
$$;

-- Create RLS policy for profiles to allow admins to select users from their organization
CREATE POLICY "Admins can view users from their organization" 
ON public.profiles 
FOR SELECT 
USING (
  organizacao_id = public.get_current_user_organization() 
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Create RLS policy for profiles to allow admins to insert new cook users
CREATE POLICY "Admins can create cook users" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  role = 'cozinheiro' 
  AND organizacao_id = public.get_current_user_organization()
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);