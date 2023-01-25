import { useNavigate } from 'react-router-dom'
import * as S from './styles'
const Header = () => {
  const navigate = useNavigate()
  return (
    <S.HeaderContainer>
      <div className="logo" onClick={() => navigate('/')}>
        <img src="/assets/img/logo.svg" />
      </div>
    </S.HeaderContainer>
  )
}

export default Header
