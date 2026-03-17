import slidesData    from '../data/static_slides.json'
import * as Ph from '@phosphor-icons/react'

function PIcon({ name, size = 14, weight = 'bold' }) {
  const Icon = Ph[name]
  return Icon ? <Icon size={size} weight={weight} style={{ display: 'inline', flexShrink: 0 }} /> : null
}
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
  'sunset-purple':   { img: sunsetPurple,   textColor: '#FFD84D', subColor: '#ffe8a0' },
  'sunset-golden':   { img: sunsetGolden,   textColor: '#FFD84D', subColor: '#ffe8a0' },
  'night-crescent':  { img: nightCrescent,  textColor: '#c8e8ff', subColor: '#a0c8f0' },
  'night-fullmoon':  { img: nightFullmoon,  textColor: '#c8e8ff', subColor: '#a0c8f0' },
  'storm':           { img: storm,          textColor: '#FFD84D', subColor: '#ffe8a0' },
  'tropical-sunset': { img: tropicalSunset, textColor: '#FFD84D', subColor: '#fff0b0' },
  'aurora':          { img: aurora,         textColor: '#a0ffdd', subColor: '#c0ffe8' },
  'tropical-day':    { img: tropicalDay,    textColor: '#FFD84D', subColor: '#fff0b0' },
}

