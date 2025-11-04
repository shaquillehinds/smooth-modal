import { useDeviceOrientation } from '@shaquillehinds/react-native-essentials';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { type LayoutChangeEvent } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { SpotModalProps } from './SpotModal.types';

export function SpotModalController(props: SpotModalProps) {
  const {
    screenWidth,
    screenHeight,
    relativeX,
    relativeY,
    relativeYWorklet,
    orientation,
  } = useDeviceOrientation();
  const opacity = useSharedValue(0);
  const top2 = useSharedValue(0);
  const left2 = useSharedValue(0);
  const screenModalPaddingX = relativeX(5);
  const screenModalPaddingY = relativeY(5);
  const initialOrientation = useRef(orientation);

  const { pageY, pageX } = useMemo(() => {
    if (orientation === initialOrientation.current)
      return { pageX: props.pageX, pageY: props.pageY };
    return {
      pageX: (props.pageX / screenHeight) * screenWidth,
      pageY: (props.pageY / screenWidth) * screenHeight,
    };
  }, [orientation]);

  const setModalPosition = useCallback(
    ({ width, height }: { width: number; height: number }) => {
      width += screenModalPaddingX;
      height += screenModalPaddingY;
      if (!width) return;
      const distanceToTop = pageY;
      const distanceToBottom = screenHeight - distanceToTop;
      const distanceToLeft = pageX;
      const distanceToRight = screenWidth - distanceToLeft;
      let top = pageY;
      if (pageY >= screenHeight / 2) {
        top = pageY + screenModalPaddingY - height;
        if (height >= distanceToTop) top = top + (height - distanceToTop);
      } else {
        if (height >= distanceToBottom)
          top = pageY - (height - distanceToBottom);
      }
      let left = pageX;
      if (pageX >= screenWidth / 2) {
        left = pageX - width;
        if (width >= distanceToLeft)
          left = left + (width - (distanceToLeft - screenModalPaddingX));
      } else {
        if (width >= distanceToRight) left = pageX - (width - distanceToRight);
      }

      top2.value = top;
      left2.value = left;
      opacity.value = withTiming(1);
    },
    [orientation]
  );

  const onContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const dimensions = e.nativeEvent.layout;
      setModalPosition(dimensions);
    },
    [orientation]
  );

  const onModalBackdropPress = () => {
    props.setShowModal(false);
  };

  useEffect(() => {
    if (!props.showModal) {
      opacity.value = withTiming(0);
    }
  }, [props.showModal]);

  const modalAnimatedStyles = useAnimatedStyle(
    () => ({
      position: 'absolute',
      top: top2.value,
      left: left2.value,
      opacity: opacity.value,
      maxHeight: relativeYWorklet(85),
    }),
    [orientation]
  );

  return { onContentLayout, onModalBackdropPress, modalAnimatedStyles };
}
