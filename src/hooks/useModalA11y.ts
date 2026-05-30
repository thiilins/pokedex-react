'use client'

import { useEffect, useRef } from 'react'

/**
 * Acessibilidade de modal: trava o scroll do body, prende o foco dentro do
 * container (Tab/Shift+Tab ciclam), fecha no ESC e devolve o foco ao elemento
 * que estava ativo quando o modal abriu. Retorna a ref para o container.
 *
 * Uso: const ref = useModalA11y(isOpen, onClose); <div ref={ref} role="dialog" ...>
 */
export function useModalA11y<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose: () => void
) {
  const containerRef = useRef<T>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Guarda o gatilho para restaurar o foco ao fechar.
    triggerRef.current = document.activeElement as HTMLElement | null

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const FOCUSABLE =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

    // Move o foco para o primeiro elemento focável do modal (ou o container).
    const focusFirst = () => {
      const el = containerRef.current
      if (!el) return
      const nodes = el.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (nodes.length > 0) nodes[0].focus()
      else el.focus()
    }
    const raf = requestAnimationFrame(focusFirst)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const el = containerRef.current
      if (!el) return
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        n => n.offsetParent !== null
      )
      if (nodes.length === 0) return

      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement as HTMLElement

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      // Restaura o foco ao gatilho.
      triggerRef.current?.focus?.()
    }
  }, [isOpen, onClose])

  return containerRef
}
