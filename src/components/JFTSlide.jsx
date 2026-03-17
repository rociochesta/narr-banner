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
import { AnchorIcon } from '@phosphor-icons/react'

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

export default function JFTSlide({ form, theme, orientation = 'portrait' }) {
  const t            = THEMES[theme] || THEMES['sunset-golden']
  const accent       = form.accentColor  || t.textColor
  const bodyText     = form.textColor    || '#ffffff'
  const subColor     = t.subColor
  const overlayColor = form.overlayColor || '#000000'
  const overlayOp    = form.overlayOpacity ?? 0.72

  const isLand = orientation === 'landscape'
  const W      = isLand ? 700 : 450
  const H      = isLand ? 394 : 800

  const jft        = form.jftEntry
  const pirate     = form.jftPirate
  const title      = pirate ? jft?.title_pirate   : jft?.title
  const summary    = pirate ? jft?.summary_pirate : jft?.short_summary
  const punchlines = jft?.punchlines ?? []
  const titleSize  = isLand ? Math.min(form.jftTitleSize ?? 18, 20) : (form.jftTitleSize ?? 18)
  const textSize   = isLand ? Math.min(form.jftTextSize  ?? 10.5, 11) : (form.jftTextSize ?? 10.5)

  /* overlay: lighter at top for image, darkens through middle for text */
  const overlayGradient = `linear-gradient(to bottom,
    ${hexToRgba(overlayColor, overlayOp * 0.3 )} 0%,
    ${hexToRgba(overlayColor, overlayOp * 0.75)} 30%,
    ${hexToRgba(overlayColor, overlayOp * 0.88)} 70%,
    ${hexToRgba(overlayColor, overlayOp       )} 100%
  )`

  const Divider = () => (
    <div style={{
      width:      '80%',
      alignSelf:  'center',
      height:     '1px',
      background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
      flexShrink: 0,
      margin:     '14px 0',
    }} />
  )

  return (
    <div
      id="jft-slide"
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
          filter:         'brightness(0.85) saturate(1.15)',
        }}
      />

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: overlayGradient }} />

      {/* Logo bottom-left */}
      {form.showLogo && (
        <img
          src={form.logoColor === 'black' ? logoBlack : logoWhite}
          alt="NARR logo"
          crossOrigin="anonymous"
          style={{
            position: 'absolute',
            bottom:   '18px',
            left:     '20px',
            width:    '60px',
            opacity:  0.7,
            zIndex:   10,
          }}
        />
      )}

      {/* NARR wordmark — top right */}
      <div style={{
        position:     'absolute',
        top:          '18px',
        right:        '22px',
        fontFamily:   "'PirataOne', serif",
        fontSize:     '38px',
        color:        accent,
        lineHeight:   1,
        letterSpacing:'4px',
        textShadow:   '2px 2px 0 rgba(0,0,0,0.7)',
        opacity:      0.95,
        zIndex:       10,
      }}>
        NARR
      </div>

      {/* "Just for Today" badge — top left */}
      <div style={{
        position:     'absolute',
        top:          '26px',
        left:         '22px',
        fontFamily:   '"Cinzel", serif',
        fontSize:     '9px',
        fontWeight:   700,
        letterSpacing:'4px',
        color:        accent,
        textTransform:'uppercase',
        opacity:      0.85,
        zIndex:       10,
      }}>
        <AnchorIcon size={11} weight="bold" style={{ display:'inline', verticalAlign:'middle', marginRight:'5px' }} />Just for Today
      </div>

      {/* Day + Date label — top left under badge */}
      {(form.day && form.day !== 'None' || form.meetingDate) && (
        <div style={{
          position:     'absolute',
          top:          '44px',
          left:         '22px',
          fontFamily:   '"Cinzel", serif',
          fontSize:     '8px',
          fontWeight:   400,
          letterSpacing:'2px',
          color:        subColor,
          opacity:      0.75,
          zIndex:       10,
        }}>
          {[form.day !== 'None' ? form.day : '', form.meetingDate ? new Date(form.meetingDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''].filter(Boolean).join(' · ')}
        </div>
      )}

      {/* Content panel — full height, centered */}
      <div style={{
        position:       'absolute',
        inset:          0,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'flex-start',
        justifyContent: 'center',
        padding:        '80px 28px 80px 28px',
        gap:            0,
        zIndex:         5,
        overflowY:      'hidden',
      }}>

        {/* Title */}
        {title && (
          <div style={{
            fontFamily:   '"Cinzel", serif',
            fontSize:     `${titleSize}px`,
            fontWeight:   700,
            color:        bodyText,
            letterSpacing:'1px',
            lineHeight:   1.35,
            textShadow:   '1px 2px 6px rgba(0,0,0,0.9)',
            marginBottom: '2px',
          }}>
            {title}
          </div>
        )}

        <Divider />

        {/* Summary */}
        {summary && (
          <p style={{
            margin:       0,
            fontFamily:   '"Cinzel", serif',
            fontSize:     `${textSize}px`,
            fontWeight:   400,
            color:        bodyText,
            lineHeight:   1.75,
            opacity:      0.9,
            letterSpacing:'0.2px',
            flex:         1,
            overflow:     'hidden',
          }}>
            {summary}
          </p>
        )}

        {/* Punchlines */}
        {punchlines.length > 0 && (
          <>
            <Divider />
            <div style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           '6px',
              width:         '100%',
              flexShrink:    0,
            }}>
              {punchlines.slice(0, 2).map((line, i) => (
                <div key={i} style={{
                  fontFamily:   '"Cinzel", serif',
                  fontSize:     '10px',
                  fontStyle:    'italic',
                  fontWeight:   400,
                  color:        accent,
                  letterSpacing:'0.4px',
                  lineHeight:   1.55,
                  opacity:      0.88,
                  textAlign:    'center',
                }}>
                  "{line}"
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
