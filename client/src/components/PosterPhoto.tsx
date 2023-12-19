import { FC } from 'react'
import { PosterPhotoProps } from '../types/poster.types'
import upload from '../assets/icons/upload.svg'

const PosterPhoto: FC<PosterPhotoProps> = ({ photo }) => {
  return (
    <div className='poster-form__photo'>
      { !photo ? (
        <div className='poster-form__photo-inner'>
          <div className="poster-form__photo-icon">
            <img src={upload} alt="" />
          </div>
          <div className='poster-form__photo-text'>Generate Photo</div>
        </div>
      ) : (
        <img 
          src={photo} 
          width={250} 
          height={250} 
          alt="Generated Photo"
        />
      ) }
    </div>
  )
}

export default PosterPhoto