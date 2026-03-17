import logoWhite from '../assets/logowhite.svg'
import logoBlack from '../assets/logoblack.svg'
import sunsetPurple from '../assets/themes/sunset-purple.png'
import sunsetGolden from '../assets/themes/sunset-golden.png'
import nightCrescent from '../assets/themes/night-crescent.png'
import nightFullmoon from '../assets/themes/night-fullmoon.png'
import storm from '../assets/themes/storm.png'
import tropicalSunset from '../assets/themes/tropical-sunset.png'
import aurora from '../assets/themes/aurora.png'
import tropicalDay from '../assets/themes/tropical-day.png'

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

export default function BannerPreview({ form, theme, font }) {
  const t = THEMES[theme] || THEMES['sunset-golden']
  const accent = form.accentColor || t.textColor
  const bodyText = form.textColor || '#ffffff'
  const subColor = t.subColor
  const overlayColor = form.overlayColor || '#000000'
  const overlayOpacity = form.overlayOpacity ?? 0.72

  const overlayGradient = `linear-gradient(to right,
    transparent 25%,
    ${hexToRgba(overlayColor, overlayOpacity * 0.6)} 45%,
    ${hexToRgba(overlayColor, overlayOpacity)} 100%
  )`

  return (
    <div
      id="banner"
      style={{
        width: '700px',
        height: '394px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        flexShrink: 0,
      }}
    >
      {/* Background */}
      <img
        src={t.img}
        alt=""
        crossOrigin="anonymous"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'left center',
        }}
      />

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: overlayGradient }} />

      {/* Logo */}
      {form.showLogo && (
        <img
          src={form.logoColor === 'black' ? logoBlack : logoWhite}
          alt="NARR logo"
          crossOrigin="anonymous"
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            width: '72px',
            opacity: 0.85,
          }}
        />
      )}

      {/* Text panel */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: '370px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px 32px 24px 20px',
        gap: '0',
      }}>

        {/* 1. NARR */}
        <div style={{
          fontFamily: "'PirataOne', serif",

          fontSize: '76px',
          color: accent,
          lineHeight: 0.85,
          textShadow: '3px 3px 0 rgba(0,0,0,0.6)',
          letterSpacing: '6px',
          marginBottom: '6px',
        }}>
          NARR
        </div>

        {/* 1. Full name — bigger, small caps style, wide tracking */}
        <div style={{
          fontFamily: '"Cinzel", serif',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '5px',
          color: subColor,
          textTransform: 'uppercase',
          marginBottom: '4px',
          opacity: 1,
          lineHeight: 1.6,
        }}>
          Narcotics Anonymous<br />Recovery Rangers
        </div>

        {/* Thin rule */}
        <div style={{
          width: '100%',
          height: '1px',
          background: `linear-gradient(90deg, ${accent}99, transparent)`,
          marginBottom: '14px',
          marginTop: '8px',
        }} />

        {/* 2. Day — Cinzel for cinematic feel */}
        {form.day && form.day !== 'None' && (
          <div style={{
            fontFamily: '"Cinzel", serif',
            fontSize: '22px',
            fontWeight: 700,
            color: bodyText,
            marginBottom: '3px',
            letterSpacing: '2px',
            textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
            lineHeight: 1,
          }}>
            {form.day}
          </div>
        )}

        {/* Meeting type */}
        <div style={{
          fontFamily: '"Cinzel", serif',
          fontSize: '10px',
          fontWeight: 400,
          color: accent,
          marginBottom: '4px',
          letterSpacing: '1.5px',
          opacity: 0.9,
        }}>
          {form.type}
        </div>

        {/* JFT title */}
        {form.type === 'Just for Today' && form.jftEntry && (
          <div style={{
            fontFamily: '"Cinzel", serif',
            fontSize: '9.5px',
            fontWeight: 600,
            color: bodyText,
            marginBottom: '4px',
            letterSpacing: '0.4px',
            lineHeight: 1.45,
            opacity: 0.9,
          }}>
            {form.jftPirate ? form.jftEntry.title_pirate : form.jftEntry.title}
          </div>
        )}

        {/* JFT punchline */}
        {form.type === 'Just for Today' && form.jftEntry && form.jftShowPunchline && form.jftEntry.punchlines?.[0] && (
          <div style={{
            fontFamily: '"Cinzel", serif',
            fontSize: '8.5px',
            fontWeight: 400,
            color: accent,
            marginBottom: '4px',
            letterSpacing: '0.3px',
            lineHeight: 1.45,
            opacity: 0.85,
            fontStyle: 'italic',
          }}>
            "{form.jftEntry.punchlines[0]}"
          </div>
        )}

        {/* Host */}
        {form.host && (
          <div style={{
            fontFamily: '"Cinzel", serif',
            fontSize: '11px',
            fontWeight: 400,
            color: bodyText,
            marginBottom: '4px',
            letterSpacing: '1px',
            opacity: 0.85,
          }}>
            Host: {form.host}
          </div>
        )}

        {/* Speaker */}
        {form.speaker && (
          <div style={{
            fontFamily: '"Cinzel", serif',
            fontSize: '13px',
            fontWeight: 700,
            color: bodyText,
            marginBottom: '12px',
            letterSpacing: '1px',
            opacity: 0.95,
          }}>
            {form.speaker}
          </div>
        )}

        {/* Times */}
        <div style={{
          fontFamily: '"Cinzel", serif',
          fontSize: '10px',
          fontWeight: 400,
          color: bodyText,
          lineHeight: 2,
          marginBottom: '14px',
          letterSpacing: '1px',
          opacity: 0.8,
        }}>
          {form.times1}<br />{form.times2}
        </div>

        {/* 5. Zoom box — thinner, more transparent, lantern glow */}
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          border: `0.5px solid ${accent}55`,
          borderRadius: '6px',
          padding: '7px 12px',
          boxShadow: `0 0 12px ${accent}18`,
        }}>
          <div style={{
            fontFamily: '"Cinzel", serif',
            fontSize: '9.5px',
            fontWeight: 600,
            color: accent,
            marginBottom: '3px',
            letterSpacing: '2px',
            opacity: 0.95,
          }}>
            ID <span style={{ color: bodyText, fontWeight: 400 }}>{form.zoomId}</span>
            &nbsp;&nbsp;
            PW <span style={{ color: bodyText, fontWeight: 400 }}>{form.zoomPw}</span>
          </div>
        </div>

      </div>
    </div>
  )
}