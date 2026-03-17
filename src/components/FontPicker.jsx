const FONTS = [
  { id: 'PirataOne',    label: 'Pirata One' },
  { id: 'PiecesOfEight', label: 'Pieces of Eight' },
  { id: 'Castlefire',   label: 'Castlefire' },
  { id: 'BlackPear',    label: 'Black Pear' },
]

export default function FontPicker({ font, setFont }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] tracking-[3px] uppercase text-[#FFD84Daa]">✍️ NARR Font</p>
      <div className="flex flex-col gap-2">
        {FONTS.map(f => (
          <button
            key={f.id}
            onClick={() => setFont(f.id)}
            className={`rounded-lg py-3 px-4 border transition-all text-left flex items-center justify-between
              ${font === f.id
                ? 'border-[#FFD84D] bg-[#FFD84D11]'
                : 'border-[#FFD84D33] hover:border-[#FFD84D88]'
              }`}
          >
            <span className="text-[10px] text-[#FFD84D88] tracking-widest uppercase">{f.label}</span>
            <span style={{ fontFamily: f.id, fontSize: '36px', color: '#FFD84D', textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
              NARR
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}