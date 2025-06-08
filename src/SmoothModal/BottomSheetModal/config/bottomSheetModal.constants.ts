import { isIOS, relativeY } from '@shaquillehinds/react-native-essentials';
import { Easing } from 'react-native-reanimated';

export const extraHeightPercent = 10;
export const extraHeight = relativeY(extraHeightPercent);
export const modalHeight = relativeY(100) + extraHeight;
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
  duration: 300,
  easing: Easing.linear,
};

export const openKeyboardTimingConfig = {
  duration: isIOS ? 330 : 500,
  easing: isIOS ? Easing.bezier(0, 0.7, 0, 1) : Easing.bezier(0, 0.2, 0, 1),
};
export const closeKeyboardTimingConfig = {
  duration: isIOS ? 450 : 500,
  easing: Easing.bezier(0, 0.2, 0, 1),
};
