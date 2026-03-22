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
import * as Ph from '@phosphor-icons/react'

function PIcon({ name, size = 13, weight = 'bold' }) {
  const Icon = Ph[name]
  return Icon ? <Icon size={size} weight={weight} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} /> : null
}

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

const MEETING_META = {
  'Living Clean':            { icon: 'BookOpenIcon',    label: 'Living Clean',         placeholder: 'Content coming soon.' },
  'It Works — How and Why':  { icon: 'WrenchIcon',      label: 'It Works — How & Why', placeholder: 'Content coming soon.' },
  'Speaker Meeting':         { icon: 'MicrophoneIcon',  label: 'Speaker Meeting',      placeholder: 'Content coming soon.' },
  'Basic Text':              { icon: 'ScrollIcon',      label: 'Basic Text',           placeholder: 'Content coming soon.' },
  'Spiritual Principle':     { icon: 'SparkleIcon',     label: 'Spiritual Principle',  placeholder: 'Content coming soon.' },
  'Music Event':             { icon: 'MusicNoteIcon',   label: 'Music Event',          placeholder: 'Content coming soon.' },
  'Movie Event':             { icon: 'FilmStripIcon',   label: 'Movie Event',          placeholder: 'Content coming soon.' },
}

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${opacity})`
}

export default function MeetingSlide({ form, theme, orientation = 'portrait' }) {
  const t            = THEMES[theme] || THEMES['sunset-golden']
  const accent       = form.accentColor  || t.textColor
  const bodyText     = form.textColor    || '#ffffff'
  const subColor     = t.subColor
  const overlayColor = form.overlayColor || '#000000'
  const overlayOp    = form.overlayOpacity ?? 0.72

  const isLand = orientation === 'landscape'
  const W      = isLand ? 700 : 450
  const H      = isLand ? 394 : 800

  const meta       = MEETING_META[form.type] || { icon: 'AnchorIcon', label: form.type, placeholder: 'Content coming soon.' }
  const titleSize  = isLand ? Math.min(form.jftTitleSize ?? 28, 22) : (form.jftTitleSize ?? 28)
  const textSize   = form.jftTextSize  ?? 13

  const overlayGradient = `linear-gradient(to bottom,
    ${hexToRgba(overlayColor, overlayOp * 0.25)} 0%,
    ${hexToRgba(overlayColor, overlayOp * 0.55)} 35%,
    ${hexToRgba(overlayColor, overlayOp * 0.70)} 100%
  )`

  return (
    <div
      id="meeting-slide"
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
          filter:         'brightness(0.85) saturate(1.1)',
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
            bottom:   '20px',
            left:     '22px',
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
        zIndex:       10,
      }}>
        NARR
      </div>

      {/* Meeting type badge — top left */}
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
        <PIcon name={meta.icon} />{meta.label}
      </div>

      {/* Day + Date — under badge */}
      {(form.day !== 'None' || form.meetingDate) && (
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

      {/* ── Cinematic card — positioned at ~42% from top ── */}
      <div style={{
        position:        'absolute',
        top:             '42%',
        left:            '50%',
        transform:       'translate(-50%, -50%)',
        width:           isLand ? '84%' : '88%',
        background:      'linear-gradient(to bottom, rgba(10,15,25,0.65), rgba(10,15,25,0.82))',
        backdropFilter:  'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius:    '22px',
        padding:         isLand ? '32px 52px' : '48px 56px',
        boxShadow:       '0 20px 60px rgba(0,0,0,0.6)',
        border:          '1px solid rgba(255,255,255,0.08)',
        zIndex:          5,
        display:         'flex',
        flexDirection:   'column',
        gap:             '0',
      }}>

        {/* Meeting type label inside card */}
        <div style={{
          fontFamily:   '"Cinzel", serif',
          fontSize:     '8px',
          fontWeight:   700,
          letterSpacing:'4px',
          color:        accent,
          textTransform:'uppercase',
          opacity:      0.7,
          marginBottom: '10px',
        }}>
          {meta.label}
        </div>

        {/* Title */}
        <div style={{
          fontFamily:   '"Cinzel", serif',
          fontSize:     `${titleSize}px`,
          fontWeight:   700,
          color:        bodyText,
          letterSpacing:'1px',
          lineHeight:   1.3,
          textShadow:   '1px 2px 8px rgba(0,0,0,0.8)',
          marginBottom: '18px',
        }}>
          {form.type === 'Basic Text' && form.basicTextChapter
            ? form.basicTextChapter
            : form.speaker || form.type}
        </div>

        {/* Divider */}
        <div style={{
          width:      '60%',
          height:     '1px',
          background: `linear-gradient(90deg, ${accent}88, transparent)`,
          marginBottom: '18px',
        }} />

        {/* Body text placeholder */}
        <p style={{
          margin:       '0 auto',
          maxWidth:     '520px',
          fontFamily:   '"Cinzel", serif',
          fontSize:     `${textSize}px`,
          fontWeight:   400,
          color:        `rgba(255,255,255,0.85)`,
          lineHeight:   1.75,
          letterSpacing:'0.2px',
        }}>
          {meta.placeholder}
        </p>

      </div>

      {/* Punchline / tagline area at bottom */}
      <div style={{
        position:   'absolute',
        bottom:     '90px',
        left:       0,
        right:      0,
        display:    'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap:        '6px',
        padding:    '0 36px',
        zIndex:     5,
      }}>
        {form.host && (
          <div style={{
            fontFamily:   '"Cinzel", serif',
            fontSize:     '9px',
            fontWeight:   400,
            color:        subColor,
            letterSpacing:'2px',
            opacity:      0.75,
          }}>
            Host: {form.host}
          </div>
        )}
      </div>

    </div>
  )
}
