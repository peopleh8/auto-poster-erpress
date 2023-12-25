import { FormEvent, ReactElement, ReactNode } from 'react'

export type ChildType = ReactNode | ReactElement

export interface ChildProps {
  children: ChildType
}

export enum FieldTypes {
  Input = 'input',
  Textarea = 'textarea'
}

export enum ButtonType {
  Button = 'button',
  Submit = 'submit',
  Reset = 'reset',
}

export enum LoaderSizes {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum LoaderStyles {
  Dark = 'dark',
  Light = 'light',
}

export interface LoaderProps {
  size: LoaderSizes
  theme: LoaderStyles
  isLoading?: boolean
}

export interface TitleProps {
  children: ChildType
  leavel: number
  classes: string
}

export interface FormProps {
  children: ChildType
  classes: string
  submitHandler: (e: FormEvent<HTMLFormElement>) => void
}

export interface FieldProps {
  [key: string]: any
}

export interface ButtonProps {
  [key: string]: any
}

export interface LinkProps {
  [key: string]: any
}
