import { ChildType } from './common.types'

export interface PosterPhotoProps {
  photo: string
}

export interface DropboxChooserProps {
  children?: ChildType
  onSuccess: (files: any) => void
  onCancel?: () => void
  disabled: boolean
}