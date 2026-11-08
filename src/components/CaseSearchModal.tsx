import React, { useState } from 'react';
import { X, Scale, Search, BookOpen, Compass, ArrowRight } from 'lucide-react';

interface CaseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSearch: (query: string) => void;
}

const POPULAR_SEARCH_TOPICS = [
  {
    topic: '买卖合同违约金过高抗辩与酌减裁判规则',
    query: '买卖合同 违约金过高 司法解释 实际损失 30% 酌减'
  },
  {
    topic: '用人单位未按月发放竞业限制补偿金的解除效力',
    query: '竞业限制 补偿金 未支付满三个月 法定解除 劳动合同法'
  },
  {
    topic: '新公司法下认缴出资加速到期与股东失权规则',
    query: '新公司法 第54条 出资加速到期 不能清偿到期债务'
  },
  {
    topic: '民间借贷利率超过LPR4倍部分利息抗辩',
    query: '民间借贷 利率上限 LPR4倍 借款合同 司法解释'
  }
];

export const CaseSearchModal: React.FC<CaseSearchModalProps> = ({
  isOpen,
  onClose,
  onSubmitSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('买卖合同违约金过高抗辩与酌减裁判规则');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onSubmitSearch(searchQuery.trim());
    onClose();
  };

  const handleSelectTopic = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl border border-[#eaecf0] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eaecf0] flex items-center justify-between bg-[#fbfbfc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f9f5ff] text-[#7f56d9] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#101828]">精准法规检索与类似案例对比</h3>
              <p className="text-xs text-[#667085]">
                直通法条渊源、最高法指导案例裁判要旨，生成同类案由裁判思路比对矩阵
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#98a2b3] hover:text-[#344054] hover:bg-[#f2f4f7] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <form id="casesearch-form" onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#344054] mb-1.5">
                输入法规查询关键词或案情焦点
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#98a2b3]" />
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#d0d5dd] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7f56d9] focus:border-[#7f56d9]"
                  placeholder="例如：逾期付款违约金过高酌减、公司股东知情权查账..."
                />
              </div>
            </div>

            {/* Popular Topics */}
            <div>
              <div className="text-xs font-medium text-[#344054] mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#7f56d9]" />
                <span>实务高频检索案由与指导案例</span>
              </div>
              <div className="space-y-1.5">
                {POPULAR_SEARCH_TOPICS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectTopic(item.query)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#eaecf0] hover:border-[#7f56d9] hover:bg-[#f9f5ff]/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#98a2b3] group-hover:text-[#7f56d9]" />
                      <span className="text-xs text-[#344054] group-hover:text-[#101828] font-medium">
                        {item.topic}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7f56d9] opacity-0 group-hover:opacity-100 transition-opacity">
                      载入
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#f9f5ff] border border-[#e9d7fe] rounded-xl text-xs text-[#53389e] leading-relaxed">
              <strong className="font-semibold">对比矩阵特色：</strong>自动对比不同审级（最高法、省高院、中院）在相同争议焦点下的判定比例、酌减基准（如LPR倍数/实际损失倍数）、以及本案应采取的举证防御策略。
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#eaecf0] bg-[#fbfbfc] flex items-center justify-between">
          <span className="text-xs text-[#667085]">
            已接入权威裁判要旨数据库与2026最新司法解释
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-[#344054] hover:bg-[#eaecf0] rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              form="casesearch-form"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#7f56d9] hover:bg-[#6941c6] rounded-lg shadow-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>立即精准检索与对比</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
