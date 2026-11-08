import React, { useState } from 'react';
import { 
  FileText, 
  Save, 
  Copy, 
  Check, 
  FileDown, 
  Printer, 
  Eye, 
  Code2, 
  Sparkles, 
  Stamp, 
  CheckCircle, 
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { LegalDocument, RedlineItem } from '../types/legal';

interface WorkbenchSplitProps {
  document: LegalDocument | null;
  redlines?: RedlineItem[];
  onSave?: (updatedText: string) => void;
  onCloseWorkbench?: () => void;
}

export const WorkbenchSplit: React.FC<WorkbenchSplitProps> = ({
  document,
  redlines = [],
  onSave
}) => {
  const [editorText, setEditorText] = useState(
    document?.fullText ||
      `民事起诉状（买卖合同纠纷）

原告：上海鼎盛智能装备有限公司
法定代表人：张振华
住所地：上海市浦东新区张江高科技园区博云路111号
联系电话：13800138000

被告：苏州创联精工机械制造有限公司
法定代表人：李建民
住所地：江苏省苏州市工业园区星湖街328号
统一社会信用代码：91320500******789A

诉讼请求：
1. 判令被告立即向原告支付拖欠设备货款本金人民币 865,000 元整；
2. 判令被告按一年期LPR的1.5倍计付逾期付款违约金（暂计至起诉之日为 38,420 元）；
3. 判令本案全部诉讼费、保全申请费由被告承担。

事实与理由：
2024年10月15日，原告与被告签订《数控机床成套设备采购合同》，约定原告向被告供应5台五轴数控加工中心，总价款为2,880,000元。原告依约按期交付全部设备并于2024年11月经被告组织技术人员现场检验合格并签署《终验合格单》。依合同约定，被告应于终验合格后30日内付清剩余30%尾款（计865,000元）。
然而经原告多次书面催告及专人跟进，被告以资金周转困难为由无理拒付至今，严重侵害原告合法财产权益。

此致
苏州市工业园区人民法院

具状人：上海鼎盛智能装备有限公司（盖章）
日期：2026年3月18日`
  );

  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'redline'>('preview');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (onSave) onSave(editorText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editorText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document?.title || '法律文书工作台草稿'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full lg:w-[48%] h-full bg-white border-l border-[#eaecf0] flex flex-col shrink-0 select-none">
      {/* Workbench Header */}
      <div className="h-14 px-4 border-b border-[#eaecf0] flex items-center justify-between bg-[#fbfbfc]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#155eef]" />
          <span className="font-semibold text-xs text-[#101828] truncate max-w-[180px]">
            {document?.title || '协同工作台 · 文书草稿'}
          </span>
          <span className="text-[10px] bg-[#ecfdf3] text-[#027a48] px-1.5 py-0.5 rounded font-medium">
            实时同步
          </span>
        </div>

        {/* View mode tabs */}
        <div className="flex items-center p-0.5 bg-[#f2f4f7] rounded-lg">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'preview' ? 'bg-white text-[#101828] shadow-xs' : 'text-[#667085] hover:text-[#101828]'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>规范排版</span>
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'edit' ? 'bg-white text-[#101828] shadow-xs' : 'text-[#667085] hover:text-[#101828]'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>编辑正文</span>
          </button>
          {redlines.length > 0 && (
            <button
              onClick={() => setActiveTab('redline')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'redline' ? 'bg-white text-[#d92d20] shadow-xs' : 'text-[#667085] hover:text-[#101828]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#d92d20]" />
              <span>红线对比 ({redlines.length})</span>
            </button>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              isSaved
                ? 'bg-[#12b76a] text-white'
                : 'text-[#155eef] bg-[#eff8ff] hover:bg-[#d1e9ff]'
            }`}
          >
            {isSaved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? '已保存' : '保存'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 text-[#667085] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors"
            title="复制正文"
          >
            {copied ? <Check className="w-4 h-4 text-[#12b76a]" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 text-[#667085] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors"
            title="导出文本"
          >
            <FileDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 text-[#667085] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors"
            title="打印"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content Body */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#fcfcfd]">
        {activeTab === 'edit' ? (
          <div className="h-full flex flex-col">
            <textarea
              value={editorText}
              onChange={(e) => setEditorText(e.target.value)}
              className="w-full flex-1 p-4 font-mono text-xs leading-relaxed text-[#101828] bg-white border border-[#d0d5dd] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#155eef] focus:border-[#155eef] resize-none"
              placeholder="在此直接编辑文书正文..."
            />
          </div>
        ) : activeTab === 'preview' ? (
          <div className="bg-white border border-[#eaecf0] shadow-xs rounded-xl p-6 font-serif text-[13px] leading-loose text-[#101828] space-y-4 max-w-2xl mx-auto">
            <div className="text-center pb-3 border-b border-[#eaecf0]">
              <h1 className="text-base font-bold font-sans tracking-wide text-[#101828]">
                {document?.title || '民事起诉状'}
              </h1>
              <div className="text-xs text-[#667085] font-sans mt-0.5">标准法律公文格式</div>
            </div>

            <div className="whitespace-pre-line text-xs font-sans text-[#1d2939] leading-relaxed">
              {editorText}
            </div>

            <div className="pt-6 flex items-end justify-between font-sans text-xs border-t border-[#eaecf0]">
              <div className="text-[#98a2b3] text-[11px]">
                <div>法言智办 · 电子卷宗认证存证</div>
                <div>存证哈希：sha256_8f9a2b7c4d1e</div>
              </div>
              <div className="text-right space-y-1 relative pr-4">
                <div className="text-[#475467]">具状人/发起方（盖章）：</div>
                <div className="font-semibold text-[#101828]">{document?.parties?.[0]?.name || '上海鼎盛智能装备有限公司'}</div>
                <div className="text-[#98a2b3]">{document?.signatureDate || '2026年3月18日'}</div>
                <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
                  <Stamp className="w-10 h-10 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Redline view in workbench */
          <div className="space-y-3">
            <div className="text-xs font-medium text-[#344054] mb-1">合同红线修订痕迹：</div>
            {redlines.map((rl) => (
              <div key={rl.id} className="bg-white border border-[#eaecf0] rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#101828]">{rl.clauseNumber} · {rl.clauseTitle}</span>
                  <span className="text-[10px] bg-[#fef3f2] text-[#d92d20] px-1.5 py-0.5 rounded font-medium">
                    {rl.riskTitle}
                  </span>
                </div>
                <div className="line-through text-[#b42318] bg-[#fef3f2] p-1.5 rounded">
                  {rl.originalText}
                </div>
                <div className="text-[#027a48] bg-[#ecfdf3] p-1.5 rounded font-medium">
                  {rl.revisedText}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workbench Footer Status */}
      <div className="h-9 px-4 border-t border-[#eaecf0] bg-white flex items-center justify-between text-[11px] text-[#667085]">
        <span>字符统计：{editorText.length} 字</span>
        <span className="flex items-center gap-1 text-[#155eef]">
          <CheckCircle className="w-3 h-3" />
          <span>合规格式校验通过</span>
        </span>
      </div>
    </div>
  );
};
