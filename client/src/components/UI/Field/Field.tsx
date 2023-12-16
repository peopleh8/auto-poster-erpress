import { FC, useRef, useEffect } from 'react'
import { FieldProps, FieldTypes } from '../../../types/common.types'
import './Field.scss'

const Field: FC<FieldProps> = ({ classes, fieldType, copyValue, ...props }) => {
  const field = useRef<null | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (field.current) {
      field.current.focus()
      field.current.select()
    }
  }, [copyValue])
  
  return (
    <div className={`field ${classes}`}>
      { fieldType === FieldTypes.Input ? (
        <input 
          className='inp' 
          {...props}
        />
      ) : (
        <textarea
          ref={field}
          className='area'
          {...props}
        />
      ) }
    </div>
  )
}

export default Field