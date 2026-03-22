import sunsetPurple   from '../assets/themes/sunset-purple.png'
import sunsetGolden   from '../assets/themes/sunset-golden.png'
import nightCrescent  from '../assets/themes/night-crescent.png'
import nightFullmoon  from '../assets/themes/night-fullmoon.png'
import storm          from '../assets/themes/storm.png'
import tropicalSunset from '../assets/themes/tropical-sunset.png'
import aurora         from '../assets/themes/aurora.png'
import tropicalDay    from '../assets/themes/tropical-day.png'
import logoWhite      from '../assets/logowhite.svg'
import logoBlack      from '../assets/logoblack.svg'

const THEMES = {
  'sunset-purple':   { img: sunsetPurple,   textColor: '#FFD84D' },
  'sunset-golden':   { img: sunsetGolden,   textColor: '#FFD84D' },
  'night-crescent':  { img: nightCrescent,  textColor: '#c8e8ff' },
  'night-fullmoon':  { img: nightFullmoon,  textColor: '#c8e8ff' },
  'storm':           { img: storm,          textColor: '#FFD84D' },
  'tropical-sunset': { img: tropicalSunset, textColor: '#FFD84D' },
  'aurora':          { img: aurora,         textColor: '#a0ffdd' },
  'tropical-day':    { img: tropicalDay,    textColor: '#FFD84D' },
}

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${opacity})`
}

function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Group a chunk's text into visual paragraphs of ~2 sentences each
function toVisualParas(chunk) {
  if (!chunk) return []
  const sentences = chunk.match(/[^.!?]+[.!?]+["'\u201D]?\s*|[^.!?]+$/g) || [chunk]
  const groups = []
  for (let i = 0; i < sentences.length; i += 2) {
    const group = sentences.slice(i, i + 2).join('').trim()
    if (group) groups.push(group)
  }
  return groups.length ? groups : [chunk]
}

// Props: chunk (string), pageNum, chunkIdx, totalChunks, entry, form, theme, orientation
export default function BasicTextSlide({ chunk, pageNum, chunkIdx = 0, totalChunks = 1, entry, form, theme, orientation = 'portrait' }) {
  const t            = THEMES[theme] || THEMES['sunset-golden']
  const accent       = form.accentColor  || t.textColor
  const overlayColor = form.overlayColor || '#000000'
  const overlayOp    = form.overlayOpacity ?? 0.72

  const isLand = orientation === 'landscape'
  const W      = isLand ? 700 : 450
  const H      = isLand ? 394 : 800
  const cardW  = isLand ? '82%' : '88%'
  const cardH  = isLand ? '290px' : '560px'
  const bodyPx = form.slideTextSize ?? 13

  const overlayGradient = `linear-gradient(to bottom,
    ${hexToRgba(overlayColor, overlayOp * 0.25)} 0%,
    ${hexToRgba(overlayColor, overlayOp * 0.65)} 40%,
    ${hexToRgba(overlayColor, overlayOp * 0.80)} 100%
  )`

  const dateStr  = formatDate(form.meetingDate)
  const topLabel = [form.day !== 'None' ? form.day : '', dateStr].filter(Boolean).join(' · ')

  if (!entry || !chunk) return null

  const visParas    = toVisualParas(chunk)
  const chunkLabel  = totalChunks > 1 ? `p. ${pageNum} · ${chunkIdx + 1}/${totalChunks}` : `p. ${pageNum}`
  // Use a stable id for html2canvas download
  const slideId     = `basic-text-${pageNum}-${chunkIdx}`

  return (
    <div
      id={slideId}
      style={{ width: `${W}px`, height: `${H}px`, position: 'relative', overflow: 'hidden', borderRadius: '14px', flexShrink: 0 }}
    >
      <img src={t.img} alt="" crossOrigin="anonymous"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.82) saturate(1.1)' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: overlayGradient }} />

      {form.showLogo && (
        <img src={form.logoColor === 'black' ? logoBlack : logoWhite} alt="NARR logo" crossOrigin="anonymous"
          style={{ position: 'absolute', bottom: isLand ? '14px' : '20px', left: isLand ? '16px' : '22px', width: isLand ? '52px' : '60px', opacity: 0.7, zIndex: 10 }}
        />
      )}

      {form.host && (
        <div style={{ position: 'absolute', bottom: isLand ? '14px' : '22px', right: '22px', fontFamily: '"Cinzel", serif', fontSize: '8px', letterSpacing: '2px', color: accent, opacity: 0.75, zIndex: 10, textAlign: 'right' }}>
          Host: {form.host}
        </div>
      )}

      {/* NARR wordmark */}
      <div style={{ position: 'absolute', top: '18px', right: '22px', fontFamily: "'PirataOne', serif", fontSize: isLand ? '30px' : '38px', color: accent, lineHeight: 1, letterSpacing: '4px', textShadow: '2px 2px 0 rgba(0,0,0,0.7)', zIndex: 10 }}>
        NARR
      </div>

      {topLabel && (
        <div style={{ position: 'absolute', top: '22px', left: '22px', fontFamily: '"Cinzel", serif', fontSize: '8px', letterSpacing: '2px', color: accent, opacity: 0.72, zIndex: 10 }}>
          {topLabel}
        </div>
      )}

      {/* Card */}
      <div style={{
        position: 'absolute', top: '43%', left: '50%', transform: 'translate(-50%, -50%)',
        width: cardW, height: cardH, overflow: 'hidden',
        background: 'linear-gradient(to bottom, rgba(10,15,25,0.65), rgba(10,15,25,0.82))',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '22px', padding: isLand ? '22px 44px' : '36px 52px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.08)',
        zIndex: 5, display: 'flex', flexDirection: 'column',
      }}>

        {/* Chapter badge */}
        <div style={{ fontFamily: '"Cinzel", serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '3.5px', color: accent, textTransform: 'uppercase', opacity: 0.6, marginBottom: '10px', flexShrink: 0 }}>
          {entry.chapter} · {entry.title}
        </div>

        {/* Divider */}
        <div style={{ width: '38%', height: '1px', background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`, marginBottom: '16px', flexShrink: 0 }} />

        {/* Text — visual paragraph groups */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: isLand ? '10px' : '14px' }}>
          {visParas.map((para, i) => (
            <p key={i} style={{
              margin: 0,
              fontFamily: '"Cinzel", serif',
              fontSize: `${bodyPx}px`,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.75,
              letterSpacing: '0.15px',
              textAlign: 'left',
            }}>
              {para}
            </p>
          ))}
        </div>

        {/* Page / chunk counter */}
        <div style={{ paddingTop: '12px', fontFamily: '"Cinzel", serif', fontSize: '7.5px', color: accent, opacity: 0.4, letterSpacing: '2px', flexShrink: 0 }}>
          {chunkLabel}
        </div>

      </div>
    </div>
  )
}
