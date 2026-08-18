import React, { useState, useMemo } from 'react';
import { 
  formatIndic, 
  toWords, 
  toCurrency, 
  toCompact, 
  toNativeDigits, 
  toFraction, 
  toOrdinal 
} from 'indic-number-words';
import { 
  Languages, 
  IndianRupee, 
  PieChart, 
  Award, 
  Binary, 
  Volume2, 
  FileCode, 
  Sparkles,
  Layers,
  Check,
  Copy
} from 'lucide-react';
import { CodeBox } from '../CodeBox';

const SUPPORTED_LANGUAGES = [
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'sd', name: 'Sindhi', native: 'सिंधी' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
];

const NUMBER_PRESETS = [
  { label: '42 (Base)', value: '42' },
  { label: '1,25,050.75 (Lakh & Decimal)', value: '125050.75' },
  { label: '2,50,00,000 (2.5 Crore)', value: '25000000' },
  { label: '1,00,00,00,000 (1 Arab / Billion)', value: '1000000000' },
  { label: '1.5 (दीड / डेढ़ Fraction)', value: '1.5' },
  { label: '2.5 (अडीच / ढाई Fraction)', value: '2.5' },
  { label: '0.75 (पाऊण / पौना Fraction)', value: '0.75' },
  { label: '1 (Ordinal 1st)', value: '1' },
];

