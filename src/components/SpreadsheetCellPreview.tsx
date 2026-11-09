import React from 'react';
import { Table } from 'lucide-react';
import { QuestionClient } from '../types.js';

interface SpreadsheetPreviewProps {
  data?: QuestionClient['spreadsheetData'];
  formula?: string;
  targetFunction: string;
}

export const SpreadsheetCellPreview: React.FC<SpreadsheetPreviewProps> = ({
  data,
  formula,
  targetFunction,
}) => {
  if (!data || !data.rows || data.rows.length === 0) {
    return null;
  }

  const columns = data.columns || ['A', 'B', 'C'];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden my-4">
      {/* Spreadsheet Formula Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-2 text-xs font-formula">
        <span className="font-bold text-slate-500 italic px-1.5 py-0.5 rounded bg-slate-200/70 border border-slate-300">
          fx
        </span>
        <div className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium overflow-x-auto whitespace-nowrap">
          {formula || `=${targetFunction}(...)`}
        </div>
        {data.highlightRange && (
          <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 whitespace-nowrap shrink-0">
            Ауқым: {data.highlightRange}
          </span>
        )}
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse font-formula">
          <thead>
            <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 select-none">
              <th className="w-10 px-2 py-1.5 text-center bg-slate-200/80 font-semibold border-r border-slate-300">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-1.5 font-semibold text-center border-r border-slate-200 last:border-r-0 min-w-[90px]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, idx) => {
              const isHeaderRow = row.rowNum === 1;
              return (
                <tr
                  key={row.rowNum || idx}
                  className={`border-b border-slate-200 last:border-b-0 hover:bg-slate-50/80 transition-colors ${
                    isHeaderRow ? 'bg-slate-50/50 font-semibold text-slate-800' : 'text-slate-700'
                  }`}
                >
                  <td className="px-2 py-1.5 text-center bg-slate-100/70 font-medium text-slate-500 border-r border-slate-300 select-none">
                    {row.rowNum}
                  </td>
                  {columns.map((col) => {
                    const cellVal = row.cells[col];
                    const isHighlighted =
                      !isHeaderRow &&
                      (data.highlightRange?.includes(col) ||
                        (typeof cellVal === 'number' && data.highlightRange?.includes('B')));

                    return (
                      <td
                        key={col}
                        className={`px-3 py-1.5 border-r border-slate-200 last:border-r-0 ${
                          isHighlighted
                            ? 'bg-purple-50/60 font-medium text-purple-900 border-purple-200'
                            : ''
                        }`}
                      >
                        {cellVal !== undefined ? String(cellVal) : ''}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
