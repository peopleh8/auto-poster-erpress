import { ChildType } from './common.types'

export interface ModalTypes {
  children: ChildType
  isOpen: boolean
  setOpen: (payload: boolean) => void
}