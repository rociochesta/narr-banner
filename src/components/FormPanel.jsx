import { useState, useEffect } from 'react'
import { AnchorIcon, PaletteIcon, SkullIcon, CalendarBlankIcon } from '@phosphor-icons/react'

const MEETING_TYPES = [
  'Living Clean',
  'Just for Today',
  'JFT — Full Reading',
  'It Works — How and Why',
  'Speaker Meeting',
  'Basic Text',
  'Spiritual Principle',
  'Music Event',
  'Movie Event',
  'Other',
]


const BASIC_TEXT_CHAPTERS = [
  'Chapter One — Who Is an Addict?',
  'Chapter Two — What Is the Narcotics Anonymous Program?',
  'Chapter Three — Why Are We Here?',
  'Chapter Four — How It Works',
  'Chapter Five — What Can I Do?',
  'Chapter Six — The Twelve Traditions of Narcotics Anonymous',
  'Chapter Seven — Recovery and Relapse',
  'Chapter Eight — We Do Recover',
  'Chapter Nine — Just for Today — Living the Program',
  'Chapter Ten — More Will Be Revealed',
]

const DAYS = [
  'None',
  'Monday Night',
  'Tuesday Night',
  'Wednesday Night',
  'Thursday Night',
  'Friday Night',
  'Saturday Morning',
  'Sunday Morning',
  'Every Night',
]

const THEMES = [
  { id: 'sunset-purple',   label: '🌅 Sunset Purple' },
  { id: 'sunset-golden',   label: '🌅 Sunset Golden' },
  { id: 'night-crescent',  label: '🌙 Crescent Moon' },
  { id: 'night-fullmoon',  label: '🌕 Full Moon' },
  { id: 'storm',           label: '⛈️ Storm' },
  { id: 'tropical-sunset', label: '🌴 Tropical Sunset' },
  { id: 'aurora',          label: '🌌 Aurora' },
  { id: 'tropical-day',    label: '☀️ Tropical Day' },
]

function Section({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex flex-col gap-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between py-2 text-[10px] tracking-[3px] uppercase
          text-[#FFD84Daa] hover:text-[#FFD84D] transition-colors w-full"
      >
        <span>{title}</span>
        <span className="text-[#FFD84D66]">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="flex flex-col gap-3 pb-4">
          {children}
        </div>
      )}
      <div className="border-t border-[#FFD84D22]" />
    </div>
  )
}

