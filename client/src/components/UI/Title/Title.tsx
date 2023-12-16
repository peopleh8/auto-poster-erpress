import { FC, createElement } from 'react'
import { TitleProps } from '../../../types/common.types'
import './Title.scss'

const Title: FC<TitleProps> = ({ children, leavel, classes }) => {
  const headingLevel = `h${Math.min(Math.max(leavel, 1), 6)}`
  
  return (
    createElement(headingLevel, { className: `title ${classes}` }, children)
  )
}

export default Title