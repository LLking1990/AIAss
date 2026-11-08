import React, { useState } from 'react';
import { X, FileText, Sparkles, Building, Landmark, Scale, Check } from 'lucide-react';
import { DRAFTING_TEMPLATES } from '../data/legalPresets';

interface DraftingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDraft: (params: {
    templateId?: string;
    docType: '诉讼文书' | '合同协议' | '函件通知' | '公司决议' | '合规备忘录';
    title: string;
    caseType: string;
    plaintiff: string;
    defendant: string;
    claimAmount?: string;
    court?: string;
    keyFacts: string;
  }) => void;
}

export const DraftingModal: React.FC<DraftingModalProps> = ({ isOpen, onClose, onSubmitDraft }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState('civil_complaint');
  const [docType, setDocType] = useState<'诉讼文书' | '合同协议' | '函件通知' | '公司决议' | '合规备忘录'>('诉讼文书');
  const [title, setTitle] = useState('民事起诉状（买卖合同货款纠纷）');
  const [caseType, setCaseType] = useState('买卖合同纠纷');
  const [plaintiff, setPlaintiff] = useState('上海鼎盛智能装备有限公司');
  const [defendant, setDefendant] = useState('苏州创联精工机械制造有限公司');
  const [claimAmount, setClaimAmount] = useState('865,000元');
  const [court, setCourt] = useState('苏州市工业园区人民法院');
  const [keyFacts, setKeyFacts] = useState('原告于2024年10月依约交付全部智能数控设备并经被告验收合格，被告仅支付首期款30%，余款经原告多次书面催告仍拒不支付。');

  if (!isOpen) return null;

  const handleSelectTemplate = (template: typeof DRAFTING_TEMPLATES[0]) => {
    setSelectedTemplateId(template.id);
    setDocType(template.defaultData.docType);
    setTitle(template.name);
    setCaseType(template.defaultData.caseType);
    setPlaintiff(template.defaultData.plaintiff);
    setDefendant(template.defaultData.defendant);
    setClaimAmount(template.defaultData.claimAmount);
    setCourt(template.defaultData.court);
    setKeyFacts(template.defaultData.keyFacts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitDraft({
      templateId: selectedTemplateId,
      docType,
      title,
      caseType,
      plaintiff,
      defendant,
      claimAmount,
      court,
      keyFacts
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl border border-[#eaecf0] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#eaecf0] flex items-center justify-between bg-[#fbfbfc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eff8ff] text-[#155eef] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#101828]">智能法律文书撰写</h3>
              <p className="text-xs text-[#667085]">选择模板或填写案件要素，AI 智能生成标准法院/商事规范文书</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#98a2b3] hover:text-[#344054] hover:bg-[#f2f4f7] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Preset Template Selector */}
          <div>
            <label className="block text-xs font-medium text-[#344054] mb-2">常用权威文书模板</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {DRAFTING_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTemplateId === tmpl.id
                      ? 'border-[#155eef] bg-[#eff8ff]/50 ring-1 ring-[#155eef]'
                      : 'border-[#eaecf0] hover:border-[#d0d5dd] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-[#155eef] bg-[#eff8ff] px-1.5 py-0.5 rounded">
                      {tmpl.category}
                    </span>
                    {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-[#155eef]" />}
                  </div>
                  <div className="text-xs font-semibold text-[#101828] truncate">{tmpl.name}</div>
                  <div className="text-[11px] text-[#667085] line-clamp-1 mt-0.5">{tmpl.description}</div>
                </button>
              ))}
            </div>
          </div>

          <form id="drafting-form" onSubmit={handleSubmit} className="space-y-4 pt-1 border-t border-[#f2f4f7]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#344054] mb-1">文书名称</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155eef] focus:border-[#155eef]"
                  placeholder="例如：民事起诉状（买卖合同）"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#344054] mb-1">案由 / 事项类型</label>
                <input
                  type="text"
                  required
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155eef] focus:border-[#155eef]"
                  placeholder="例如：买卖合同纠纷、劳动争议"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#344054] mb-1">原告 / 申请人 / 甲方</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#98a2b3]" />
                  <input
                    type="text"
                    required
                    value={plaintiff}
                    onChange={(e) => setPlaintiff(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155eef] focus:border-[#155eef]"
                    placeholder="公司全称或自然人姓名"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#344054] mb-1">被告 / 被申请人 / 乙方</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#98a2b3]" />
                  <input
                    type="text"
                    required
                    value={defendant}
                    onChange={(e) => setDefendant(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155eef] focus:border-[#155eef]"
                    placeholder="相对方公司或自然人"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#344054] mb-1">标的金额 / 诉求款项</label>
                <div className="relative">
                  <Scale className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#98a2b3]" />
                  <input
                    type="text"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155eef] focus:border-[#155eef]"
                    placeholder="例如：865,000元"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#344054] mb-1">管辖法院 / 仲裁委</label>
                <div className="relative">
                  <Landmark className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#98a2b3]" />
                  <input
                    type="text"
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155eef] focus:border-[#155eef]"
                    placeholder="例如：苏州市工业园区人民法院"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#344054] mb-1">核心事实与理由简要说明</label>
              <textarea
                rows={3}
                required
                value={keyFacts}
                onChange={(e) => setKeyFacts(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155eef] focus:border-[#155eef] leading-relaxed"
                placeholder="简明叙述合作背景、履约过程、对方违约事实及我方主张依凭..."
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#eaecf0] bg-[#fbfbfc] flex items-center justify-between">
          <span className="text-xs text-[#667085]">
            遵循《民法典》及《民事诉讼法》法定起诉要件自动排版
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
              form="drafting-form"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#155eef] hover:bg-[#124bbf] rounded-lg shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>一键生成专业文书</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
