import React from 'react';
import { 
  PanelLeft, 
  Volume2, 
  VolumeX, 
  MoreHorizontal, 
  RotateCcw, 
  Share2,
  FileDown
} from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  mode: 'chat' | 'workbench';
  onModeChange: (mode: 'chat' | 'workbench') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetChat: () => void;
  onExportDoc?: () => void;
  chatTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  mode,
  onModeChange,
  isMuted,
  onToggleMute,
  onResetChat,
  onExportDoc,
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

      {/* Center: Mode switcher (can also be toggled here or on hero) */}
      <div className="flex items-center p-0.5 bg-[#f2f4f7] rounded-lg border border-[#eaecf0]">
        <button
          onClick={() => onModeChange('chat')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            mode === 'chat'
              ? 'bg-white text-[#101828] shadow-xs'
              : 'text-[#667085] hover:text-[#101828]'
          }`}
        >
          对话
        </button>
        <button
          onClick={() => onModeChange('workbench')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            mode === 'workbench'
              ? 'bg-white text-[#101828] shadow-xs'
              : 'text-[#667085] hover:text-[#101828]'
          }`}
        >
          工作
        </button>
      </div>

      {/* Right: Sound, Share, More */}
      <div className="flex items-center gap-1">
        {onExportDoc && (
          <button
            onClick={onExportDoc}
            className="p-1.5 text-[#475467] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors"
            title="导出当前文书/审查报告"
          >
            <FileDown className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onResetChat}
          className="p-1.5 text-[#475467] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors"
          title="清空并开启新咨询"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleMute}
          className="p-1.5 text-[#475467] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors"
          title={isMuted ? '取消静音' : '静音'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => alert('已将当前法务咨询与红线比对报告复制到分享剪贴板！')}
          className="p-1.5 text-[#475467] hover:text-[#101828] hover:bg-[#f2f4f7] rounded-lg transition-colors"
          title="分享"
        >
          <Share2 className="w-4 h-4" />
        </button>

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
