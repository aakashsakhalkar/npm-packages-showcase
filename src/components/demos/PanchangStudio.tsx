import React, { useState, useMemo } from 'react';
import { getMarathiPanchang, DEFAULT_LOCATION } from 'marathi-panchang-core';
import { 
  Sun, 
  Moon, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  Compass, 
  Flame, 
  Star, 
  Languages,
  FileCode,
  AlertCircle
} from 'lucide-react';
import { CodeBox } from '../CodeBox';

const CITY_PRESETS = [
  { name: 'पुणे (Pune - Default)', lat: 18.5204, lon: 73.8567, tz: 5.5 },
  { name: 'मुंबई (Mumbai)', lat: 18.9388, lon: 72.8353, tz: 5.5 },
  { name: 'नागपूर (Nagpur)', lat: 21.1458, lon: 79.0882, tz: 5.5 },
  { name: 'नाशिक (Nashik)', lat: 19.9975, lon: 73.7898, tz: 5.5 },
  { name: 'कोल्हापूर (Kolhapur)', lat: 16.7050, lon: 74.2433, tz: 5.5 },
  { name: 'छत्रपती संभाजीनगर (Sambhajinagar)', lat: 19.8762, lon: 75.3433, tz: 5.5 },
  { name: 'ठाणे (Thane)', lat: 19.2183, lon: 72.9781, tz: 5.5 },
  { name: 'सोलापूर (Solapur)', lat: 17.6599, lon: 75.9064, tz: 5.5 },
  { name: 'नवी दिल्ली (New Delhi)', lat: 28.6139, lon: 77.2090, tz: 5.5 },
];

const FESTIVAL_PRESETS = [
  { label: "Today's Date", date: new Date().toISOString().split('T')[0] },
  { label: 'गुढीपाडवा (Gudi Padwa 2026)', date: '2026-03-19' },
  { label: 'आषाढी एकादशी (Ashadhi Ekadashi 2026)', date: '2026-07-25' },
  { label: 'पिठोरी अमावास्या - पोळा (Pola 2026)', date: '2026-09-11' },
  { label: 'गणेश चतुर्थी (Ganesh Chaturthi 2026)', date: '2026-09-14' },
  { label: 'ऋषीपंचमी (Rishi Panchami 2026)', date: '2026-09-15' },
  { label: 'ज्येष्ठा गौरी पूजन (Gauri Pujan 2026)', date: '2026-09-18' },
  { label: 'दिवाळी लक्ष्मीपूजन (Diwali Lakshmi Pujan 2026)', date: '2026-11-08' },
  { label: 'मकर संक्रांती (Makar Sankranti 2026)', date: '2026-01-14' },
  { label: 'महाशिवरात्री (Mahashivratri 2026)', date: '2026-02-15' },
];

