import React, { useMemo } from 'react';
import { Lightbulb } from 'lucide-react';

const extractTextLines = (html: string) => {
  let text = html
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/?ul>/gi, '')
    .replace(/<blockquote>/gi, '💡 ')
    .replace(/<\/blockquote>/gi, '\n\n')
    .replace(/<\/?h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, '');

  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&mdash;/g, '—')
    .replace(/&quot;/g, '"');

  return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
};

export default function PostContent({ contentHtml }: { contentHtml: string }) {
  const lines = useMemo(() => extractTextLines(contentHtml), [contentHtml]);

  const blocks: React.ReactNode[] = [];
  let currentList: string[] = [];
  let currentTable: string[][] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="my-6 space-y-3">
          {currentList.map((item, i) => (
            <li key={i} className="flex items-start text-[#1F2937] text-[16px] leading-[1.8]">
              <span className="text-[#C8A028] mr-3 mt-1 text-xs">■</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const flushTable = () => {
    if (currentTable.length > 0) {
      blocks.push(
        <div key={`table-${blocks.length}`} className="my-8 overflow-x-auto rounded-xl border border-[#E5E7EB]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EEF3FB]">
                {currentTable[0].map((cell, i) => (
                  <th key={i} className="px-6 py-4 font-bold text-[#1B3F7A] border-b border-[#E5E7EB]">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTable.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 text-[#1F2937] border-b border-[#E5E7EB] last:border-b-0">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('|')) {
      flushList();
      const cells = line.split('|').map(c => c.trim()).filter(c => c.length > 0);
      if (cells.length > 0) currentTable.push(cells);
      continue;
    } else {
      flushTable();
    }

    if (line.startsWith('•') || line.startsWith('-')) {
      currentList.push(line.replace(/^[•-]\s*/, ''));
      continue;
    } else {
      flushList();
    }

    const stepMatch = line.match(/^(Шаг \d+|Этап \d+)[.:]\s*(.*)$/i);
    if (stepMatch) {
      blocks.push(
        <div
          key={`step-${i}`}
          className="flex flex-col md:flex-row gap-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#E5E7EB] border-l-4 border-l-[#C8A028] my-8 animate-in slide-in-from-bottom-5 fade-in duration-500 fill-mode-both"
          style={{ animationDelay: `${(i % 5) * 100}ms` }}
        >
          <div className="w-14 h-14 rounded-full bg-[#1B3F7A] text-white flex flex-col items-center justify-center font-bold shrink-0">
            <span className="text-[10px] uppercase opacity-80 leading-none mb-0.5">{stepMatch[1].split(' ')[0]}</span>
            <span className="text-xl leading-none">{stepMatch[1].split(' ')[1]}</span>
          </div>
          <div>
            {stepMatch[2] && <h3 className="text-xl font-bold text-[#1B3F7A] mb-3">{stepMatch[2]}</h3>}
            {i + 1 < lines.length && !lines[i + 1].match(/^(Шаг|Этап|💡|•|-)/i) && lines[i + 1].length > 80 && (
              <p className="text-[#1F2937] leading-[1.8]">{lines[++i]}</p>
            )}
          </div>
        </div>
      );
      continue;
    }

    if (line.startsWith('💡')) {
      blocks.push(
        <div key={`tip-${i}`} className="bg-[#FBF3DC] border-l-4 border-[#C8A028] p-5 md:p-6 rounded-lg my-8 flex gap-4 shadow-sm">
          <Lightbulb className="w-6 h-6 text-[#C8A028] shrink-0 mt-0.5" />
          <p className="text-[#1F2937] italic leading-relaxed text-[16px]">{line.replace(/^💡\s*/, '')}</p>
        </div>
      );
      continue;
    }

    if (line.length > 0 && line.length <= 80 && !/[.!?:]$/.test(line)) {
      blocks.push(
        <h2 key={`h2-${i}`} className="text-[20px] font-bold text-[#1B3F7A] border-b-2 border-[#C8A028] pb-2 w-max mt-10 mb-6">
          {line}
        </h2>
      );
      continue;
    }

    blocks.push(
      <p key={`p-${i}`} className="text-[16px] leading-[1.8] text-[#1F2937] mb-5">
        {line}
      </p>
    );
  }

  flushList();
  flushTable();

  return <div className="smart-content-wrapper">{blocks}</div>;
}
