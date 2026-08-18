import React, { useState, useEffect } from 'react';
import { 
  AESCryptor, 
  AESCryptorError, 
  DecryptionError, 
  InvalidKeyError, 
  InvalidPayloadError,
  EncryptionError
} from 'aescryptor-ts';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Sparkles, 
  Sliders, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  FileCode,
  Zap
} from 'lucide-react';
import { CodeBox } from '../CodeBox';

export const AesCryptorStudio: React.FC = () => {
  // Input state
  const [mode, setMode] = useState<'text' | 'json' | 'instance'>('text');
  const [plainText, setPlainText] = useState<string>('Confidential Data: API_SECRET_TOKEN_99812 #TopSecret 🔒');
  const [jsonInput, setJsonInput] = useState<string>(JSON.stringify({
    userId: 'usr_882910',
    role: 'superadmin',
    permissions: ['read:all', 'write:all', 'crypto:sign'],
    timestamp: Date.now()
  }, null, 2));

  const [secretKey, setSecretKey] = useState<string>('StrongSuperSecretPassphrase@2026!');
  
  // Options state
  const [format, setFormat] = useState<'base64' | 'hex'>('base64');
  const [iterations, setIterations] = useState<number>(100000);
  const [saltLength, setSaltLength] = useState<number>(16);
  const [ivLength, setIvLength] = useState<number>(12);

  // Output & Execution state
  const [encryptedOutput, setEncryptedOutput] = useState<string>('');
  const [decryptedOutput, setDecryptedOutput] = useState<string>('');
  const [decryptKeyInput, setDecryptKeyInput] = useState<string>('StrongSuperSecretPassphrase@2026!');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [tamperedNotice, setTamperedNotice] = useState<string | null>(null);

  // Key generator helper
  const [genKeyBits, setGenKeyBits] = useState<128 | 192 | 256>(256);
  const [generatedKey, setGeneratedKey] = useState<string>('');

  const handleGenerateRandomKey = () => {
    try {
      const k = AESCryptor.generateKey(genKeyBits);
      setGeneratedKey(k);
      setSecretKey(k);
      setDecryptKeyInput(k);
    } catch (e: any) {
      console.error(e);
    }
  };

  // Perform Encryption
  const handleEncrypt = async () => {
    setErrorStatus(null);
    setTamperedNotice(null);
    const start = performance.now();
    try {
      let result = '';
      const opts = { format, iterations, saltLength, ivLength };

      if (mode === 'text') {
        result = await AESCryptor.encrypt(plainText, secretKey, opts);
      } else if (mode === 'json') {
        const parsed = JSON.parse(jsonInput);
        result = await AESCryptor.encryptJSON(parsed, secretKey, opts);
      } else {
        const instance = new AESCryptor(secretKey, opts);
        result = await instance.encrypt(plainText);
      }

      const elapsed = performance.now() - start;
      setExecutionTime(Math.round(elapsed * 100) / 100);
      setEncryptedOutput(result);
      setDecryptKeyInput(secretKey);
      
      // Auto-run decrypt test
      handleDecrypt(result, secretKey);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(`Encryption Error: ${err.message || err}`);
    }
  };

  // Perform Decryption
  const handleDecrypt = async (payloadToDecrypt?: string, keyToUse?: string) => {
    const payload = payloadToDecrypt !== undefined ? payloadToDecrypt : encryptedOutput;
    const key = keyToUse !== undefined ? keyToUse : decryptKeyInput;
    setErrorStatus(null);

    if (!payload) return;

    try {
      if (mode === 'json') {
        const res = await AESCryptor.decryptJSON(payload, key, { iterations });
        setDecryptedOutput(JSON.stringify(res, null, 2));
      } else {
        const res = await AESCryptor.decrypt(payload, key, { iterations });
        setDecryptedOutput(res);
      }
    } catch (err: any) {
      let msg = 'Decryption Failed: ';
      if (err instanceof DecryptionError) {
        msg += 'Integrity validation failed! The authentication tag did not match (wrong password or data tampered).';
      } else if (err instanceof InvalidKeyError) {
        msg += 'Invalid key provided.';
      } else if (err instanceof InvalidPayloadError) {
        msg += 'Payload format is invalid or corrupted.';
      } else {
        msg += err.message || err;
      }
      setDecryptedOutput('');
      setErrorStatus(msg);
    }
  };

  // Tamper Simulation: Alter 1 character in the ciphertext
  const handleTamperPayload = () => {
    if (!encryptedOutput) return;
    const parts = encryptedOutput.split('$');
    if (parts.length >= 5) {
      // Modify last part (ciphertext/tag)
      const last = parts[parts.length - 1];
      const alteredChar = last.charAt(0) === 'A' ? 'B' : 'A';
      parts[parts.length - 1] = alteredChar + last.slice(1);
      const tampered = parts.join('$');
      setEncryptedOutput(tampered);
      setTamperedNotice('⚠️ Payload modified! 1 character in ciphertext/auth tag was flipped.');
      handleDecrypt(tampered, decryptKeyInput);
    }
  };

  useEffect(() => {
    handleEncrypt();
  }, [mode, format, iterations, saltLength, ivLength]);

  const payloadParts = encryptedOutput ? encryptedOutput.split('$').filter(Boolean) : [];

  const generatedCode = `import { AESCryptor } from 'aescryptor-ts';

// 1. Encryption with configured options
const secretKey = '${secretKey}';
const data = ${mode === 'json' ? jsonInput : `'${plainText}'`};

const encrypted = await AESCryptor.${mode === 'json' ? 'encryptJSON' : 'encrypt'}(data, secretKey, {
  format: '${format}',
  iterations: ${iterations},
  saltLength: ${saltLength},
  ivLength: ${ivLength},
});

console.log('Encrypted Payload:', encrypted);

// 2. Decryption & Authentication Tag Verification
const decrypted = await AESCryptor.${mode === 'json' ? 'decryptJSON' : 'decrypt'}(encrypted, secretKey, {
  iterations: ${iterations},
});

console.log('Decrypted Data:', decrypted);`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Studio Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        borderLeft: '4px solid #10b981',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShieldCheck size={28} color="#10b981" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>aescryptor-ts Live Studio</h2>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>v1.0.0</span>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>Zero-Dep</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Authenticated AES-256-GCM encryption with PBKDF2 key derivation, cryptographic salts, and tamper verification.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setMode('text')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: mode === 'text' ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-subtle)',
              color: mode === 'text' ? '#ffffff' : 'var(--text-secondary)',
              border: mode === 'text' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-subtle)',
              boxShadow: mode === 'text' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
            }}
          >
            Plain Text Mode
          </button>
          <button
            onClick={() => setMode('json')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: mode === 'json' ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-subtle)',
              color: mode === 'json' ? '#ffffff' : 'var(--text-secondary)',
              border: mode === 'json' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-subtle)',
              boxShadow: mode === 'json' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
            }}
          >
            JSON Object Mode
          </button>
          <button
            onClick={() => setMode('instance')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: mode === 'instance' ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-subtle)',
              color: mode === 'instance' ? '#ffffff' : 'var(--text-secondary)',
              border: mode === 'instance' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-subtle)',
              boxShadow: mode === 'instance' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
            }}
          >
            Class Instance Mode
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs + Config | Output + Tamper Testing */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        {/* Left Column: Data & Configuration */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Lock size={18} color="#10b981" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>1. Data & Secret Key Input</h3>
          </div>

          {/* Plain Text or JSON Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              {mode === 'json' ? 'JSON Payload to Encrypt:' : 'Plain Text to Encrypt:'}
            </label>
            {mode === 'json' ? (
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={5}
                style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', resize: 'vertical' }}
              />
            ) : (
              <textarea
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                rows={3}
                style={{ width: '100%', fontSize: '0.9rem', resize: 'vertical' }}
              />
            )}
          </div>

          {/* Secret Key Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Secret Password / Passphrase:
              </label>
              <button
                onClick={handleGenerateRandomKey}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  color: '#10b981',
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <Sparkles size={12} />
                Generate {genKeyBits}-bit Key
              </button>
            </div>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
                setDecryptKeyInput(e.target.value);
              }}
              style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}
            />
          </div>

          {/* Cryptographic Options Controls */}
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700 }}>
              <Sliders size={16} color="#6366f1" />
              <span>All Encryption & PBKDF2 Options</span>
            </div>

            {/* Format & Bit sizes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Format (`options.format`):
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'base64' | 'hex')}
                  style={{ width: '100%' }}
                >
                  <option value="base64">base64 (Compact)</option>
                  <option value="hex">hex (Hexadecimal)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Key Generator Length:
                </label>
                <select
                  value={genKeyBits}
                  onChange={(e) => setGenKeyBits(Number(e.target.value) as 128 | 192 | 256)}
                  style={{ width: '100%' }}
                >
                  <option value={256}>256 bits (AES-256)</option>
                  <option value={192}>192 bits (AES-192)</option>
                  <option value={128}>128 bits (AES-128)</option>
                </select>
              </div>
            </div>

            {/* PBKDF2 Iterations Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>PBKDF2 Iterations (`options.iterations`):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>
                  {iterations.toLocaleString()} rounds
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={300000}
                step={10000}
                value={iterations}
                onChange={(e) => setIterations(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
            </div>

            {/* Salt & IV Lengths */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Salt Bytes (`options.saltLength`):
                </label>
                <select
                  value={saltLength}
                  onChange={(e) => setSaltLength(Number(e.target.value))}
                  style={{ width: '100%' }}
                >
                  <option value={16}>16 bytes (128-bit Salt)</option>
                  <option value={24}>24 bytes (192-bit Salt)</option>
                  <option value={32}>32 bytes (256-bit Salt)</option>
                  <option value={8}>8 bytes (64-bit Salt)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  IV Bytes (`options.ivLength`):
                </label>
                <select
                  value={ivLength}
                  onChange={(e) => setIvLength(Number(e.target.value))}
                  style={{ width: '100%' }}
                >
                  <option value={12}>12 bytes (Standard 96-bit GCM IV)</option>
                  <option value={16}>16 bytes (128-bit IV)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleEncrypt}
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
            }}
          >
            <Lock size={18} />
            Encrypt Payload Now
          </button>
        </div>

        {/* Right Column: Encrypted Output & Verification */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Unlock size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>2. Encrypted Output & Verification</h3>
            </div>
            {executionTime > 0 && (
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                <Zap size={12} /> {executionTime} ms
              </span>
            )}
          </div>

          {/* Encrypted String */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Encrypted Payload String (`$aescryptor$v1$...`):
            </label>
            <textarea
              readOnly
              value={encryptedOutput}
              rows={3}
              style={{
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--accent-emerald)',
                background: 'var(--bg-input)',
                borderColor: tamperedNotice ? '#f59e0b' : 'var(--border-subtle)',
              }}
            />
          </div>

          {/* Payload Breakdown Inspector */}
          {payloadParts.length >= 4 && (
            <div style={{
              background: 'var(--bg-subtle)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Payload Component Breakdown:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                  Prefix: ${payloadParts[0]}$
                </span>
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
                  Version: {payloadParts[1]}
                </span>
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                  Salt ({format}): {payloadParts[2]?.slice(0, 8)}...
                </span>
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' }}>
                  IV ({format}): {payloadParts[3]?.slice(0, 8)}...
                </span>
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                  Ciphertext + 128-bit Tag: {payloadParts[4]?.slice(0, 12)}...
                </span>
              </div>
            </div>
          )}

          {/* Tamper Testing Simulator */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700 }}>
              <AlertTriangle size={16} />
              <span>GCM Tamper & Authentication Tag Validation Simulator</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              AES-GCM authenticates every single byte. Tampering with 1 character or using a wrong password immediately causes decryption to fail.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleTamperPayload}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                }}
              >
                Mutate 1 Ciphertext Byte
              </button>
              <button
                onClick={() => {
                  setDecryptKeyInput('WrongPassword123!');
                  handleDecrypt(encryptedOutput, 'WrongPassword123!');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(244, 63, 94, 0.2)',
                  color: '#fb7185',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                }}
              >
                Test Wrong Password
              </button>
              <button
                onClick={() => {
                  setDecryptKeyInput(secretKey);
                  handleEncrypt();
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                Reset to Original
              </button>
            </div>
            {tamperedNotice && (
              <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600 }}>{tamperedNotice}</div>
            )}
          </div>

          {/* Decryption Verification Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Decrypted Result Status:
            </label>
            {errorStatus ? (
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}>
                <XCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{errorStatus}</span>
              </div>
            ) : (
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '160px',
                overflowY: 'auto',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#10b981', fontWeight: 700 }}>
                  <CheckCircle2 size={16} />
                  <span>Decryption Succeeded & Tag Verified Authentic!</span>
                </div>
                {decryptedOutput}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <FileCode size={18} color="#6366f1" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Generated TypeScript Code for Selected Config</h4>
        </div>
        <CodeBox code={generatedCode} language="typescript" title="aescryptor-ts-usage.ts" />
      </div>
    </div>
  );
};
