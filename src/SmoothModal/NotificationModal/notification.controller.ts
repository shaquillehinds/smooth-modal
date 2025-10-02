import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  type NotificationProps,
  type NotificationSizeOptions,
} from './notificationModal.types';
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
import {
  isIOS,
  relativeShort,
  useDeviceOrientation,
} from '@shaquillehinds/react-native-essentials';
import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

export default function NotificationController({
  notifications,
  setNotifications,
  notification,
  avoidStatusBar,
  width,
  height,
  contentWidth,
  imageSize,
  messageWidth,
  titleWidth,
  borderRadius,
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

  const { relativeX, relativeY, orientation, normalize } =
    useDeviceOrientation();

  const payloadStyle =
    notification.content.type === 'data'
      ? notification.content.payload
      : ({} as NotificationSizeOptions);

  const w = payloadStyle.width || width;
  const h = payloadStyle.height || height;
  const cW = payloadStyle.contentWidth || contentWidth;
  const iS = payloadStyle.imageSize || imageSize;
  const tW = payloadStyle.titleWidth || titleWidth;
  const mW = payloadStyle.messageWidth || messageWidth;
  const bR = payloadStyle.borderRadius || borderRadius;

  const orientationStyles = useMemo<StyleProp<ViewStyle>>(
    () => ({
      maxWidth: relativeX(95),
      width: relativeX(w || 85),
      borderRadius: relativeShort(bR || 5),
      minHeight: relativeY(5),
      height: h ? relativeY(h) : undefined,
    }),
    [orientation]
  );
  const orientationContentStyles = useMemo<StyleProp<ViewStyle>>(
    () => ({
      minHeight: relativeY(5),
      borderRadius: relativeShort(bR || 5),
      paddingVertical: relativeY(1),
      paddingHorizontal: relativeX(1),
      width: cW ? relativeX(cW) : undefined,
      height: h ? relativeY(h) : undefined,
    }),
    [orientation]
  );
  const orientationImageStyles = useMemo<StyleProp<ImageStyle>>(
    () => ({
      width: relativeX(iS || 12),
      height: relativeX(iS || 12),
      marginRight: relativeX(1),
    }),
    [orientation]
  );
  const orientationTitleStyles = useMemo<StyleProp<TextStyle>>(
    () => ({
      maxWidth: relativeX(80),
      width: relativeX(tW || 70),
      fontWeight: 600,
      fontSize: normalize(14),
    }),
    [orientation]
  );

  const orientationMessageStyles = useMemo<StyleProp<TextStyle>>(
    () => ({
      maxWidth: relativeX(80),
      fontSize: normalize(13),
      width: relativeX(mW || 70),
    }),
    [orientation]
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
    setExiting(true);
    opacity.value = withTiming(0, { duration: 150 });
    translationY.value = withTiming(
      initialNotificationPosition,
      {
        duration: 150,
      },
      () => {
        runOnJS(handleLeave)();
      }
    );
  }, [notification]);

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
    relativeX,
    relativeY,
    orientationStyles,
    orientationContentStyles,
    orientationImageStyles,
    orientationTitleStyles,
    orientationMessageStyles,
    notifAnimatedStyle,
    onComponentClose,
    onSwipeUp,
    notificationDurationMilliS,
  };
}
