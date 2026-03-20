/**
 * Configuration file for opScribe PoC
 * 
 * IMPORTANT: Update the WEBHOOK_URL with your actual n8n webhook endpoint
 * Example: 'http://localhost:5678/webhook/transcribe'
 * or 'https://your-n8n-instance.com/webhook/transcribe'
 */

export const WEBHOOK_URL = "https://lqo5pm48.rpcld.cc/webhook/transcribe";

// Hint the backend about the expected spoken language to improve accuracy.
// Use ISO-639-1, for example: 'en', 'tr', 'de'
export const TRANSCRIPTION_LANGUAGE = 'en';

// Optional style hint for the transcription provider.
// Keep this in the same language as the recorded speech.
export const TRANSCRIPTION_PROMPT =
  'This is a clear English voice note. Preserve punctuation and medical terminology where spoken.';

// Supported audio MIME types (browser dependent)
export const AUDIO_MIME_TYPES = [
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg;codecs=opus'
];

// Get the first supported MIME type
export const getSupportedMimeType = () => {
  for (const mimeType of AUDIO_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }
  return 'audio/webm'; // fallback
};
