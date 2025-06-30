import { useCallback, useEffect, useRef } from 'react';
import { type NotificationProps } from './notificationModal.types';
import {
  Easing,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  notificationHeight,
  initialNotificationPosition,
  notificationEnterDurationMilliS,
  notificationLeaveDurationMilliS,
  notificationOffset,
} from './notificationModal.constants';
import { isIOS } from '@shaquillehinds/react-native-essentials';

export default function NotificationController({
  notifications,
  setNotifications,
  notification,
  avoidStatusBar,
}: NotificationProps) {
  // how much the notification moves down from it's initial y position, which is 0 (NOT initialNotificationPosition)
  const initialNotificationOffset =
    initialNotificationPosition +
    (isIOS
      ? notificationOffset
      : avoidStatusBar
        ? notificationOffset
        : notificationHeight / 2);

  const notificationDurationMilliS = notification.duration || 5000;
  const notificationVisibleDurationMilliS =
    notificationDurationMilliS - notificationLeaveDurationMilliS;

  const onScreenAmount = useRef(0);
  const exiting = useRef(false);
  const setExiting = useCallback(
    (bool: boolean) => (exiting.current = bool),
    []
  );
  const scale = useSharedValue(isIOS ? 0.5 : avoidStatusBar ? 0.5 : 0);
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
  const enterNotificiationAnimation = useCallback((iosDevice?: boolean) => {
    'worklet';
    if (prevTranslationY.value === 0) return;
    let newVal = notificationOffset + prevTranslationY.value;
    let ageValue = (initialNotificationOffset + notificationOffset) / newVal;
    ageValue += iosDevice ? 0.55 : avoidStatusBar ? 0.63 : 0.75;
    if (ageValue > 1) ageValue = 1;
    if (ageValue < 1) {
      if (ageValue > 0.9) newVal *= ageValue;
      else if (ageValue < (iosDevice ? 0.73 : 0.82)) {
        ageValue = 0;
        newVal = 0;
      } else
        newVal *= ageValue + (iosDevice ? 0.13 : avoidStatusBar ? 0.02 : 0.025);
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

  const handleLeave = useCallback(() => {
    notification.onNotificationLeave?.();
  }, []);

  const onSwipeUp = useCallback(() => {
    'worklet';
    runOnJS(setExiting)(true);
    runOnJS(handleLeave)();
    opacity.value = withTiming(0, { duration: 150 });
    translationY.value = withTiming(initialNotificationPosition, {
      duration: 150,
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
      if (!exiting.current) runOnUI(enterNotificiationAnimation)(isIOS);
    }
    onScreenAmount.current = notifications.length;
  }, [notifications.length]);
  useEffect(() => {
    notification.onNotificationEnter && notification.onNotificationEnter();
    setTimeout(() => {
      setExiting(true);
      runOnUI(leaveNotificationAnimation)();
    }, notificationVisibleDurationMilliS);
  }, []);

  return {
    notifAnimatedStyle,
    onComponentClose,
    onSwipeUp,
    notificationDurationMilliS,
  };
}
