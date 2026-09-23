import React from 'react';
import { Sparkles, BookOpen, ScrollText, UserCheck, User, Columns, Server } from 'lucide-react';
import type { BrandDto } from '../../types/brand';
import { Button } from '../common/Button';

export type ViewMode = 'AGENT' | 'CUSTOMER' | 'SPLIT';

interface HeaderProps {
  brands: BrandDto[];
  activeBrandId: number;
  onSelectBrand: (brandId: number) => void;
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  onOpenKnowledgeBase: () => void;
  onOpenAuditLogs: () => void;
  isBackendConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  brands,
  activeBrandId,
  onSelectBrand,
  viewMode,
  onSetViewMode,
  onOpenKnowledgeBase,
  onOpenAuditLogs,
  isBackendConnected,
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-badge">
          <Sparkles className="logo-icon" size={20} />
          <div className="logo-text-group">
            <span className="logo-brand">Datastraw</span>
            <span className="logo-subtitle">AI CX Assistant</span>
          </div>
        </div>

        {/* Brand Selector */}
        <div className="brand-select-wrapper">
          <span className="selector-label">Brand:</span>
          <select
            className="brand-select"
            value={activeBrandId}
            onChange={(e) => onSelectBrand(Number(e.target.value))}
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="header-right">
        {/* Backend Connectivity Indicator */}
        <div
          className={`status-pill ${isBackendConnected ? 'online' : 'offline'}`}
          title={
            isBackendConnected
              ? 'Backend Connected (Spring Boot 8080)'
              : 'Backend Disconnected (Spring Boot not reachable at port 8080)'
          }
        >
          <Server size={14} />
          <span>{isBackendConnected ? 'Backend: Spring Boot 8080' : 'Backend: Disconnected'}</span>
        </div>

        {/* View Mode Switcher: Agent vs Customer vs Split-Screen */}
        <div className="view-mode-tabs">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'AGENT' ? 'active-mode' : ''}`}
            onClick={() => onSetViewMode('AGENT')}
            title="Agent Workspace: 3-column view with AI copilot"
          >
            <UserCheck size={14} />
            <span>Agent View</span>
          </button>

          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'CUSTOMER' ? 'active-mode' : ''}`}
            onClick={() => onSetViewMode('CUSTOMER')}
            title="Customer View: Realistic customer chat widget"
          >
            <User size={14} />
            <span>Customer View</span>
          </button>

          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'SPLIT' ? 'active-mode' : ''}`}
            onClick={() => onSetViewMode('SPLIT')}
            title="Side-by-Side Test: Customer on left, Agent AI Copilot on right"
          >
            <Columns size={14} />
            <span>Side-by-Side</span>
          </button>
        </div>

        {/* Knowledge Base Manager Button */}
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<BookOpen size={15} />}
          onClick={onOpenKnowledgeBase}
        >
          Brand Policies
        </Button>

        {/* Audit Logs Button */}
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ScrollText size={15} />}
          onClick={onOpenAuditLogs}
        >
          Logs
        </Button>
      </div>
    </header>
  );
};
