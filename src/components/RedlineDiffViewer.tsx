import React, { useState } from 'react';
import { ShieldAlert, AlertCircle, CheckCircle2, Copy, Check, FileDown, Sparkles } from 'lucide-react';
import { ContractReviewResult, RedlineItem } from '../types/legal';

interface RedlineDiffViewerProps {
  review: ContractReviewResult;
  onApplyAll?: () => void;
  onExportWord?: () => void;
}

export const RedlineDiffViewer: React.FC<RedlineDiffViewerProps> = ({
  review,
  onExportWord
}) => {
  const [redlines, setRedlines] = useState<RedlineItem[]>(review.redlines);
  const [filterLevel, setFilterLevel] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleApply = (id: string) => {
    setRedlines(prev =>
      prev.map(item => (item.id === id ? { ...item, applied: !item.applied } : item))
    );
  };

  const handleApplyAll = () => {
    setRedlines(prev => prev.map(item => ({ ...item, applied: true })));
  };

  const handleCopyClause = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = redlines.filter(r => (filterLevel === 'all' ? true : r.riskLevel === filterLevel));

  const appliedCount = redlines.filter(r => r.applied).length;

  return (
    <div className="bg-white border border-[#eaecf0] rounded-2xl p-5 shadow-xs space-y-4 my-2">
      {/* Title & Score Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f2f4f7] pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fef3f2] text-[#d92d20] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-[15px] text-[#101828]">{review.contractName}</h4>
              <span className="text-[11px] bg-[#fef3f2] text-[#b42318] px-2 py-0.5 rounded font-medium">
                红线审查完成
              </span>
            </div>
            <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">{review.summary}</p>
          </div>
        </div>

        {/* Risk Score Pill & Stats */}
        <div className="flex items-center gap-3 shrink-0 bg-[#fbfbfc] p-2 rounded-xl border border-[#eaecf0]">
          <div className="text-center px-2">
            <div className="text-[10px] text-[#667085]">合规得分</div>
            <div className="text-lg font-bold font-mono text-[#d92d20]">{review.overallScore}</div>
          </div>
          <div className="w-[1px] h-6 bg-[#eaecf0]" />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#d92d20] font-medium">{review.stats.highRisks} 高危</span>
            <span className="text-[#f79009] font-medium">{review.stats.mediumRisks} 中危</span>
            <span className="text-[#155eef] font-medium">{review.stats.lowRisks} 提示</span>
          </div>
        </div>
      </div>

      {/* Key findings check list */}
      <div className="bg-[#fef6ee]/60 border border-[#fecdca]/60 rounded-xl p-3.5 text-xs">
        <div className="font-semibold text-[#b54708] mb-1.5 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-[#f79009]" />
          <span>核心合规发现与条款陷阱诊断：</span>
        </div>
        <ul className="space-y-1 text-[#b54708] pl-5 list-disc text-[12px] leading-relaxed">
          {review.keyFindings.map((finding, idx) => (
            <li key={idx}>{finding}</li>
          ))}
        </ul>
      </div>

      {/* Filter and bulk action row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1 bg-[#f2f4f7] p-1 rounded-lg">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filterLevel === 'all' ? 'bg-white text-[#101828] shadow-xs' : 'text-[#667085] hover:text-[#101828]'
            }`}
          >
            全部批注 ({redlines.length})
          </button>
          <button
            onClick={() => setFilterLevel('high')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filterLevel === 'high' ? 'bg-white text-[#d92d20] shadow-xs' : 'text-[#667085] hover:text-[#101828]'
            }`}
          >
            高风险 ({review.stats.highRisks})
          </button>
          <button
            onClick={() => setFilterLevel('medium')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filterLevel === 'medium' ? 'bg-white text-[#f79009] shadow-xs' : 'text-[#667085] hover:text-[#101828]'
            }`}
          >
            中风险 ({review.stats.mediumRisks})
          </button>
          <button
            onClick={() => setFilterLevel('low')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filterLevel === 'low' ? 'bg-white text-[#155eef] shadow-xs' : 'text-[#667085] hover:text-[#101828]'
            }`}
          >
            提示 ({review.stats.lowRisks})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyAll}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#155eef] bg-[#eff8ff] hover:bg-[#d1e9ff] rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>一键采纳全部修改 ({appliedCount}/{redlines.length})</span>
          </button>
          {onExportWord && (
            <button
              onClick={onExportWord}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#344054] bg-white border border-[#d0d5dd] hover:bg-[#f9fafb] rounded-lg transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>导出修订版Word</span>
            </button>
          )}
        </div>
      </div>

      {/* Redline Items List */}
      <div className="space-y-3 pt-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-4 transition-all ${
              item.applied
                ? 'border-[#a6f4c5] bg-[#f6fef9]'
                : item.riskLevel === 'high'
                ? 'border-[#fecdca] bg-white hover:border-[#f97066]'
                : 'border-[#eaecf0] bg-white hover:border-[#d0d5dd]'
            }`}
          >
            {/* Clause Top Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#101828]">{item.clauseNumber} · {item.clauseTitle}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                    item.riskLevel === 'high'
                      ? 'bg-[#fef3f2] text-[#d92d20]'
                      : item.riskLevel === 'medium'
                      ? 'bg-[#fef6ee] text-[#b54708]'
                      : 'bg-[#eff8ff] text-[#155eef]'
                  }`}
                >
                  {item.riskLevel === 'high' ? '高风险' : item.riskLevel === 'medium' ? '中风险' : '合规提示'}
                </span>
                <span className="text-xs font-medium text-[#475467]">{item.riskTitle}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleApply(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    item.applied
                      ? 'bg-[#12b76a] text-white hover:bg-[#039855]'
                      : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]'
                  }`}
                >
                  {item.applied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>已采纳</span>
                    </>
                  ) : (
                    <span>采纳修改</span>
                  )}
                </button>

                <button
                  onClick={() => handleCopyClause(item.revisedText, item.id)}
                  title="复制修订后条款"
                  className="p-1 text-[#667085] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-md transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#12b76a]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Redline Diff Box */}
            <div className="space-y-2 text-xs bg-[#fbfbfc] p-3 rounded-lg border border-[#f2f4f7] font-mono leading-relaxed">
              {/* Original Text with deletion markup */}
              <div className="text-[#667085]">
                <span className="text-[10px] font-sans font-medium text-[#98a2b3] mr-2">【原条款】</span>
                <span className="line-through text-[#b42318] bg-[#fef3f2] px-1 py-0.5 rounded">
                  {item.originalText}
                </span>
              </div>

              {/* Revised Text with insertion markup */}
              <div className="text-[#101828]">
                <span className="text-[10px] font-sans font-medium text-[#039855] mr-2">【红线修改】</span>
                <span className="text-[#027a48] bg-[#ecfdf3] px-1 py-0.5 rounded font-medium">
                  {item.revisedText}
                </span>
              </div>
            </div>

            {/* Legal reasoning & statutory basis */}
            <div className="mt-2.5 pt-2 border-t border-[#f2f4f7] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#667085]">
              <div>
                <span className="font-semibold text-[#344054]">法理依据：</span>
                {item.legalReason}
              </div>
              <span className="shrink-0 text-[#175cd3] bg-[#eff8ff] px-2 py-0.5 rounded text-[10px] font-medium">
                {item.statuteReference}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
