-- Drop existing tables if they exist (for clean slate)
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;

-- Create volunteers table
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table (NGO events)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  skills_required TEXT[] NOT NULL DEFAULT '{}',
  event_date DATE NOT NULL,
  volunteers_needed INTEGER DEFAULT 1,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table (volunteer-event matches)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  match_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'notified')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(volunteer_id, event_id)
);

-- Enable Row Level Security
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Volunteers policies (allow public access for demo)
CREATE POLICY "Anyone can view volunteers" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert volunteers" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update volunteers" ON volunteers FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete volunteers" ON volunteers FOR DELETE USING (true);

-- Events policies (allow public access for demo)
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Anyone can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update events" ON events FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete events" ON events FOR DELETE USING (true);

-- Matches policies (allow public access for demo)
CREATE POLICY "Anyone can view matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Anyone can insert matches" ON matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update matches" ON matches FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete matches" ON matches FOR DELETE USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_volunteers_location ON volunteers(location);
CREATE INDEX idx_volunteers_skills ON volunteers USING GIN(skills);
CREATE INDEX idx_events_location ON events(location);
CREATE INDEX idx_events_skills_required ON events USING GIN(skills_required);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_matches_volunteer_id ON matches(volunteer_id);
CREATE INDEX idx_matches_event_id ON matches(event_id);
