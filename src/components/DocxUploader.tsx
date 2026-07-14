import { useRef, useState } from 'react';
import { FileText, UploadCloud } from 'lucide-react';
import mammoth from 'mammoth';

interface DocxUploaderProps {
  onInsertText: (text: string) => void;
  className?: string;
}

// Extracts plain text from a .docx entirely in the browser (mammoth), shows
// a preview, and only writes into the review's `text` field when the admin
// explicitly clicks "Вставить" — never automatically, so they can check/edit
// first. The .docx file itself is never uploaded to the server.
export default function DocxUploader({ onInsertText, className }: DocxUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setExtractedText(null);
    setFileName(file.name);
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setExtractedText(result.value.trim());
    } catch {
      setError('Не удалось прочитать .docx файл');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={inputRef}
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 text-sm font-medium text-[#1B3F7A] bg-[#EEF3FB] hover:bg-[#E0EAFB] border border-[#3B82F6]/20 px-3 py-2 rounded-lg transition-colors"
      >
        <UploadCloud className="w-4 h-4" />
        Загрузить текст из .docx
      </button>

      {isLoading && <div className="text-xs text-[#64748B] mt-2">Читаю файл...</div>}
      {error && <div className="text-xs text-red-500 mt-2">{error}</div>}

      {extractedText !== null && !isLoading && (
        <div className="mt-3 border border-[#E2E8F0] rounded-lg p-3 bg-[#F8FAFC]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase mb-2">
            <FileText className="w-3.5 h-3.5" /> {fileName}
          </div>
          <p className="text-sm text-[#1E293B] max-h-32 overflow-y-auto whitespace-pre-line mb-3">
            {extractedText || '(пустой документ)'}
          </p>
          <button
            type="button"
            onClick={() => onInsertText(extractedText)}
            disabled={!extractedText}
            className="text-sm font-bold text-white bg-[#1B3F7A] hover:bg-[#2960B0] disabled:bg-[#94A3B8] disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors"
          >
            Вставить в текст отзыва
          </button>
        </div>
      )}
    </div>
  );
}
