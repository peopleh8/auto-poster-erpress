import { FC } from 'react'
import { FormProps } from '../../../types/common.types'
import './Form.scss'

const Form: FC<FormProps> = ({ 
  children, 
  classes,
  submitHandler
}) => {
  return (
    <form 
      autoComplete='off'
      className={`form ${classes}`}
      onSubmit={submitHandler}
    >
      {children}
    </form>
  )
}

export default Form