
export interface ApiKeyConfig {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  isRequired: boolean;
  helpText?: string;
}

export interface UserApiKey {
  id: string;
  provider: string;
  api_key: string;
  is_active: boolean;
}
