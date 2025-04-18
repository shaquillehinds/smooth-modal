import * as Layout from '../utils/Layout.const';
import { Easing } from 'react-native-reanimated';

export const yOffset = Layout.relativeY(10);

export const modalContentMaxHeight = Layout.SCREEN_HEIGHT - yOffset;

// Needed for bottomModal.styles
export const modalBottomOffset = -Layout.SCREEN_HEIGHT * 2.015 - yOffset;
export const modalHeight = Layout.relativeY(100);

export const modalTimingConfig = (duration = Layout.isIOS ? 600 : 550) => ({
  duration,
  easing: Layout.isIOS ? Easing.elastic(0.8) : Easing.elastic(0.8),
});
export const openTimingConfig = modalTimingConfig();
export const velocityCloseTimingConfig = modalTimingConfig(200);
export const halfCloseTimingConfig = modalTimingConfig(400);

export const keyboardOpeningTimingConfig = (
  duration = Layout.isIOS ? 330 : 500
) => ({
  duration,
  easing: Layout.isIOS
    ? Easing.bezier(0, 0.7, 0, 1)
    : Easing.bezier(0, 0.2, 0, 1),
});
export const openKeyboardTimingConfig = keyboardOpeningTimingConfig();
export const keyboardClosingTimingConfig = (
  duration = Layout.isIOS ? 450 : 500
) => ({
  duration,
  easing: Easing.bezier(0, 0.2, 0, 1),
});
export const closeKeyboardTimingConfig = keyboardClosingTimingConfig();
