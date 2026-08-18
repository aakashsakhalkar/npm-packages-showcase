import React from 'react';
import { Package, ExternalLink, Code2, Globe, Sun, Moon } from 'lucide-react';
import { AUTHOR } from '../data/packagesInfo';
import { Logo } from './Logo';
import type { PackageId } from '../types';

interface HeaderProps {
  activeTab: PackageId;
  onSelectTab: (id: PackageId) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectTab, theme, onToggleTheme }) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg-header)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Brand */}
        <div 
          onClick={() => onSelectTab('overview')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <Logo size={42} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                aakash<span style={{ color: '#0284c7' }}>.sakhalkar</span>
              </span>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#4f46e5', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                NPM Studio
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              5 Zero-Dependency Open Source Libraries
            </p>
          </div>
        </div>

        {/* Quick Links & Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Theme Toggle Button */}
          {/* Theme Toggle Button (Icon Only) */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              background: theme === 'light' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.2)',
              color: theme === 'light' ? '#d97706' : '#818cf8',
              border: theme === 'light' ? '1.5px solid rgba(245, 158, 11, 0.4)' : '1.5px solid rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s ease',
              boxShadow: theme === 'light' ? '0 2px 8px rgba(245, 158, 11, 0.2)' : '0 2px 8px rgba(99, 102, 241, 0.25)',
            }}
          >
            {theme === 'light' ? <Sun size={18} color="#d97706" /> : <Moon size={18} color="#818cf8" />}
          </button>

          {/* Portfolio Link */}
          <a
            href={AUTHOR.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
              color: '#0284c7',
              border: '1.5px solid rgba(2, 132, 199, 0.35)',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.12)',
            }}
          >
            <Globe size={14} />
            <span>Portfolio</span>
            <ExternalLink size={12} />
          </a>

          {/* npm Profile */}
          <a
            href={AUTHOR.npmProfile}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(235, 84, 36, 0.1)',
              color: '#e11d48',
              border: '1px solid rgba(235, 84, 36, 0.25)',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <Package size={14} />
            <span>npm Profile</span>
            <ExternalLink size={12} />
          </a>

          {/* GitHub Profile */}
          <a
            href={AUTHOR.githubProfile}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.05)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <Code2 size={14} />
            <span>GitHub</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </header>
  );
};
