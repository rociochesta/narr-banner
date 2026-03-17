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

/**
 * slideType:
 *   'quote'      → Slide 1: title + opening quote
 *   'body-0' … 'body-N' → body paragraph N
 *   'jft'        → Final slide: "Just for Today" affirmation
 */
export default function JFTFullSlide({ entry, slideType, form, theme, orientation = 'portrait' }) {
  const t            = THEMES[theme] || THEMES['sunset-golden']
  const accent       = form.accentColor  || t.textColor
  const bodyText     = form.textColor    || '#ffffff'
  const subColor     = t.subColor
  const overlayColor = form.overlayColor || '#000000'
  const overlayOp    = form.overlayOpacity ?? 0.72

  const isLand = orientation === 'landscape'
  const W      = isLand ? 700 : 450
  const H      = isLand ? 394 : 800
  const cardW  = isLand ? '82%' : '88%'
  const cardH  = isLand ? '290px' : '560px'

  const titlePx = form.slideTitleSize ?? 22
  const bodyPx  = form.slideTextSize  ?? 13

  const overlayGradient = `linear-gradient(to bottom,
    ${hexToRgba(overlayColor, overlayOp * 0.25)} 0%,
    ${hexToRgba(overlayColor, overlayOp * 0.65)} 40%,
    ${hexToRgba(overlayColor, overlayOp * 0.80)} 100%
  )`

  const dateStr  = formatDate(form.meetingDate)
  const topLabel = [form.day !== 'None' ? form.day : '', dateStr].filter(Boolean).join(' · ')

  if (!entry) return null

  const isQuote = slideType === 'quote'
  const isJFT   = slideType === 'jft'
  const bodyIdx = slideType.startsWith('body-') ? parseInt(slideType.replace('body-', ''), 10) : -1

  const elementId = `jft-full-${slideType}`

  return (
    <div
      id={elementId}
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
          letterSpacing: '2px',
          color:         accent,
          opacity:       0.75,
          zIndex:        10,
        }}>
          Host: {form.host}
        </div>
      )}

      {/* NARR — top right */}
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

      {/* Day + date — top left */}
      {topLabel && (
        <div style={{
          position:      'absolute',
          top:           '22px',
          left:          '22px',
          fontFamily:    '"Cinzel", serif',
          fontSize:      '8px',
          letterSpacing: '2px',
          color:         accent,
          opacity:       0.72,
          zIndex:        10,
        }}>
          {topLabel}
        </div>
      )}

      {/* ── Card ── */}
      <div style={{
        position:             'absolute',
        top:                  '43%',
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
        gap:                  0,
      }}>

        {/* ── QUOTE slide ── */}
        {isQuote && (
          <>
            <div style={{
              fontFamily:    '"Cinzel", serif',
              fontSize:      '8px',
              fontWeight:    700,
              letterSpacing: '4px',
              color:         accent,
              textTransform: 'uppercase',
              opacity:       0.65,
              marginBottom:  '16px',
            }}>
              Just for Today
            </div>

            <div style={{
              fontFamily:    '"Cinzel", serif',
              fontSize:      `${titlePx}px`,
              fontWeight:    700,
              color:         bodyText,
              letterSpacing: '1px',
              lineHeight:    1.3,
              textShadow:    '1px 2px 8px rgba(0,0,0,0.8)',
              margin:        '0 auto 22px',
              maxWidth:      '520px',
            }}>
              {entry.title}
            </div>

            <div style={{
              width:      '40%',
              height:     '1px',
              background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
              margin:     '0 auto 22px',
              flexShrink: 0,
            }} />

            <p style={{
              margin:        '0 auto',
              maxWidth:      '480px',
              fontFamily:    '"Cinzel", serif',
              fontSize:      `${bodyPx}px`,
              color:         'rgba(255,255,255,0.88)',
              lineHeight:    1.85,
              letterSpacing: '0.2px',
              fontStyle:     'italic',
            }}>
              "{entry.quote}"
            </p>

            {entry.citation && (
              <div style={{
                marginTop:     '14px',
                fontFamily:    '"Cinzel", serif',
                fontSize:      '8px',
                color:         accent,
                opacity:       0.6,
                letterSpacing: '1.5px',
              }}>
                — {entry.citation}
              </div>
            )}
          </>
        )}

        {/* ── BODY slide ── */}
        {bodyIdx >= 0 && entry.body?.[bodyIdx] && (
          <>
            <div style={{
              fontFamily:    '"Cinzel", serif',
              fontSize:      '8px',
              fontWeight:    700,
              letterSpacing: '4px',
              color:         accent,
              textTransform: 'uppercase',
              opacity:       0.65,
              marginBottom:  '18px',
            }}>
              {entry.title}
            </div>

            <p style={{
              margin:        '0 auto',
              maxWidth:      '520px',
              fontFamily:    '"Cinzel", serif',
              fontSize:      `${bodyPx}px`,
              color:         'rgba(255,255,255,0.88)',
              lineHeight:    1.85,
              letterSpacing: '0.2px',
            }}>
              {entry.body[bodyIdx]}
            </p>
          </>
        )}

        {/* ── JUST FOR TODAY slide ── */}
        {isJFT && (
          <>
            <div style={{
              fontFamily:    '"Cinzel", serif',
              fontSize:      '9px',
              fontWeight:    700,
              letterSpacing: '5px',
              color:         accent,
              textTransform: 'uppercase',
              opacity:       0.7,
              marginBottom:  '20px',
            }}>
              Just for Today
            </div>

            <div style={{
              width:      '40%',
              height:     '1px',
              background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
              margin:     '0 auto 24px',
              flexShrink: 0,
            }} />

            <p style={{
              margin:        '0 auto',
              maxWidth:      '480px',
              fontFamily:    '"Cinzel", serif',
              fontSize:      `${Math.round(bodyPx * 1.15)}px`,
              color:         'rgba(255,255,255,0.9)',
              lineHeight:    1.9,
              letterSpacing: '0.3px',
              fontStyle:     'italic',
            }}>
              {entry.just_for_today}
            </p>
          </>
        )}

      </div>
    </div>
  )
}
