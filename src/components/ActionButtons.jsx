import html2canvas from 'html2canvas'
import { useState } from 'react'

async function captureSlide(id) {
  const el = document.getElementById(id)
  const images = el.querySelectorAll('img')
  await Promise.all(Array.from(images).map(img =>
    img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res })
  ))
  return html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#1a0f05',
    logging: false,
    width:  el.offsetWidth,
    height: el.offsetHeight,
  })
}

export default function ActionButtons({ form, activeSlide = 'banner', customLabel }) {
  const [downloadStatus, setDownloadStatus] = useState('idle')

  async function downloadBanner() {
    setDownloadStatus('rendering')
    // activeSlide is either 'banner' or an element id string passed directly
    const slideId = activeSlide === 'banner' ? 'banner' : activeSlide
    try {
      const canvas = await captureSlide(slideId)
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const suffix = activeSlide === 'banner' ? '' : `-${activeSlide}`
        a.download = `narr-${(form.day || 'meeting').replace(/\s+/g, '-').toLowerCase()}${suffix}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setDownloadStatus('done')
        setTimeout(() => setDownloadStatus('idle'), 3000)
      }, 'image/png')
    } catch (e) {
      console.error(e)
      setDownloadStatus('error')
      setTimeout(() => setDownloadStatus('idle'), 3000)
    }
  }

  function shareWhatsApp() {
    const speakerLine = form.speaker ? `\nSpeaker: ${form.speaker}` : ''
    const msg =
      `NARR Meeting - Narcotics Anonymous Recovery Rangers\n\n` +
      `${form.day}\n` +
      `${form.type}${speakerLine}\n\n` +
      `${form.times1}\n` +
      `${form.times2}\n\n` +
      `Zoom ID: ${form.zoomId}\n` +
      `Password: ${form.zoomPw}\n\n` +
      `Fair winds & following seas, sailor!`
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank')
  }

  const downloadLabel = {
    idle: customLabel ?? (activeSlide === 'banner' ? 'Download Banner' : 'Download Slide'),
    rendering: 'Rendering...',
    done: 'Downloaded!',
    error: 'Error — try again',
  }[downloadStatus]

  return (
    <div className="flex flex-col gap-3 w-full max-w-[640px]">

      <div className="flex gap-2 items-center text-[10px] text-[#f5edd866] tracking-wider mb-1">
        <span className="bg-[#FFD84D] text-[#3a1a00] rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
        <span>Download the banner to your device</span>
      </div>

      <button
        onClick={downloadBanner}
        disabled={downloadStatus === 'rendering'}
        className="w-full py-3 rounded-xl font-bold text-lg tracking-wide transition-all
          bg-[#FFD84D] text-[#3a1a00] hover:bg-[#ffe066] active:scale-95
          disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ fontFamily: 'Fredoka One, cursive' }}
      >
        ⬇ {downloadLabel}
      </button>

      <div className="flex gap-2 items-center text-[10px] text-[#f5edd866] tracking-wider mt-2 mb-1">
        <span className="bg-[#25D366] text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
        <span>Open WhatsApp — attach the image and send!</span>
      </div>

      <button
        onClick={shareWhatsApp}
        className="w-full py-3 rounded-xl font-bold text-lg tracking-wide transition-all
          bg-[#25D366] text-white hover:bg-[#20bd5a] active:scale-95"
        style={{ fontFamily: 'Fredoka One, cursive' }}
      >
        Share to WhatsApp
      </button>

    </div>
  )
}