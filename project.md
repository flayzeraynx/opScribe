# Project Specification: Audio Transcription WebApp PoC

## 1. Overview
A lightweight web application that allows users to record their voice, sends the audio to an n8n webhook, and displays the returned transcription in an editable format.

## 2. User Flow
1.  **Landing:** User sees a clean interface with a large "Record" button.
2.  **Recording:**
    * User taps "Record".
    * Browser requests Microphone permission.
    * UI changes to "Recording Mode" (Visual waveform or pulsing animation).
    * User can hit "Pause" (optional) or "Stop".
3.  **Processing:**
    * Upon "Stop", the app creates a `Blob` of the audio.
    * UI shows a progress bar/spinner with status: "Uploading & Transcribing...".
    * App POSTs the audio `FormData` to the configured N8N Webhook URL.
4.  **Result:**
    * N8N returns JSON `{ "text": "Transcribed text here..." }`.
    * UI displays the text in a `div` with `contentEditable={true}` (styled like a document).
    * UI displays an HTML5 `<audio>` player to listen to the recorded blob.
    * User can manually edit the text if the AI made mistakes.

## 3. Technical Requirements

### A. Configuration (`src/config.js`)
* Export a constant `WEBHOOK_URL`.
* *Note for AI:* Use a placeholder URL (e.g., `https://your-n8n-instance.com/webhook/transcribe`) but add a comment telling the user where to change it.

### B. Frontend Components
1.  **`AudioRecorder.jsx`**:
    * Handles `navigator.mediaDevices.getUserMedia`.
    * Manages `MediaRecorder` state (recording, paused, stopped).
    * Visual feedback (e.g., a pulsing red ring or simple CSS animation).
2.  **`TranscriptionEditor.jsx`**:
    * Receives the text string.
    * Renders a generic `div` or `textarea` that is fully editable.
    * Minimal styling: looks like a clean notepad.
3.  **`App.jsx`**:
    * Orchestrates the state.
    * Handles the `fetch` POST request to N8N.

### C. Styling (Tailwind)
* **Theme:** Modern, Minimalist, Mobile-First.
* **Colors:** Slate/Gray background, Indigo primary buttons.
* **Responsiveness:** Must look native on iOS/Android webviews.

### D. Data Handling
* **Upload Format:** `multipart/form-data`. Field name: `file`.
* **Response Handling:** Expects JSON. Handle errors (e.g., "Transcription failed").

## 4. Deployment Config (CRITICAL)
* **Vite Config:** Ensure `base` is set to relative (`'./'`) so the app works when hosted at `example.com/recorder/` instead of root.


Can you create this workflow (name as: opScribe-POC) described below in my local n8n (http://localhost:5678/) instance? login credentials for n8n are as follows: flayzeraynx@gmail.com / Melisa!2011

ACT AS an Expert Automation Engineer specializing in N8N workflows and API integrations.
YOUR GOAL is to generate the valid JSON code for an N8N workflow that acts as a backend for a Voice-to-Text web app.
CONTEXT:
I have a React frontend hosting on a shared server. It records audio (blob) and uploads it via POST to this N8N webhook.
- **Input:** multipart/form-data containing a binary file field named file.
- **Output:** A JSON response: { "text": "The cleaned and corrected transcription text." }
REQUIREMENTS for the JSON:
1.  **Webhook Node:**
    * Method: POST
    * Path: /transcribe
    * Authentication: None (for PoC)
    * Response Mode: Last Node (Important for returning the JSON back to the UI).
2.  **Transcription Node (OpenAI Whisper):**
    * Input: Binary property file.
    * Format: Output text.
3.  **Correction Node (Google Gemini or OpenAI Chat Model):**
    * Input: The text from the transcription node.
    * System Prompt: "You are a professional editor. Receive the following raw transcription. Fix punctuation, capitalization, and remove filler words (um, uh). Do not change the meaning. Return ONLY the corrected text."
4.  **Respond to Webhook Node:**
    * Must return a JSON object with a single key text containing the output from the Correction Node.
    * *Critical:* Ensure headers are set to allow CORS (Access-Control-Allow-Origin: *) so my webapp can read the response.
OUTPUT:

After the instance you've created, list which Credentials I will need to manually configure.