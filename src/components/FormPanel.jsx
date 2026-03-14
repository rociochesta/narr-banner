const MEETING_TYPES = [
  'Living Clean',
  'JFT',
  'It Works — How and Why',
  'Speaker Meeting',
  'Basic Text',
  'Spiritual Principle',
]

const DAYS = [
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

export default function FormPanel({ form, setForm, theme, setTheme }) {
  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  return (
    <div className="bg-[#2a1505] border border-[#FFD84D33] rounded-2xl p-6 flex flex-col gap-5 w-full max-w-xs">

      {/* NARR title */}
      <div className="text-center">
        <p className="text-[#FFD84D] text-xs tracking-[4px] uppercase font-bold">⚓ NARR Banner Maker</p>
      </div>

      {/* Theme */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">🎨 Theme</p>
        <div className="grid grid-cols-2 gap-2">
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
      </div>

      <hr className="border-[#FFD84D22]" />

      {/* Meeting info */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">📅 Meeting</p>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#f5edd8cc]">Day</label>
          <select
            value={form.day}
            onChange={e => update('day', e.target.value)}
            className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] focus:outline-none focus:border-[#FFD84D]"
          >
            {DAYS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#f5edd8cc]">Meeting Type</label>
          <select
            value={form.type}
            onChange={e => update('type', e.target.value)}
            className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] focus:outline-none focus:border-[#FFD84D]"
          >
            {MEETING_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#f5edd8cc]">Host <span className="font-normal opacity-60">(optional)</span></label>
          <input
            value={form.host}
            onChange={e => update('host', e.target.value)}
            placeholder="e.g. Captain Jack"
            className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] placeholder-[#f5edd833] focus:outline-none focus:border-[#FFD84D]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#f5edd8cc]">Speaker <span className="font-normal opacity-60">(optional)</span></label>
          <input
            value={form.speaker}
            onChange={e => update('speaker', e.target.value)}
            placeholder="e.g. Tanya G"
            className="bg-[#1a0f05] border border-[#FFD84D44] rounded-lg px-3 py-2 text-sm font-bold text-[#f5edd8] placeholder-[#f5edd833] focus:outline-none focus:border-[#FFD84D]"
          />
        </div>
      </div>

      <hr className="border-[#FFD84D22]" />

      {/* Times */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">🕐 Times</p>
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
      </div>

      <hr className="border-[#FFD84D22]" />

      {/* Zoom */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">💻 Zoom</p>
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
      </div>

    </div>
  )
}