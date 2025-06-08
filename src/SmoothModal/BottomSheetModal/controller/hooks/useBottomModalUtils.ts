import { useDeviceOrientation } from '@shaquillehinds/react-native-essentials';
import type { SharedValue } from 'react-native-reanimated';
import type { SnapPoint } from '../../config/bottomSheetModal.types';
import {
  strToNumPercentage,
  strToNumPercentageWorklet,
} from '../../../utils/strToNumPercentage';
import { extraHeightPercent } from '../../config/bottomSheetModal.constants';

export function useBottomModalUtils() {
  const deviceOrientation = useDeviceOrientation();

  const extraHeight = deviceOrientation.relativeY(extraHeightPercent);
  const modalHeight = deviceOrientation.relativeY(100) + extraHeight;
  const modalBottomOffset = -modalHeight * 2;

  const getMaxMinSnapPoints = (snapPoints: SnapPoint[]) => {
    const firstSnapPoint = snapPoints[0]!;
    let maxSnapPoint = firstSnapPoint.offset;
    let minSnapPoint = firstSnapPoint.offset;
    for (const snapPoint of snapPoints) {
      if (snapPoint.offset < maxSnapPoint) maxSnapPoint = snapPoint.offset;
      if (snapPoint.offset > minSnapPoint) minSnapPoint = snapPoint.offset;
    }
    return { maxSnapPoint, minSnapPoint, firstSnapPoint };
  };

  const getMaxMinSnapPointsWorklet = (snapPoints: SharedValue<SnapPoint[]>) => {
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

  const percentageToSnapPoint = (p: string | number) => {
    const percentage = strToNumPercentage(p);
    return {
      percentage: percentage / 100,
      offset: -(deviceOrientation.relativeY(percentage) + extraHeight),
    };
  };

  const percentageToSnapPointWorklet = (
    p: string | number,
    screenHeight: number
  ) => {
    'worklet';
    const percentage = strToNumPercentageWorklet(p);
    const decimal = percentage / 100;
    const snapPointOffset = screenHeight * decimal;
    const extraSnapPointHeight = screenHeight * (extraHeightPercent / 100);
    return {
      percentage: decimal,
      offset: -(snapPointOffset + extraSnapPointHeight),
    };
  };

  return {
    ...deviceOrientation,
    extraHeight,
    modalHeight,
    modalBottomOffset,
    getMaxMinSnapPoints,
    getMaxMinSnapPointsWorklet,
    percentageToSnapPoint,
    percentageToSnapPointWorklet,
  };
}

export type UseBottomModalUtilsReturn = ReturnType<typeof useBottomModalUtils>;
