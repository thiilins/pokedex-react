import React from 'react'
import Modal from 'react-modal'

import {
  MainModal,
  IndexContainer,
  PokemonImageContainer,
  PokemonData,
  PokemonDataContainer
} from './styles'

import WeightIcon from '@assets/weight.svg'
import HeightIcon from '@assets/height.svg'

import PokemonTypeIcon from '@components/PokemonTypeIcon'
import { IPokemonResumeProps, PokemonTypesVariant } from '@/types/pokemon'

interface IPictureCard {
  pokemon: IPokemonResumeProps
  miniCard?: boolean
  isOpen?: boolean
  onRequestClose: () => void
  maxWidth?: string
  maxHeight?: string
}
Modal.setAppElement('#root')

const PictureCard: React.FC<IPictureCard> = ({
  pokemon,
  onRequestClose,
  isOpen = false,
  miniCard
}) => {
  const StandardBaseModalStyle: Modal.Styles = {
    overlay: {
      background: ' rgba(0, 0, 0, 0.5)',
      position: 'fixed',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '999'
    }
  }
  const type = pokemon.types[0].name as PokemonTypesVariant
  return (
    <MainModal
      type={type}
      className="modal__content"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={StandardBaseModalStyle}>
      <PokemonDataContainer>
        <PokemonData>
          <h2 className="name">{pokemon.name}</h2>
          <div className="details">
            <div>
              <span>Peso</span>
              <span>
                <WeightIcon />
                {pokemon.weight / 10} kg
              </span>
            </div>
            <span className="divider" />
            <div>
              <span>Altura</span>
              <span>
                <HeightIcon />
                {pokemon.height / 10} m
              </span>
            </div>
          </div>
          <div className="types">
            {pokemon.types.map(type => (
              <PokemonTypeIcon key={type.id} type={type.name} />
            ))}
          </div>
          <div className="id">#{('0000' + pokemon.id).slice(-4)}</div>
          <div className="close">
            <span onClick={onRequestClose}>Fechar</span>
          </div>
        </PokemonData>
      </PokemonDataContainer>
      <PokemonImageContainer type={type}>
        <img src={pokemon.image ?? ''} />
        <div className="background__name">{pokemon.japan_name}</div>
        <div className="loader__animation" />
      </PokemonImageContainer>
    </MainModal>
  )
}

export default PictureCard
