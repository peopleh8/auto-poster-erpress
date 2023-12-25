import { FC } from 'react'
import { LinkProps } from '../../../types/common.types'
import './Link.scss'

const Link: FC<LinkProps> = ({ href, text, ...props }) => {
  return (
    <a
      className='link'
      href={href}
      target='_blank'
      {...props}
    >
      {text}
    </a>
  )
}

export default Link