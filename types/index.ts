export interface Project {
  id: string;
  user_id: string;
  name: string;
  contract_text: string | null;
  scope_summary: ScopeSummary | null;
  created_at: string;
}

export interface ScopeSummary {
  deliverables: string[];
  exclusions: string[];
  constraints: string[];
}

export interface Meeting {
  id: string;
  project_id: string;
  title: string | null;
  transcript: string | null;
  audio_url: string | null;
  analyzed_at: string | null;
  created_at: string;
}

export interface ScopeAlert {
  id: string;
  meeting_id: string;
  request_text: string;
  reason: string;
  contract_reference: string | null;
  status: 'new' | 'reviewed' | 'billed';
  created_at: string;
}
