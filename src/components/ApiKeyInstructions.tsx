
import React from 'react';
import { Check, Save, X, Key } from 'lucide-react';

const ApiKeyInstructions = () => {
  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your API keys are given priority over our shared service keys</li>
          <li>• This ensures faster processing and higher quotas for your requests</li>
          <li>• Keys are encrypted and stored securely in our database</li>
          <li>• You can remove your keys at any time</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <h4 className="font-medium">Get API Keys:</h4>
          <div className="space-y-1 text-blue-600">
            <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener" className="block hover:underline">
              → ElevenLabs API Keys
            </a>
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" className="block hover:underline">
              → OpenAI API Keys
            </a>
            <a href="https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/" target="_blank" rel="noopener" className="block hover:underline">
              → Azure Cognitive Services
            </a>
            <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener" className="block hover:underline">
              → Google Cloud Credentials
            </a>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Status Legend:</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-500" />
              <span>Configured and active</span>
            </div>
            <div className="flex items-center gap-2">
              <Save className="h-3 w-3 text-blue-500" />
              <span>Ready to save</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-3 w-3 text-red-500" />
              <span>Recommended for best experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Key className="h-3 w-3 text-gray-400" />
              <span>Optional</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApiKeyInstructions;
