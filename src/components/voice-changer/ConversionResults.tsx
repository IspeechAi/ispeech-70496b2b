
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Play, Pause, Download } from 'lucide-react';

interface ConversionResultsProps {
  processedAudioUrl: string | null;
  transcription: string;
  playingProcessed: boolean;
  onPlayProcessed: () => void;
  onDownload: () => void;
}

const ConversionResults = ({ 
  processedAudioUrl, 
  transcription, 
  playingProcessed, 
  onPlayProcessed, 
  onDownload 
}: ConversionResultsProps) => {
  if (!processedAudioUrl) return null;

  return (
    <>
      {transcription && (
        <Card className="border-blue-500/30 bg-blue-500/10">
          <CardContent className="pt-4">
            <h4 className="font-medium text-blue-300 mb-2">Detected Speech:</h4>
            <p className="text-gray-300 text-sm">{transcription}</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-green-500/30 bg-gradient-to-r from-green-500/10 to-cyan-500/10">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-green-300 mb-4 flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Conversion Complete!
          </h3>
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={onPlayProcessed}
              className="flex-1 border-green-500/50 text-green-300 hover:bg-green-500/20"
            >
              {playingProcessed ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play Result
                </>
              )}
            </Button>
            <Button
              onClick={onDownload}
              className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ConversionResults;
