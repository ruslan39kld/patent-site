import React, { useRef, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  rows?: number;
}

export function WysiwygEditor({ value, onChange, rows = 12 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
        <div className="bg-[#F8FAFC] flex gap-2 p-2 border-b border-gray-200">
             <button 
                type="button" 
                onMouseDown={e => { e.preventDefault(); document.execCommand('formatBlock', false, 'H3'); }} 
                className="px-3 py-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-gray-200 rounded transition-colors"
             >
                Заголовок (H3)
             </button>
             <button 
                type="button" 
                onMouseDown={e => { e.preventDefault(); document.execCommand('formatBlock', false, 'P'); }} 
                className="px-3 py-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-gray-200 rounded transition-colors"
             >
                Обычный текст
             </button>
             <div className="w-px bg-gray-300 mx-1"></div>
             <button 
                type="button" 
                onMouseDown={e => { e.preventDefault(); document.execCommand('bold', false, ''); }} 
                className="px-3 py-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-gray-200 rounded transition-colors"
             >
                Жирный
             </button>
             <button 
                type="button" 
                onMouseDown={e => { e.preventDefault(); document.execCommand('italic', false, ''); }} 
                className="px-3 py-1.5 text-xs italic font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-gray-200 rounded transition-colors"
             >
                Курсив
             </button>
        </div>
        <div 
          ref={editorRef}
          className="p-4 outline-none w-full prose prose-sm max-w-none text-[#0F172A]"
          style={{ minHeight: `${rows * 1.5}rem` }}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
        />
    </div>
  );
}
