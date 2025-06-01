
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Volume2 className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">ISPEECH</span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Terms and Conditions</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using ISPEECH, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
              <p className="text-gray-700">
                ISPEECH is a text-to-speech service that converts written text into natural-sounding speech using AI technology.
                We provide access to multiple TTS providers including ElevenLabs, OpenAI, Google Cloud, Azure, and others.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-gray-700">
                You must create an account to use our service. You are responsible for maintaining the confidentiality of your account
                credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. API Keys and Usage</h2>
              <p className="text-gray-700">
                Users may provide their own API keys for TTS services. We are not responsible for charges incurred from third-party
                TTS providers. Users are responsible for monitoring their own API usage and associated costs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Privacy Policy</h2>
              <p className="text-gray-700">
                We collect and process personal information in accordance with our Privacy Policy. Text inputs may be temporarily
                cached for performance optimization but are automatically deleted after 24 hours.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Prohibited Uses</h2>
              <p className="text-gray-700">
                You may not use our service for illegal activities, to generate harmful content, or to impersonate others
                without consent. Voice cloning features should only be used with proper authorization.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Service Availability</h2>
              <p className="text-gray-700">
                We strive to maintain service availability but do not guarantee uninterrupted access. TTS providers may
                have their own limitations and quotas that affect service availability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-700">
                ISPEECH shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                including loss of profits, data, or use, incurred by you or any third party.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes
                via email or through the service interface.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms and Conditions, please contact us at support@ispeech.ai
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
