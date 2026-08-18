import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  encodeText, 
  decodeText, 
  encode, 
  decode, 
  toDataUrl, 
  fromDataUrl, 
  parseDataUrl,
  isDataUrl,
  toBase64Url, 
  fromBase64Url, 
  padBase64, 
  unpadBase64, 
  inspect, 
  getEncodedSize, 
  getDecodedSize, 
  getOverhead, 
  fitsInSize,
  isBase64, 
  isBase64Url, 
  validateBase64,
  createChunkedEncoder,
  createChunkedDecoder,
  InvalidCharacterError,
  InvalidPaddingError,
  InvalidLengthError
} from 'base64-toolkit';
import { 
  Binary, 
  FileSearch, 
  Upload, 
  Link as LinkIcon, 
  FileCode, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Check, 
  Copy, 
  Sliders, 
  AlertCircle,
  Eye,
  FileCheck
} from 'lucide-react';
import { CodeBox } from '../CodeBox';

const SAMPLE_DATA_URLS = [
  {
    name: '1x1 Transparent PNG',
    data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  },
  {
    name: 'Red Dot PNG',
    data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
  },
  {
    name: 'Clean SVG Icon',
    data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzOGJkZjgiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTEyIDJ2MjBNMiAxMmgyMCIvPjwvc3ZnPg==',
  },
  {
    name: 'Sample PDF Document',
    data: 'data:application/pdf;base64,JVBERi0xLjMKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqIDIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iaiAzIDAgb2JqPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCAzMDAgMTQ0XT4+ZW5kb2JqIHhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDc3IDAwMDAwIG4gCjAwMDAwMDAxNzggMDAwMDAgbiAKdHJhaWxlcjw8L1Jvb3QgMSAwIFIvU2l6ZSA0Pj4lJUVPRg==',
  },
];

