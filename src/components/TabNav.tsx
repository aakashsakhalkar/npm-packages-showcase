import React from 'react';
import type { PackageId } from '../types';
import { PACKAGES_INFO } from '../data/packagesInfo';
import { 
  LayoutGrid, 
  ShieldCheck, 
  Sun, 
  Palette, 
  Languages, 
  Binary 
} from 'lucide-react';

interface TabNavProps {
  activeTab: PackageId;
  onSelectTab: (id: PackageId) => void;
}

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onSelectTab }) => {
  const getIcon = (id: PackageId) => {
    switch (id) {
      case 'overview': return <LayoutGrid size={18} />;
      case 'aescryptor': return <ShieldCheck size={18} />;
      case 'panchang': return <Sun size={18} />;
      case 'color-extractor': return <Palette size={18} />;
      case 'indic-numbers': return <Languages size={18} />;
      case 'base64-toolkit': return <Binary size={18} />;
    }
  };

  const tabs: { id: PackageId; label: string; badge?: string; color?: string }[] = [
    { id: 'overview', label: 'Suite Overview', color: '#6366f1' },
    ...PACKAGES_INFO.map(p => ({ id: p.id, label: p.npmName, badge: `v${p.version}`, color: p.badgeColor })),
  ];

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      overflowX: 'auto',
      padding: '8px 8px 10px 8px',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(16px)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-card)',
      margin: '24px 0',
      transition: 'all 0.3s ease',
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.88rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              background: isActive 
                ? `linear-gradient(135deg, ${tab.color || '#6366f1'}, #06b6d4)`
                : 'transparent',
              boxShadow: isActive ? `0 4px 15px ${tab.color}55` : 'none',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {getIcon(tab.id)}
            <span>{tab.label}</span>
            {tab.badge && (
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '999px',
                background: isActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.06)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
