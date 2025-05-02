import type { SharedValue } from 'react-native-reanimated';
import type { SnapPoint } from './bottomSheetModal.types';

export function getMaxMinSnapPoints(snapPoints: SharedValue<SnapPoint[]>) {
  'worklet';
  const firstSnapPoint = snapPoints.value[0]!;
  let maxSnapPoint = firstSnapPoint.offset;
  let minSnapPoint = firstSnapPoint.offset;
  for (const snapPoint of snapPoints.value) {
    if (snapPoint.offset < maxSnapPoint) maxSnapPoint = snapPoint.offset;
    if (snapPoint.offset > minSnapPoint) minSnapPoint = snapPoint.offset;
  }
  return { maxSnapPoint, minSnapPoint, firstSnapPoint };
}
