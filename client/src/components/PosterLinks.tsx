import { FC } from 'react'
import { ChildProps } from '../types/common.types'

const PosterLinks: FC<ChildProps> = ({ children }) => {
  return (
    <div className='poster-form__links'>{children}</div>
  )
}

export default PosterLinks