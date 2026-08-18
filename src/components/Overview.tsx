import React from 'react';
import { PACKAGES_INFO, AUTHOR } from '../data/packagesInfo';
import type { PackageId } from '../types';
import { 
  ShieldCheck, 
  Sun, 
  Palette, 
  Languages, 
  Binary, 
  ArrowRight, 
  Package, 
  CheckCircle2, 
  Cpu,
  Globe,
  ExternalLink,
  Code2
} from 'lucide-react';
import { CodeBox } from './CodeBox';

interface OverviewProps {
  onSelectTab: (id: PackageId) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onSelectTab }) => {
  const getIcon = (id: PackageId) => {
    switch (id) {
      case 'aescryptor': return <ShieldCheck size={28} color="#10b981" />;
      case 'panchang': return <Sun size={28} color="#f59e0b" />;
      case 'color-extractor': return <Palette size={28} color="#ec4899" />;
      case 'indic-numbers': return <Languages size={28} color="#6366f1" />;
      case 'base64-toolkit': return <Binary size={28} color="#06b6d4" />;
      default: return <Package size={28} color="#6366f1" />;
    }
  };

  const installAllCommand = `npm install aescryptor-ts marathi-panchang-core web-color-extractor indic-number-words base64-toolkit`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Banner */}
      <div className="glass-panel" style={{
        padding: '36px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(236, 72, 153, 0.06) 100%)',
        border: '1.5px solid rgba(99, 102, 241, 0.25)',
      }}>
        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#4f46e5', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              ⚡ 5 Zero-Dependency TypeScript Libraries
            </span>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              ✓ Production Ready
            </span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Open Source NPM Library Suite & <span className="gradient-text">Interactive Studio</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Created by <a href={AUTHOR.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', fontWeight: 800, textDecoration: 'none' }}>{AUTHOR.name}</a>. A collection of ultra-lightweight, high-performance, and zero-dependency TypeScript/JavaScript utilities for modern Web, Node.js, and Mobile platforms.
          </p>

          {/* Quick Install One-Liner */}
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Install All 5 Packages in One Command:
            </span>
            <CodeBox code={installAllCommand} language="bash" title="Single Line Install" />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Published Repositories', val: '5 Libraries', icon: <Package size={20} color="#0284c7" />, bg: 'rgba(6, 182, 212, 0.1)' },
          { label: 'External Dependencies', val: '0 Dependencies', icon: <CheckCircle2 size={20} color="#059669" />, bg: 'rgba(16, 185, 129, 0.1)' },
          { label: 'Language Support', val: '18 Indic Dialects', icon: <Languages size={20} color="#4f46e5" />, bg: 'rgba(99, 102, 241, 0.1)' },
          { label: 'Magic Bytes Detection', val: '30+ Formats', icon: <Cpu size={20} color="#9333ea" />, bg: 'rgba(168, 85, 247, 0.1)' },
        ].map((stat, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: stat.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 5 Package Cards Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Explore All 5 Interactive Playgrounds</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Click any card to launch its live studio</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {PACKAGES_INFO.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => onSelectTab(pkg.id)}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                borderTop: `3px solid ${pkg.badgeColor}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = pkg.badgeColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${pkg.badgeColor}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {getIcon(pkg.id)}
                  </div>
                  <span className="badge" style={{ background: `${pkg.badgeColor}22`, color: pkg.badgeColor }}>
                    v{pkg.version}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
                  {pkg.npmName}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {pkg.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                  {pkg.tags.map((t, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: pkg.badgeColor,
              }}>
                <span>Launch Interactive Studio</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Profile & Portfolio Card */}
      <div className="glass-panel" style={{
        padding: '32px',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-subtle) 100%)',
        border: '1.5px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        boxShadow: 'var(--shadow-card)',
        borderRadius: 'var(--radius-xl)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: '#ffffff',
            boxShadow: '0 6px 20px rgba(2, 132, 199, 0.35)',
            border: '2px solid #ffffff',
          }}>
            AS
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{AUTHOR.name}</h3>
              <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                Author & Maintainer
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px', fontWeight: 500 }}>
              {AUTHOR.role} • {AUTHOR.tagline}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href={AUTHOR.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 4px 18px rgba(2, 132, 199, 0.35)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Globe size={18} />
            <span>Visit Portfolio</span>
            <ExternalLink size={14} />
          </a>

          <a
            href={AUTHOR.npmProfile}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 18px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(225, 29, 72, 0.08)',
              color: '#e11d48',
              border: '1.5px solid rgba(225, 29, 72, 0.25)',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Package size={18} />
            <span>npm Profile</span>
            <ExternalLink size={14} />
          </a>

          <a
            href={AUTHOR.githubProfile}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 18px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border-subtle)',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.15s ease',
            }}
          >
            <Code2 size={18} />
            <span>GitHub</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
