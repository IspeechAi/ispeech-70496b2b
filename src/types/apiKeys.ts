
export interface ApiKeyConfig {
  id: string;
  label: string;
  placeholder: string;
  description: string;
  helpUrl?: string;
  isRequired?: boolean; // Added missing property
}

export interface UserApiKey {
  id: string;
  provider: string;
  api_key: string;
  created_at: string;
  updated_at: string;
  is_active?: boolean; // Added missing property
}
