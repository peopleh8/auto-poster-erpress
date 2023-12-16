import { FC } from 'react'
import { ButtonProps, LoaderSizes, LoaderStyles } from '../../../types/common.types'
import Loader from '../Loader/Loader'
import './Button.scss'

const Button: FC<ButtonProps> = ({ classes, text, isFetching, icon, ...props }) => {
  return (
    <button 
      className={`btn ${classes} ${isFetching ? 'fetching' : ''}`}
      {...props}
    >
      { icon ? <img src={icon} alt={text} width={20} height={20} /> : text }
      <Loader size={LoaderSizes.Small} theme={LoaderStyles.Light} />
    </button>
  )
}

export default Button