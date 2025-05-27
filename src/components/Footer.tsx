
import React from 'react';
import { Volume2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold">ISPEECH</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered text-to-speech technology for everyone.
            </p>
          </div>

          {/* TTS Providers */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">TTS Providers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://elevenlabs.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  ElevenLabs
                </a>
              </li>
              <li>
                <a
                  href="https://cloud.google.com/text-to-speech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Google Cloud TTS
                </a>
              </li>
              <li>
                <a
                  href="https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Azure Speech
                </a>
              </li>
              <li>
                <a
                  href="https://aws.amazon.com/polly/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Amazon Polly
                </a>
              </li>
              <li>
                <a
                  href="https://coqui.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Coqui TTS
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="mailto:support@ispeech.ai" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@ispeech.ai</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ISPEECH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
