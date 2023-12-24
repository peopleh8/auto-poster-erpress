import { useEffect, useCallback, useMemo, FC } from 'react'
import Button from './UI/Button/Button'
import { ButtonType } from '../types/common.types'
import { DropboxChooserProps } from '../types/poster.types';

const DropboxChooser: FC<DropboxChooserProps> = ({ children, onSuccess, onCancel, disabled }) => {
  const options = useMemo(
    () => ({
      success: (files: any) => {
        console.log('success', files)
        onSuccess && onSuccess(files)
      },
      cancel: () => {
        console.log('cancel')
        onCancel && onCancel()
      },
      linkType: 'direct',
      multiselect: false,
      extensions: ['.png', '.jpg', '.jpeg'],
      folderselect: false,
    }),
    [onSuccess, onCancel]
  );

  useEffect(() => {
    const script = document.createElement('script')
    script.setAttribute('src', import.meta.env.VITE_DROPBOX_SDK_URL)
    script.setAttribute('id', import.meta.env.VITE_DROPBOX_SCRIPT_ID)
    script.setAttribute('data-app-key', import.meta.env.VITE_DROPBOX_APP_KEY)
    document.body.appendChild(script)
  }, [])

  const handleChoose = useCallback(() => {
    //@ts-ignore
    if (window.Dropbox) {
      //@ts-ignore
      window.Dropbox.choose(options)
    }
  }, [options])

  return (
    <div onClick={handleChoose}>
      {
        children || 
        <Button 
          classes='poster-form__btn' 
          text='Get/Set DropBox Image'
          type={ButtonType.Button}
          disabled={disabled}
        />
      }
    </div>
  );
}

export default DropboxChooser