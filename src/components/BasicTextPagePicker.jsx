import { useState, useEffect, useRef } from 'react'
import { CheckSquareIcon, SquareIcon, MinusSquareIcon, CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react'

// ── helpers ───────────────────────────────────────────────────────────────────
function Paragraphs({ pg, textColor }) {
  const paras = Array.isArray(pg.paragraphs) ? pg.paragraphs : (pg.text || '').split('\n\n').filter(Boolean)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {paras.map((p, i) => (
        <p key={i} style={{ margin: 0, fontSize: '12px', lineHeight: 1.7, color: textColor || 'rgba(245,237,216,0.75)', letterSpacing: '0.15px' }}>
          {p}
        </p>
      ))}
    </div>
  )
}

function PageCheckbox({ state }) {
  const color = state === 'none' ? 'rgba(245,237,216,0.2)' : '#FFD84D'
  if (state === 'all')  return <CheckSquareIcon size={17} weight="fill"    style={{ color, flexShrink: 0 }} />
  if (state === 'some') return <MinusSquareIcon size={17} weight="fill"    style={{ color, flexShrink: 0 }} />
  return                       <SquareIcon      size={17} weight="regular" style={{ color, flexShrink: 0 }} />
}

// ── Chapter mode reader ───────────────────────────────────────────────────────
function ChapterReader({ entry, selection, onChange }) {
  const [local, setLocal] = useState(() => initPageSel(entry, selection))

  useEffect(() => { setLocal(initPageSel(entry, selection)) }, [entry])

  if (!entry?.pages) return null
  const pages = entry.pages
  const selected = Object.values(local).filter(Boolean).length

  const apply = (next) => { setLocal(next); onChange(next) }
  const toggle = (i) => apply({ ...local, [i]: !local[i] })
  const selectAll   = () => apply(Object.fromEntries(pages.map((_, i) => [i, true])))
  const deselectAll = () => apply(Object.fromEntries(pages.map((_, i) => [i, false])))

  return (
    <>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 22px', borderBottom: '1px solid rgba(255,216,77,0.08)', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', color: 'rgba(255,216,77,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {selected}/{pages.length} pages selected
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Btn onClick={selectAll}>All</Btn>
          <Btn onClick={deselectAll} dim>None</Btn>
        </div>
      </div>

      {/* Scrollable page list */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {pages.map((pg, i) => {
          const checked = local[i] !== false
          return (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,216,77,0.07)' }}>
              {/* Page header — clickable to toggle */}
              <div
                onClick={() => toggle(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 22px 10px',
                  cursor: 'pointer',
                  background: checked ? 'rgba(255,216,77,0.05)' : 'transparent',
                  position: 'sticky', top: 0, zIndex: 1,
                  backdropFilter: 'blur(4px)',
                  borderBottom: '1px solid rgba(255,216,77,0.06)',
                }}
              >
                <PageCheckbox state={checked ? 'all' : 'none'} />
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: checked ? '#FFD84D' : 'rgba(245,237,216,0.3)' }}>
                  p. {pg.page}
                </span>
                {pg.topics?.length > 0 && (
                  <span style={{ fontSize: '9px', color: checked ? 'rgba(255,216,77,0.45)' : 'rgba(245,237,216,0.15)', letterSpacing: '1px', marginLeft: '4px' }}>
                    {pg.topics.join(' · ')}
                  </span>
                )}
              </div>
              {/* Full text */}
              <div style={{ padding: '14px 22px 18px' }}>
                <Paragraphs pg={pg} textColor={checked ? 'rgba(245,237,216,0.72)' : 'rgba(245,237,216,0.28)'} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ── Topic mode reader ─────────────────────────────────────────────────────────
// selection format: { "chapterValue::pageIdx": bool }
const pageKey = (chapter, pageIdx) => `${chapter.value}::${pageIdx}`

function TopicReader({ allData, selection, onChange }) {
  const [expanded, setExpanded] = useState({})
  const [local, setLocal] = useState(selection || {})

  useEffect(() => { setLocal(selection || {}) }, [selection])

  if (!allData) return <p style={{ padding: '24px', color: 'rgba(245,237,216,0.3)', fontSize: '12px' }}>Loading…</p>

  // Build topic → [{chapter, pageIdx, pg}] map
  const topicMap = {}
  allData.forEach(chapter => {
    chapter.pages.forEach((pg, pageIdx) => {
      (pg.topics || []).forEach(t => {
        if (!topicMap[t]) topicMap[t] = []
        topicMap[t].push({ chapter, pageIdx, pg })
      })
    })
  })
  const allTopics = Object.keys(topicMap).sort()

  const apply = (next) => { setLocal(next); onChange(next) }

  const togglePage = (chapter, pageIdx) => {
    const k = pageKey(chapter, pageIdx)
    apply({ ...local, [k]: !local[k] })
  }

  const toggleTopic = (topic) => {
    const entries = topicMap[topic]
    const state = topicState(topic, entries, local)
    const next = { ...local }
    entries.forEach(({ chapter, pageIdx }) => { next[pageKey(chapter, pageIdx)] = state !== 'all' })
    apply(next)
  }

  const toggleExpand = (t) => setExpanded(e => ({ ...e, [t]: !e[t] }))

  const totalPages = Object.values(local).filter(Boolean).length

  return (
    <>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 22px', borderBottom: '1px solid rgba(255,216,77,0.08)', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', color: 'rgba(255,216,77,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {totalPages} page{totalPages !== 1 ? 's' : ''} selected
        </span>
        <Btn dim onClick={() => apply({})}>Clear all</Btn>
      </div>

      {/* Topic list */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {allTopics.map(topic => {
          const entries = topicMap[topic]
          const state   = topicState(topic, entries, local)
          const isOpen  = !!expanded[topic]
          const pgNums  = entries.map(e => e.pg.page)
          const pageRange = pgNums.length > 1
            ? `p.${Math.min(...pgNums)}–p.${Math.max(...pgNums)}`
            : `p.${pgNums[0]}`

          return (
            <div key={topic} style={{ borderBottom: '1px solid rgba(255,216,77,0.07)' }}>
              {/* Topic header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 22px',
                background: state !== 'none' ? 'rgba(255,216,77,0.05)' : 'transparent',
                position: 'sticky', top: 0, zIndex: 1,
                backdropFilter: 'blur(4px)',
              }}>
                <div onClick={() => toggleTopic(topic)} style={{ cursor: 'pointer' }}>
                  <PageCheckbox state={state} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'capitalize', letterSpacing: '0.2px', color: state !== 'none' ? 'rgba(245,237,216,0.9)' : 'rgba(245,237,216,0.35)' }}>
                    {topic}
                  </div>
                  <div style={{ fontSize: '9px', letterSpacing: '1.5px', marginTop: '2px', color: state !== 'none' ? 'rgba(255,216,77,0.5)' : 'rgba(245,237,216,0.2)' }}>
                    {pageRange} · {entries.length} page{entries.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <button onClick={() => toggleExpand(topic)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,216,77,0.35)', padding: '2px', display: 'flex' }}>
                  {isOpen ? <CaretDownIcon size={13} weight="bold" /> : <CaretRightIcon size={13} weight="bold" />}
                </button>
              </div>

              {/* Expanded: individual pages with checkboxes */}
              {isOpen && entries.map(({ chapter, pageIdx, pg }, j) => {
                const k = pageKey(chapter, pageIdx)
                const checked = !!local[k]
                return (
                  <div key={j} style={{ borderTop: '1px solid rgba(255,216,77,0.05)', background: 'rgba(0,0,0,0.18)' }}>
                    {/* Page header with checkbox */}
                    <div
                      onClick={() => togglePage(chapter, pageIdx)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 22px 8px 48px', cursor: 'pointer' }}
                    >
                      <PageCheckbox state={checked ? 'all' : 'none'} />
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: checked ? '#FFD84D' : 'rgba(245,237,216,0.25)' }}>
                        p.{pg.page} · {chapter.title}
                      </span>
                    </div>
                    {/* Full text */}
                    <div style={{ padding: '0 22px 14px 48px' }}>
                      <Paragraphs pg={pg} textColor={checked ? 'rgba(245,237,216,0.65)' : 'rgba(245,237,216,0.22)'} />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}

function topicState(topic, entries, local) {
  const checked = entries.filter(({ chapter, pageIdx }) => !!local[pageKey(chapter, pageIdx)]).length
  if (checked === 0)               return 'none'
  if (checked === entries.length)  return 'all'
  return 'some'
}

// ── Small button ──────────────────────────────────────────────────────────────
function Btn({ onClick, children, dim }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
      background: dim ? 'transparent' : 'rgba(255,216,77,0.1)',
      border: `1px solid ${dim ? 'rgba(255,216,77,0.12)' : 'rgba(255,216,77,0.3)'}`,
      color: dim ? 'rgba(245,237,216,0.35)' : '#FFD84D',
      fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
    }}>{children}</button>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function BasicTextPagePicker({ mode = 'chapter', entry, allData, selection, onChange }) {
  return (
    <div style={{
      width: '450px', height: '800px',
      background: '#1a0e04',
      border: '1px solid rgba(255,216,77,0.18)',
      borderRadius: '14px',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: '16px 22px 12px', borderBottom: '1px solid rgba(255,216,77,0.12)', flexShrink: 0 }}>
        <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#FFD84D', textTransform: 'uppercase', fontWeight: 700 }}>
          {mode === 'topic' ? 'Browse by Topic' : 'Select Pages'}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(245,237,216,0.45)', marginTop: '3px' }}>
          {mode === 'topic' ? 'Check topics to include in your slide deck' : entry?.chapter}
        </div>
      </div>

      {mode === 'chapter'
        ? <ChapterReader entry={entry} selection={selection} onChange={onChange} />
        : <TopicReader   allData={allData} selection={selection} onChange={onChange} />
      }
    </div>
  )
}

// ── init helpers ──────────────────────────────────────────────────────────────
function initPageSel(entry, selection) {
  if (!entry?.pages) return {}
  const existing = selection ?? {}
  return Object.fromEntries(entry.pages.map((_, i) => [i, existing[i] !== false]))
}
