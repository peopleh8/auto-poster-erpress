import { FC } from 'react'
import { FieldProps, FieldTypes } from '../../../types/common.types'
import './Field.scss'

const Field: FC<FieldProps> = ({ classes, fieldType, copyValue, ...props }) => {
  return (
    <div className={`field ${classes}`}>
      { fieldType === FieldTypes.Input ? (
        <input 
          className='inp' 
          {...props}
        />
      ) : (
        <textarea
          className='area'
          {...props}
        />
      ) }
    </div>
  )
}

export default Field