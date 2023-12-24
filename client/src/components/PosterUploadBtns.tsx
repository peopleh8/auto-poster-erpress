import { FC } from 'react'
import { ChildProps } from '../types/common.types'

const PosterUploadBtns: FC<ChildProps> = ({ children }) => {
  return (
    <div className='poster-form__upload-btns'>{children}</div>
  )
}

export default PosterUploadBtns