export default function map(
  value: number,
  sourceMin: number,
  sourceMax: number,
  destinationMin: number,
  destinationMax: number,
) {
  return (
    destinationMin +
      (destinationMax - destinationMin) *
        ((value - sourceMin) / (sourceMax - sourceMin)) || 0
  );
}
