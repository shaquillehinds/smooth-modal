import { Easing } from 'react-native-reanimated';
import * as Layout from '../../utils/Layout.const';

export const extraHeight = Layout.relativeY(10);
export const modalHeight = Layout.relativeY(100) + extraHeight;
export const modalContentMaxHeight = modalHeight;

// Needed for bottomModal.styles
export const modalBottomOffset = -modalHeight * 2;

export const modalTimingConfig = (duration = 500) => ({
  duration,
  easing: Easing.bezier(0.2, 0.32, 0, 1),
});
export const modalTransitionTimingConfig = modalTimingConfig();
export const animateOpenTimingConfig = modalTimingConfig();

export const animateCloseTimingConfig = {
  duration: 120,
  easing: Easing.linear,
};

export const openKeyboardTimingConfig = {
  duration: Layout.isIOS ? 330 : 500,
  easing: Layout.isIOS
    ? Easing.bezier(0, 0.7, 0, 1)
    : Easing.bezier(0, 0.2, 0, 1),
};
export const closeKeyboardTimingConfig = {
  duration: Layout.isIOS ? 450 : 500,
  easing: Easing.bezier(0, 0.2, 0, 1),
};
