export enum Unit {
  MM = 'mm',
  CM = 'cm',
  INCH = 'in',
  FT_IN = 'ft_in',
  FT = 'ft',
}

/** All internal dimensions are stored as millimeters */
export type Mm = number & { readonly __brand: unique symbol };

export function mm(value: number): Mm {
  return value as Mm;
}
