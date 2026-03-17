import { useState, useEffect } from 'react'
import { AnchorIcon, LayoutIcon, SlideshowIcon, ArrowLeftIcon, ArrowsOutSimpleIcon, XIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import JFTFullSlide from './components/JFTFullSlide'
import FormPanel from './components/FormPanel'
import BannerPreview from './components/BannerPreview'
import JFTSlide from './components/JFTSlide'
import MeetingSlide from './components/MeetingSlide'
import SlideCanvas, { STATIC_SLIDES } from './components/SlideCanvas'
import ActionButtons from './components/ActionButtons'
import AdvancedPanel from './components/AdvancedPanel'
import SlidesPanel from './components/SlidesPanel'

const defaultForm = {
  day: 'Thursday Night',
  type: 'It Works — How and Why',
  host: '',
  speaker: '',
  times1: '5:30 PST · 6:30 MST',
  times2: '7:30 CST · 8:30 EST',
  zoomId: '994 380 1291',
  zoomPw: '654321',
  overlayColor: '#000000',
  overlayOpacity: 0.72,
  accentColor: '',
  textColor: '',
  jftEntry: null,
  jftFullEntry: null,
  jftShowPunchline: false,
  jftPirate: false,
  showLogo: true,
  logoColor: 'white',
  jftTitleSize: 18,
  jftTextSize: 10.5,
  slideOrientation: 'portrait',
  deckSlides: { 'serenity-prayer': false },
  deckSlideOrder: [],
  meetingDate: '',
  slideTitleSize: 22,
  slideTextSize: 13,
}

// ── Landing screen ───────────────────────────────────────────────────────────
function ModeSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-[#1a0f05] text-[#f5edd8] flex flex-col items-center justify-center p-8 gap-10">
      <h1 className="text-center font-bold text-[#FFD84D] text-3xl tracking-widest">
        <AnchorIcon size={28} weight="bold" className="inline mr-2 align-middle" />
        NARR Tools
      </h1>
      <p className="text-[#f5edd8aa] text-xs tracking-[3px] uppercase">What would you like to make?</p>

      <div className="flex gap-6 flex-wrap justify-center">
        {[
          {
            id: 'banner',
            Icon: LayoutIcon,
            title: 'Banner Maker',
            desc: 'Create the weekly meeting announcement banner for WhatsApp.',
          },
          {
            id: 'deck',
            Icon: SlideshowIcon,
            title: 'Slide Deck',
            desc: 'Build a full set of meeting slides — readings, JFT, and more.',
          },
        ].map(({ id, Icon, title, desc }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="w-64 flex flex-col items-center gap-4 p-8 rounded-2xl border border-[#FFD84D33]
              bg-[#2a1505] hover:border-[#FFD84D] hover:bg-[#3a1f08] transition-all group"
          >
            <Icon size={40} weight="duotone" className="text-[#FFD84D] group-hover:scale-110 transition-transform" />
            <div className="flex flex-col gap-1 text-center">
              <span className="font-bold text-[#FFD84D] tracking-widest text-sm uppercase">{title}</span>
              <span className="text-[11px] text-[#f5edd8aa] leading-relaxed">{desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Banner Maker ─────────────────────────────────────────────────────────────
function BannerMaker({ form, setForm, theme, setTheme, onBack }) {
  return (
    <div className="min-h-screen bg-[#1a0f05] text-[#f5edd8] p-6">
      <div className="flex items-center justify-center mb-8 relative">
        <button
          onClick={onBack}
          className="absolute left-0 flex items-center gap-1 text-[10px] tracking-[3px] uppercase
            text-[#FFD84Daa] hover:text-[#FFD84D] transition-colors"
        >
          <ArrowLeftIcon size={13} weight="bold" />Back
        </button>
        <h1 className="font-bold text-[#FFD84D] text-2xl tracking-widest">
          <LayoutIcon size={22} weight="bold" className="inline mr-2 align-middle" />Banner Maker
        </h1>
      </div>

      <div className="flex gap-8 justify-center items-start flex-wrap">
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <FormPanel form={form} setForm={setForm} theme={theme} setTheme={setTheme} />
          <AdvancedPanel form={form} setForm={setForm} />
        </div>

        <div className="flex flex-col gap-4 items-center">
          <BannerPreview form={form} theme={theme} />
          <ActionButtons form={form} activeSlide="banner" />
        </div>
      </div>
    </div>
  )
}

// ── Slide Deck ───────────────────────────────────────────────────────────────
function DeckMaker({ form, setForm, theme, setTheme, onBack }) {
  const [deckIndex, setDeckIndex] = useState(0)
  const [isPresenting, setIsPresenting] = useState(false)
  const [fsScale, setFsScale] = useState(1)

  const orientation = form.slideOrientation || 'portrait'
  const isJFT       = form.type === 'Just for Today'

  const slideW = orientation === 'landscape' ? 700 : 450
  const slideH = orientation === 'landscape' ? 394 : 800

  const slideOrder = form.deckSlideOrder?.length
    ? form.deckSlideOrder.filter(k => STATIC_SLIDES[k])
    : Object.keys(STATIC_SLIDES)

  // Expand jft-full into individual sub-slides
  const jftFullSlides = (form.deckSlides?.['jft-full'] && form.jftFullEntry)
    ? [
        { id: 'jft-full-quote', label: `JFT · ${form.jftFullEntry.title}` },
        ...(form.jftFullEntry.body || []).map((_, i, arr) => ({
          id:    `jft-full-body-${i}`,
          label: `JFT · Reading ${i + 1}/${arr.length}`,
        })),
        { id: 'jft-full-jft', label: 'JFT · Just for Today' },
      ]
    : []

  const deckItems = [
    { id: isJFT ? 'jft' : 'meeting', label: isJFT ? 'JFT Summary' : form.type },
    ...jftFullSlides,
    ...slideOrder
      .filter(key => form.deckSlides?.[key] && key !== 'jft-full')
      .flatMap(key => {
        const slide = STATIC_SLIDES[key]
        if (!slide) return []
        const n = slide.paragraphs?.length ?? 1
        return (slide.paragraphs || ['']).map((_, i) => ({
          id:       key,
          slideIdx: i,
          label:    n > 1 ? `${slide.label} · ${i + 1}/${n}` : slide.label,
        }))
      }),
  ]

  const safeIndex   = Math.min(deckIndex, deckItems.length - 1)
  const currentDeck = deckItems[safeIndex]

  const isJFTFull   = currentDeck?.id?.startsWith('jft-full-')
  const jftFullType = isJFTFull ? currentDeck.id.replace('jft-full-', '') : null

  const elementId = currentDeck?.id === 'jft'    ? 'jft-slide'
                  : currentDeck?.id === 'meeting' ? 'meeting-slide'
                  : isJFTFull                     ? currentDeck.id
                  : `slide-${currentDeck?.id}-${currentDeck?.slideIdx ?? 0}`

  const goPrev = () => setDeckIndex(i => Math.max(0, i - 1))
  const goNext = () => setDeckIndex(i => Math.min(deckItems.length - 1, i + 1))

  // Keyboard nav + scale in presentation mode
  useEffect(() => {
    if (!isPresenting) return
    const calc = () => {
      const sx = (window.innerWidth  * 0.9) / slideW
      const sy = (window.innerHeight * 0.88) / slideH
      setFsScale(Math.min(sx, sy))
    }
    calc()
    window.addEventListener('resize', calc)
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  goNext()
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    goPrev()
      if (e.key === 'Escape')                               setIsPresenting(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', calc)
      window.removeEventListener('keydown', onKey)
    }
  }, [isPresenting, slideW, slideH, safeIndex, deckItems.length])

  const CurrentSlide = () => (
    <>
      {currentDeck?.id === 'jft'     && <JFTSlide     form={form} theme={theme} orientation={orientation} />}
      {currentDeck?.id === 'meeting' && <MeetingSlide form={form} theme={theme} orientation={orientation} />}
      {jftFullType && <JFTFullSlide entry={form.jftFullEntry} slideType={jftFullType} form={form} theme={theme} orientation={orientation} />}
      {!isJFTFull && currentDeck?.id !== 'jft' && currentDeck?.id !== 'meeting' && (
        <SlideCanvas slideType={currentDeck?.id} slideIdx={currentDeck?.slideIdx ?? 0} form={form} theme={theme} orientation={orientation} />
      )}
    </>
  )

  const arrowBtn = (disabled, onClick, children) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background:   'rgba(0,0,0,0.55)',
        border:       '1px solid rgba(255,216,77,0.3)',
        borderRadius: '50%',
        width:        '52px',
        height:       '52px',
        color:        disabled ? 'rgba(255,216,77,0.2)' : '#FFD84D',
        fontSize:     '26px',
        lineHeight:   1,
        cursor:       disabled ? 'default' : 'pointer',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        flexShrink:   0,
        transition:   'background 0.15s',
      }}
    >{children}</button>
  )

  return (
    <div className="min-h-screen bg-[#1a0f05] text-[#f5edd8] p-6">

      {/* Presentation overlay */}
      {isPresenting && (
        <div
          style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}
        >
          {arrowBtn(safeIndex === 0, goPrev, <CaretLeftIcon size={28} weight="bold" />)}

          <div style={{ transform: `scale(${fsScale})`, transformOrigin: 'center center', flexShrink: 0 }}>
            <CurrentSlide />
          </div>

          {arrowBtn(safeIndex === deckItems.length - 1, goNext, <CaretRightIcon size={28} weight="bold" />)}

          {/* Close */}
          <button
            onClick={() => setIsPresenting(false)}
            style={{ position: 'absolute', top: '16px', right: '20px',
              background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,216,77,0.3)',
              borderRadius: '8px', color: '#FFD84D', padding: '6px 12px',
              fontSize: '11px', letterSpacing: '2px', cursor: 'pointer' }}
          >
            <XIcon size={13} weight="bold" style={{ display: 'inline', marginRight: '5px' }} />ESC
          </button>

          {/* Counter */}
          <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)',
            fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,216,77,0.5)', textTransform: 'uppercase' }}>
            {currentDeck?.label} · {safeIndex + 1} / {deckItems.length}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mb-8 relative">
        <button
          onClick={onBack}
          className="absolute left-0 flex items-center gap-1 text-[10px] tracking-[3px] uppercase
            text-[#FFD84Daa] hover:text-[#FFD84D] transition-colors"
        >
          <ArrowLeftIcon size={13} weight="bold" />Back
        </button>
        <h1 className="font-bold text-[#FFD84D] text-2xl tracking-widest">
          <SlideshowIcon size={22} weight="bold" className="inline mr-2 align-middle" />Slide Deck
        </h1>
      </div>

      <div className="flex gap-8 justify-center items-start flex-wrap">
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <FormPanel form={form} setForm={setForm} theme={theme} setTheme={setTheme} />
          <AdvancedPanel form={form} setForm={setForm} />
          <SlidesPanel form={form} setForm={setForm} />
        </div>

        <div className="flex flex-col gap-4 items-center">
          {/* Deck navigation */}
          <div className="flex items-center gap-3 self-stretch justify-between">
            <button
              onClick={goPrev}
              disabled={safeIndex === 0}
              className="px-3 py-1 rounded-lg border border-[#FFD84D33] text-[#FFD84D] text-sm
                disabled:opacity-30 hover:border-[#FFD84D88] transition-all"
            >
              ‹ Prev
            </button>
            <span className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">
              {currentDeck?.label} · {safeIndex + 1} / {deckItems.length}
            </span>
            <button
              onClick={goNext}
              disabled={safeIndex === deckItems.length - 1}
              className="px-3 py-1 rounded-lg border border-[#FFD84D33] text-[#FFD84D] text-sm
                disabled:opacity-30 hover:border-[#FFD84D88] transition-all"
            >
              Next ›
            </button>
          </div>

          {/* Slide with side arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {arrowBtn(safeIndex === 0, goPrev, <CaretLeftIcon size={22} weight="bold" />)}
            <CurrentSlide />
            {arrowBtn(safeIndex === deckItems.length - 1, goNext, <CaretRightIcon size={22} weight="bold" />)}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsPresenting(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#FFD84D55]
                text-[#FFD84D] text-xs tracking-[2px] uppercase hover:border-[#FFD84D] hover:bg-[#FFD84D11] transition-all"
            >
              <ArrowsOutSimpleIcon size={14} weight="bold" />Present
            </button>
            <ActionButtons form={form} activeSlide={elementId} customLabel="Download Slide" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Root ─────────────────────────────────────────────────────────────────────
function App() {
  const [mode, setMode]     = useState(null) // null | 'banner' | 'deck'
  const [form, setForm]     = useState(defaultForm)
  const [theme, setTheme]   = useState('sunset-golden')

  if (!mode) return <ModeSelector onSelect={setMode} />

  const shared = { form, setForm, theme, setTheme, onBack: () => setMode(null) }

  return mode === 'banner'
    ? <BannerMaker {...shared} />
    : <DeckMaker   {...shared} />
}

export default App
