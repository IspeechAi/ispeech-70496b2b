
export interface ApiKeyConfig {
  id: string;
  label: string;
  placeholder: string;
  description: string;
  helpUrl?: string;
}

export interface UserApiKey {
  id: string;
  provider: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}
