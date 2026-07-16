import React, { useRef, useState } from 'react';
import { UploadCloud, X, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-expect-error -- Vite ?url import, resolves to the worker script's final asset URL.
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

interface ImageUploaderProps {
  value?: string;
  onChange: (base64: string) => void;
  shape?: 'square' | 'circle' | 'banner' | 'landscape' | 'landscape_3_2' | 'portrait' | 'document';
  maxSizeMB?: number;
  className?: string;
  // Opt-in only — every other field keeps accepting just images/PDF. When
  // set, an MP4 is uploaded as-is (no canvas processing, which only makes
  // sense for rasterizable content) to a separate, size-capped endpoint.
  allowVideo?: boolean;
}

const MAX_VIDEO_SIZE_MB = 5;

function isVideoUrl(url: string) {
  return /\.mp4($|\?)/i.test(url);
}

export default function ImageUploader({
  value,
  onChange,
  shape = 'square',
  maxSizeMB = 10,
  className,
  allowVideo = false,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const UPLOAD_TIMEOUT_MS = 30000;

  const uploadToServer = (blob: Blob, filename: string, endpoint: string = '/api/upload') => {
    const formData = new FormData();
    formData.append('file', blob, filename);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

    fetch(endpoint, { method: 'POST', body: formData, signal: controller.signal })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Сервер вернул ошибку (${res.status})`);
        return data as { url: string };
      })
      .then((data) => onChange(data.url))
      .catch((err) => {
        // Surface a clear, actionable message instead of failing silently or
        // falling back to a placeholder — the previous value (if any) is left
        // untouched since onChange() is only called on success above.
        if (err instanceof DOMException && err.name === 'AbortError') {
          setError('Сервер не отвечает (таймаут). Проверьте соединение и попробуйте снова.');
        } else if (err instanceof TypeError) {
          setError('Не удалось связаться с сервером. Проверьте интернет-соединение и попробуйте снова.');
        } else {
          setError(err instanceof Error ? err.message : 'Ошибка загрузки файла');
        }
      })
      .finally(() => {
        clearTimeout(timer);
        setIsLoading(false);
      });
  };

  // Shared by both images and PDFs (rendered to a canvas first): resize via
  // canvas, then upload the resulting JPEG blob so it gets a real, unique,
  // persistent URL under /uploads instead of being embedded as base64 in the
  // app state. From here on a PDF scan is indistinguishable from a photo.
  const processAndUpload = (source: HTMLImageElement | HTMLCanvasElement, baseName: string) => {
    const canvas = document.createElement('canvas');
    let width = source.width;
    let height = source.height;
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
    if (!ctx) {
      setError('Не удалось обработать изображение');
      setIsLoading(false);
      return;
    }
    ctx.drawImage(source, 0, 0, width, height);
    canvas.toBlob((blob) => {
      if (!blob) {
        setError('Не удалось обработать изображение');
        setIsLoading(false);
        return;
      }
      uploadToServer(blob, `${baseName}.jpg`);
    }, 'image/jpeg', 0.8);
  };

  // Renders the first page of a PDF onto a canvas at a resolution generous
  // enough that text/photos stay legible after processAndUpload's resize.
  const renderPdfFirstPage = async (file: File): Promise<HTMLCanvasElement> => {
    const data = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');
    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas;
  };

  const handleFile = (file: File) => {
    setError(null);
    setIsLoading(true);
    const isVideo = allowVideo && file.type === 'video/mp4';
    const isPdf = file.type === 'application/pdf';
    if (!isVideo && !file.type.startsWith('image/') && !isPdf) {
      setError(allowVideo ? 'Поддерживаются изображения, PDF и MP4-видео' : 'Поддерживаются изображения и PDF файлы');
      setIsLoading(false);
      return;
    }
    if (isVideo) {
      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        setError(`Размер видео не должен превышать ${MAX_VIDEO_SIZE_MB}MB`);
        setIsLoading(false);
        return;
      }
      // Uploaded as-is — a canvas can't rasterize video, and re-encoding
      // client-side is out of scope for a "swap the hero photo" field.
      uploadToServer(file, file.name, '/api/upload-video');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Размер файла не должен превышать ${maxSizeMB}MB`);
      setIsLoading(false);
      return;
    }

    const baseName = file.name.replace(/\.[^./]+$/, '');

    if (isPdf) {
      renderPdfFirstPage(file)
        .then((canvas) => processAndUpload(canvas, baseName))
        .catch(() => {
          setError('Не удалось обработать PDF файл');
          setIsLoading(false);
        });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => processAndUpload(img, baseName);
      img.onerror = () => {
        setError('Не удалось прочитать изображение');
        setIsLoading(false);
      };
      img.src = result;
    };
    reader.onerror = () => {
      setError('Не удалось прочитать файл');
      setIsLoading(false);
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
    portrait: 'aspect-[3/4] rounded-[12px]',
    // Fixed 800x600 (4:3) frame for document-like scans/screenshots: neutral
    // background, no decorative blurred backdrop, image always shown in full
    // via object-contain (never cropped) — see ImageUploader's preview <img>.
    document: 'aspect-[4/3] rounded-[12px]'
  };

  const isDocumentShape = shape === 'document';
  const isVideoPreview = !!value && isVideoUrl(value);

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
        accept={allowVideo ? 'image/png, image/jpeg, image/webp, application/pdf, video/mp4' : 'image/png, image/jpeg, image/webp, application/pdf'}
        className="hidden"
      />

      {value ? (
        <div className={cn(
          "relative group overflow-hidden border border-[#E2E8F0] flex items-center justify-center",
          isDocumentShape ? "bg-gray-50" : "bg-black/5",
          shapeClasses[shape]
        )}>
          {!isDocumentShape && !isVideoPreview && (
            <div
              className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-70"
              style={{ backgroundImage: `url("${value}")` }}
            />
          )}
          {isVideoPreview ? (
            // No controls — this is a WYSIWYG preview of how it'll appear
            // on the public site (autoplaying, looping, silent), not a
            // player for the admin to operate by hand.
            <video
              src={value}
              autoPlay
              muted
              loop
              playsInline
              className="relative z-10 w-full h-full object-contain"
            />
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
