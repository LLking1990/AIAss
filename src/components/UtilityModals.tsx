import React from 'react';
import { X, Settings, Check } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-[#eaecf0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-[#eaecf0] flex items-center justify-between bg-[#fbfbfc]">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#155eef]" />
            <h3 className="font-semibold text-sm text-[#101828]">法务办公偏好设置</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#98a2b3] hover:text-[#344054]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#344054] mb-1">法规援引标准</label>
            <select className="w-full px-3 py-2 border border-[#d0d5dd] rounded-lg bg-white text-xs">
              <option>民法典及2026最新司法解释编纂版（推荐）</option>
              <option>新修订《中华人民共和国公司法》（2024版）</option>
              <option>现行劳动合同法及最高院劳动争议全套指导案例</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#344054] mb-1">合同红线审查严格度</label>
            <div className="grid grid-cols-3 gap-2">
              <button className="py-1.5 border border-[#155eef] bg-[#eff8ff] text-[#155eef] rounded-lg font-medium text-center">
                严格防控 (乙方视角)
              </button>
              <button className="py-1.5 border border-[#d0d5dd] text-[#344054] rounded-lg text-center hover:bg-[#f9fafb]">
                商务平衡
              </button>
              <button className="py-1.5 border border-[#d0d5dd] text-[#344054] rounded-lg text-center hover:bg-[#f9fafb]">
                促成交易型
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#fbfbfc] border border-[#eaecf0] rounded-xl flex items-center justify-between">
            <div>
              <div className="font-medium text-[#101828]">保密与数据脱敏</div>
              <div className="text-[11px] text-[#667085]">自动对当事人身份证、手机号进行脱敏加密</div>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#12b76a] text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[#eaecf0] bg-[#fbfbfc] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#155eef] text-white text-xs font-medium rounded-lg hover:bg-[#124bbf]"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};
