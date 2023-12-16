import { FC } from 'react'
import { ChildProps } from '../types/common.types'

const PosterButtons: FC<ChildProps> = ({ children }) => {
  return (
    <div className='poster-form__btns'>{children}</div>
  )
}

export default PosterButtons