export const Base64ToolkitStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'inspector' | 'urlsafe' | 'streaming' | 'validator'>('text');

  // Text Mode state
  const [plainText, setPlainText] = useState<string>('नमस्कार दुनिया! 🚀 Base64-Toolkit with Unicode & Emojis 🌟');
  const [textUrlSafe, setTextUrlSafe] = useState<boolean>(false);
  const [textEncoded, setTextEncoded] = useState<string>('');
  const [textDecoded, setTextDecoded] = useState<string>('');

  // Inspector & Data URL state
  const [inspectorInput, setInspectorInput] = useState<string>(SAMPLE_DATA_URLS[0].data);
  const [inspectionReport, setInspectionReport] = useState<any>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');

  // URL Safe Converter state
  const [urlSafeInput, setUrlSafeInput] = useState<string>('SGVsbG8rV29ybGQvVGVzdD09');
  const [urlSafeConverted, setUrlSafeConverted] = useState<string>('');
  const [urlSafePadding, setUrlSafePadding] = useState<boolean>(false);

  // Streaming state
  const [streamChunks, setStreamChunks] = useState<string[]>(['Chunk1Data_', 'Chunk2Data_', 'FinalChunk3']);
  const [streamEncoded, setStreamEncoded] = useState<string>('');

  // Validator state
  const [validatorInput, setValidatorInput] = useState<string>('SGVsbG8gV29ybGQ=');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message: string }>({ isValid: true, message: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Run Text conversion
  useEffect(() => {
    try {
      const enc = encodeText(plainText, { urlSafe: textUrlSafe });
      setTextEncoded(enc);
      const dec = decodeText(enc);
      setTextDecoded(dec);
    } catch (e: any) {
      console.error(e);
    }
  }, [plainText, textUrlSafe]);

  // Run Inspector
  useEffect(() => {
    try {
      if (inspectorInput) {
        const rep = inspect(inspectorInput);
        setInspectionReport(rep);
        if (isDataUrl(inspectorInput)) {
          setFilePreviewUrl(inspectorInput);
        } else {
          // If pure base64, detect mime and format as data URL for preview
          const mime = rep.mimeType || 'application/octet-stream';
          setFilePreviewUrl(toDataUrl(inspectorInput, mime));
        }
      }
    } catch (e: any) {
      console.error(e);
    }
  }, [inspectorInput]);

  // Run Base64URL Conversion
  useEffect(() => {
    try {
      const converted = toBase64Url(urlSafeInput, { preservePadding: urlSafePadding });
      setUrlSafeConverted(converted);
    } catch (e: any) {
      console.error(e);
    }
  }, [urlSafeInput, urlSafePadding]);

  // Run Streaming simulation
  useEffect(() => {
    try {
      const encoder = createChunkedEncoder();
      let res = '';
      const textEnc = new TextEncoder();
      for (const chunk of streamChunks) {
        res += encoder.push(textEnc.encode(chunk));
      }
      res += encoder.finish();
      setStreamEncoded(res);
    } catch (e: any) {
      console.error(e);
    }
  }, [streamChunks]);

  // Run Validator
  const handleValidate = (val: string) => {
    setValidatorInput(val);
    try {
      validateBase64(val);
      setValidationResult({ isValid: true, message: '✓ Valid RFC 4648 Base64 String' });
    } catch (err: any) {
      let msg = 'Invalid: ';
      if (err instanceof InvalidCharacterError) {
        msg += `Invalid character '${err.character}' at position ${err.position}`;
      } else if (err instanceof InvalidPaddingError) {
        msg += `Invalid padding: ${err.message}`;
      } else if (err instanceof InvalidLengthError) {
        msg += `Invalid length: ${err.message}`;
      } else {
        msg += err.message || err;
      }
      setValidationResult({ isValid: false, message: msg });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setInspectorInput(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generatedCode = `import { 
  encodeText, 
  decodeText, 
  inspect, 
  toBase64Url, 
  toDataUrl 
} from 'base64-toolkit';

// 1. Unicode UTF-8 Safe Text Encoding
const b64 = encodeText('${plainText.slice(0, 30)}...', { urlSafe: ${textUrlSafe} });
console.log('Encoded:', b64);
console.log('Decoded:', decodeText(b64));

// 2. Magic Byte Format Inspector (sniffs 30+ file types)
const report = inspect(b64OrDataUrl);
console.log('Format:', report.formatDescription, 'MIME:', report.mimeType);
console.log('Magic Bytes:', report.magicBytes);
console.log('Decoded Size:', report.estimatedDecodedSize, 'bytes');

// 3. RFC 4648 §5 URL-Safe conversion
const urlSafeStr = toBase64Url(b64, { preservePadding: ${urlSafePadding} });`;

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
        borderLeft: '4px solid #06b6d4',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Binary size={28} color="#06b6d4" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>base64-toolkit 🧰</h2>
              <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>v1.0.0</span>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>30+ Magic Bytes</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Universal Base64 conversion, 30+ format magic-byte inspection, streaming chunks, and RFC 4648 URL-safe toolkit.
            </p>
          </div>
        </div>

        {/* Feature Sub-tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'text', label: 'Unicode Text Mode' },
            { id: 'inspector', label: 'Magic Byte Inspector' },
            { id: 'urlsafe', label: 'Base64URL Converter' },
            { id: 'streaming', label: 'Chunk Streamer' },
            { id: 'validator', label: 'Strict Validator' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: activeTab === t.id ? '#06b6d4' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === t.id ? '#000000' : 'var(--text-secondary)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feature 1: Text & Unicode Mode */}
      {activeTab === 'text' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#22d3ee' }}>1. UTF-8 Unicode / Multi-byte Text Input</h3>
            <textarea
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              rows={5}
              style={{ width: '100%', fontSize: '0.95rem', resize: 'vertical' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={textUrlSafe}
                onChange={(e) => setTextUrlSafe(e.target.checked)}
                style={{ accentColor: '#06b6d4' }}
              />
              <span>RFC 4648 URL-Safe Mode (`+` ➔ `-`, `/` ➔ `_`)</span>
            </label>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34d399' }}>2. Base64 Encoded & Decoded Output</h3>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Encoded Base64 String:</span>
              <textarea
                readOnly
                value={textEncoded}
                rows={3}
                style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#22d3ee', background: '#070b14', marginTop: '4px' }}
              />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Decoded Back to Plaintext:</span>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#6ee7b7', marginTop: '4px', fontSize: '0.9rem' }}>
                {textDecoded}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 2: Magic Byte Inspector */}
      {activeTab === 'inspector' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#22d3ee' }}>
                Base64 or Data URL to Inspect
              </h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#22d3ee',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                <Upload size={12} /> Upload Any File
              </button>
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {SAMPLE_DATA_URLS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setInspectorInput(sample.data)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: inspectorInput === sample.data ? '#06b6d4' : 'rgba(255, 255, 255, 0.06)',
                    color: inspectorInput === sample.data ? '#000000' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {sample.name}
                </button>
              ))}
            </div>

            <textarea
              value={inspectorInput}
              onChange={(e) => setInspectorInput(e.target.value)}
              rows={7}
              placeholder="Paste any Base64 string or Data URL..."
              style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', resize: 'vertical' }}
            />
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8' }}>
              🔍 Magic Byte Inspection Report (`inspect()`)
            </h3>

            {inspectionReport && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
                <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Detected Format:</span>
                  <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.95rem' }}>
                    {inspectionReport.formatDescription || 'Unknown Format'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>MIME Type / Ext:</span>
                  <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>
                    {inspectionReport.mimeType} (.{inspectionReport.extension})
                  </div>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>File Category:</span>
                  <div style={{ fontWeight: 800, color: '#d97706', textTransform: 'capitalize' }}>
                    {inspectionReport.fileCategory || 'Binary'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Magic Bytes Header:</span>
                  <div style={{ fontWeight: 800, color: '#9333ea', fontFamily: 'var(--font-mono)' }}>
                    {inspectionReport.magicBytes || 'N/A'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Decoded Size:</span>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                    {inspectionReport.estimatedDecodedSize} bytes
                  </div>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Base64 Overhead:</span>
                  <div style={{ fontWeight: 800, color: '#db2777' }}>
                    +33.59% (+{inspectionReport.encodedSize - inspectionReport.estimatedDecodedSize} bytes)
                  </div>
                </div>
              </div>
            )}

            {/* Live Media Preview if Image or SVG */}
            {filePreviewUrl && inspectionReport?.fileCategory === 'image' && (
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Decoded Live Image Preview:
                </span>
                <div style={{
                  height: '100px',
                  borderRadius: 'var(--radius-md)',
                  background: '#070b14',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                }}>
                  <img src={filePreviewUrl} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feature 3: Base64URL Converter */}
      {activeTab === 'urlsafe' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#22d3ee' }}>
              Standard Base64 Input
            </h3>
            <input
              type="text"
              value={urlSafeInput}
              onChange={(e) => setUrlSafeInput(e.target.value)}
              style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={urlSafePadding}
                onChange={(e) => setUrlSafePadding(e.target.checked)}
                style={{ accentColor: '#06b6d4' }}
              />
              <span>Preserve Trailing '=' Padding (`preservePadding: true`)</span>
            </label>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34d399' }}>
              URL-Safe Base64 (`toBase64Url()`)
            </h3>
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: '#070b14', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', color: '#22d3ee' }}>
              {urlSafeConverted}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Replaces '+' with '-' and '/' with '_' according to RFC 4648 section 5. Safe for URLs, JWT tokens, and filenames.
            </p>
          </div>
        </div>
      )}

      {/* Feature 4: Streaming Generator */}
      {activeTab === 'streaming' && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#22d3ee' }}>
            Chunked Streaming Simulator (`createChunkedEncoder`)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Processes streaming byte chunks across arbitrary 3-byte boundaries without buffering the entire stream in memory.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {streamChunks.map((chunk, idx) => (
              <div key={idx}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Chunk {idx + 1}:</label>
                <input
                  type="text"
                  value={chunk}
                  onChange={(e) => {
                    const copy = [...streamChunks];
                    copy[idx] = e.target.value;
                    setStreamChunks(copy);
                  }}
                  style={{ width: '100%', marginTop: '4px', fontFamily: 'var(--font-mono)' }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Streamed Base64 Output:</span>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: '#070b14', color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {streamEncoded}
            </div>
          </div>
        </div>
      )}

      {/* Feature 5: Strict Validator */}
      {activeTab === 'validator' && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#22d3ee' }}>
            Strict RFC 4648 Base64 Validator (`validateBase64()`)
          </h3>
          <input
            type="text"
            value={validatorInput}
            onChange={(e) => handleValidate(e.target.value)}
            placeholder="Type or paste Base64 to validate..."
            style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
          />

          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: validationResult.isValid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: validationResult.isValid ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            color: validationResult.isValid ? '#34d399' : '#f87171',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}>
            {validationResult.message}
          </div>
        </div>
      )}

      {/* Code Snippet Box */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <FileCode size={18} color="#06b6d4" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Integration Code for base64-toolkit</h4>
        </div>
        <CodeBox code={generatedCode} language="typescript" title="base64-toolkit-usage.ts" />
      </div>
    </div>
  );
};
