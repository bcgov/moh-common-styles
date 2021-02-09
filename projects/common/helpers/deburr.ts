// Normalize accented characters in a string
export const deburr = (str: string): string => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
