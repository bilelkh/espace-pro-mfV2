export function hasSalesRevenues(sectorId: number | undefined): boolean {
  return !!sectorId && sectorId !== 1 && sectorId !== 4;
}
