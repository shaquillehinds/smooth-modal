import { Easing } from 'react-native-reanimated';
import * as Layout from '../../utils/Layout.const';

export const extraHeight = Layout.relativeY(10);
export const modalHeight = Layout.relativeY(100) + extraHeight;
export const modalContentMaxHeight = modalHeight;

// Needed for bottomModal.styles
export const modalBottomOffset = -modalHeight * 2;

export const modalTimingConfig = (duration = 600) => ({
  duration,
  easing: Easing.elastic(0.8),
});
export const openTimingConfig = modalTimingConfig();
export const halfCloseTimingConfig = modalTimingConfig(400);

export const velocityTimingConfig = (duration = 300) => ({
  duration,
  easing: Easing.bezier(0.25, 0.5, 0.35, 1),
});
export const velocityCloseTimingConfig = velocityTimingConfig(350);

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
