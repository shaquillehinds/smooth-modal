import { useCallback, useEffect, useRef } from 'react';
import { type NotificationProps } from './notificationModal.types';
import {
  Easing,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  notificationEnterDurationMilliS,
  notificationHeight,
  notificationLeaveDurationMilliS,
  notificationVisibleDurationMilliS,
} from './notificationModal.constants';
import { isIOS, relativeY } from '../utils/Layout.const';

export default function NotificationController({
  notifications,
  setNotifications,
  notification,
}: NotificationProps) {
  // how much the notification will move down when another one lands
  const notificationOffset = notificationHeight + notificationHeight * 0.1;
  // how far off screen is the notification hidden before showing
  const initialNotificationPosition = -(notificationHeight + relativeY(3));
  // how much the notification moves down from it's initial y position, which is 0 (NOT initialNotificationPosition)
  const initialNotificationOffset =
    initialNotificationPosition +
    (isIOS ? notificationOffset : notificationHeight / 2);

  const onScreenAmount = useRef(0);
  const exiting = useRef(false);
  const scale = useSharedValue(isIOS ? 0.5 : 0);
  const opacity = useSharedValue(0);
  const translationY = useSharedValue(initialNotificationPosition);
  const prevTranslationY = useSharedValue(initialNotificationOffset);

  const notifAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: translationY.value }, { scale: scale.value }],
      opacity: opacity.value,
    }),
    []
  );
  const enterNotificiationAnimation = useCallback(() => {
    'worklet';
    if (prevTranslationY.value === 0) return;
    let newVal = notificationOffset + prevTranslationY.value;
    let ageValue = (initialNotificationOffset + notificationOffset) / newVal;
    ageValue += isIOS ? 0.55 : 0.75;
    if (ageValue > 1) ageValue = 1;
    if (ageValue < 1) {
      if (ageValue > 0.9) newVal *= ageValue;
      else if (ageValue < (isIOS ? 0.73 : 0.82)) {
        ageValue = 0;
        newVal = 0;
      } else newVal *= ageValue + (isIOS ? 0.13 : 0.025);
    }
    prevTranslationY.value = newVal;
    scale.value = withTiming(ageValue, {
      duration: notificationEnterDurationMilliS,
      easing: Easing.bezier(0.8, 1.36, 0.6, 1),
    });
    opacity.value = withTiming(ageValue, {
      duration: notificationEnterDurationMilliS,
    });
    translationY.value = withTiming(newVal, {
      duration: notificationEnterDurationMilliS,
      easing: Easing.bezier(0.8, 1.36, 0.6, 1),
    });
  }, []);

  const leaveNotificationAnimation = useCallback(() => {
    'worklet';

    opacity.value = withTiming(0, {
      duration: notificationLeaveDurationMilliS,
    });
  }, []);

  const onComponentClose = useCallback(() => {
    setNotifications((prev) =>
      prev.filter((noti) => noti.id !== notification.id)
    );
    notification.onNotificationLeave && notification.onNotificationLeave();
  }, []);

  useEffect(() => {
    if (notifications.length > onScreenAmount.current) {
      if (!exiting.current) runOnUI(enterNotificiationAnimation)();
    }
    onScreenAmount.current = notifications.length;
  }, [notifications.length]);
  useEffect(() => {
    setTimeout(() => {
      exiting.current = true;
      runOnUI(leaveNotificationAnimation)();
    }, notificationVisibleDurationMilliS);
  }, []);

  return { notifAnimatedStyle, onComponentClose };
}
