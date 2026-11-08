import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  ArrowUp, 
  Mic, 
  MicOff, 
  FileText, 
  ShieldAlert, 
  Scale, 
  Paperclip, 
  X, 
  Sparkles,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Attachment } from '../types/legal';

interface ChatInputProps {
  onSendMessage: (text: string, attachments?: Attachment[]) => void;
  onOpenDraftingModal: () => void;
  onOpenContractReviewModal: () => void;
  onOpenCaseSearchModal: () => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onOpenDraftingModal,
  onOpenContractReviewModal,
  onOpenCaseSearchModal,
  isLoading = false
}) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [reasoningMode, setReasoningMode] = useState<'quick' | 'deep'>('deep');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || isLoading) return;
    onSendMessage(text.trim(), attachments);
    setText('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleAttachLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newAttach: Attachment = {
      id: `att_${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'document'
    };
    setAttachments(prev => [...prev, newAttach]);
    setShowAttachMenu(false);
  };

  const handleAttachSample = (title: string, size: string) => {
    const sampleAttach: Attachment = {
      id: `att_sample_${Date.now()}`,
      name: title,
      size,
      type: 'contract'
    };
    setAttachments(prev => [...prev, sampleAttach]);
    setShowAttachMenu(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Simulate real speech-to-text recognition
      const mockSpokenText = '请针对对方拖欠工程进度款超过90天的违约责任，出具一份具有法律约束力的催告律师函并起诉状。';
      let i = 0;
      const interval = setInterval(() => {
        if (i < mockSpokenText.length) {
          setText(prev => prev + mockSpokenText[i]);
          i++;
        } else {
          clearInterval(interval);
          setIsRecording(false);
        }
      }, 70);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Container matching Doubao's signature large rounded card */}
      <div className="relative bg-white rounded-3xl border border-[#d0d5dd] shadow-sm hover:border-[#b2ccff] focus-within:border-[#155eef] focus-within:ring-2 focus-within:ring-[#155eef]/15 transition-all">
        {/* Attachment chips if present */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1 border-b border-[#f2f4f7]">
            {attachments.map(att => (
              <div
                key={att.id}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f8f9fa] border border-[#eaecf0] rounded-lg text-xs text-[#344054]"
              >
                <Paperclip className="w-3.5 h-3.5 text-[#667085]" />
                <span className="font-medium truncate max-w-[200px]">{att.name}</span>
                <span className="text-[10px] text-[#98a2b3]">({att.size})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(att.id)}
                  className="p-0.5 hover:text-red-600 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input Area */}
        <div className="px-4 pt-3 pb-1">
          <textarea
            ref={textareaRef}
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? '正在倾听语音输入并实时转录为法律专业用语...' : '发消息或按住空格说话... (输入法律问题、粘贴合同条款或上传文书)'}
            className="w-full text-[13.5px] leading-relaxed text-[#101828] placeholder-[#98a2b3] bg-transparent resize-none border-0 focus:outline-none focus:ring-0"
          />
        </div>

        {/* BOTTOM TOOLBAR: The requested 3 primary fast legal tools + actions */}
        <div className="px-3 pb-2.5 pt-1 flex items-center justify-between gap-2 flex-wrap">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Attachment Plus button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#475467] hover:bg-[#f2f4f7] hover:text-[#101828] transition-colors"
                title="添加附件或载入合同样本"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Attach Dropdown Menu */}
              {showAttachMenu && (
                <div className="absolute left-0 bottom-10 z-20 w-64 bg-white border border-[#eaecf0] rounded-xl shadow-lg p-2 text-xs text-[#344054] space-y-1">
                  <div className="text-[10px] font-semibold text-[#98a2b3] px-2 py-1">上传或载入</div>
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#f9fafb] text-left transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-[#155eef]" />
                    <span>上传本地合同 / 文书 (Word/PDF)</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleAttachLocalFile}
                  />

                  <div className="text-[10px] font-semibold text-[#98a2b3] px-2 py-1 pt-1.5 border-t border-[#f2f4f7]">
                    载入经典审查样本
                  </div>
                  <button
                    onClick={() => handleAttachSample('软件开发定制采购合同.docx', '342 KB')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#f9fafb] text-left transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#d92d20]" />
                    <span className="truncate">软件开发定制采购合同.docx</span>
                  </button>
                  <button
                    onClick={() => handleAttachSample('商业办公楼租赁合同(霸王条款版).docx', '218 KB')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#f9fafb] text-left transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#f79009]" />
                    <span className="truncate">商业办公租赁合同(含陷阱).docx</span>
                  </button>
                </div>
              )}
            </div>

            <div className="w-[1px] h-4 bg-[#eaecf0] mx-0.5" />

            {/* TOOL 1: 智能法律文书撰写 */}
            <button
              type="button"
              onClick={onOpenDraftingModal}
              className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#344054] hover:text-[#155eef] hover:bg-[#eff8ff] transition-all"
              title="一键起草各类起诉状、答辩状、律师函、商事合同与劳动仲裁书"
            >
              <FileText className="w-3.5 h-3.5 text-[#155eef] group-hover:scale-110 transition-transform" />
              <span>智能法律文书撰写</span>
            </button>

            {/* TOOL 2: 合同风险智能审查与红线批注 */}
            <button
              type="button"
              onClick={onOpenContractReviewModal}
              className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#344054] hover:text-[#d92d20] hover:bg-[#fef3f2] transition-all"
              title="自动扫描霸王条款与法律陷阱，生成可替换的 Word 级红线修改批注"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#d92d20] group-hover:scale-110 transition-transform" />
              <span>合同风险智能审查与红线批注</span>
            </button>

            {/* TOOL 3: 精准法规检索与类似案例对比 */}
            <button
              type="button"
              onClick={onOpenCaseSearchModal}
              className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#344054] hover:text-[#7f56d9] hover:bg-[#f9f5ff] transition-all"
              title="直通民法典及最新司法解释，生成最高院类似判例裁判思路比对矩阵"
            >
              <Scale className="w-3.5 h-3.5 text-[#7f56d9] group-hover:scale-110 transition-transform" />
              <span>精准法规检索与类似案例对比</span>
            </button>
          </div>

          {/* Right Action Tools: Reasoning Mode, Voice, Send */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Reasoning depth toggle */}
            <button
              type="button"
              onClick={() => setReasoningMode(prev => prev === 'deep' ? 'quick' : 'deep')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                reasoningMode === 'deep'
                  ? 'bg-[#eff8ff] text-[#175cd3] border border-[#b2ccff]'
                  : 'bg-[#f2f4f7] text-[#475467] hover:bg-[#eaecf0]'
              }`}
              title="切换推理模式：深度法律研判（援引法条与司法判例）或 快速解答"
            >
              {reasoningMode === 'deep' ? (
                <>
                  <Sparkles className="w-3 h-3 text-[#155eef]" />
                  <span>深度法律研判</span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 text-[#f79009]" />
                  <span>快速模式</span>
                </>
              )}
            </button>

            {/* Voice Input */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-[#475467] hover:bg-[#f2f4f7] hover:text-[#101828]'
              }`}
              title={isRecording ? '点击结束语音录入' : '语音输入'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={(!text.trim() && attachments.length === 0) || isLoading}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                (text.trim() || attachments.length > 0) && !isLoading
                  ? 'bg-[#101828] text-white hover:bg-[#1d2939] shadow-xs'
                  : 'bg-[#f2f4f7] text-[#98a2b3] cursor-not-allowed'
              }`}
              title="发送"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle tips text */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-[#98a2b3] mt-2 select-none">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>内容由法律AI模型生成，请在签署前经专业执业律师复核</span>
        </span>
        <span>·</span>
        <span>回车直接发送，Shift + 回车换行</span>
      </div>
    </div>
  );
};
