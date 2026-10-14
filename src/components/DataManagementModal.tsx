import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Download, Upload } from 'lucide-react';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (jsonString: string) => boolean;
  onReset: () => void;
  solvedCount: number;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  onReset,
  solvedCount,
}) => {
  const { isDark } = useTheme();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImport(content);
      if (success) {
        setImportStatus('Progress imported successfully!');
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 1500);
      } else {
        setImportStatus('Invalid JSON file format. Please check the file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`relative max-w-md w-full border rounded-[8px] shadow-2xl p-5 space-y-4 transition-colors ${
          isDark
            ? 'bg-[#202020] border-[#2e2e2e] text-[#f1f1f1]'
            : 'bg-white border-[#e9e9e7] text-[#37352f]'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3
            className={`text-sm font-semibold ${
              isDark ? 'text-[#f1f1f1]' : 'text-[#37352f]'
            }`}
          >
            Backup & Progress Data
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded-[4px] ${
              isDark ? 'text-[#888888] hover:text-[#f1f1f1]' : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <X size={15} />
          </button>
        </div>

        <p
          className={`text-xs leading-relaxed ${
            isDark ? 'text-[#888888]' : 'text-[#787774]'
          }`}
        >
          Your problem statuses and notes are stored locally in this browser. Backup or restore your data below.
        </p>

        {importStatus && (
          <div
            className={`p-2.5 rounded-[4px] text-xs ${
              importStatus.includes('successfully')
                ? isDark
                  ? 'bg-[#448361]/20 text-[#64a37e] border border-[#448361]/35'
                  : 'bg-[#dbeddb] text-[#1c3829] border border-[#c0e0c0]'
                : isDark
                ? 'bg-[#e16b67]/20 text-[#e16b67] border border-[#e16b67]/35'
                : 'bg-[#ffe2dd] text-[#5d1715] border border-[#fbc5bc]'
            }`}
          >
            {importStatus}
          </div>
        )}

        <div className="space-y-2.5">
          {/* Export Action */}
          <div
            className={`p-3 rounded-[6px] border flex items-center justify-between gap-3 ${
              isDark ? 'bg-[#242424] border-[#2d2d2d]' : 'bg-[#f7f6f3] border-[#e9e9e7]'
            }`}
          >
            <div>
              <div className={`text-xs ${isDark ? 'text-[#e0e0e0]' : 'text-[#37352f]'}`}>
                Export Progress
              </div>
              <div
                className={`text-[11px] ${
                  isDark ? 'text-[#888888]' : 'text-[#787774]'
                }`}
              >
                Download JSON backup of your {solvedCount} solved problems
              </div>
            </div>
            <button
              type="button"
              onClick={onExport}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] text-xs border transition-colors shrink-0 ${
                isDark
                  ? 'bg-[#2a2a2a] hover:bg-[#333333] border-[#383838] text-[#f1f1f1]'
                  : 'bg-white hover:bg-[#efefed] border-[#e3e2de] text-[#37352f]'
              }`}
            >
              <Download size={12} />
              <span>Export</span>
            </button>
          </div>

          {/* Import Action */}
          <div
            className={`p-3 rounded-[6px] border flex items-center justify-between gap-3 ${
              isDark ? 'bg-[#242424] border-[#2d2d2d]' : 'bg-[#f7f6f3] border-[#e9e9e7]'
            }`}
          >
            <div>
              <div className={`text-xs ${isDark ? 'text-[#e0e0e0]' : 'text-[#37352f]'}`}>
                Import Progress
              </div>
              <div
                className={`text-[11px] ${
                  isDark ? 'text-[#888888]' : 'text-[#787774]'
                }`}
              >
                Restore progress from JSON backup
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] text-xs border transition-colors shrink-0 ${
                isDark
                  ? 'bg-[#2a2a2a] hover:bg-[#333333] border-[#383838] text-[#f1f1f1]'
                  : 'bg-white hover:bg-[#efefed] border-[#e3e2de] text-[#37352f]'
              }`}
            >
              <Upload size={12} />
              <span>Choose File</span>
            </button>
          </div>

          {/* Reset Action */}
          <div
            className={`p-3 rounded-[6px] border space-y-2 ${
              isDark
                ? 'bg-[#221c1c] border-[#3a2525]'
                : 'bg-[#fdf3f2] border-[#f8d0cc]'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div
                  className={`text-xs font-medium ${
                    isDark ? 'text-[#e16b67]' : 'text-[#c73e3a]'
                  }`}
                >
                  Reset Progress
                </div>
                <div
                  className={`text-[11px] ${
                    isDark ? 'text-[#9b6f6f]' : 'text-[#9b7270]'
                  }`}
                >
                  Clear all solved problem checks & notes
                </div>
              </div>
              {!showResetConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className={`px-2.5 py-1 rounded-[4px] text-xs transition-colors shrink-0 ${
                    isDark
                      ? 'bg-[#e16b67]/20 text-[#e16b67] hover:bg-[#e16b67]/30'
                      : 'bg-[#ffe2dd] text-[#c73e3a] hover:bg-[#ffd5ce] border border-[#f8c0b8]'
                  }`}
                >
                  Reset...
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onReset();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className={`px-2 py-1 rounded-[4px] text-xs font-medium transition-colors ${
                      isDark
                        ? 'bg-[#e16b67] text-white hover:bg-[#d65753]'
                        : 'bg-[#c73e3a] text-white hover:bg-[#b03531]'
                    }`}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className={`px-2 py-1 text-xs ${
                      isDark ? 'text-[#888888] hover:text-[#cccccc]' : 'text-[#787774] hover:text-[#37352f]'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-1 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-1.5 rounded-[4px] text-xs transition-colors ${
              isDark
                ? 'text-[#cccccc] hover:bg-[#282828]'
                : 'text-[#37352f] hover:bg-[#efefed]'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
