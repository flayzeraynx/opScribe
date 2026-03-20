import { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import TranscriptionEditor from './components/TranscriptionEditor';
import {
  WEBHOOK_URL,
  TRANSCRIPTION_LANGUAGE,
  TRANSCRIPTION_PROMPT,
} from './config';
import { Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [transcriptionText, setTranscriptionText] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleRecordingComplete = async (blob) => {
    setError('');
    setIsProcessing(true);
    
    // Create audio URL for playback
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setAudioBlob(blob);

    try {
      // Create FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');
      formData.append('language', TRANSCRIPTION_LANGUAGE);
      formData.append('prompt', TRANSCRIPTION_PROMPT);

      // Send to N8N webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.text) {
        setTranscriptionText(data.text);
      } else {
        throw new Error('No transcription text received from server');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setError(`Transcription failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setTranscriptionText('');
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
            opScribe
          </h1>
          <p className="text-slate-600 text-lg">
            Record your voice, get instant transcription
          </p>
        </header>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!transcriptionText && !isProcessing && (
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
              <p className="text-xl text-slate-700 font-medium">
                Uploading & Transcribing...
              </p>
              <p className="text-sm text-slate-500 mt-2">
                This may take a few moments
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {transcriptionText && (
            <div className="space-y-6">
              {/* Audio Player */}
              {audioUrl && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-2 font-medium">
                    Your Recording:
                  </p>
                  <audio controls className="w-full" src={audioUrl}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Transcription Editor */}
              <TranscriptionEditor
                text={transcriptionText}
                onChange={setTranscriptionText}
              />

              {/* Action Button */}
              <button
                onClick={handleReset}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Record Another
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Powered by OpenAI Whisper & Google Gemini</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
