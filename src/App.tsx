import React, { useState, useEffect } from 'react';
import type { PackageId } from './types';
import { Header } from './components/Header';
import { TabNav } from './components/TabNav';
import { Overview } from './components/Overview';
import { AesCryptorStudio } from './components/demos/AesCryptorStudio';
import { PanchangStudio } from './components/demos/PanchangStudio';
import { ColorExtractorStudio } from './components/demos/ColorExtractorStudio';
import { IndicNumberStudio } from './components/demos/IndicNumberStudio';
import { Base64ToolkitStudio } from './components/demos/Base64ToolkitStudio';
import { Logo } from './components/Logo';
import { AUTHOR } from './data/packagesInfo';

import { ErrorBoundary } from './components/ErrorBoundary';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PackageId>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const renderActiveStudio = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onSelectTab={setActiveTab} />;
      case 'aescryptor':
        return <AesCryptorStudio />;
      case 'panchang':
        return <PanchangStudio />;
      case 'color-extractor':
        return <ColorExtractorStudio />;
      case 'indic-numbers':
        return <IndicNumberStudio />;
      case 'base64-toolkit':
        return <Base64ToolkitStudio />;
      default:
        return <Overview onSelectTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main style={{ maxWidth: '1360px', width: '100%', margin: '0 auto', padding: '0 24px 60px 24px', flex: 1 }}>
        <TabNav activeTab={activeTab} onSelectTab={setActiveTab} />
        <ErrorBoundary>
          {renderActiveStudio()}
        </ErrorBoundary>
      </main>

      <footer style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size={24} />
            <span>
              Built with ❤️ for <a href={AUTHOR.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}>{AUTHOR.name}</a>'s open source NPM suite.
            </span>
          </div>
          <div>
            All packages licensed under <b>MIT</b> • Zero External Dependencies
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