// Keyed object for O(1) lookup — still exported for SlidesPanel / App
export const STATIC_SLIDES = Object.fromEntries(slidesData.map(s => [s.id, s]))

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${opacity})`
}

function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function SlideCanvas({ slideType, slideIdx = 0, form, theme, orientation = 'portrait' }) {
  const t            = THEMES[theme] || THEMES['sunset-golden']
  const accent       = form.accentColor  || t.textColor
  const bodyText     = form.textColor    || '#ffffff'
  const overlayColor = form.overlayColor || '#000000'
  const overlayOp    = form.overlayOpacity ?? 0.72

  const slide   = STATIC_SLIDES[slideType]
  const isLand  = orientation === 'landscape'
  const W       = isLand ? 700 : 450
  const H       = isLand ? 394 : 800
  const cardW   = isLand ? '82%' : '88%'
  const cardTop = isLand ? '50%' : '43%'
  const cardH   = isLand ? '290px' : '560px'
  const titlePx = form.slideTitleSize ?? 22
  const bodyPx  = form.slideTextSize  ?? 13

  const overlayGradient = `linear-gradient(to bottom,
    ${hexToRgba(overlayColor, overlayOp * 0.25)} 0%,
    ${hexToRgba(overlayColor, overlayOp * 0.60)} 40%,
    ${hexToRgba(overlayColor, overlayOp * 0.75)} 100%
  )`

  const dateStr   = formatDate(form.meetingDate)
  const topLabel  = [form.day !== 'None' ? form.day : '', dateStr].filter(Boolean).join(' · ')

  if (!slide) return null

  return (
    <div
      id={`slide-${slideType}-${slideIdx}`}
      style={{
        width:        `${W}px`,
        height:       `${H}px`,
        position:     'relative',
        overflow:     'hidden',
        borderRadius: '14px',
        flexShrink:   0,
      }}
    >
      {/* Background */}
      <img
        src={t.img}
        alt=""
        crossOrigin="anonymous"
        style={{
          position:       'absolute',
          inset:          0,
          width:          '100%',
          height:         '100%',
          objectFit:      'cover',
          objectPosition: 'center 30%',
          filter:         'brightness(0.82) saturate(1.1)',
        }}
      />

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: overlayGradient }} />

      {/* Logo — bottom left */}
      {form.showLogo && (
        <img
          src={form.logoColor === 'black' ? logoBlack : logoWhite}
          alt="NARR logo"
          crossOrigin="anonymous"
          style={{
            position: 'absolute',
            bottom:   isLand ? '14px' : '20px',
            left:     isLand ? '16px' : '22px',
            width:    isLand ? '52px' : '60px',
            opacity:  0.7,
            zIndex:   10,
          }}
        />
      )}

      {/* Host — bottom right */}
      {form.host && (
        <div style={{
          position:      'absolute',
          bottom:        isLand ? '14px' : '22px',
          right:         '22px',
          fontFamily:    '"Cinzel", serif',
          fontSize:      '8px',
          fontWeight:    400,
          letterSpacing: '2px',
          color:         accent,
          opacity:       0.75,
          zIndex:        10,
          textAlign:     'right',
        }}>
          Host: {form.host}
        </div>
      )}

      {/* NARR wordmark — top right */}
      <div style={{
        position:      'absolute',
        top:           '18px',
        right:         '22px',
        fontFamily:    "'PirataOne', serif",
        fontSize:      isLand ? '30px' : '38px',
        color:         accent,
        lineHeight:    1,
        letterSpacing: '4px',
        textShadow:    '2px 2px 0 rgba(0,0,0,0.7)',
        zIndex:        10,
      }}>
        NARR
      </div>

      {/* Day + Date — top left */}
      {topLabel && (
        <div style={{
          position:      'absolute',
          top:           '22px',
          left:          '22px',
          fontFamily:    '"Cinzel", serif',
          fontSize:      '8px',
          fontWeight:    400,
          letterSpacing: '2px',
          color:         accent,
          opacity:       0.72,
          zIndex:        10,
        }}>
          {topLabel}
        </div>
      )}

      {/* Cinematic card */}
      <div style={{
        position:             'absolute',
        top:                  cardTop,
        left:                 '50%',
        transform:            'translate(-50%, -50%)',
        width:                cardW,
        height:               cardH,
        overflow:             'hidden',
        background:           'linear-gradient(to bottom, rgba(10,15,25,0.65), rgba(10,15,25,0.82))',
        backdropFilter:       'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius:         '22px',
        padding:              isLand ? '28px 48px' : '44px 60px',
        boxShadow:            '0 20px 60px rgba(0,0,0,0.65)',
        border:               '1px solid rgba(255,255,255,0.08)',
        zIndex:               5,
        display:              'flex',
        flexDirection:        'column',
        alignItems:           'center',
        textAlign:            'center',
      }}>

        {/* Icon + Title (single line) */}
        <div style={{
          fontFamily:    '"Cinzel", serif',
          fontSize:      `${titlePx}px`,
          fontWeight:    700,
          color:         bodyText,
          letterSpacing: '1px',
          lineHeight:    1.3,
          textShadow:    '1px 2px 8px rgba(0,0,0,0.8)',
          margin:        '0 auto 20px',
          maxWidth:      '520px',
          width:         '100%',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          gap:           '10px',
        }}>
          <PIcon name={slide.icon} size={titlePx} weight="bold" />
          {slide.title}
        </div>

        {/* Divider */}
        <div style={{
          width:      '40%',
          height:     '1px',
          background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
          margin:     '0 auto 24px',
          flexShrink: 0,
        }} />

        {/* Paragraphs */}
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           '14px',
          maxWidth:      '520px',
          width:         '100%',
          margin:        '0 auto',
        }}>
          {[(slide.paragraphs || [])[slideIdx]].filter(Boolean).map((para, i) => {
            const lines = para.split('\n').filter(Boolean)
            const isList = lines.length > 1 && lines.some(l => /^\d+\./.test(l.trim()))
            if (isList) {
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {lines.map((line, j) => {
                    const match = line.trim().match(/^(\d+\.)\s*(.*)/)
                    return (
                      <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', textAlign: 'left' }}>
                        <span style={{
                          fontFamily: '"Cinzel", serif',
                          fontSize:   `${bodyPx}px`,
                          fontWeight: 700,
                          color:      accent,
                          lineHeight: 1.7,
                          flexShrink: 0,
                          minWidth:   '22px',
                        }}>{match ? match[1] : ''}</span>
                        <span style={{
                          fontFamily:    '"Cinzel", serif',
                          fontSize:      `${bodyPx}px`,
                          fontWeight:    400,
                          color:         'rgba(255,255,255,0.88)',
                          lineHeight:    1.7,
                          letterSpacing: '0.2px',
                        }}>{match ? match[2] : line}</span>
                      </div>
                    )
                  })}
                </div>
              )
            }
            return (
              <p key={i} style={{
                margin:        0,
                fontFamily:    '"Cinzel", serif',
                fontSize:      `${bodyPx}px`,
                fontWeight:    400,
                color:         'rgba(255,255,255,0.88)',
                lineHeight:    1.85,
                letterSpacing: '0.2px',
                fontStyle:     slideType === 'serenity-prayer' ? 'italic' : 'normal',
              }}>
                {para}
              </p>
            )
          })}
        </div>

      </div>
    </div>
  )
}
