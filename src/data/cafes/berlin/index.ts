import { CAFES_MITTE } from './districts/mitte';
import { CAFES_PRENZLAUER_BERG } from './districts/prenzlauerBerg';
import { CAFES_KREUZBERG } from './districts/kreuzberg';
import { CAFES_NEUKOELLN } from './districts/neukoelln';

export const BERLIN_CAFES = [
  ...CAFES_MITTE,
  ...CAFES_PRENZLAUER_BERG,
  ...CAFES_KREUZBERG,
  ...CAFES_NEUKOELLN
];