/*
  # Create Ideas Management Schema

  1. New Tables
    - `ideas`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `description` (text)
      - `category` (text, required)
      - `priority` (text, required)
      - `status` (text, required, default 'new')
      - `tags` (text array)
      - `reminder_date` (timestamptz)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `idea_resources`
      - `id` (uuid, primary key)
      - `idea_id` (uuid, foreign key to ideas)
      - `type` (text, required)
      - `title` (text, required)
      - `url` (text)
      - `content` (text)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'other',
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'new',
  tags text[] DEFAULT '{}',
  reminder_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create idea_resources table
CREATE TABLE IF NOT EXISTS idea_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL DEFAULT 'link',
  title text NOT NULL,
  url text,
  content text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for ideas table
CREATE POLICY "Users can view their own ideas"
  ON ideas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ideas"
  ON ideas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas"
  ON ideas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas"
  ON ideas
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for idea_resources table
CREATE POLICY "Users can view resources for their ideas"
  ON idea_resources
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ideas 
      WHERE ideas.id = idea_resources.idea_id 
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create resources for their ideas"
  ON idea_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas 
      WHERE ideas.id = idea_resources.idea_id 
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update resources for their ideas"
  ON idea_resources
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ideas 
      WHERE ideas.id = idea_resources.idea_id 
      AND ideas.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas 
      WHERE ideas.id = idea_resources.idea_id 
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete resources for their ideas"
  ON idea_resources
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ideas 
      WHERE ideas.id = idea_resources.idea_id 
      AND ideas.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS ideas_user_id_idx ON ideas(user_id);
CREATE INDEX IF NOT EXISTS ideas_category_idx ON ideas(category);
CREATE INDEX IF NOT EXISTS ideas_status_idx ON ideas(status);
CREATE INDEX IF NOT EXISTS ideas_priority_idx ON ideas(priority);
CREATE INDEX IF NOT EXISTS ideas_created_at_idx ON ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idea_resources_idea_id_idx ON idea_resources(idea_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for ideas table
DROP TRIGGER IF EXISTS update_ideas_updated_at ON ideas;
CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();