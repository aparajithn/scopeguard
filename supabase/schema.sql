-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  contract_text TEXT,
  scope_summary JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Meetings table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  transcript TEXT,
  audio_url TEXT,
  analyzed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scope alerts table
CREATE TABLE scope_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
  request_text TEXT NOT NULL,
  reason TEXT NOT NULL,
  contract_reference TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scope_alerts ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Meetings policies
CREATE POLICY "Users can view meetings from their projects"
  ON meetings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = meetings.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert meetings for their projects"
  ON meetings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = meetings.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update meetings from their projects"
  ON meetings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = meetings.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete meetings from their projects"
  ON meetings FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = meetings.project_id
    AND projects.user_id = auth.uid()
  ));

-- Scope alerts policies
CREATE POLICY "Users can view alerts from their meetings"
  ON scope_alerts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM meetings
    JOIN projects ON projects.id = meetings.project_id
    WHERE meetings.id = scope_alerts.meeting_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert alerts for their meetings"
  ON scope_alerts FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM meetings
    JOIN projects ON projects.id = meetings.project_id
    WHERE meetings.id = scope_alerts.meeting_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update alerts from their meetings"
  ON scope_alerts FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM meetings
    JOIN projects ON projects.id = meetings.project_id
    WHERE meetings.id = scope_alerts.meeting_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete alerts from their meetings"
  ON scope_alerts FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM meetings
    JOIN projects ON projects.id = meetings.project_id
    WHERE meetings.id = scope_alerts.meeting_id
    AND projects.user_id = auth.uid()
  ));
