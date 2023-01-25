import generatePaginateCount, { DOTS } from '@/utils/generatePaginateCount'
import React, { useMemo } from 'react'
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from 'react-icons/md'
import { PaginationContainer, PageItem, Container } from './styles'
interface IPaginationProps {
  totalPages: number
  siblingCount?: number
  currentPage: number
  onNext: () => void
  onPrevious: () => void
  onPageChange: (page: number) => void
}

const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  siblingCount = 1,
  totalPages,
  onNext,
  onPageChange,
  onPrevious
}) => {
  const paginationRange = useMemo(() => {
    return generatePaginateCount(totalPages, siblingCount, currentPage)
  }, [siblingCount, totalPages, currentPage])
  return (
    <Container>
      <PaginationContainer>
        <PageItem disabled={currentPage === 1} onClick={onPrevious}>
          <MdOutlineNavigateBefore />
        </PageItem>
        {paginationRange.map(pageNumber => {
          if (pageNumber === DOTS) {
            return <PageItem key={pageNumber + 'page'}>&#8230;</PageItem>
          }

          return (
            <PageItem
              key={pageNumber + 'page'}
              onClick={() => onPageChange(+pageNumber)}>
              {pageNumber}
            </PageItem>
          )
        })}
        <PageItem
          disabled={currentPage === paginationRange[-1]}
          onClick={onNext}>
          <MdOutlineNavigateNext />
        </PageItem>
      </PaginationContainer>
    </Container>
  )
}

export default Pagination
