import { ReactNode } from 'react';

export interface IComponentProps {
  className?: string
  name: string
  key?: any
}

export enum StrapEventType {
  onValidateDone
}

export type TEventData = {
  type: StrapEventType
  data: any
}

export enum ValidationResultType {
  Success,
  Error,
  Warning
}

/**
 * Should contain validation result information
 * such as its type and mesage
 */
export type TValidationResult = {
  /**
   * Describe if the result is success, warning or error
   */
  type: ValidationResultType
  /**
   * Optional messages list that should be displayed
   */
  messages?: Array<string>
}

export type TEventCallback = (event: any) => void
