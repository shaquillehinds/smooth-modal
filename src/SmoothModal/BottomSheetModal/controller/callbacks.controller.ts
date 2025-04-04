import { runOnUI, withTiming, type SharedValue } from 'react-native-reanimated';
import { useCallback } from 'react';
import {
  halfCloseTimingConfig,
  modalContentMaxHeight,
  openTimingConfig,
  yOffset,
} from '../bottomSheetModal.constants';
import { type LayoutChangeEvent } from 'react-native';

type CallbackControllerProps = {
  translationX: SharedValue<number>;
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  closedYPosition: number;
  disableLayoutAnimation: React.MutableRefObject<boolean>;
  setDisableLayoutAnimation: (bool: boolean) => void;
  setShowModal:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((bool: boolean) => void);
};

export function callbackController(props: CallbackControllerProps) {
  const {
    backdropOpacity,
    translationX,
    translationY,
    closedYPosition,
    prevTranslationY,
    disableLayoutAnimation,
  } = props;
  const animateModalOpen = useCallback((height: number) => {
    'worklet';
    if (height > modalContentMaxHeight) height = modalContentMaxHeight;
    const translateYHeight = -height - yOffset;
    translationY.value = withTiming(translateYHeight, openTimingConfig, () => {
      prevTranslationY.value = translateYHeight;
    });
    backdropOpacity.value = withTiming(1, openTimingConfig);
  }, []);

  const animateModalClose = useCallback(() => {
    'worklet';
    translationY.value = withTiming(closedYPosition, halfCloseTimingConfig);
    backdropOpacity.value = withTiming(0, halfCloseTimingConfig);
  }, []);

  const onPlatformViewLayout = useCallback((e: LayoutChangeEvent) => {
    translationX.value = -e.nativeEvent.layout.x;
  }, []);

  const onModalContentLayout = useCallback((e: LayoutChangeEvent) => {
    if (!disableLayoutAnimation.current)
      runOnUI(animateModalOpen)(e.nativeEvent.layout.height);
  }, []);

  const closeModal = useCallback((delayMS?: number) => {
    delayMS
      ? setTimeout(() => props.setShowModal(false), delayMS)
      : props.setShowModal(false);
    props.setDisableLayoutAnimation(true);
  }, []);

  const onModalBackdropPress = useCallback(() => {
    closeModal();
    runOnUI(animateModalClose)();
  }, []);

  return {
    animateModalClose,
    onPlatformViewLayout,
    onModalContentLayout,
    closeModal,
    onModalBackdropPress,
  };
}
