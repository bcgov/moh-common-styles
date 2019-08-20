/**
 * In most cases this will be the part of the error message that will appear after the field label.
 *
 * {{label}} is required.
 */
export interface ErrorMessage {
  required?: string;
  [key: string]: string;
}
