import { CAFES_NORTH } from "./cafes/cafesNorth";
import { CAFES_SOUTH } from "./cafes/cafesSouth";
import { CAFES_EAST } from "./cafes/cafesEast";

export const BERLIN_CAFES = [
  ...CAFES_NORTH,
  ...CAFES_SOUTH,
  ...CAFES_EAST
];