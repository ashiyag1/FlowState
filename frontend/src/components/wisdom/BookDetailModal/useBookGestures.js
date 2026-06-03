import { useState, useRef, useEffect, useCallback } from 'react'

const easeBack = (t) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

export function useBookGestures({ pages, idx, setIdx, bookEl, onClose }) {
  const [angle, setAngle] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const stateRef = useRef({ flip: 'idle' }) // idle | dragging | animating
  const startX = useRef(0)
  const startY = useRef(0)
  const dragDir = useRef(1) // 1 forward, -1 backward
  const rafId = useRef(null)
  const hadVertical = useRef(false)

  const isTurning = stateRef.current.flip !== 'idle' || isAnimating
  const flipPct = Math.abs(angle) / 180

  // Clean up animation frames
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  const goTo = useCallback((nextIdx) => {
    setIdx(nextIdx)
    setAngle(0)
    stateRef.current.flip = 'idle'
    setIsAnimating(false)
  }, [setIdx])

  const animate = useCallback((from, to, dur, onDone) => {
    const t0 = performance.now()
    stateRef.current.flip = 'animating'
    setIsAnimating(true)

    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur)
      const eased = p < 1 ? 1 - Math.pow(1 - p, 3) : 1
      const extra = p < 1 ? 0 : 4 * (1 - easeBack(Math.min(1, (now - t0 - dur) / 100)))

      const val = from + (to - from) * eased + extra
      setAngle(Math.max(-180, Math.min(180, val)))

      if (p < 1 || now - t0 < dur + 100) {
        rafId.current = requestAnimationFrame(step)
      } else {
        setAngle(to)
        onDone()
      }
    }
    rafId.current = requestAnimationFrame(step)
  }, [])

  const flipForward = useCallback(() => {
    if (idx >= pages.length - 1) return
    animate(angle, -180, 400, () => goTo(idx + 1))
  }, [idx, pages.length, angle, animate, goTo])

  const flipBackward = useCallback(() => {
    if (idx <= 0) return
    animate(angle, 180, 400, () => goTo(idx - 1))
  }, [idx, angle, animate, goTo])

  const snapBack = useCallback(() => {
    animate(angle, 0, 300, () => {
      stateRef.current.flip = 'idle'
      setIsAnimating(false)
      setAngle(0)
    })
  }, [angle, animate])

  const onDown = useCallback((e) => {
    if (stateRef.current.flip !== 'idle') return
    startX.current = e.clientX
    startY.current = e.clientY
    stateRef.current.flip = 'ready'
    dragDir.current = 1
    hadVertical.current = false
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
    e.target.setPointerCapture(e.pointerId)
  }, [])

  const onMove = useCallback((e) => {
    const s = stateRef.current.flip
    if (s !== 'ready' && s !== 'dragging') return

    const dx = e.clientX - startX.current
    const dy = Math.abs(e.clientY - startY.current)

    if (s === 'ready') {
      if (dy > Math.abs(dx) * 0.5) {
        hadVertical.current = true
        return
      }
      if (Math.abs(dx) < 8) return
      dragDir.current = dx < 0 ? 1 : -1 // left drag = forward, right drag = backward
      if (dragDir.current === 1 && idx >= pages.length - 1) return
      if (dragDir.current === -1 && idx <= 0) return
      stateRef.current.flip = 'dragging'
    }

    const rect = bookEl.current?.getBoundingClientRect()
    if (!rect) return
    const pw = rect.width * 0.8
    const raw = -(dx / pw) * 180
    let a
    if (dragDir.current === 1) {
      a = Math.max(-180, Math.min(0, raw))
    } else {
      a = Math.min(180, Math.max(0, raw))
    }
    if (Math.abs(a) < 1) a = 0
    setAngle(a)
  }, [idx, pages.length, bookEl])

  const resetGesture = useCallback(() => {
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    stateRef.current.flip = 'idle'
  }, [])

  const onUp = useCallback((e) => {
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    try {
      e.target.releasePointerCapture(e.pointerId)
    } catch {}

    if (stateRef.current.flip === 'ready') {
      stateRef.current.flip = 'idle'
      if (hadVertical.current) return // was a scroll, not a tap
      
      const rect = bookEl.current?.getBoundingClientRect()
      if (!rect) return
      const x = (e.clientX - rect.left) / rect.width
      if (x > 0.65 && idx < pages.length - 1) {
        flipForward()
      } else if (x < 0.35 && idx > 0) {
        flipBackward()
      }
      return
    }

    if (stateRef.current.flip !== 'dragging') return
    const progress = Math.abs(angle) / 180
    if (progress > 0.35) {
      if (dragDir.current === 1 && idx < pages.length - 1) {
        flipForward()
        return
      }
      if (dragDir.current === -1 && idx > 0) {
        flipBackward()
        return
      }
    }
    snapBack()
  }, [angle, idx, pages.length, flipForward, flipBackward, snapBack, bookEl])

  const onCancel = useCallback(() => {
    resetGesture()
  }, [resetGesture])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
      if (e.key === 'ArrowRight' && idx < pages.length - 1) {
        flipForward()
      }
      if (e.key === 'ArrowLeft' && idx > 0) {
        flipBackward()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [idx, pages.length, onClose, flipForward, flipBackward])

  return {
    angle,
    isAnimating,
    onDown,
    onMove,
    onUp,
    onCancel,
    flipForward,
    flipBackward,
    isTurning,
    dragDir: dragDir.current,
    flipPct
  }
}
export default useBookGestures
