import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBoxProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export const CodeBox: React.FC<CodeBoxProps> = ({
  code,
  language = 'typescript',
  title,
  showLineNumbers = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="codebox-container" style={{
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      background: '#070b14',
      margin: '12px 0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 14px',
        background: '#0e1526',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '0.8rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Terminal size={14} color="#6366f1" />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{title || language.toUpperCase()}</span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            background: copied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
            color: copied ? '#10b981' : 'var(--text-secondary)',
            border: copied ? '1px solid #10b981' : '1px solid var(--border-subtle)',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div style={{
        padding: '14px',
        overflowX: 'auto',
        maxHeight: '380px',
        fontSize: '0.85rem',
        lineHeight: 1.5,
        fontFamily: 'var(--font-mono)',
        color: '#e2e8f0',
      }}>
        {showLineNumbers ? (
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              {lines.map((line, i) => (
                <tr key={i}>
                  <td style={{
                    paddingRight: '16px',
                    textAlign: 'right',
                    color: '#475569',
                    userSelect: 'none',
                    width: '30px',
                  }}>
                    {i + 1}
                  </td>
                  <td style={{ whiteSpace: 'pre' }}>{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            <code>{code.trim()}</code>
          </pre>
        )}
      </div>
    </div>
  );
};