export const PanchangStudio: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0);
  const [isCustomCity, setIsCustomCity] = useState<boolean>(false);
  const [customLat, setCustomLat] = useState<number>(18.5204);
  const [customLon, setCustomLon] = useState<number>(73.8567);
  const [customTz, setCustomTz] = useState<number>(5.5);
  const [customCityName, setCustomCityName] = useState<string>('Custom Location');
  const [displayLanguage, setDisplayLanguage] = useState<'mr' | 'en'>('mr');

  // Compute panchang
  const panchangData = useMemo(() => {
    try {
      const location = isCustomCity
        ? { latitude: customLat, longitude: customLon, timezoneOffsetHours: customTz, cityName: customCityName }
        : {
            latitude: CITY_PRESETS[selectedCityIndex].lat,
            longitude: CITY_PRESETS[selectedCityIndex].lon,
            timezoneOffsetHours: CITY_PRESETS[selectedCityIndex].tz,
            cityName: CITY_PRESETS[selectedCityIndex].name,
          };
      return getMarathiPanchang(selectedDate, location);
    } catch (err: any) {
      console.error(err);
      return null;
    }
  }, [selectedDate, selectedCityIndex, isCustomCity, customLat, customLon, customTz, customCityName]);

  const activeCity = isCustomCity
    ? { name: customCityName, lat: customLat, lon: customLon, tz: customTz }
    : CITY_PRESETS[selectedCityIndex];

  const generatedCode = `import { getMarathiPanchang } from 'marathi-panchang-core';

// 1. Configure location coordinates
const location = {
  cityName: '${activeCity.name}',
  latitude: ${activeCity.lat},
  longitude: ${activeCity.lon},
  timezoneOffsetHours: ${activeCity.tz}, // IST UTC+5:30
};

// 2. Compute astronomical Panchang
const panchang = getMarathiPanchang('${selectedDate}', location);

console.log('Month:', panchang.month.fullMonthNameMarathi);
console.log('Tithi:', panchang.tithi.nameMarathi, '(', panchang.tithi.pakshaMarathi, ')');
console.log('Nakshatra:', panchang.nakshatra.nameMarathi, 'Pada:', panchang.nakshatra.pada);
console.log('Sunrise:', panchang.astronomy.sunrise, 'Sunset:', panchang.astronomy.sunset);
console.log('Moonrise (Sankashti Fast):', panchang.astronomy.moonrise);
console.log('Rahu Kaal:', panchang.muhurta.rahuKaal.start, 'to', panchang.muhurta.rahuKaal.end);
console.log('Festivals:', panchang.festivals);`;

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
        borderLeft: '4px solid #f59e0b',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sun size={28} color="#f59e0b" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>marathi-panchang-core 🚩</h2>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.3)' }}>v1.0.3</span>
              <span className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>100% Offline</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              High-precision Lahiri Ayanamsha & Amanta Hindu Calendar astronomical engine for Maharashtra.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Display Script:</span>
          <button
            onClick={() => setDisplayLanguage('mr')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: displayLanguage === 'mr' ? '#f59e0b' : 'rgba(255, 255, 255, 0.06)',
              color: displayLanguage === 'mr' ? '#000000' : 'var(--text-secondary)',
            }}
          >
            मराठी (Devanagari)
          </button>
          <button
            onClick={() => setDisplayLanguage('en')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: displayLanguage === 'en' ? '#f59e0b' : 'rgba(255, 255, 255, 0.06)',
              color: displayLanguage === 'en' ? '#000000' : 'var(--text-secondary)',
            }}
          >
            English
          </button>
        </div>
      </div>

      {/* Control Panel: Date & Location Selectors */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Date Selector */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              <Calendar size={16} color="#f59e0b" />
              <span>Select Gregorian Date:</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: '100%', fontSize: '0.95rem' }}
            />
          </div>

          {/* City Selector */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              <MapPin size={16} color="#f59e0b" />
              <span>Location / City:</span>
            </label>
            <select
              value={isCustomCity ? 'custom' : selectedCityIndex}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setIsCustomCity(true);
                } else {
                  setIsCustomCity(false);
                  setSelectedCityIndex(Number(e.target.value));
                }
              }}
              style={{ width: '100%' }}
            >
              {CITY_PRESETS.map((city, idx) => (
                <option key={idx} value={idx}>{city.name}</option>
              ))}
              <option value="custom">⚙️ Custom Coordinates (Lat / Long / TZ)</option>
            </select>
          </div>
        </div>

        {/* Custom Coordinates Inputs (Conditional) */}
        {isCustomCity && (
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
          }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>City Name:</label>
              <input
                type="text"
                value={customCityName}
                onChange={(e) => setCustomCityName(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Latitude (°):</label>
              <input
                type="number"
                step="0.0001"
                value={customLat}
                onChange={(e) => setCustomLat(Number(e.target.value))}
                style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Longitude (°):</label>
              <input
                type="number"
                step="0.0001"
                value={customLon}
                onChange={(e) => setCustomLon(Number(e.target.value))}
                style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Timezone Offset (Hrs):</label>
              <input
                type="number"
                step="0.5"
                value={customTz}
                onChange={(e) => setCustomTz(Number(e.target.value))}
                style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem' }}
              />
            </div>
          </div>
        )}

        {/* Quick Festival Date Presets */}
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Quick Festival Dates:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FESTIVAL_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDate(p.date)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: selectedDate === p.date ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-subtle)',
                  color: selectedDate === p.date ? '#b45309' : 'var(--text-secondary)',
                  border: selectedDate === p.date ? '1.5px solid #d97706' : '1px solid var(--border-subtle)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Panchang Vedic Card */}
      {panchangData ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Card 1: Core Tithi & Planetary Overview */}
          <div className="glass-panel" style={{
            padding: '24px',
            background: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            borderTop: '3px solid #f59e0b',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 700 }}>
                  {panchangData.samvat.shakaSamvatsaraName} संवत्सर | शके {panchangData.samvat.shakaSamvat} | विक्रम {panchangData.samvat.vikramSamvat}
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)' }}>
                  {displayLanguage === 'mr' ? panchangData.month.fullMonthNameMarathi : panchangData.month.nameEnglish}
                </h3>
              </div>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                {displayLanguage === 'mr' ? panchangData.dayOfWeek.nameMarathi : panchangData.dayOfWeek.nameEnglish} ({panchangData.dayOfWeek.rulerPlanet})
              </span>
            </div>

            {/* Tithi Highlight */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid #f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>तिथी (Tithi):</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
                {displayLanguage === 'mr' ? panchangData.tithi.nameMarathi : panchangData.tithi.nameEnglish} 
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '8px' }}>
                  ({displayLanguage === 'mr' ? panchangData.tithi.pakshaMarathi : panchangData.tithi.pakshaEnglish})
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                उदय तिथी: <b>{panchangData.tithi.udayaTithiMarathi}</b> | वेळ: {panchangData.tithi.startTime} ते {panchangData.tithi.endTime}
              </div>
            </div>

            {/* Nakshatra, Yoga, Karana */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>नक्षत्र (Nakshatra):</span>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0284c7' }}>
                  {displayLanguage === 'mr' ? panchangData.nakshatra.nameMarathi : panchangData.nakshatra.nameEnglish}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  चरण {panchangData.nakshatra.pada} | स्वामी: {panchangData.nakshatra.lordMarathi}
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>चंद्र राशी (Moon Sign):</span>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#9333ea' }}>
                  {panchangData.astronomy.moonRashiMarathi}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  नक्षत्र स्वामी: {panchangData.nakshatra.rashiMarathi}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>योग (Yoga):</span>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: panchangData.yoga.isAuspicious ? '#059669' : '#e11d48' }}>
                  {panchangData.yoga.nameMarathi} {panchangData.yoga.isAuspicious ? '✓ शुभ' : '✗ अशुभ'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>करण (Karana):</span>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: panchangData.karana.isBhadra ? '#e11d48' : 'var(--text-primary)' }}>
                  {panchangData.karana.nameMarathi} {panchangData.karana.isBhadra ? '(भद्रा / विष्टी ⚠️)' : ''}
                </div>
              </div>
            </div>

            {/* Festivals */}
            {panchangData.festivals && panchangData.festivals.length > 0 && (
              <div style={{
                background: 'rgba(236, 72, 153, 0.1)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#db2777', fontSize: '0.82rem', fontWeight: 700 }}>
                  <Sparkles size={14} />
                  <span>सण व उत्सव (Festivals & Vrat):</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {panchangData.festivals.map((f: any, i: number) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(236, 72, 153, 0.15)',
                      color: '#be185d',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      fontSize: '0.82rem',
                      fontWeight: 700
                    }}>
                      🚩 {displayLanguage === 'mr' ? (f.nameMarathi || f.name) : f.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Astronomical Sun & Moon Tracking */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <Compass size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>खगोलीय स्थिती (Solar & Lunar Ephemeris)</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1.5px solid rgba(245, 158, 11, 0.3)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontSize: '0.82rem', fontWeight: 700 }}>
                  <Sun size={15} color="#d97706" /> सूर्योदय (Sunrise)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {panchangData.astronomy.sunrise}
                </div>
              </div>

              <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1.5px solid rgba(244, 63, 94, 0.3)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#be123c', fontSize: '0.82rem', fontWeight: 700 }}>
                  <Sun size={15} color="#e11d48" /> सूर्यास्त (Sunset)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {panchangData.astronomy.sunset}
                </div>
              </div>
            </div>

            {/* Moonrise for Sankashti */}
            <div style={{
              background: 'rgba(79, 70, 229, 0.08)',
              border: '1.5px solid rgba(79, 70, 229, 0.3)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4338ca', fontSize: '0.88rem', fontWeight: 700 }}>
                  <Moon size={16} color="#4f46e5" /> चंद्रोदय वेळ (Moonrise - Sankashti Fast)
                </div>
                <span className="badge" style={{ background: 'rgba(79, 70, 229, 0.15)', color: '#4338ca', border: '1px solid rgba(79, 70, 229, 0.35)', fontWeight: 700 }}>
                  उपवास सोडण्याची वेळ
                </span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4338ca', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                {panchangData.astronomy.moonrise || 'N/A'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>
                चंद्रास्त: <b>{panchangData.astronomy.moonset}</b> | दिनमान: <b>{panchangData.astronomy.dayLength}</b>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              लाहिरी अयनांश (Lahiri Ayanamsha): <b style={{ color: 'var(--text-primary)' }}>{panchangData.astronomy.lahiriAyanamshaDegrees}°</b> | मध्यान्ह: <b style={{ color: 'var(--text-primary)' }}>{panchangData.astronomy.solarNoon}</b>
            </div>
          </div>

          {/* Card 3: Auspicious & Inauspicious Muhurtas */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <Clock size={18} color="#059669" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>शुभ व अशुभ मुहूर्त (Muhurtas & Kaal)</h3>
            </div>

            {/* Inauspicious Rahukaal */}
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1.5px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.88rem' }}>⏳ राहू काळ (Rahu Kaal - वर्ज्य):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#b91c1c', fontWeight: 800, fontSize: '0.95rem' }}>
                  {panchangData.muhurta.rahuKaal.start} ते {panchangData.muhurta.rahuKaal.end}
                </span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>यमगंड काळ (Yamaganda):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>
                  {panchangData.muhurta.yamagandaKaal.start} ते {panchangData.muhurta.yamagandaKaal.end}
                </span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>गुलिक काळ (Gulika Kaal):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>
                  {panchangData.muhurta.gulikaKaal.start} ते {panchangData.muhurta.gulikaKaal.end}
                </span>
              </div>
            </div>

            {/* Auspicious Muhurtas */}
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1.5px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ color: '#047857', fontWeight: 700, fontSize: '0.88rem' }}>✨ अभिजीत मुहूर्त (Abhijit Muhurta):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#047857', fontWeight: 800, fontSize: '0.95rem' }}>
                  {panchangData.muhurta.abhijitMuhurta.start} ते {panchangData.muhurta.abhijitMuhurta.end}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0 4px', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '8px' }}>
              <span>ब्रह्म मुहूर्त: <b style={{ color: 'var(--text-primary)' }}>{panchangData.muhurta.brahmaMuhurta.start}</b></span>
              <span>अमृत काळ: <b style={{ color: 'var(--text-primary)' }}>{panchangData.muhurta.amritKaal.start} - {panchangData.muhurta.amritKaal.end}</b></span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '24px', textAlign: 'center', color: '#f87171' }}>
          Unable to compute Panchang for the specified date.
        </div>
      )}

      {/* Code Snippet Box */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <FileCode size={18} color="#f59e0b" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Integration Code for marathi-panchang-core</h4>
        </div>
        <CodeBox code={generatedCode} language="typescript" title="marathi-panchang-usage.ts" />
      </div>
    </div>
  );
};
