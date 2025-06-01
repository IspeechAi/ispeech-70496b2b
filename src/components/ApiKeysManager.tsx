
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, Plus, AlertCircle } from 'lucide-react';
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
    <div className="space-y-6">
      <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/20 shadow-xl shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Key className="h-6 w-6 text-purple-400" />
            API Key Management
          </CardTitle>
          <p className="text-gray-400">
            Add your own API keys to access premium TTS services. Your keys are stored securely and encrypted.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current API Keys */}
          <div className="space-y-4">
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
          </div>

          {/* Add New Provider Section */}
          <Card className="border-cyan-500/30 bg-cyan-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Plus className="h-5 w-5 text-cyan-400" />
                <h3 className="font-medium text-cyan-300">Add More Providers</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Want to use additional voice providers? We support Fish Audio, Azure Speech, and Amazon Polly.
              </p>
              <Button 
                variant="outline" 
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                onClick={() => {
                  // This could open a modal or navigate to provider setup
                  console.log('Add provider functionality')
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Request Provider Access
              </Button>
            </CardContent>
          </Card>

          {/* Status Overview */}
          <Card className="border-purple-500/30 bg-slate-800/30">
            <CardContent className="pt-6">
              <h3 className="font-medium text-white mb-4">Provider Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {apiKeyConfigs.map((config) => {
                  const isConfigured = userApiKeys.some(key => key.provider === config.id && key.is_active);
                  return (
                    <div key={config.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-gray-300">{config.label}</span>
                      <div className="flex items-center gap-2">
                        {isConfigured ? (
                          <span className="text-green-400 text-sm">✓ Ready</span>
                        ) : (
                          <span className="text-yellow-400 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Needs Key
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <ApiKeyInstructions />
    </div>
  );
};

export default ApiKeysManager;
