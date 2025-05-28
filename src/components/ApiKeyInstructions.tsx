
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ApiKeyInstructions = () => {
  const providers = [
    {
      name: 'ElevenLabs',
      url: 'https://elevenlabs.io/app/speech-synthesis',
      description: 'Create an account and go to your profile to find your API key'
    },
    {
      name: 'OpenAI',
      url: 'https://platform.openai.com/api-keys',
      description: 'Create an API key from your OpenAI dashboard'
    },
    {
      name: 'Azure',
      url: 'https://portal.azure.com',
      description: 'Create a Cognitive Services resource and get your key'
    },
    {
      name: 'Google Cloud',
      url: 'https://console.cloud.google.com/apis/credentials',
      description: 'Enable Text-to-Speech API and create credentials'
    },
    {
      name: 'Amazon Polly',
      url: 'https://console.aws.amazon.com/iam/home?#/security_credentials',
      description: 'Create an IAM user with Polly permissions and get access keys'
    }
  ];

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Info className="h-5 w-5" />
          How to Get Your API Keys
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            API keys are required to access premium TTS services. Each provider offers different voices and features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <div key={provider.name} className="border rounded-lg p-4 hover:border-purple-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{provider.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(provider.url, '_blank')}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">{provider.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Security Notice</h4>
            <p className="text-sm text-yellow-700">
              Your API keys are encrypted and stored securely. They are never shared with third parties or visible to other users.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInstructions;
