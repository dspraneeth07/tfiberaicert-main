-- Submissions table for the AI certification flow
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  workspace TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful index for the admin list view
CREATE INDEX idx_submissions_created_at ON public.submissions (created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Anyone (anon role included) may insert a submission, but length-limited to prevent abuse
CREATE POLICY "Anyone can submit a certification entry"
  ON public.submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(full_name)   BETWEEN 2 AND 120
    AND char_length(designation) BETWEEN 1 AND 120
    AND char_length(workspace)   BETWEEN 1 AND 200
    AND char_length(mobile)      BETWEEN 5 AND 20
    AND char_length(email)       BETWEEN 5 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- No one can read, update, or delete via the public API.
-- The admin page reads via a server function using the service role.
CREATE POLICY "No public read"
  ON public.submissions
  FOR SELECT
  TO anon, authenticated
  USING (false);
