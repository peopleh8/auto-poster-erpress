import { FC } from 'react'
import { ModalTypes } from '../../../types/modal.types'
import './Modal.scss'

const Modal: FC<ModalTypes> = ({ children, isOpen, setOpen }) => {
  return (
    <div 
      className={`modal ${isOpen ? 'open' : ''}`}
      onClick={() => setOpen(false)}
    >
      <div 
        className='modal__content'
        onClick={e => e.stopPropagation()}
      >
        <div 
          className='modal__times'
          onClick={() => setOpen(false)}
        />
        {children}
      </div>
    </div>
  )
}

export default Modal