export default function FormPanel({ form, setForm, theme, setTheme, mode = 'banner', basicTextData = null }) {
  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const [jftData,     setJftData]     = useState(null)
  const [jftFullData, setJftFullData] = useState(null)

  useEffect(() => {
    fetch('/data/jft_summaries.json').then(r => r.json()).then(setJftData).catch(() => {})
    fetch('/data/jft.JSON').then(r => r.json()).then(setJftFullData).catch(() => {})
  }, [])

  useEffect(() => {
    const isJFT = form.type === 'Just for Today' || form.type === 'JFT — Full Reading'
    const isFull = form.type === 'JFT — Full Reading'
    if (isJFT) {
      const today = new Date()
      const m = today.getMonth() + 1, d = today.getDate()
      setForm(f => ({
        ...f,
        jftEntry:     jftData     ? (jftData.find(e => e.month === m && e.day === d)     ?? null) : null,
        jftFullEntry: jftFullData ? (jftFullData.find(e => e.month === m && e.day === d) ?? null) : null,
        ...(isFull ? { deckSlides: { ...f.deckSlides, 'jft-full': true } } : {}),
      }))
    } else {
      setForm(f => ({ ...f, jftEntry: null, jftFullEntry: null }))
    }
  }, [form.type, jftData, jftFullData])

  useEffect(() => {
    if (form.type === 'Basic Text' && basicTextData) {
      const entry = basicTextData.find(c => c.value === form.basicTextChapter) ?? null
      setForm(f => {
        // Initialize page selection for this chapter if not yet set
        const existing = f.basicTextPageSelection?.[f.basicTextChapter]
        const needsInit = entry && !existing
        const newSel = needsInit
          ? Object.fromEntries(entry.pages.map((_, i) => [i, true]))
          : existing
        return {
          ...f,
          basicTextEntry: entry,
          basicTextPageSelection: needsInit
            ? { ...f.basicTextPageSelection, [f.basicTextChapter]: newSel }
            : f.basicTextPageSelection,
        }
      })
    } else {
      setForm(f => ({ ...f, basicTextEntry: null }))
    }
  }, [form.type, form.basicTextChapter, basicTextData])

  return (
    <div className="bg-[#2a1505] border border-[#FFD84D33] rounded-2xl p-5 flex flex-col gap-1 w-full max-w-xs">

      <p className="text-[#FFD84D] text-xs tracking-[4px] uppercase font-bold text-center mb-3">
        <AnchorIcon size={14} weight="bold" className="inline mr-1 align-middle" />NARR Banner Maker
      </p>

      {/* Theme — open by default */}
      <Section title={<><PaletteIcon size={13} weight="bold" className="inline mr-1" />Theme</>} defaultOpen={true}>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`rounded-lg py-2 px-2 text-xs font-bold border transition-all
                ${theme === t.id
                  ? 'border-[#FFD84D] text-[#FFD84D] bg-[#FFD84D11]'
                  : 'border-[#FFD84D33] text-[#f5edd899] hover:border-[#FFD84D88]'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Logo — in Theme section footer */}
      <Section title={<><SkullIcon size={13} weight="bold" className="inline mr-1" />Logo</>}>
        <label className="flex items-center gap-2 text-xs text-[#f5edd8cc] cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={form.showLogo}
            onChange={e => update('showLogo', e.target.checked)}
            className="accent-[#FFD84D]"
          />
          Show logo in corner
        </label>
        {form.showLogo && (
          <div className="flex gap-2">
            <button
              onClick={() => update('logoColor', 'white')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold border transition-all
                ${form.logoColor === 'white'
                  ? 'border-[#FFD84D] text-[#FFD84D] bg-[#FFD84D11]'
                  : 'border-[#FFD84D33] text-[#f5edd899] hover:border-[#FFD84D88]'}`}
            >
              White
            </button>
            <button
              onClick={() => update('logoColor', 'black')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold border transition-all
                ${form.logoColor === 'black'
                  ? 'border-[#FFD84D] text-[#FFD84D] bg-[#FFD84D11]'
                  : 'border-[#FFD84D33] text-[#f5edd899] hover:border-[#FFD84D88]'}`}
            >
              Black
            </button>
          </div>
        )}
      </Section>

      {/* Meeting — collapsed */}
      <Section title={<><CalendarBlankIcon size={13} weight="bold" className="inline mr-1" />Meeting</>} defaultOpen={false}>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 pt-1 flex-1">
            <label className="text-xs font-bold text-[#f5edd8cc]">Day</label>
            <select
              value={form.day}
              onChange={e => update('day', e.target.value)}
              className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] focus:outline-none focus:border-[#FFD84D]"
            >
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1 pt-1 justify-end">
            <label className="flex items-center gap-2 text-xs text-[#f5edd8cc] cursor-pointer select-none pb-2">
              <input
                type="checkbox"
                checked={!!form.meetingDate}
                onChange={e => update('meetingDate', e.target.checked ? new Date().toISOString().split('T')[0] : '')}
                className="accent-[#FFD84D]"
              />
              Show date
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#f5edd8cc]">Meeting Type</label>
          <select
            value={MEETING_TYPES.slice(0, -1).includes(form.type) ? form.type : 'Other'}
            onChange={e => update('type', e.target.value !== 'Other' ? e.target.value : '')}
            className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] focus:outline-none focus:border-[#FFD84D]"
          >
            {MEETING_TYPES.map(o => <option key={o}>{o}</option>)}
          </select>
          {!MEETING_TYPES.slice(0, -1).includes(form.type) && (
            <input
              value={form.type}
              onChange={e => update('type', e.target.value)}
              placeholder="Describe meeting type..."
              className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] placeholder-[#f5edd833] focus:outline-none focus:border-[#FFD84D]"
            />
          )}
          {form.type === 'Basic Text' && (
            <div className="flex flex-col gap-2">
              {/* Chapter / Topic toggle */}
              <div className="flex">
                {[['chapter', 'By Chapter'], ['topic', 'By Topic']].map(([id, label]) => (
                  <button key={id}
                    onClick={() => update('basicTextMode', id)}
                    className={`flex-1 py-1.5 text-[10px] tracking-[2px] uppercase border transition-all
                      ${form.basicTextMode === id
                        ? 'bg-[#FFD84D18] border-[#FFD84D66] text-[#FFD84D] font-bold'
                        : 'bg-transparent border-[#FFD84D22] text-[#f5edd855] hover:border-[#FFD84D44]'}
                      ${id === 'chapter' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
                  >{label}</button>
                ))}
              </div>

              {/* Chapter mode: chapter dropdown */}
              {form.basicTextMode !== 'topic' && (
                <select
                  value={form.basicTextChapter}
                  onChange={e => update('basicTextChapter', e.target.value)}
                  className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] focus:outline-none focus:border-[#FFD84D]"
                >
                  <option value="">— Select chapter —</option>
                  {BASIC_TEXT_CHAPTERS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}

              {/* Topic mode: info — selection happens in the reader panel */}
              {form.basicTextMode === 'topic' && (() => {
                const sel = form.basicTextTopicSelection || {}
                const selPages = Object.values(sel).filter(Boolean).length
                return (
                  <p className="text-[10px] text-[#FFD84D88] tracking-[1px] leading-relaxed italic">
                    {selPages > 0
                      ? `${selPages} page${selPages !== 1 ? 's' : ''} selected — browse topics in the reader →`
                      : 'Browse topics in the reader panel →'}
                  </p>
                )
              })()}
            </div>
          )}
        </div>
        {(form.type === 'Just for Today' || form.type === 'JFT — Full Reading') && (
          <div className="flex flex-col gap-2 bg-[#1a0f05] border border-[#FFD84D22] rounded-lg p-3">
            {form.jftEntry ? (
              <>
                <p className="text-[10px] text-[#f5edd8aa] italic leading-snug">
                  "{form.jftPirate ? form.jftEntry.title_pirate : form.jftEntry.title}"
                </p>
                {form.type === 'Just for Today' && (
                  <>
                    <label className="flex items-center gap-2 text-xs text-[#f5edd8cc] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.jftShowPunchline}
                        onChange={e => update('jftShowPunchline', e.target.checked)}
                        className="accent-[#FFD84D]"
                      />
                      Show punchline
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#f5edd8cc] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.jftPirate}
                        onChange={e => update('jftPirate', e.target.checked)}
                        className="accent-[#FFD84D]"
                      />
                      <SkullIcon size={12} weight="bold" className="inline mr-1" />Pirate jargon
                    </label>
                  </>
                )}
                {/* Font size controls */}
                <div className="flex flex-col gap-2 pt-1 border-t border-[#FFD84D22] mt-1">
                  {[['Title size', 'jftTitleSize', 12, 36, 1], ['Text size', 'jftTextSize', 7, 20, 0.5]].map(([label, field, min, max, step]) => (
                    <div key={field} className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#f5edd8aa]">{label}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => update(field, Math.max(min, +(form[field] - step).toFixed(1)))}
                          className="w-5 h-5 rounded border border-[#FFD84D44] text-[#FFD84D] text-xs hover:border-[#FFD84D] leading-none"
                        >−</button>
                        <span className="text-[10px] text-[#f5edd8] w-7 text-center">{form[field]}</span>
                        <button
                          onClick={() => update(field, Math.min(max, +(form[field] + step).toFixed(1)))}
                          className="w-5 h-5 rounded border border-[#FFD84D44] text-[#FFD84D] text-xs hover:border-[#FFD84D] leading-none"
                        >+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[10px] text-[#f5edd855] italic">No JFT entry found for today</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#f5edd8cc]">
            Host <span className="font-normal opacity-60">(optional)</span>
          </label>
          <input
            value={form.host}
            onChange={e => update('host', e.target.value)}
            placeholder="e.g. John D"
            className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] placeholder-[#f5edd833] focus:outline-none focus:border-[#FFD84D]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#f5edd8cc]">
            Speaker <span className="font-normal opacity-60">(optional)</span>
          </label>
          <input
            value={form.speaker}
            onChange={e => update('speaker', e.target.value)}
            placeholder="e.g. Tanya G"
            className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] placeholder-[#f5edd833] focus:outline-none focus:border-[#FFD84D]"
          />
        </div>
      </Section>

      {/* Times + Zoom — banner only */}
      {mode !== 'deck' && (
        <>
          <Section title="🕐 Times" defaultOpen={false}>
            <input
              value={form.times1}
              onChange={e => update('times1', e.target.value)}
              className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] focus:outline-none focus:border-[#FFD84D]"
            />
            <input
              value={form.times2}
              onChange={e => update('times2', e.target.value)}
              className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] focus:outline-none focus:border-[#FFD84D]"
            />
          </Section>

          <Section title="💻 Zoom" defaultOpen={false}>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#f5edd8cc]">Zoom ID</label>
              <input
                value={form.zoomId}
                onChange={e => update('zoomId', e.target.value)}
                className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] focus:outline-none focus:border-[#FFD84D]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#f5edd8cc]">Password</label>
              <input
                value={form.zoomPw}
                onChange={e => update('zoomPw', e.target.value)}
                className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] focus:outline-none focus:border-[#FFD84D]"
              />
            </div>
          </Section>
        </>
      )}

    </div>
  )
}