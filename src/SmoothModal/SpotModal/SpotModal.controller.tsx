import { type LayoutChangeEvent } from 'react-native';
import {
  relativeYWorklet,
  useDeviceOrientation,
} from '@shaquillehinds/react-native-essentials';
import { useCallback, useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { SpotModalProps } from './SpotModal.types';

export function SpotModalController(props: SpotModalProps) {
  const { screenWidth, screenHeight, relativeX, relativeY } =
    useDeviceOrientation();
  const opacity = useSharedValue(0);
  const top2 = useSharedValue(0);
  const left2 = useSharedValue(0);
  const screenModalPaddingX = relativeX(5);
  const screenModalPaddingY = relativeY(5);

  const onContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      let { width, height } = e.nativeEvent.layout;
      width += screenModalPaddingX;
      height += screenModalPaddingY;
      if (!width) return;
      const distanceToTop = props.pageY;
      const distanceToBottom = screenHeight - distanceToTop;
      const distanceToLeft = props.pageX;
      const distanceToRight = screenWidth - distanceToLeft;
      let top = props.pageY;
      if (props.pageY >= screenHeight / 2) {
        top = props.pageY + screenModalPaddingY - height;
        if (height >= distanceToTop) top = top + (height - distanceToTop);
      } else {
        if (height >= distanceToBottom)
          top = props.pageY - (height - distanceToBottom);
      }
      let left = props.pageX;
      if (props.pageX >= screenWidth / 2) {
        left = props.pageX - width;
        if (width >= distanceToLeft)
          left = left + (width - (distanceToLeft - screenModalPaddingX));
      } else {
        if (width >= distanceToRight)
          left = props.pageX - (width - distanceToRight);
      }

      top2.value = top;
      left2.value = left;
      opacity.value = withTiming(1);
    },
    [screenWidth]
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
    []
  );

  return { onContentLayout, onModalBackdropPress, modalAnimatedStyles };
}
