import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { DraftingModal } from './components/DraftingModal';
import { ContractReviewModal } from './components/ContractReviewModal';
import { CaseSearchModal } from './components/CaseSearchModal';
import { RedlineDiffViewer } from './components/RedlineDiffViewer';
import { CaseComparisonCard } from './components/CaseComparisonCard';
import { LegalDocPreview } from './components/LegalDocPreview';
import { WorkbenchSplit } from './components/WorkbenchSplit';
import { SettingsModal } from './components/UtilityModals';
import { 
  Conversation, 
  Message, 
  LegalDocument, 
  ContractReviewResult, 
  CaseComparisonResult,
  Attachment 
} from './types/legal';
import { 
  INITIAL_CONVERSATIONS, 
  RECOMMENDED_PROMPTS, 
  SAMPLE_CONTRACTS_FOR_REVIEW 
} from './data/legalPresets';
import { 
  generateLegalDocument, 
  reviewContractWithRedline, 
  searchCaseLawAndStatutes, 
  sendChatMessage 
} from './services/legalAiService';
import { Sparkles, ArrowRight, ShieldCheck, FileText, Scale } from 'lucide-react';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mode, setMode] = useState<'chat' | 'workbench'>('chat');
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Active documents & review state for workbench & export
  const [activeDoc, setActiveDoc] = useState<LegalDocument | null>(null);
  const [activeReview, setActiveReview] = useState<ContractReviewResult | null>(null);

  // Modals state
  const [isDraftingModalOpen, setIsDraftingModalOpen] = useState(false);
  const [isContractReviewModalOpen, setIsContractReviewModalOpen] = useState(false);
  const [isCaseSearchModalOpen, setIsCaseSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isLoading]);

  // Handle new conversation
  const handleNewChat = () => {
    setActiveConvId(null);
  };

  const handleNewWorkbenchTask = () => {
    setMode('workbench');
    setIsDraftingModalOpen(true);
  };

  // Delete conversation
  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId(null);
    }
  };

  // Toggle pin
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Helper to append message to active conversation or create new one
  const appendMessage = (
    userMsg: Message,
    assistantMsg: Message,
    titleHint?: string
  ) => {
    const timeStr = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    if (!activeConvId) {
      const newId = `conv_${Date.now()}`;
      const newConv: Conversation = {
        id: newId,
        title: titleHint || userMsg.content.slice(0, 18) || '新法务咨询',
        updatedAt: timeStr,
        category: 'recent',
        messages: [userMsg, assistantMsg]
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newId);
    } else {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? {
                ...c,
                updatedAt: timeStr,
                messages: [...c.messages, userMsg, assistantMsg]
              }
            : c
        )
      );
    }
  };

  // 1. Send ordinary text message or with attachments
  const handleSendMessage = async (text: string, attachments?: Attachment[]) => {
    const timeStr = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const userMsg: Message = {
      id: `m_user_${Date.now()}`,
      sender: 'user',
      timestamp: timeStr,
      content: text,
      attachments
    };

    setIsLoading(true);

    // If attachments include contract sample or user asks for review
    const isContractReviewIntent =
      attachments?.some((a) => a.type === 'contract') ||
      text.includes('审查合同') ||
      text.includes('红线批注') ||
      text.includes('合同风险');

    const isDraftingIntent =
      text.includes('起草') || text.includes('撰写') || text.includes('起诉状') || text.includes('协议');

    const isCaseSearchIntent =
      text.includes('检索') || text.includes('判例') || text.includes('指导案例') || text.includes('法条');

    if (isContractReviewIntent) {
      const sample = SAMPLE_CONTRACTS_FOR_REVIEW[0];
      const reviewResult = await reviewContractWithRedline(sample.title, sample.content);
      setActiveReview(reviewResult);

      const assistantMsg: Message = {
        id: `m_ast_${Date.now()}`,
        sender: 'assistant',
        timestamp: timeStr,
        content: `已为您完成对《${reviewResult.contractName}》的深度合规扫描与红线批注。共发现 ${reviewResult.stats.highRisks} 项高危条款及 ${reviewResult.stats.mediumRisks} 项中危条款，详情已为您生成交互式红线对比视图：`,
        type: 'contract_review',
        metadata: { contractReview: reviewResult }
      };

      appendMessage(userMsg, assistantMsg, `合同审查：${reviewResult.contractName}`);
      setIsLoading(false);
      return;
    }

    if (isDraftingIntent) {
      const doc = await generateLegalDocument({
        docType: '诉讼文书',
        title: '民事起诉状',
        caseType: '买卖合同纠纷',
        plaintiff: '上海鼎盛智能装备有限公司',
        defendant: '苏州创联精工机械制造有限公司',
        claimAmount: '865,000元',
        court: '苏州市工业园区人民法院',
        keyFacts: text || '原告依约履行供货义务，被告逾期拒绝清偿设备尾款。'
      });
      setActiveDoc(doc);

      const assistantMsg: Message = {
        id: `m_ast_${Date.now()}`,
        sender: 'assistant',
        timestamp: timeStr,
        content: `已依据《民法典》及法定诉讼要件为您起草完成《${doc.title}》。文书包含标准原被告当事人信息、诉讼请求、事实理由及法律依据：`,
        type: 'drafting',
        metadata: { document: doc }
      };

      appendMessage(userMsg, assistantMsg, doc.title);
      setIsLoading(false);
      return;
    }

    if (isCaseSearchIntent) {
      const caseResult = await searchCaseLawAndStatutes(text);
      const assistantMsg: Message = {
        id: `m_ast_${Date.now()}`,
        sender: 'assistant',
        timestamp: timeStr,
        content: `为您检索到关于【${caseResult.queryTopic}】的核心法律条文及最高人民法院相似判例裁判要旨矩阵：`,
        type: 'case_comparison',
        metadata: { caseComparison: caseResult }
      };

      appendMessage(userMsg, assistantMsg, `案例检索：${caseResult.queryTopic}`);
      setIsLoading(false);
      return;
    }

    // Default chat via legal ai service
    const history = (activeConv?.messages || []).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content
    }));

    const reply = await sendChatMessage(text, history);

    const assistantMsg: Message = {
      id: `m_ast_${Date.now()}`,
      sender: 'assistant',
      timestamp: timeStr,
      content: reply,
      type: 'general'
    };

    appendMessage(userMsg, assistantMsg, text.slice(0, 16));
    setIsLoading(false);
  };

  // 2. Submit from Drafting Modal
  const handleDraftingSubmit = async (params: {
    templateId?: string;
    docType: '诉讼文书' | '合同协议' | '函件通知' | '公司决议' | '合规备忘录';
    title: string;
    caseType: string;
    plaintiff: string;
    defendant: string;
    claimAmount?: string;
    court?: string;
    keyFacts: string;
  }) => {
    setIsLoading(true);
    const timeStr = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const userMsg: Message = {
      id: `m_user_${Date.now()}`,
      sender: 'user',
      timestamp: timeStr,
      content: `请帮我生成一份《${params.title}》，当事人原告/甲方为【${params.plaintiff}】，被告/乙方为【${params.defendant}】，标的金额：${params.claimAmount || '见约定'}，核心事实：${params.keyFacts}`
    };

    const doc = await generateLegalDocument(params);
    setActiveDoc(doc);

    const assistantMsg: Message = {
      id: `m_ast_${Date.now()}`,
      sender: 'assistant',
      timestamp: timeStr,
      content: `已为您智能起草完成《${doc.title}》。文书严格对照法定起诉/签署格式，文书已排版就绪，您可以一键复制、导出Word或在右侧工作台中并排编辑：`,
      type: 'drafting',
      metadata: { document: doc }
    };

    appendMessage(userMsg, assistantMsg, `起草：${doc.title}`);
    setIsLoading(false);
  };

  // 3. Submit from Contract Review Modal
  const handleContractReviewSubmit = async (title: string, content: string) => {
    setIsLoading(true);
    const timeStr = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const userMsg: Message = {
      id: `m_user_${Date.now()}`,
      sender: 'user',
      timestamp: timeStr,
      content: `请对以下合同进行深度风险审查与红线批注：《${title}》\n\n${content.slice(0, 120)}...`
    };

    const review = await reviewContractWithRedline(title, content);
    setActiveReview(review);

    const assistantMsg: Message = {
      id: `m_ast_${Date.now()}`,
      sender: 'assistant',
      timestamp: timeStr,
      content: `已完成对《${review.contractName}》的条款逐行审查，合规评分【${review.overallScore}/100】。识别出 ${review.stats.highRisks} 个高风险陷阱与霸王条款，已为您生成对应红线修改对比：`,
      type: 'contract_review',
      metadata: { contractReview: review }
    };

    appendMessage(userMsg, assistantMsg, `审查：${review.contractName}`);
    setIsLoading(false);
  };

  // 4. Submit from Case Search Modal
  const handleCaseSearchSubmit = async (query: string) => {
    setIsLoading(true);
    const timeStr = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const userMsg: Message = {
      id: `m_user_${Date.now()}`,
      sender: 'user',
      timestamp: timeStr,
      content: `检索法规与司法判例：${query}`
    };

    const caseData = await searchCaseLawAndStatutes(query);

    const assistantMsg: Message = {
      id: `m_ast_${Date.now()}`,
      sender: 'assistant',
      timestamp: timeStr,
      content: `已完成对“${caseData.queryTopic}”的法律检索。为您匹配了最新现行法条依据及最高人民法院审判裁判要旨对比：`,
      type: 'case_comparison',
      metadata: { caseComparison: caseData }
    };

    appendMessage(userMsg, assistantMsg, `案例对比：${caseData.queryTopic}`);
    setIsLoading(false);
  };

  // Quick prompt click from "为你推荐" on hero
  const handlePromptClick = (p: typeof RECOMMENDED_PROMPTS[0]) => {
    if (p.type === 'contract_review') {
      setIsContractReviewModalOpen(true);
    } else if (p.type === 'drafting') {
      setIsDraftingModalOpen(true);
    } else if (p.type === 'case_comparison') {
      handleCaseSearchSubmit(p.query);
    } else {
      handleSendMessage(p.text);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-[#101828]">
      {/* 1. Left Sidebar matching reference image */}
      <Sidebar
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={(id) => setActiveConvId(id)}
        onNewChat={handleNewChat}
        onNewWorkbenchTask={handleNewWorkbenchTask}
        onDeleteConversation={handleDeleteConversation}
        onTogglePin={handleTogglePin}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isOpen={sidebarOpen}
      />

      {/* 2. Main Center / Split Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          mode={mode}
          onModeChange={setMode}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          onResetChat={handleNewChat}
          onExportDoc={() => {
            if (activeDoc) {
              alert(`已准备好导出《${activeDoc.title}》标准电子卷宗！`);
            } else {
              alert('当前对话暂未生成文书，您可点击底部【智能法律文书撰写】生成！');
            }
          }}
          chatTitle={activeConv?.title}
        />

        {/* Content Body: Chat + Optional Workbench Split */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Main Chat Flow */}
          <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
            {/* Messages Area or Welcome Hero */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {!activeConv || activeConv.messages.length === 0 ? (
                /* HEROPAGE MATCHING DOUBAO SCREENSHOT */
                <div className="max-w-2xl mx-auto min-h-full flex flex-col justify-center items-center text-center px-4 py-8">
                  {/* Big Welcoming Headline */}
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101828] mb-6">
                    有什么我能帮你的吗？
                  </h1>

                  {/* Segmented Control Pill matching screenshot: [ 对话 ] [ 工作 ] */}
                  <div className="inline-flex p-1 bg-[#f2f4f7] rounded-full border border-[#eaecf0] mb-10 shadow-2xs">
                    <button
                      onClick={() => setMode('chat')}
                      className={`px-8 py-2 text-xs font-semibold rounded-full transition-all ${
                        mode === 'chat'
                          ? 'bg-white text-[#101828] shadow-xs'
                          : 'text-[#667085] hover:text-[#101828]'
                      }`}
                    >
                      对话
                    </button>
                    <button
                      onClick={() => setMode('workbench')}
                      className={`px-8 py-2 text-xs font-semibold rounded-full transition-all ${
                        mode === 'workbench'
                          ? 'bg-white text-[#101828] shadow-xs'
                          : 'text-[#667085] hover:text-[#101828]'
                      }`}
                    >
                      工作
                    </button>
                  </div>

                  {/* "为你推荐" Section */}
                  <div className="w-full text-left space-y-2.5">
                    <div className="text-[11px] font-medium text-[#98a2b3] px-1">为你推荐</div>

                    <div className="space-y-2">
                      {RECOMMENDED_PROMPTS.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePromptClick(p)}
                          className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-[#eaecf0] hover:border-[#155eef] hover:bg-[#eff8ff]/20 text-left transition-all group shadow-2xs"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="text-[10px] font-semibold text-[#155eef] bg-[#eff8ff] px-2 py-0.5 rounded-full shrink-0">
                              {p.tag}
                            </span>
                            <span className="text-xs text-[#344054] group-hover:text-[#101828] font-medium truncate">
                              {p.text}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#98a2b3] group-hover:text-[#155eef] shrink-0 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* CHAT MESSAGES STREAM */
                <div className="max-w-4xl mx-auto space-y-6 pb-6">
                  {activeConv.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {/* Assistant Avatar */}
                      {msg.sender === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#155eef] to-[#2e90fa] text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-xs">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      )}

                      {/* Message Content Container */}
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-[#101828] text-white rounded-tr-xs'
                            : 'bg-white border border-[#eaecf0] text-[#101828] rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {/* Attachments if any */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2 pb-2 border-b border-white/20">
                            {msg.attachments.map((att) => (
                              <span
                                key={att.id}
                                className="text-[11px] bg-white/10 px-2 py-0.5 rounded font-mono"
                              >
                                📎 {att.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Plain text body */}
                        <div className="whitespace-pre-line">{msg.content}</div>

                        {/* SPECIAL RENDERER: Document Drafting Card */}
                        {msg.metadata?.document && (
                          <div className="mt-3">
                            <LegalDocPreview
                              document={msg.metadata.document}
                              onOpenInWorkbench={(doc) => {
                                setActiveDoc(doc);
                                setMode('workbench');
                              }}
                            />
                          </div>
                        )}

                        {/* SPECIAL RENDERER: Contract Redline Review */}
                        {msg.metadata?.contractReview && (
                          <div className="mt-3">
                            <RedlineDiffViewer
                              review={msg.metadata.contractReview}
                              onExportWord={() =>
                                alert('正在生成带修订跟踪标记的 Word 文档并下载...')
                              }
                            />
                          </div>
                        )}

                        {/* SPECIAL RENDERER: Legal & Case Precedent Comparison */}
                        {msg.metadata?.caseComparison && (
                          <div className="mt-3">
                            <CaseComparisonCard data={msg.metadata.caseComparison} />
                          </div>
                        )}

                        {/* Message Timestamp */}
                        <div
                          className={`text-[10px] mt-1.5 text-right ${
                            msg.sender === 'user' ? 'text-white/60' : 'text-[#98a2b3]'
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>

                      {/* User Avatar */}
                      {msg.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-[#344054] text-white flex items-center justify-center font-medium text-xs shrink-0">
                          张
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#155eef] to-[#2e90fa] text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                        <ShieldCheck className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="bg-[#f9fafb] border border-[#eaecf0] rounded-2xl px-4 py-2.5 text-xs text-[#667085] flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#155eef] animate-pulse" />
                        <span>正在进行深度法规检索与红线研判中...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* THE SIGNATURE BOTTOM INPUT & TOOLBAR WITH THE 3 REQUESTED QUICK TOOLS */}
            <ChatInput
              onSendMessage={handleSendMessage}
              onOpenDraftingModal={() => setIsDraftingModalOpen(true)}
              onOpenContractReviewModal={() => setIsContractReviewModalOpen(true)}
              onOpenCaseSearchModal={() => setIsCaseSearchModalOpen(true)}
              isLoading={isLoading}
            />
          </div>

          {/* Optional Workbench Split (when mode === 'workbench') */}
          {mode === 'workbench' && (
            <WorkbenchSplit
              document={activeDoc}
              redlines={activeReview?.redlines || []}
              onSave={(text) => {
                if (activeDoc) {
                  setActiveDoc({ ...activeDoc, fullText: text });
                }
              }}
              onCloseWorkbench={() => setMode('chat')}
            />
          )}
        </div>
      </div>

      {/* 3. The 3 Primary Modals Requested by User */}
      <DraftingModal
        isOpen={isDraftingModalOpen}
        onClose={() => setIsDraftingModalOpen(false)}
        onSubmitDraft={handleDraftingSubmit}
      />

      <ContractReviewModal
        isOpen={isContractReviewModalOpen}
        onClose={() => setIsContractReviewModalOpen(false)}
        onSubmitReview={handleContractReviewSubmit}
      />

      <CaseSearchModal
        isOpen={isCaseSearchModalOpen}
        onClose={() => setIsCaseSearchModalOpen(false)}
        onSubmitSearch={handleCaseSearchSubmit}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
