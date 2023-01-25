import styled, { css } from 'styled-components'
import Select from '@mui/material/Select'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { MdOutlineKeyboardArrowUp } from 'react-icons/md'
import { HiPlus } from 'react-icons/hi'
export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
  `}
`
export const SelectContainer = styled(Select)`
  ${({ theme }) => css`
    background: white;
    border-radius: 0.5rem;
    cursor: pointer;
  `}
`

export const ExpandIcon = styled(MdOutlineKeyboardArrowUp)`
  ${({ theme }) => css`
    position: absolute;
    right: 12px;
    width: 20px;
    height: auto;
    user-select: none;
    pointer-events: none;
    transition: transform 0.2s;
    &.MuiSelect-iconOpen {
      transform: rotate(180deg);
    }
  `}
`
