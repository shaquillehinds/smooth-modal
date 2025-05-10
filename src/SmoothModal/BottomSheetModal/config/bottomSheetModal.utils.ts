import type { SharedValue } from 'react-native-reanimated';
import type { SnapPoint } from './bottomSheetModal.types';
import {
  strToNumPercentage,
  strToNumPercentageWorklet,
} from '../../utils/strToNumPercentage';
import { relativeY, relativeYWorklet } from '../../utils/Layout.const';
import { extraHeight } from './bottomSheetModal.constants';

export const getMaxMinSnapPoints = (snapPoints: SharedValue<SnapPoint[]>) => {
  const firstSnapPoint = snapPoints.value[0]!;
  let maxSnapPoint = firstSnapPoint.offset;
  let minSnapPoint = firstSnapPoint.offset;
  for (const snapPoint of snapPoints.value) {
    if (snapPoint.offset < maxSnapPoint) maxSnapPoint = snapPoint.offset;
    if (snapPoint.offset > minSnapPoint) minSnapPoint = snapPoint.offset;
  }
  return { maxSnapPoint, minSnapPoint, firstSnapPoint };
};

export const getMaxMinSnapPointsWorklet = (
  snapPoints: SharedValue<SnapPoint[]>
) => {
  'worklet';
  const firstSnapPoint = snapPoints.value[0]!;
  let maxSnapPoint = firstSnapPoint.offset;
  let minSnapPoint = firstSnapPoint.offset;
  for (const snapPoint of snapPoints.value) {
    if (snapPoint.offset < maxSnapPoint) maxSnapPoint = snapPoint.offset;
    if (snapPoint.offset > minSnapPoint) minSnapPoint = snapPoint.offset;
  }
  return { maxSnapPoint, minSnapPoint, firstSnapPoint };
};

export const percentageToSnapPoint = (p: string | number) => {
  const percentage = strToNumPercentage(p);
  return {
    percentage: percentage / 100,
    offset: -(relativeY(percentage) + extraHeight),
  };
};

export const percentageToSnapPointWorklet = (p: string | number) => {
  'worklet';
  const percentage = strToNumPercentageWorklet(p);
  return {
    percentage: percentage / 100,
    offset: -(relativeYWorklet(percentage) + extraHeight),
  };
};
