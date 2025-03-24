import * as Layout from '../utils/Layout.const';
import { Easing, type WithTimingConfig } from 'react-native-reanimated';

export const yOffset = Layout.relativeY(10);

export const modalContentMaxHeight = Layout.SCREEN_HEIGHT - yOffset;

// Needed for bottomModal.styles
export const modalBottomOffset = -Layout.SCREEN_HEIGHT - yOffset;
export const modalHeight = Layout.relativeY(100);

export const modalTimingConfig: (durationMS?: number) => WithTimingConfig = (
  duration = Layout.isIOS ? 600 : 550
) => ({
  duration,
  easing: Layout.isIOS ? Easing.elastic(0.8) : Easing.elastic(0.8),
});
export const openTimingConfig = modalTimingConfig();
export const velocityCloseTimingConfig = modalTimingConfig(200);
export const halfCloseTimingConfig = modalTimingConfig(400);
