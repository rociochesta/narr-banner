import sunsetPurple from '../assets/themes/sunset-purple.png'
import sunsetGolden from '../assets/themes/sunset-golden.png'
import nightCrescent from '../assets/themes/night-crescent.png'
import nightFullmoon from '../assets/themes/night-fullmoon.png'
import storm from '../assets/themes/storm.png'
import tropicalSunset from '../assets/themes/tropical-sunset.png'
import aurora from '../assets/themes/aurora.png'
import tropicalDay from '../assets/themes/tropical-day.png'

const THEME_STYLES = {
  'sunset-purple':   { img: sunsetPurple,   accent: '#f5a623', text: '#fff5e6', sub: '#f0b8ff' },
  'sunset-golden':   { img: sunsetGolden,   accent: '#FFD84D', text: '#fff5e6', sub: '#ffd9a0' },
  'night-crescent':  { img: nightCrescent,  accent: '#88bbff', text: '#ddeeff', sub: '#6699dd' },
  'night-fullmoon':  { img: nightFullmoon,  accent: '#e8eeff', text: '#d8e8ff', sub: '#99aacc' },
  'storm':           { img: storm,          accent: '#80b8ff', text: '#c8d8f0', sub: '#6888aa' },
  'tropical-sunset': { img: tropicalSunset, accent: '#ffe060', text: '#fff5e0', sub: '#ffbb88' },
  'aurora':          { img: aurora,         accent: '#40ffb0', text: '#c8fff0', sub: '#50cc90' },
  'tropical-day':    { img: tropicalDay,    accent: '#ffee00', text: '#ffffff', sub: '#b0f0ff' },
}

export default function BannerPreview({ form, theme }) {
  const t = THEME_STYLES[theme] || THEME_STYLES['sunset-golden']

  return (
    <div className="flex flex-col gap-4 items-center">
      <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">👁 Preview</p>

      {/* Banner card — 16:9-ish, image fills left, text on right */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl flex"
        style={{ width: 640, height: 360 }}
      >
        {/* Background image — full bleed */}
        <img
          src={t.img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay on right half so text is readable */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, transparent 30%, rgba(0,0,0,0.72) 52%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        {/* Text panel — right side */}
        <div
          className="relative ml-auto flex flex-col justify-center gap-3 px-7 py-6 text-right"
          style={{ width: '55%' }}
        >
          {/* NARR heading */}
          <div>
            <p
              style={{ color: t.accent, fontFamily: "'UnifrakturMaguntia', serif" }}
              className="text-4xl tracking-wider drop-shadow leading-none"
            >
              NARR
            </p>
            <p
              style={{ color: t.sub }}
              className="text-[9px] tracking-[3px] uppercase font-bold mt-0.5"
            >
              Narcotics Anonymous Recovery Rangers
            </p>
          </div>

          <div style={{ borderColor: t.accent + '55' }} className="border-t" />

          {/* Day + type */}
          <div>
            <p
              style={{ color: t.accent, fontFamily: "'Fredoka One', cursive" }}
              className="text-2xl leading-tight"
            >
              {form.day}
            </p>
            <p style={{ color: t.text }} className="text-sm font-bold leading-snug mt-0.5">
              {form.type}
            </p>
            {form.host && (
              <p style={{ color: t.sub }} className="text-xs italic mt-0.5">
                Host: {form.host}
              </p>
            )}
            {form.speaker && (
              <p style={{ color: t.sub }} className="text-xs italic mt-0.5">
                Speaker: {form.speaker}
              </p>
            )}
          </div>

          <div style={{ borderColor: t.accent + '55' }} className="border-t" />

          {/* Times */}
          <div>
            <p style={{ color: t.sub }} className="text-[9px] tracking-[3px] uppercase font-bold mb-1">
              Meeting Time
            </p>
            <p style={{ color: t.text }} className="text-sm font-bold">{form.times1}</p>
            <p style={{ color: t.text }} className="text-sm font-bold">{form.times2}</p>
          </div>

          <div style={{ borderColor: t.accent + '55' }} className="border-t" />

          {/* Zoom */}
          <div>
            <p style={{ color: t.sub }} className="text-[9px] tracking-[3px] uppercase font-bold mb-1">
              Join on Zoom
            </p>
            <p style={{ color: t.text }} className="text-sm font-bold">ID: {form.zoomId}</p>
            <p style={{ color: t.text }} className="text-sm font-bold">Password: {form.zoomPw}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
