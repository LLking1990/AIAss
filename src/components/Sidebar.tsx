import React, { useState } from 'react';
import { 
  SquarePen, 
  MessageSquare, 
  Grid, 
  Search, 
  Settings, 
  Pin, 
  Trash2, 
  FileText,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Conversation } from '../types/legal';

interface SidebarProps {
  conversations: Conversation[];
  activeConvId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onNewWorkbenchTask: () => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onOpenSettings: () => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConvId,
  onSelectConversation,
  onNewChat,
  onNewWorkbenchTask,
  onDeleteConversation,
  onTogglePin,
  onOpenSettings,
  isOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const pinnedConvs = conversations.filter(c => c.isPinned);
  const draftConvs = conversations.filter(c => c.category === 'draft');
  const recentConvs = conversations.filter(c => !c.isPinned && c.category !== 'draft');

  const filteredRecent = searchQuery
    ? recentConvs.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : recentConvs;

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="w-64 h-full bg-[#fbfbfc] border-r border-[#eaecf0] flex flex-col shrink-0 select-none text-[13px] text-[#344054]">
      {/* Top Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#f2f4f7]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#155eef] to-[#2e90fa] flex items-center justify-center text-white font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-[#101828]">法言智办</span>
          <span className="text-[10px] bg-[#eff8ff] text-[#175cd3] px-1.5 py-0.5 rounded font-medium">办公版</span>
        </div>
        <button
          onClick={() => setIsSearching(!isSearching)}
          className="p-1.5 text-[#667085] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-md transition-colors"
          title="搜索对话与文书"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Search Bar if active */}
      {isSearching && (
        <div className="px-3 pt-2">
          <input
            type="text"
            autoFocus
            placeholder="搜索历史对话或法条..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#d0d5dd] rounded-lg focus:outline-none focus:border-[#155eef] focus:ring-1 focus:ring-[#155eef]"
          />
        </div>
      )}

      {/* Primary Actions: Clean and focused */}
      <div className="px-3 py-3 space-y-1">
        <button
          onClick={onNewWorkbenchTask}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors text-left"
        >
          <SquarePen className="w-4 h-4 text-[#475467]" />
          <span>新工作任务</span>
        </button>

        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors text-left"
        >
          <MessageSquare className="w-4 h-4 text-[#475467]" />
          <span>新对话</span>
        </button>
      </div>

      <div className="h-[1px] bg-[#f2f4f7] mx-3 my-1" />

      {/* Scrollable Conversation Lists */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* Drafts */}
        {draftConvs.length > 0 && (
          <div>
            <div className="text-[11px] font-medium text-[#98a2b3] px-2 mb-1">草稿</div>
            <div className="space-y-0.5">
              {draftConvs.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    activeConvId === conv.id ? 'bg-[#f2f4f7] text-[#101828] font-medium' : 'text-[#475467] hover:bg-[#f9fafb]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-[#98a2b3] shrink-0" />
                    <span className="truncate text-xs">{conv.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pinned */}
        {pinnedConvs.length > 0 && (
          <div>
            <div className="text-[11px] font-medium text-[#98a2b3] px-2 mb-1">置顶</div>
            <div className="space-y-0.5">
              {pinnedConvs.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    activeConvId === conv.id ? 'bg-[#f2f4f7] text-[#101828] font-medium' : 'text-[#475467] hover:bg-[#f9fafb]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#155eef]/70 shrink-0" />
                    <span className="truncate text-xs">{conv.title}</span>
                  </div>
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => onTogglePin(conv.id, e)}
                      title="取消置顶"
                      className="p-1 hover:text-[#101828]"
                    >
                      <Pin className="w-3 h-3 fill-current text-[#155eef]" />
                    </button>
                    <button
                      onClick={(e) => onDeleteConversation(conv.id, e)}
                      title="删除"
                      className="p-1 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3 text-[#98a2b3]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Conversations */}
        <div>
          <div className="text-[11px] font-medium text-[#98a2b3] px-2 mb-1">最近</div>
          <div className="space-y-0.5">
            {filteredRecent.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  activeConvId === conv.id ? 'bg-[#f2f4f7] text-[#101828] font-medium' : 'text-[#475467] hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3.5 h-3.5 rounded-full border border-[#d0d5dd] flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#98a2b3]" />
                  </div>
                  <span className="truncate text-xs">{conv.title}</span>
                </div>
                <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => onTogglePin(conv.id, e)}
                    title="置顶对话"
                    className="p-1 hover:text-[#155eef]"
                  >
                    <Pin className="w-3 h-3 text-[#98a2b3]" />
                  </button>
                  <button
                    onClick={(e) => onDeleteConversation(conv.id, e)}
                    title="删除"
                    className="p-1 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3 text-[#98a2b3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-[#f2f4f7] flex items-center justify-between bg-white/70">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#101828] text-white flex items-center justify-center font-medium text-xs shrink-0 ring-2 ring-white">
            张
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#101828] truncate flex items-center gap-1">
              <span>用户9527 · 张法务</span>
              <ChevronRight className="w-3 h-3 text-[#98a2b3]" />
            </div>
            <div className="text-[11px] text-[#667085] truncate">高级企业法律顾问</div>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="p-1.5 text-[#667085] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-md transition-colors"
          title="系统与偏好设置"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
