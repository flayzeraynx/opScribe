import { useState, useRef, useEffect } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

const TranscriptionEditor = ({ text, onChange }) => {
  const [copied, setCopied] = useState(false);
  const editableRef = useRef(null);
  const isInternalUpdate = useRef(false);

  // Sync external text changes to the contentEditable div
  useEffect(() => {
    if (editableRef.current && !isInternalUpdate.current) {
      // Only update if the content is different (external change like new transcription)
      if (editableRef.current.textContent !== text) {
        editableRef.current.textContent = text;
      }
    }
    isInternalUpdate.current = false;
  }, [text]);

  const handleInput = (e) => {
    isInternalUpdate.current = true;
    onChange(e.currentTarget.textContent);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-800">
            Transcription
          </h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Editable Text Area */}
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[200px] p-6 bg-slate-50 rounded-lg border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-800 leading-relaxed transition-colors duration-200"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      />

      {/* Helper text */}
      <p className="text-sm text-slate-500 italic">
        Click on the text above to edit if the AI made any mistakes.
      </p>
    </div>
  );
};

export default TranscriptionEditor;
