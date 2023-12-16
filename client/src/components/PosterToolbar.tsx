import { FC } from 'react'
import { ChildProps } from '../types/common.types'

const PosterToolbar: FC<ChildProps> = ({ children }) => {
  return (
    <div className='poster-form__toolbar'>{children}</div>
  )
}

export default PosterToolbar