export const IndicNumberStudio: React.FC = () => {
  const [numInput, setNumInput] = useState<string>('125050.75');
  const [selectedLang, setSelectedLang] = useState<string>('mr');
  const [useNativeDigits, setUseNativeDigits] = useState<boolean>(false);
  const [viewAllGrid, setViewAllGrid] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const numVal = parseFloat(numInput) || 0;

  // Single language computations
  const results = useMemo(() => {
    try {
      const opts = { lang: selectedLang as any, useNativeDigits };
      return {
        formattedIndic: formatIndic(numInput),
        words: toWords(numVal, opts),
        currency: toCurrency(numVal, opts),
        compact: toCompact(numVal, opts),
        nativeDigits: toNativeDigits(numInput, opts),
        fraction: toFraction(numVal, opts),
        ordinal: toOrdinal(Math.floor(numVal) || 1, opts),
      };
    } catch (e: any) {
      console.error(e);
      return null;
    }
  }, [numInput, numVal, selectedLang, useNativeDigits]);

  // All 18 Languages Comparison Grid
  const allLangsComparison = useMemo(() => {
    return SUPPORTED_LANGUAGES.map((lang) => {
      try {
        const opts = { lang: lang.code as any, useNativeDigits };
        return {
          ...lang,
          words: toWords(numVal, opts),
          currency: toCurrency(numVal, opts),
          nativeDigits: toNativeDigits(numInput, opts),
          ordinal: toOrdinal(Math.floor(numVal) || 1, opts),
        };
      } catch (e) {
        return {
          ...lang,
          words: 'Error',
          currency: 'Error',
          nativeDigits: 'Error',
          ordinal: 'Error',
        };
      }
    });
  }, [numInput, numVal, useNativeDigits]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleSpeak = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'mr' ? 'mr-IN' : langCode === 'hi' ? 'hi-IN' : langCode === 'en' ? 'en-IN' : 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const generatedCode = `import { 
  formatIndic, 
  toWords, 
  toCurrency, 
  toCompact, 
  toNativeDigits, 
  toFraction, 
  toOrdinal 
} from 'indic-number-words';

const val = ${numVal};
const lang = '${selectedLang}'; // 18 languages supported: 'sa', 'mr', 'hi', 'en', 'gu', 'bn', 'ta', 'te', 'kn', 'ml'...

console.log('Indian Format:', formatIndic(val));
console.log('Words:', toWords(val, { lang, useNativeDigits: ${useNativeDigits} }));
console.log('Currency Phrasing:', toCurrency(val, { lang, useNativeDigits: ${useNativeDigits} }));
console.log('Compact Notation:', toCompact(val, { lang }));
console.log('Native Script Digits:', toNativeDigits(val, { lang }));
console.log('Indian Fraction:', toFraction(val, { lang }));
console.log('Ordinal:', toOrdinal(val, { lang }));`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Studio Header */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        borderLeft: '4px solid #6366f1',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Languages size={28} color="#6366f1" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>indic-number-words 🇮🇳</h2>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>v1.0.1</span>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>18 Languages</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Convert numbers into Indian format, words, currency phrases, fractions, native script digits, and ordinals across 18 Indic languages.
            </p>
          </div>
        </div>

        <button
          onClick={() => setViewAllGrid(!viewAllGrid)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            background: viewAllGrid ? '#6366f1' : 'rgba(99, 102, 241, 0.15)',
            color: viewAllGrid ? '#ffffff' : '#818cf8',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          <Layers size={16} />
          {viewAllGrid ? 'Hide 18-Language Grid' : 'Compare All 18 Languages'}
        </button>
      </div>

      {/* Input Panel & Preset Selectors */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Number Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Enter Any Number or Decimal:
            </label>
            <input
              type="text"
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              placeholder="e.g. 125050.75"
              style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
            />
          </div>

          {/* Language Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Target Indic Language (18 Supported):
            </label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              style={{ width: '100%', fontSize: '0.95rem' }}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.native}) - [{l.code}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Options Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input
              type="checkbox"
              checked={useNativeDigits}
              onChange={(e) => setUseNativeDigits(e.target.checked)}
              style={{ accentColor: '#6366f1' }}
            />
            <span>Use Native Script Digits (`useNativeDigits: true`)</span>
          </label>
        </div>

        {/* Quick Number Presets */}
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Quick Number & Fraction Presets:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {NUMBER_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setNumInput(p.value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: numInput === p.value ? 'linear-gradient(135deg, #4f46e5, #0284c7)' : 'var(--bg-subtle)',
                  color: numInput === p.value ? '#ffffff' : 'var(--text-secondary)',
                  border: numInput === p.value ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-subtle)',
                  boxShadow: numInput === p.value ? '0 2px 8px rgba(79, 70, 229, 0.3)' : 'none',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Result Cards for All 7 Methods */}
      {results && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Method 1: formatIndic */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '3px solid #0284c7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                1. `formatIndic(val)` (Indian Grouping)
              </span>
              <button
                onClick={() => handleCopy(results.formattedIndic, 'format')}
                style={{ color: copiedKey === 'format' ? '#059669' : 'var(--text-muted)' }}
              >
                {copiedKey === 'format' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
              {results.formattedIndic}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lakh & Crore grouping format</span>
          </div>

          {/* Method 2: toWords */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '3px solid #4f46e5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                2. `toWords(val, '{selectedLang}')` (Spoken Words)
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleSpeak(results.words, selectedLang)} title="Speak aloud" style={{ color: '#4f46e5' }}>
                  <Volume2 size={18} />
                </button>
                <button
                  onClick={() => handleCopy(results.words, 'words')}
                  style={{ color: copiedKey === 'words' ? '#059669' : 'var(--text-muted)' }}
                >
                  {copiedKey === 'words' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {results.words}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full grammatical wording</span>
          </div>

          {/* Method 3: toCurrency */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '3px solid #059669' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                3. `toCurrency(val, '{selectedLang}')` (Legal / Cheque)
              </span>
              <button
                onClick={() => handleCopy(results.currency, 'currency')}
                style={{ color: copiedKey === 'currency' ? '#059669' : 'var(--text-muted)' }}
              >
                {copiedKey === 'currency' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', lineHeight: 1.4 }}>
              {results.currency}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Financial & banking phrasing</span>
          </div>

          {/* Method 4: toCompact */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '3px solid #d97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                4. `toCompact(val, '{selectedLang}')` (Short Notation)
              </span>
              <button
                onClick={() => handleCopy(results.compact, 'compact')}
                style={{ color: copiedKey === 'compact' ? '#059669' : 'var(--text-muted)' }}
              >
                {copiedKey === 'compact' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>
              {results.compact}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lakh / Crore compact abbreviations</span>
          </div>

          {/* Method 5: toNativeDigits */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '3px solid #9333ea' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                5. `toNativeDigits(val, '{selectedLang}')` (Script Digits)
              </span>
              <button
                onClick={() => handleCopy(results.nativeDigits, 'native')}
                style={{ color: copiedKey === 'native' ? '#059669' : 'var(--text-muted)' }}
              >
                {copiedKey === 'native' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#9333ea', letterSpacing: '0.05em' }}>
              {results.nativeDigits}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Native script numeral characters</span>
          </div>

          {/* Method 6: toFraction */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '3px solid #db2777' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                6. `toFraction(val, '{selectedLang}')` (Traditional Indian Fraction)
              </span>
              <button
                onClick={() => handleCopy(results.fraction, 'fraction')}
                style={{ color: copiedKey === 'fraction' ? '#059669' : 'var(--text-muted)' }}
              >
                {copiedKey === 'fraction' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#db2777' }}>
              {results.fraction || 'N/A for integer'}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>पाव, अर्धा, पाऊण, सव्वा, दीड, अडीच, साडे...</span>
          </div>

          {/* Method 7: toOrdinal */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '3px solid #7c3aed' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                7. `toOrdinal(val, '{selectedLang}')` (Ordinal Rank)
              </span>
              <button
                onClick={() => handleCopy(results.ordinal, 'ordinal')}
                style={{ color: copiedKey === 'ordinal' ? '#059669' : 'var(--text-muted)' }}
              >
                {copiedKey === 'ordinal' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#7c3aed' }}>
              {results.ordinal}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1st, पहिला, प्रथमः, முதலாவது</span>
          </div>
        </div>
      )}

      {/* 18 Languages Comparison Grid (Collapsible/Toggled) */}
      {viewAllGrid && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Sparkles size={18} color="#4f46e5" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              All 18 Indic Languages Comparison Grid for ({numInput})
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '2px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 14px', borderRadius: '6px 0 0 6px', color: 'var(--text-secondary)' }}>Code</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>Language</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>Native Digits</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>Words (`toWords`)</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>Currency Phrasing (`toCurrency`)</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>Ordinal (`toOrdinal`)</th>
                  <th style={{ padding: '12px 14px', borderRadius: '0 6px 6px 0', color: 'var(--text-secondary)' }}>Audio</th>
                </tr>
              </thead>
              <tbody>
                {allLangsComparison.map((item) => (
                  <tr
                    key={item.code}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: selectedLang === item.code ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#4f46e5' }}>
                      {item.code}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                      {item.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({item.native})</span>
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#9333ea', fontSize: '1rem' }}>
                      {item.nativeDigits}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.words}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#059669', fontWeight: 600 }}>
                      {item.currency}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#7c3aed', fontWeight: 600 }}>
                      {item.ordinal}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        onClick={() => handleSpeak(item.words, item.code)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: 'var(--bg-subtle)',
                          color: '#4f46e5',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <Volume2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Code Snippet Box */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <FileCode size={18} color="#6366f1" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Integration Code for indic-number-words</h4>
        </div>
        <CodeBox code={generatedCode} language="typescript" title="indic-number-words-usage.ts" />
      </div>
    </div>
  );
};
