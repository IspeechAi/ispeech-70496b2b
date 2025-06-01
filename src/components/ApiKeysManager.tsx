
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key } from 'lucide-react';
import { useApiKeys } from '@/hooks/useApiKeys';
import { apiKeyConfigs } from '@/config/apiKeyConfigs';
import ApiKeyInput from '@/components/ApiKeyInput';
import ApiKeyInstructions from '@/components/ApiKeyInstructions';

const ApiKeysManager = () => {
  const {
    apiKeys,
    userApiKeys,
    savingKeys,
    saveApiKey,
    deleteApiKey,
    handleKeyChange
  } = useApiKeys();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Your API Keys
        </CardTitle>
        <p className="text-sm text-gray-600">
          Add your own API keys to access premium TTS services. Your keys are stored securely and encrypted.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiKeyConfigs.map((keyConfig) => (
          <ApiKeyInput
            key={keyConfig.id}
            keyConfig={keyConfig}
            value={apiKeys[keyConfig.id]}
            userApiKeys={userApiKeys}
            savingKeys={savingKeys}
            apiKeys={apiKeys}
            onValueChange={handleKeyChange}
            onSave={saveApiKey}
            onDelete={deleteApiKey}
          />
        ))}

        <ApiKeyInstructions />
      </CardContent>
    </Card>
  );
};

export default ApiKeysManager;
