import { useState } from 'react'
import FormPanel from './components/FormPanel'
import BannerPreview from './components/BannerPreview'

const defaultForm = {
  day: 'Thursday Night',
  type: 'It Works — How and Why',
  host: '',
  speaker: '',
  times1: '5:30 PST · 6:30 MST',
  times2: '7:30 CST · 8:30 EST',
  zoomId: '994 380 1291',
  zoomPw: '654321',
}

function App() {
  const [form, setForm] = useState(defaultForm)
  const [theme, setTheme] = useState('sunset-golden')

  return (
    <div className="min-h-screen bg-[#1a0f05] text-[#f5edd8] p-6">
      <h1 className="text-center font-bold text-[#FFD84D] text-3xl tracking-widest mb-8">
        ⚓ NARR Banner Maker
      </h1>
      <div className="flex gap-8 justify-center items-start flex-wrap">
        <FormPanel form={form} setForm={setForm} theme={theme} setTheme={setTheme} />
        <BannerPreview form={form} theme={theme} />
      </div>
    </div>
  )
}

export default App