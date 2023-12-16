import { FC } from 'react'
import classNames from 'classnames'
import { LoaderProps, LoaderSizes, LoaderStyles } from '../../../types/common.types'
import './Loader.scss'

const Loader: FC<LoaderProps> = ({ size, theme, isLoading }) => {
  const sizeClass = size === LoaderSizes.Large ? 'large' : size === LoaderSizes.Medium ? 'medium' : 'small'
  const themeClass = theme === LoaderStyles.Dark ? 'dark' : 'light'
  const isLoadingClass = isLoading ? 'visible' : ''

  const loaderClasses = classNames('loader', sizeClass, themeClass, isLoadingClass)
  
  return (
    <div className={loaderClasses}>
      <svg className='circular' viewBox='25 25 50 50'>
        <circle className='path' cx='50' cy='50' r='20' fill='none' strokeWidth='3' strokeMiterlimit='10'/>
      </svg>
    </div>
  )
}

export default Loader