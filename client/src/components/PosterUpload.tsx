import { FC } from 'react'
import { ChildProps } from '../types/common.types'

const PosterUpload: FC<ChildProps> = ({ children }) => {
  return (
    <div className='poster-form__upload'>{children}</div>
  )
}

export default PosterUpload