import { useState, useRef } from 'react'
import { STATIC_SLIDES } from './SlideCanvas'
import { SlideshowIcon } from '@phosphor-icons/react'
import * as Ph from '@phosphor-icons/react'

function PIcon({ name }) {
  const Icon = Ph[name]
  return Icon ? <Icon size={13} weight="bold" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} /> : null
}

export default function SlidesPanel({ form, setForm }) {
  const [open, setOpen] = useState(false)
  const [dragOver, setDragOver] = useState(null)
  const dragItem = useRef(null)

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const toggleSlide = (key) =>
    setForm(f => ({ ...f, deckSlides: { ...f.deckSlides, [key]: !f.deckSlides?.[key] } }))

  const slideOrder = form.deckSlideOrder?.length
    ? form.deckSlideOrder.filter(k => STATIC_SLIDES[k])
    : Object.keys(STATIC_SLIDES)

  const handleDrop = (toKey) => {
    const from = dragItem.current
    if (!from || from === toKey) { setDragOver(null); return }
    const order = [...slideOrder]
    const fi = order.indexOf(from)
    const ti = order.indexOf(toKey)
    order.splice(fi, 1)
    order.splice(ti, 0, from)
    update('deckSlideOrder', order)
    dragItem.current = null
    setDragOver(null)
  }

  return (
    <div className="bg-[#2a1505] border border-[#FFD84D33] rounded-2xl p-5 w-full max-w-xs">

      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-[10px] tracking-[3px]
          uppercase text-[#FFD84Daa] hover:text-[#FFD84D] transition-colors"
      >
        <span><SlideshowIcon size={13} weight="bold" className="inline mr-1" />Slide Deck</span>
        <span className="text-[#FFD84D66]">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-4 mt-4">

          {/* Orientation */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">Orientation</p>
            <div className="flex gap-2">
              {[['portrait', '📱 Vertical'], ['landscape', '🖥 Horizontal']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => update('slideOrientation', val)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wide border transition-all
                    ${form.slideOrientation === val
                      ? 'border-[#FFD84D] text-[#FFD84D] bg-[#FFD84D11]'
                      : 'border-[#FFD84D33] text-[#f5edd899] hover:border-[#FFD84D66]'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#FFD84D22]" />

          {/* Font size controls */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">Text Size</p>
            {[['Title', 'slideTitleSize', 12, 40, 1], ['Body', 'slideTextSize', 7, 20, 0.5]].map(([label, field, min, max, step]) => (
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

          <hr className="border-[#FFD84D22]" />

          {/* JFT full reading — only when JFT type is selected */}
          {(form.type === 'Just for Today' || form.type === 'JFT — Full Reading') && form.jftFullEntry && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">Just for Today</p>
              <label className="flex items-center gap-2 text-xs text-[#f5edd8cc] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.deckSlides?.['jft-full'] ?? false}
                  onChange={() => toggleSlide('jft-full')}
                  className="accent-[#FFD84D]"
                />
                <PIcon name="BookOpenTextIcon" />
                Full Reading
                <span className="text-[#f5edd855] ml-auto">
                  {(form.jftFullEntry.body?.length ?? 0) + 2} slides
                </span>
              </label>
            </div>
          )}

          <hr className="border-[#FFD84D22]" />

          {/* Static slide checkboxes — draggable */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">Include Slides</p>
            {slideOrder.map((key) => {
              const slide = STATIC_SLIDES[key]
              if (!slide) return null
              return (
                <div
                  key={key}
                  draggable
                  onDragStart={() => { dragItem.current = key }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(key) }}
                  onDrop={() => handleDrop(key)}
                  onDragEnd={() => setDragOver(null)}
                  className="flex items-center gap-2"
                  style={{
                    borderRadius: '6px',
                    padding: '3px 4px',
                    background: dragOver === key ? 'rgba(255,216,77,0.08)' : 'transparent',
                    border: dragOver === key ? '1px solid rgba(255,216,77,0.3)' : '1px solid transparent',
                    transition: 'background 0.1s',
                  }}
                >
                  <span style={{ color: 'rgba(255,216,77,0.35)', cursor: 'grab', fontSize: '13px', lineHeight: 1, flexShrink: 0, userSelect: 'none' }}>⠿</span>
                  <label className="flex items-center gap-2 text-xs text-[#f5edd8cc] cursor-pointer select-none flex-1">
                    <input
                      type="checkbox"
                      checked={form.deckSlides?.[key] ?? false}
                      onChange={() => toggleSlide(key)}
                      className="accent-[#FFD84D]"
                    />
                    <PIcon name={slide.icon} />{slide.label}
                    {(slide.paragraphs?.length ?? 0) > 1 && (
                      <span className="text-[#f5edd855] ml-auto">{slide.paragraphs.length} slides</span>
                    )}
                  </label>
                </div>
              )
            })}
          </div>

        </div>
      )}
    </div>
  )
}
