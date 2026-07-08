import React, { useRef, useState } from 'react';
import { UploadCloud, X, RefreshCw, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import PdfViewer from './PdfViewer';

interface ImageUploaderProps {
  value?: string;
  onChange: (base64: string) => void;
  shape?: 'square' | 'circle' | 'banner' | 'landscape' | 'landscape_3_2' | 'portrait';
  maxSizeMB?: number;
  className?: string;
}

export default function ImageUploader({ 
  value, 
  onChange, 
  shape = 'square', 
  maxSizeMB = 10,
  className 
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    setIsLoading(true);
    const isPdf = file.type === 'application/pdf';
    if (!file.type.startsWith('image/') && !isPdf) {
      setError('Поддерживаются изображения и PDF файлы');
      setIsLoading(false);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Размер файла не должен превышать ${maxSizeMB}MB`);
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      if (isPdf) {
        onChange(result);
        setIsLoading(false);
        return;
      }
      
      // Compress image using canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIMENSION = 1200;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // 0.8 quality jpeg is much smaller than raw base64
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          onChange(compressedBase64);
        } else {
          onChange(result); // Fallback to raw if logic fails
        }
        setIsLoading(false);
      };
      img.onerror = () => {
        onChange(result); // Fallback
        setIsLoading(false);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const shapeClasses = {
    square: 'aspect-square rounded-[12px]',
    circle: 'aspect-square rounded-full',
    banner: 'aspect-[21/9] rounded-[12px]',
    landscape: 'aspect-[4/3] rounded-[12px]',
    landscape_3_2: 'aspect-[3/2] rounded-[12px]',
    portrait: 'aspect-[3/4] rounded-[12px]'
  };

  const isPdfValue = value?.startsWith('data:application/pdf');

  return (
    <div className={cn('relative', className)}>
      <input 
        type="file" 
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
          e.target.value = '';
        }}
        accept="image/png, image/jpeg, image/webp, application/pdf"
        className="hidden"
      />
      
      {value ? (
        <div className={cn(
          "relative group overflow-hidden border border-[#E2E8F0] bg-black/5 flex items-center justify-center", 
          shapeClasses[shape]
        )}>
          {!isPdfValue && (
            <div 
              className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-70"
              style={{ backgroundImage: `url("${value}")` }}
            />
          )}
          {isPdfValue ? (
            <div className="absolute inset-0 overflow-hidden bg-white">
               <PdfViewer 
                 base64={value as string} 
                 className="w-full h-full border-0 pointer-events-none" 
               />
            </div>
          ) : (
            <img 
              src={value} 
              alt="Preview" 
              className="relative z-10 w-full h-full object-contain" 
            />
          )}
          <div className="absolute inset-0 z-20 bg-[#0F172A]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button 
              onClick={(e) => { e.preventDefault(); inputRef.current?.click(); }}
              className="p-2 bg-white rounded-full text-[#1E293B] hover:text-[#1B3F7A] transition-colors"
              title="Заменить"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); onChange(''); }}
              className="p-2 bg-white rounded-full text-[#1E293B] hover:text-red-500 transition-colors"
              title="Удалить"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {isLoading && (
            <div className="absolute inset-0 z-30 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
              <RefreshCw className="w-6 h-6 text-[#1B3F7A] animate-spin mb-2" />
              <div className="text-xs font-bold text-[#1B3F7A]">Загрузка...</div>
            </div>
          )}
        </div>
      ) : (
        <div 
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors",
            shapeClasses[shape],
            dragActive 
              ? "border-[#1B3F7A] bg-[#EEF3FB]" 
              : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#1B3F7A]/50 hover:bg-[#EEF3FB]/30",
            error ? "border-red-400 bg-red-50" : ""
          )}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-[#1B3F7A] animate-spin mb-3" />
              <div className="text-sm font-medium text-[#1B3F7A]">Обработка фото...</div>
            </div>
          ) : (
            <>
              <UploadCloud className={cn("w-8 h-8 mb-2", dragActive ? "text-[#1B3F7A]" : "text-[#64748B]")} />
              <div className="text-sm font-medium text-[#1E293B] mb-1">
                Перетащите файл
              </div>
              <div className="text-xs text-[#64748B]">или нажмите для выбора</div>
            </>
          )}
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-500 mt-2 font-medium">{error}</div>
      )}
    </div>
  );
}
