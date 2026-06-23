import React, { useEffect, useState } from 'react';

interface PdfViewerProps {
  base64: string;
  className?: string;
  tabIndex?: number;
}

export default function PdfViewer({ base64, className, tabIndex }: PdfViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string>('');

  useEffect(() => {
    if (!base64 || !base64.startsWith('data:application/pdf')) return;

    try {
      const base64Data = base64.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (e) {
      console.error('Error creating PDF blob', e);
    }
  }, [base64]);

  if (!blobUrl) return null;

  return (
    <iframe
      src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
      className={className}
      title="PDF Document"
      tabIndex={tabIndex}
    />
  );
}
