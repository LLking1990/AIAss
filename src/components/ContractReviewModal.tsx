import React, { useState } from 'react';
import { X, ShieldAlert, Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { SAMPLE_CONTRACTS_FOR_REVIEW } from '../data/legalPresets';

interface ContractReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (contractTitle: string, contractText: string) => void;
}

export const ContractReviewModal: React.FC<ContractReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview
}) => {
  const [contractTitle, setContractTitle] = useState('企业管理系统技术开发与定制服务合同（采购方视角）');
  const [contractText, setContractText] = useState(SAMPLE_CONTRACTS_FOR_REVIEW[0].content);
  const [selectedPresetId, setSelectedPresetId] = useState(SAMPLE_CONTRACTS_FOR_REVIEW[0].id);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof SAMPLE_CONTRACTS_FOR_REVIEW[0]) => {
    setSelectedPresetId(preset.id);
    setContractTitle(preset.title);
    setContractText(preset.content);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setContractTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setContractText(content || '合同文件已成功导入，包含知识产权归属、付款结算、检验标准及违约责任条款。');
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractText.trim()) return;
    onSubmitReview(contractTitle, contractText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl border border-[#eaecf0] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eaecf0] flex items-center justify-between bg-[#fbfbfc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#fef3f2] text-[#d92d20] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#101828]">合同风险智能审查与红线批注</h3>
              <p className="text-xs text-[#667085]">
                深度扫描霸王条款、付款失衡与无限兜底陷阱，自动生成 Word 级可替换红线
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Quick preset contracts */}
          <div>
            <div className="text-xs font-medium text-[#344054] mb-2 flex items-center justify-between">
              <span>一键载入测试样本合同（含真实隐蔽风险）</span>
              <span className="text-[11px] text-[#667085]">可直接选择快速体验红线比对</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_CONTRACTS_FOR_REVIEW.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPresetId === preset.id
                      ? 'border-[#155eef] bg-[#eff8ff]/40 ring-1 ring-[#155eef]'
                      : 'border-[#eaecf0] hover:border-[#d0d5dd] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#101828] truncate">{preset.title}</span>
                    {selectedPresetId === preset.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#155eef] shrink-0" />}
                  </div>
                  <div className="text-[11px] text-[#667085] line-clamp-2 leading-relaxed">{preset.summary}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload or Drop */}
          <div className="relative border-2 border-dashed border-[#eaecf0] hover:border-[#155eef] rounded-xl p-3.5 text-center transition-colors bg-[#fbfbfc]">
            <input
              type="file"
              accept=".doc,.docx,.pdf,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center gap-2 text-xs text-[#475467]">
              <Upload className="w-4 h-4 text-[#155eef]" />
              <span className="font-medium text-[#155eef]">点击上传合同文件</span>
              <span>或直接将文件拖拽至此处（支持 Word / PDF / TXT）</span>
            </div>
          </div>

          {/* Title & Clause Text */}
          <form id="review-form" onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#344054] mb-1">待审查合同名称</label>
              <input
                type="text"
                required
                value={contractTitle}
                onChange={(e) => setContractTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155eef] focus:border-[#155eef]"
                placeholder="例如：采购框架协议、房屋租赁合同"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-[#344054]">合同文本与关键条款内容</label>
                <span className="text-[11px] text-[#98a2b3]">字符数：{contractText.length}</span>
              </div>
              <textarea
                rows={7}
                required
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                className="w-full font-mono text-xs px-3 py-2.5 border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155eef] focus:border-[#155eef] leading-relaxed text-[#1d2939]"
                placeholder="在此粘贴合同条款内容..."
              />
            </div>

            <div className="p-3 bg-[#fef6ee] border border-[#f9dbaf] rounded-xl flex items-start gap-2.5 text-xs text-[#b54708]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#f79009]" />
              <div className="leading-relaxed text-[11px]">
                <strong className="font-semibold">审查机制提示：</strong>系统将依据《民法典》合同编及最新裁判指引，自动标红存在权责失衡、加重本方责任或免除对方义务的条款，并生成可直接用于商务谈判与签署的修订版本。
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#eaecf0] bg-[#fbfbfc] flex items-center justify-between">
          <span className="text-xs text-[#667085]">
            红线批注引擎已就绪 · 支持逐条审查与一键应用
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
              form="review-form"
              disabled={isUploading || !contractText.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#d92d20] hover:bg-[#b42318] rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>开始智能审查与生成红线</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
