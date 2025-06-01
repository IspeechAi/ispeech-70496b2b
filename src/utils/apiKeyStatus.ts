
import { Check, Save, X, Key } from 'lucide-react';
import { UserApiKey, ApiKeyConfig } from '@/types/apiKeys';

export const getKeyStatus = (
  keyConfig: ApiKeyConfig, 
  apiKeys: Record<string, string>, 
  userApiKeys: UserApiKey[], 
  savingKeys: Record<string, boolean>
) => {
  const hasValue = !!apiKeys[keyConfig.id];
  const isSaved = userApiKeys.some(key => key.provider === keyConfig.id && key.is_active);
  const isSaving = savingKeys[keyConfig.id];
  
  if (isSaving) return { icon: Key, color: 'text-blue-500', text: 'Saving...' };
  if (isSaved) return { icon: Check, color: 'text-green-500', text: 'Saved' };
  if (hasValue) return { icon: Save, color: 'text-blue-500', text: 'Save' };
  if (keyConfig.isRequired) return { icon: X, color: 'text-red-500', text: 'Required' };
  return { icon: Key, color: 'text-gray-400', text: 'Optional' };
};
