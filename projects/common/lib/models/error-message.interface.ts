/**
 * In most cases this will be the part of the error message that will appear after the field label.
 *
 * {{label}} is required.
 *
 * Date component will subsitute '{label}' for the label in the component.
 * Ex. { required: '{label} is required.' }
 *
 * Note: '{label}' is exported in constant 'LabelReplacementTag'.
 */
export const LabelReplacementTag = '{label}';
export interface ErrorMessage {
  required?: string;
  [key: string]: string;
}

// Function only used with library
export function replaceLabelTag( str: string, value: string ) {
  return str.replace( LabelReplacementTag, value );
}
