import React, { useEffect, useRef, useState } from 'react'
import { Check, X, ZoomIn } from 'lucide-react'

interface ImageCropModalProps {
  file: File
  aspect?: number       // width / height, e.g. 3/4 for a portrait book cover
  outputWidth?: number
  outputHeight?: number
  onCancel: () => void
  onConfirm: (blob: Blob) => void
}

const CONTAINER_W = 280
const FILL_COLOR = '#1a1b1c'

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  file, aspect = 3 / 4, outputWidth = 600, outputHeight,
  onCancel, onConfirm,
}) => {
  const containerH = CONTAINER_W / aspect
  const outH = outputHeight ?? Math.round(outputWidth / aspect)

  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [natural, setNatural] = useState({ w: 0, h: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null)
  const imgElRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setImgUrl(url)
    const img = new Image()
    img.onload = () => { setNatural({ w: img.naturalWidth, h: img.naturalHeight }); imgElRef.current = img }
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])

  if (!imgUrl || !natural.w) {
    return (
      <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#f26822] rounded-full animate-spin" />
      </div>
    )
  }

  const baseScale = Math.max(CONTAINER_W / natural.w, containerH / natural.h)
  const scale = baseScale * zoom
  const dispW = natural.w * scale
  const dispH = natural.h * scale
  const maxPanX = Math.max(0, (dispW - CONTAINER_W) / 2)
  const maxPanY = Math.max(0, (dispH - containerH) / 2)
  const clampedPan = {
    x: Math.max(-maxPanX, Math.min(maxPanX, pan.x)),
    y: Math.max(-maxPanY, Math.min(maxPanY, pan.y)),
  }

  const imageLeft = CONTAINER_W / 2 + clampedPan.x - dispW / 2
  const imageTop  = containerH / 2 + clampedPan.y - dispH / 2

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: clampedPan.x, panY: clampedPan.y }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy })
  }
  const onPointerUp = () => { dragRef.current = null }

  const handleConfirm = () => {
    const img = imgElRef.current
    if (!img) return
    const sx = -imageLeft / scale
    const sy = -imageTop / scale
    const sW = CONTAINER_W / scale
    const sH = containerH / scale

    const canvas = document.createElement('canvas')
    canvas.width = outputWidth
    canvas.height = outH
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = FILL_COLOR
    ctx.fillRect(0, 0, outputWidth, outH)
    ctx.drawImage(img, sx, sy, sW, sH, 0, 0, outputWidth, outH)
    canvas.toBlob(blob => { if (blob) onConfirm(blob) }, 'image/jpeg', 0.92)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-[#1a1b1c] border border-white/[0.09] rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm">Ajusta el recorte</h3>
          <button onClick={onCancel} className="w-7 h-7 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-all">
            <X size={13} />
          </button>
        </div>

        <div
          className="relative mx-auto rounded-xl overflow-hidden border border-white/[0.09] touch-none cursor-move select-none"
          style={{ width: CONTAINER_W, height: containerH, background: FILL_COLOR }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <img
            src={imgUrl}
            alt="crop preview"
            draggable={false}
            style={{
              position: 'absolute', left: imageLeft, top: imageTop,
              width: dispW, height: dispH, maxWidth: 'none',
            }}
          />
        </div>

        <div className="flex items-center gap-3 mt-4">
          <ZoomIn size={14} className="text-white/40 flex-shrink-0" />
          <input
            type="range" min={0.4} max={3} step={0.01} value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="flex-1 accent-[#f26822]"
          />
        </div>
        <p className="text-white/25 text-xs text-center mt-2">Arrastra para mover · desliza para acercar o alejar</p>

        <div className="flex gap-3 mt-5">
          <button onClick={onCancel}
            className="flex-1 py-2.5 border border-white/[0.09] text-white/50 hover:text-white rounded-xl text-sm font-medium transition-colors">
            Cancelar
          </button>
          <button onClick={handleConfirm}
            className="flex-1 py-2.5 bg-[#f26822] hover:bg-[#d45c1a] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <Check size={14} /> Usar recorte
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropModal
