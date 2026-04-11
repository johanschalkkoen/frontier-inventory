
CREATE TABLE public.player_characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  character_name TEXT NOT NULL DEFAULT 'Outlaw',
  archetype_id TEXT NOT NULL DEFAULT 'jace',
  portrait_id TEXT NOT NULL DEFAULT 'male-0',
  trait_points JSONB NOT NULL DEFAULT '{}'::jsonb,
  skill_points JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.player_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own characters"
ON public.player_characters FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own characters"
ON public.player_characters FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters"
ON public.player_characters FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters"
ON public.player_characters FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_player_characters_updated_at
BEFORE UPDATE ON public.player_characters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
