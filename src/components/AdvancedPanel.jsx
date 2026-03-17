import { useState } from 'react'
import { SlidersHorizontalIcon } from '@phosphor-icons/react'

export default function AdvancedPanel({ form, setForm }) {
  const [open, setOpen] = useState(false)
  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  function reset() {
    setForm(f => ({
      ...f,
      overlayColor: '#000000',
      overlayOpacity: 0.72,
      accentColor: '',
      textColor: '',
    }))
  }

  return (
    <div className="bg-[#2a1505] border border-[#FFD84D33] rounded-2xl p-5 w-full max-w-xs">

      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-[10px] tracking-[3px]
          uppercase text-[#FFD84Daa] hover:text-[#FFD84D] transition-colors"
      >
        <span><SlidersHorizontalIcon size={13} weight="bold" className="inline mr-1" />Advanced</span>
        <span className="text-[#FFD84D66]">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-4 mt-4">

          {/* Overlay */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">Overlay</p>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-[#f5edd8cc] w-16">Color</label>
              <input
                type="color"
                value={form.overlayColor}
                onChange={e => update('overlayColor', e.target.value)}
                className="w-10 h-8 rounded cursor-pointer border border-[#FFD84D33] bg-transparent"
              />
              <span className="text-xs text-[#f5edd866]">{form.overlayColor}</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-[#f5edd8cc] w-16">Opacity</label>
              <input
                type="range"
                min="0" max="1" step="0.05"
                value={form.overlayOpacity}
                onChange={e => update('overlayOpacity', parseFloat(e.target.value))}
                className="flex-1 accent-[#FFD84D]"
              />
              <span className="text-xs text-[#f5edd866] w-8">
                {Math.round(form.overlayOpacity * 100)}%
              </span>
            </div>
          </div>

          <hr className="border-[#FFD84D22]" />

          {/* Colors */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">Font Colors</p>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-[#f5edd8cc] w-16">Accent</label>
              <input
                type="color"
                value={form.accentColor || '#FFD84D'}
                onChange={e => update('accentColor', e.target.value)}
                className="w-10 h-8 rounded cursor-pointer border border-[#FFD84D33] bg-transparent"
              />
              <span className="text-xs text-[#f5edd866]">NARR · borders</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-[#f5edd8cc] w-16">Text</label>
              <input
                type="color"
                value={form.textColor || '#ffffff'}
                onChange={e => update('textColor', e.target.value)}
                className="w-10 h-8 rounded cursor-pointer border border-[#FFD84D33] bg-transparent"
              />
              <span className="text-xs text-[#f5edd866]">Day · times · zoom</span>
            </div>
          </div>

          <hr className="border-[#FFD84D22]" />

          <button
            onClick={reset}
            className="text-xs text-[#f5edd855] hover:text-[#f5edd8aa] transition-colors underline underline-offset-2 text-center"
          >
            Reset to theme defaults
          </button>

        </div>
      )}
    </div>
  )
}