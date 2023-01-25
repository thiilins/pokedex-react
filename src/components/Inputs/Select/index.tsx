import React, { useCallback } from 'react'
import InputLabel from '@mui/material/InputLabel'
import { MenuItem } from '..'
import { SX } from '@/types/sx'
import { Container, SelectContainer, ExpandIcon } from './styles'
interface ISelectComponent {
  options?: (string | number)[]
  label?: string
  value?: string | number
  sx?: SX
  setValue?: (value: string | number) => void
  variant?: 'standard' | 'outlined' | 'filled'
}
export const Select: React.FC<ISelectComponent> = ({
  setValue = () => null,
  value,
  label,
  variant = 'outlined',
  options = []
}) => {
  const handleOnCHange = useCallback(
    (value: any) => setValue && setValue(value),
    [setValue]
  )

  return (
    <Container>
      <InputLabel
        variant="standard"
        sx={{ fontSize: '.8rem', paddingBottom: '.5rem' }}>
        {label}
      </InputLabel>
      <SelectContainer
        IconComponent={({ className }) => <ExpandIcon className={className} />}
        sx={{ width: '100%', minHeight: '2rem' }}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        variant={variant}
        onChange={({ target }) => handleOnCHange(target.value)}>
        {options.map(item => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </SelectContainer>
    </Container>
  )
}
