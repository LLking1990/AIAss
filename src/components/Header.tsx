import React from 'react';
import { PanelLeft, MoreHorizontal } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  mode: 'chat' | 'workbench';
  onModeChange?: (mode: 'chat' | 'workbench') => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onResetChat?: () => void;
  onExportDoc?: () => void;
  chatTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  mode,
  chatTitle
}) => {
  return (
    <header className="h-14 px-4 flex items-center justify-between border-b border-[#f2f4f7] bg-white shrink-0 select-none">
      {/* Left: Sidebar Toggle & Context Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-[#475467] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors"
          title="切换侧边栏"
        >
          {/* Custom Doubao style split panel icon */}
          <PanelLeft className="w-4 h-4" />
        </button>

        {chatTitle ? (
          <div className="flex items-center gap-2 text-xs text-[#344054]">
            <span className="font-medium text-[#101828] truncate max-w-[260px]">{chatTitle}</span>
            <span className="text-[#d0d5dd]">/</span>
            <span className="text-[#667085]">{mode === 'chat' ? '智能对话模式' : '协同工作台模式'}</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#667085]">
            <span>个人法务与综合办公中枢</span>
          </div>
        )}
      </div>


      {/* Right: More */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => alert('更多选项：\n1. 导出案卷归档 (ZIP)\n2. 法规库版本：2026最新施行版\n3. 文书印章与格式微调')}
          className="p-1.5 text-[#475467] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors"
          title="更多"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
