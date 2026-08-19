import React, { useState, useEffect, useRef } from 'react';
import { 
  extractPalette, 
  evaluateWCAG, 
  getContrastRatio, 
  rgbToHex, 
  rgbToHsl,
  useColorExtractor 
} from 'web-color-extractor';
import { 
  Palette, 
  Upload, 
  Image as ImageIcon, 
  Sliders, 
  Check, 
  Copy, 
  Zap, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Music,
  FileCode
} from 'lucide-react';
import { CodeBox } from '../CodeBox';

const SAMPLE_IMAGES = [
  {
    name: 'Cyberpunk Neon',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sunset Ocean',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Mountain Aurora',
    url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Minimal Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Tokyo Blossom',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Abstract Fluid',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
  },
];

export const ColorExtractorStudio: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_IMAGES[0].url);
  const [customUrl, setCustomUrl] = useState<string>('');
  
  // Extractor Options
  const [maxColors, setMaxColors] = useState<number>(10);
  const [quality, setQuality] = useState<number>(5);
  const [maxDimension, setMaxDimension] = useState<number>(300);
  const [useWorker, setUseWorker] = useState<boolean>(true);
  const [alphaThreshold, setAlphaThreshold] = useState<number>(125);
  const [ignoreWhite, setIgnoreWhite] = useState<boolean>(false);

  // Result state
  const [palette, setPalette] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processTime, setProcessTime] = useState<number>(0);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const runExtraction = async (imgSource: string | File) => {
    setIsLoading(true);
    const start = performance.now();
    try {
      const result = await extractPalette(imgSource, {
        maxColors,
        quality,
        maxDimension,
        useWorker,
        alphaThreshold,
        ignoreWhite,
      });
      const elapsed = performance.now() - start;
      setProcessTime(Math.round(elapsed * 10) / 10);
      setPalette(result);
    } catch (err) {
      console.error('Extraction failed: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runExtraction(selectedImage);
  }, [selectedImage, maxColors, quality, maxDimension, useWorker, alphaThreshold, ignoreWhite]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const categories = [
    { key: 'dominant', label: 'Dominant', color: palette?.dominant },
    { key: 'vibrant', label: 'Vibrant', color: palette?.vibrant },
    { key: 'lightVibrant', label: 'Light Vibrant', color: palette?.lightVibrant },
    { key: 'darkVibrant', label: 'Dark Vibrant', color: palette?.darkVibrant },
    { key: 'muted', label: 'Muted', color: palette?.muted },
    { key: 'lightMuted', label: 'Light Muted', color: palette?.lightMuted },
    { key: 'darkMuted', label: 'Dark Muted', color: palette?.darkMuted },
  ];

  const dominantHex = palette?.dominant?.hex || '#6366f1';
  const vibrantHex = palette?.vibrant?.hex || '#38bdf8';
  const darkVibrantHex = palette?.darkVibrant?.hex || '#0f172a';

  const generatedCode = `import { extractPalette, evaluateWCAG } from 'web-color-extractor';

// 1. Extract dynamic color palette with MMCQ algorithm
const palette = await extractPalette(imageElementOrUrl, {
  maxColors: ${maxColors},
  quality: ${quality},
  maxDimension: ${maxDimension},
  useWorker: ${useWorker},
  alphaThreshold: ${alphaThreshold},
  ignoreWhite: ${ignoreWhite},
});

console.log('Dominant:', palette.dominant?.hex);
console.log('Vibrant:', palette.vibrant?.hex);
console.log('Dark Vibrant:', palette.darkVibrant?.hex);
console.log('All Swatches:', palette.allSwatches);

// 2. Evaluate WCAG 2.1 contrast compliance
const wcag = evaluateWCAG(palette.dominant.rgb);
console.log('Contrast Ratio:', wcag.contrastRatio);
console.log('Preferred Text Color:', wcag.preferredTextColor); // #FFFFFF or #000000`;

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
        borderLeft: '4px solid #ec4899',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(236, 72, 153, 0.15)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Palette size={28} color="#ec4899" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>web-color-extractor 🎨</h2>
              <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#db2777', border: '1px solid rgba(236, 72, 153, 0.3)' }}>v1.0.0</span>
              <span className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>MMCQ + Worker</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Client-side dynamic color palette extractor, 7 profile swatches, and WCAG contrast validator.
            </p>
          </div>
        </div>

        {processTime > 0 && (
          <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#db2777', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '6px 12px' }}>
            <Zap size={14} /> Extracted in {processTime} ms
          </span>
        )}
      </div>

      {/* Main Grid: Image Selector & Options | Extracted Palette & Live UI Mock */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Left Column: Image Source & Config */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <ImageIcon size={18} color="#ec4899" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>1. Image Source & Presets</h3>
          </div>

          {/* Sample Preset Buttons */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Choose a Sample Image Preset:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {SAMPLE_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  style={{
                    position: 'relative',
                    height: '60px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === img.url ? '2px solid #ec4899' : '1px solid var(--border-subtle)',
                    boxShadow: selectedImage === img.url ? '0 0 12px rgba(236, 72, 153, 0.5)' : 'none',
                  }}
                >
                  <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0, 0, 0, 0.65)',
                    padding: '2px 4px',
                    fontSize: '0.65rem',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}>
                    {img.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Upload & URL Input */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Upload size={16} /> Upload Local Image
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="url"
              placeholder="Paste Image URL..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              style={{ flex: 1, fontSize: '0.85rem' }}
            />
            <button
              onClick={() => {
                if (customUrl) setSelectedImage(customUrl);
              }}
              style={{
                padding: '0 16px',
                borderRadius: 'var(--radius-md)',
                background: '#ec4899',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              Load
            </button>
          </div>

          {/* Active Image Preview */}
          <div style={{
            height: '180px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            background: '#070b14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img src={selectedImage} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          {/* All Options Sliders & Toggles */}
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              <Sliders size={16} color="#ec4899" />
              <span>All Extractor Options (`ExtractorOptions`)</span>
            </div>

            {/* Max Colors Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Max Colors (`options.maxColors`):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#ec4899', fontWeight: 700 }}>{maxColors}</span>
              </div>
              <input
                type="range"
                min={2}
                max={32}
                value={maxColors}
                onChange={(e) => setMaxColors(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ec4899' }}
              />
            </div>

            {/* Quality (Stride Step) Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Quality / Step (`options.quality`):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#0284c7', fontWeight: 700 }}>
                  {quality} ({quality === 1 ? 'Highest Precision' : 'Faster Sampling'})
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            {/* Max Dimension */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Max Canvas Dimension (`options.maxDimension`):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#a855f7', fontWeight: 700 }}>{maxDimension}px</span>
              </div>
              <input
                type="range"
                min={100}
                max={800}
                step={50}
                value={maxDimension}
                onChange={(e) => setMaxDimension(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#a855f7' }}
              />
            </div>

            {/* Checkbox Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={useWorker}
                  onChange={(e) => setUseWorker(e.target.checked)}
                  style={{ accentColor: '#ec4899' }}
                />
                <span>Web Worker (`useWorker`)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={ignoreWhite}
                  onChange={(e) => setIgnoreWhite(e.target.checked)}
                  style={{ accentColor: '#ec4899' }}
                />
                <span>Ignore White Padding</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: 7 Swatches, Full Palette & Live Mock UI */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Layers size={18} color="#ec4899" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>2. 7 Profile Tokens & Quantized Palette</h3>
          </div>

          {/* 7 Profile Swatches */}
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Categorized Profile Swatches:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
              {categories.map((cat) => (
                <div
                  key={cat.key}
                  onClick={() => cat.color && handleCopy(cat.color.hex)}
                  style={{
                    background: cat.color ? cat.color.hex : '#1e293b',
                    color: cat.color?.isDark ? '#ffffff' : '#000000',
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    cursor: cat.color ? 'pointer' : 'default',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
                    transition: 'transform 0.15s ease',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 600 }}>{cat.label}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                    {cat.color?.hex || 'N/A'}
                  </div>
                  {copiedHex === cat.color?.hex && (
                    <div style={{ fontSize: '0.65rem', marginTop: '2px', fontWeight: 700 }}>Copied!</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* All Quantized Swatches List */}
          {palette?.allSwatches && (
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                All Quantized Swatches ({palette.allSwatches.length} colors):
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {palette.allSwatches.map((swatch: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => handleCopy(swatch.hex)}
                    title={`HEX: ${swatch.hex}\nRGB: (${swatch.rgb.join(', ')})\nCoverage: ${swatch.percentage}%`}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: swatch.hex,
                      border: copiedHex === swatch.hex ? '2px solid #ffffff' : '1px solid rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* WCAG 2.1 Accessibility Contrast Checker */}
          {palette?.dominant && (
            <div style={{
              background: 'var(--bg-subtle)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.85rem', fontWeight: 700 }}>
                <ShieldCheck size={16} color="#0284c7" />
                <span>WCAG 2.1 Accessibility Validator on Dominant Color ({palette.dominant.hex})</span>
              </div>
              {(() => {
                const wcag = evaluateWCAG(palette.dominant.rgb);
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.8rem', marginTop: '4px' }}>
                    <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>Contrast Ratio</div>
                      <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.95rem' }}>{wcag.contrastRatio}:1</div>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>Preferred Text</div>
                      <div style={{ fontWeight: 800, color: wcag.preferredTextColor === '#FFFFFF' ? '#0f172a' : '#0f172a', fontSize: '0.95rem' }}>
                        {wcag.preferredTextColor === '#FFFFFF' ? 'White Text' : 'Black Text'}
                      </div>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>Compliance</div>
                      <div style={{ fontWeight: 800, color: wcag.scoreAA ? '#059669' : '#e11d48', fontSize: '0.95rem' }}>
                        {wcag.scoreAAA ? 'AAA Pass' : wcag.scoreAA ? 'AA Pass' : 'Fail'}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Live Dynamic Mock UI Preview: Themed Music Player Card */}
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Live Dynamic UI Themed with Extracted Palette:
            </span>
            <div style={{
              background: `linear-gradient(135deg, ${darkVibrantHex}ee, ${palette?.darkMuted?.hex || '#0f172a'}dd)`,
              border: `1px solid ${vibrantHex}55`,
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: `0 10px 25px -5px ${darkVibrantHex}99`,
              transition: 'all 0.5s ease',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: `0 4px 15px ${dominantHex}66`,
              }}>
                <img src={selectedImage} alt="Album" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.72rem', color: vibrantHex, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Now Playing (Dynamic Theme)
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Synthetic Euphoria
                </div>
                <div style={{ fontSize: '0.8rem', color: palette?.lightMuted?.hex || '#cbd5e1' }}>
                  Aakash Sakhalkar • Waveform
                </div>
              </div>

              <button style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: vibrantHex,
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 15px ${vibrantHex}88`,
                flexShrink: 0,
              }}>
                <Play size={18} fill="#000000" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <FileCode size={18} color="#ec4899" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Integration Code for web-color-extractor</h4>
        </div>
        <CodeBox code={generatedCode} language="typescript" title="color-extractor-usage.ts" />
      </div>
    </div>
  );
};
