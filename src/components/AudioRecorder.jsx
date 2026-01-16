import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Pause, Play, AlertCircle } from 'lucide-react';
import { getSupportedMimeType } from '../config';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError('');
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get supported MIME type
      const mimeType = getSupportedMimeType();
      
      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        onRecordingComplete(blob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Reset state
        setIsRecording(false);
        setIsPaused(false);
        setRecordingTime(0);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to access microphone. Please grant permission and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {!isRecording ? (
        <button
          onClick={startRecording}
          className="group relative"
        >
          <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative bg-primary hover:bg-primary-hover text-white rounded-full p-8 transition-all duration-300 transform group-hover:scale-105 shadow-2xl">
            <Mic className="w-20 h-20" />
          </div>
          <p className="text-lg font-semibold text-slate-700 mt-6">
            Tap to Record
          </p>
        </button>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          {/* Pulsing animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full pulse-ring"></div>
            <div className="relative bg-red-500 rounded-full p-8 shadow-2xl">
              <Mic className="w-20 h-20 text-white" />
            </div>
          </div>

          {/* Timer */}
          <div className="text-3xl font-mono font-bold text-slate-800">
            {formatTime(recordingTime)}
          </div>

          {/* Status */}
          <p className="text-lg font-semibold text-slate-700">
            {isPaused ? 'Recording Paused' : 'Recording...'}
          </p>

          {/* Control buttons */}
          <div className="flex space-x-4">
            {!isPaused ? (
              <button
                onClick={pauseRecording}
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-4 transition-colors duration-200 shadow-lg"
                title="Pause"
              >
                <Pause className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 transition-colors duration-200 shadow-lg"
                title="Resume"
              >
                <Play className="w-6 h-6" />
              </button>
            )}

            <button
              onClick={stopRecording}
              className="bg-slate-700 hover:bg-slate-800 text-white rounded-full p-4 transition-colors duration-200 shadow-lg"
              title="Stop"
            >
              <Square className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
