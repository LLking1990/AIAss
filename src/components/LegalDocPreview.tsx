import React, { useState } from 'react';
import { FileText, Copy, Check, FileDown, Edit3, Printer, Stamp } from 'lucide-react';
import { LegalDocument } from '../types/legal';

interface LegalDocPreviewProps {
  document: LegalDocument;
  onOpenInWorkbench?: (doc: LegalDocument) => void;
}

export const LegalDocPreview: React.FC<LegalDocPreviewProps> = ({
  document,
  onOpenInWorkbench
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(document.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const blob = new Blob([document.fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-[#eaecf0] rounded-2xl p-5 shadow-xs space-y-4 my-2">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-[#f2f4f7] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#eff8ff] text-[#155eef] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-[#101828]">{document.title}</h4>
              <span className="text-[10px] bg-[#eff8ff] text-[#175cd3] px-2 py-0.5 rounded font-medium">
                {document.docType}
              </span>
            </div>
            <p className="text-[11px] text-[#667085]">
              符合人民法院/仲裁机构审查规范格式 · 签发日期：{document.signatureDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenInWorkbench && (
            <button
              onClick={() => onOpenInWorkbench(document)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#155eef] bg-[#eff8ff] hover:bg-[#d1e9ff] rounded-lg transition-colors"
              title="在右侧工作台中并排编辑"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>工作台编辑</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#344054] bg-white border border-[#d0d5dd] hover:bg-[#f9fafb] rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#12b76a]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '已复制' : '复制全文'}</span>
          </button>

          <button
            onClick={handleDownloadText}
            className="p-1.5 text-[#667085] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors"
            title="导出文本"
          >
            <FileDown className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 text-[#667085] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors"
            title="打印文书"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formal Document Layout View */}
      <div className="bg-[#fafbfc] border border-[#eaecf0] rounded-xl p-5 font-serif text-[13px] leading-relaxed text-[#101828] space-y-4">
        {/* Document Title Header */}
        <div className="text-center pb-2 border-b border-[#eaecf0]">
          <h2 className="text-base font-bold font-sans tracking-wide text-[#101828]">{document.title}</h2>
          <div className="text-xs text-[#667085] font-sans mt-0.5">案由类别：{document.caseType}</div>
        </div>

        {/* Parties Block */}
        <div className="space-y-1.5 bg-white p-3 rounded-lg border border-[#f2f4f7] text-xs font-sans">
          {document.parties.map((p, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="font-semibold text-[#344054] shrink-0 min-w-[80px]">{p.role}：</span>
              <span className="text-[#101828]">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Demands Block */}
        <div>
          <div className="font-bold text-xs font-sans text-[#101828] mb-1">
            {document.docType === '函件通知' ? '【催告事项及法律要求】' : '【诉讼 / 仲裁请求】'}
          </div>
          <div className="space-y-1 pl-4 text-xs font-sans">
            {document.demands.map((demand, dIdx) => (
              <div key={dIdx} className="text-[#1d2939]">
                {dIdx + 1}. {demand}
              </div>
            ))}
          </div>
        </div>

        {/* Facts and Reasons */}
        <div>
          <div className="font-bold text-xs font-sans text-[#101828] mb-1">【事实与理由】</div>
          <p className="text-xs font-sans text-[#344054] leading-relaxed whitespace-pre-line pl-2 border-l-2 border-[#155eef]">
            {document.factsAndReasons}
          </p>
        </div>

        {/* Legal basis */}
        <div>
          <div className="font-bold text-xs font-sans text-[#101828] mb-1">【法律依据】</div>
          <div className="flex flex-wrap gap-1.5 font-sans">
            {document.legalBasis.map((lb, lIdx) => (
              <span key={lIdx} className="text-[11px] bg-[#eff8ff] text-[#175cd3] px-2 py-0.5 rounded">
                {lb}
              </span>
            ))}
          </div>
        </div>

        {/* Signature & Seal Block */}
        <div className="pt-4 flex items-end justify-between font-sans text-xs border-t border-[#eaecf0]">
          <div className="text-[#667085]">
            <div>送达机构：有管辖权之机构</div>
            <div>附送材料：证据清单、主体资信证明、授权委托书</div>
          </div>
          <div className="text-right space-y-1 relative pr-6">
            <div className="text-[#344054] font-medium">具状人 / 发函方（盖章）：</div>
            <div className="font-bold text-[#101828]">{document.parties[0]?.name}</div>
            <div className="text-[#667085]">{document.signatureDate}</div>
            <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
              <Stamp className="w-12 h-12 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
