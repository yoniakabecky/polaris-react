import clamp from './clamp';
import map from './map';

export default function animationMap(
  value: number,
  sourceMin: number,
  sourceMax: number,
  destinationMin: number,
  destinationMax: number,
) {
  return map(
    clamp(value, sourceMin, sourceMax),
    sourceMin,
    sourceMax,
    destinationMin,
    destinationMax,
  );
}
