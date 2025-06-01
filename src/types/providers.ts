
export interface ApiProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  supportsCloning: boolean;
}

export interface Voice {
  id: string;
  name: string;
  provider: string;
  gender?: string;
  language?: string;
  isCloned?: boolean;
  preview_url?: string;
}

export interface ApiKeyStatus {
  provider: string;
  isValid: boolean;
  isActive: boolean;
  quotaUsed?: number;
  quotaLimit?: number;
}
