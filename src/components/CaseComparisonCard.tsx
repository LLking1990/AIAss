import React, { useState } from 'react';
import { Scale, BookOpen, ExternalLink, Lightbulb, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { CaseComparisonResult } from '../types/legal';

interface CaseComparisonCardProps {
  data: CaseComparisonResult;
}

export const CaseComparisonCard: React.FC<CaseComparisonCardProps> = ({ data }) => {
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(data.precedents[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedCaseId(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-white border border-[#eaecf0] rounded-2xl p-5 shadow-xs space-y-4 my-2">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#f2f4f7] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f9f5ff] text-[#7f56d9] flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-[15px] text-[#101828]">{data.queryTopic}</h4>
              <span className="text-[11px] bg-[#f9f5ff] text-[#6941c6] px-2 py-0.5 rounded font-medium">
                法规与同类判例对照
              </span>
            </div>
            <p className="text-xs text-[#667085] mt-0.5">
              已匹配 {data.statutes.length} 部现行有效法条及 {data.precedents.length} 篇最高法/省高院指导案例
            </p>
          </div>
        </div>
      </div>

      {/* Applicable Statutes */}
      <div>
        <div className="text-xs font-semibold text-[#344054] mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#7f56d9]" />
          <span>核心援引法规及司法解释条文：</span>
        </div>
        <div className="space-y-2">
          {data.statutes.map((st, idx) => (
            <div key={idx} className="bg-[#fbfbfc] border border-[#eaecf0] rounded-xl p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#101828]">{st.lawName} {st.article}</span>
                <span className="text-[10px] bg-[#eff8ff] text-[#175cd3] px-1.5 py-0.5 rounded">现行有效</span>
              </div>
              <p className="text-[#344054] leading-relaxed pl-2 border-l-2 border-[#7f56d9]">{st.content}</p>
              <div className="text-[11px] text-[#667085] pt-1">
                <span className="font-medium text-[#475467]">法理释明：</span>
                {st.interpretation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Precedent Comparison Matrix */}
      <div>
        <div className="text-xs font-semibold text-[#344054] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-[#7f56d9]" />
            <span>类似判例司法裁判矩阵对比（最高法 / 典型判例）：</span>
          </span>
          <span className="text-[11px] text-[#667085]">点击案例展开审判逻辑</span>
        </div>

        <div className="space-y-2.5">
          {data.precedents.map((prec) => {
            const isExpanded = expandedCaseId === prec.id;
            return (
              <div
                key={prec.id}
                className="border border-[#eaecf0] hover:border-[#d0d5dd] rounded-xl p-3.5 bg-white transition-all shadow-2xs"
              >
                <div
                  onClick={() => toggleExpand(prec.id)}
                  className="flex items-start justify-between cursor-pointer gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#101828]">{prec.caseName}</span>
                      <span className="text-[10px] font-mono text-[#667085] bg-[#f2f4f7] px-1.5 py-0.5 rounded">
                        {prec.caseNumber}
                      </span>
                      <span className="text-[10px] font-bold text-[#027a48] bg-[#ecfdf3] px-2 py-0.5 rounded-full">
                        相似度 {prec.similarity}%
                      </span>
                    </div>
                    <div className="text-[11px] text-[#667085] mt-1 flex items-center gap-2">
                      <span>审判机构：{prec.court}</span>
                      <span>·</span>
                      <span>裁判日期：{prec.judgmentDate}</span>
                    </div>
                  </div>

                  <button className="p-1 text-[#98a2b3] hover:text-[#344054] shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Dispute focus always visible */}
                <div className="mt-2 text-xs bg-[#f9fafb] p-2 rounded-lg text-[#344054]">
                  <span className="font-semibold text-[#101828]">争议焦点：</span>
                  {prec.disputeFocus}
                </div>

                {/* Collapsible deep reasoning */}
                {isExpanded && (
                  <div className="mt-3 pt-2.5 border-t border-[#f2f4f7] space-y-2 text-xs animate-in fade-in duration-150">
                    <div>
                      <span className="font-semibold text-[#101828]">裁判要旨 / 结果：</span>
                      <p className="text-[#344054] mt-0.5 leading-relaxed">{prec.verdictSummary}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-[#101828]">法官释法与裁判逻辑：</span>
                      <p className="text-[#475467] mt-0.5 leading-relaxed bg-[#fbfbfc] p-2.5 rounded-lg border border-[#f2f4f7]">
                        {prec.judgeReasoning}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 text-[#667085]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-[#344054]">指导示范价值：</span>
                        <span>{prec.significance}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#7f56d9] hover:underline cursor-pointer">
                        <span>文书网存证</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategy advice checklist */}
      <div className="bg-[#f0f9ff] border border-[#b9e6fe] rounded-xl p-3.5 text-xs text-[#026aa2] space-y-2">
        <div className="font-semibold flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-[#0ba5ec]" />
          <span>诉讼与谈判应对策略指南：</span>
        </div>
        <p className="text-[12px] leading-relaxed text-[#026aa2]">{data.legalAdvice}</p>
        <div className="space-y-1 pt-1">
          {data.litigationStrategy.map((strat, sIdx) => (
            <div key={sIdx} className="flex items-start gap-1.5 text-[11.5px] text-[#026aa2]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0ba5ec] shrink-0 mt-0.5" />
              <span>{strat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
