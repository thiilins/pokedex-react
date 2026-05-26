import React, { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface IPaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageRange = useMemo(() => {
    const range: (number | string)[] = []
    const siblingCount = 1

    // Always show first, last, current and siblings
    const totalNumbers = siblingCount * 2 + 3 // siblings + first + last + current
    const totalBlocks = totalNumbers + 2 // totalNumbers + dots

    if (totalPages <= totalBlocks) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i)
      }
      return range
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      for (let i = 1; i <= leftItemCount; i++) {
        range.push(i)
      }
      range.push('...')
      range.push(lastPageIndex)
      return range
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      range.push(firstPageIndex)
      range.push('...')
      for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
        range.push(i)
      }
      return range
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      range.push(firstPageIndex)
      range.push('...')
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        range.push(i)
      }
      range.push('...')
      range.push(lastPageIndex)
      return range
    }

    return range
  }, [currentPage, totalPages])

  if (totalPages <= 1) return null

  return (
    <nav className="flex justify-center items-center gap-1.5 py-8" aria-label="Navegação de páginas">
      
      {/* Previous button */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Pages list */}
      <div className="flex items-center gap-1">
        {pageRange.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="w-10 h-10 flex items-center justify-center text-slate-400 select-none text-sm"
              >
                &#8230;
              </span>
            )
          }

          const pageNum = page as number
          const isActive = pageNum === currentPage

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-white shadow-glow-default border border-primary/50 scale-105'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          )
        })}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
        aria-label="Próxima página"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

    </nav>
  )
}

export default Pagination
