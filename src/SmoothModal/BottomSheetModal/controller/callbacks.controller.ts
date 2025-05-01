//$lf-ignore
import {
  runOnJS,
  runOnUI,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useCallback } from 'react';
import {
  halfCloseTimingConfig,
  modalContentMaxHeight,
  openTimingConfig,
} from '../config/bottomSheetModal.constants';
import { type LayoutChangeEvent } from 'react-native';
import { ModalState } from '../config/bottomSheetModal.types';

type CallbackControllerProps = {
  snapPoints: SharedValue<{ percentage: number; offset: number }[]>;
  modalState: React.MutableRefObject<ModalState>;
  translationX: SharedValue<number>;
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  closedYPosition: SharedValue<number>;
  fullyOpenYPosition: SharedValue<number>;
  disableLayoutAnimation: React.MutableRefObject<boolean>;
  setDisableLayoutAnimation: (bool: boolean) => void;
  setShowModal:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((bool: boolean) => void);
};

export function callbackController(props: CallbackControllerProps) {
  const {
    snapPoints,
    modalState,
    backdropOpacity,
    translationX,
    translationY,
    closedYPosition,
    prevTranslationY,
    fullyOpenYPosition,
    disableLayoutAnimation,
  } = props;
  const setModalState = useCallback((state: ModalState) => {
    modalState.current = state;
  }, []);
  const animateModalOpen = useCallback((height: number) => {
    'worklet';
    if (height > modalContentMaxHeight) height = modalContentMaxHeight;
    const translateYHeight = -height;
    translationY.value = withTiming(translateYHeight, openTimingConfig, () => {
      prevTranslationY.value = translateYHeight;
      runOnJS(setModalState)(ModalState.OPEN);
    });
    backdropOpacity.value = withTiming(
      snapPoints.value[0]?.percentage || 1,
      openTimingConfig
    );
  }, []);

  const animateModalClose = useCallback(() => {
    'worklet';
    translationY.value = withTiming(
      closedYPosition.value,
      halfCloseTimingConfig
    );
    backdropOpacity.value = withTiming(0, halfCloseTimingConfig);
  }, []);

  const onPlatformViewLayout = useCallback((e: LayoutChangeEvent) => {
    translationX.value = -e.nativeEvent.layout.x;
  }, []);

  const onModalContentLayout = useCallback((e: LayoutChangeEvent) => {
    if (modalState.current === ModalState.OPENING) return;
    if (!modalState.current) setModalState(ModalState.OPENING);
    if (snapPoints.value.length && modalState.current === ModalState.OPEN)
      return;
    if (!snapPoints.value.length) {
      if (e.nativeEvent.layout.height > modalContentMaxHeight)
        fullyOpenYPosition.value = -modalContentMaxHeight;
      else fullyOpenYPosition.value = -e.nativeEvent.layout.height;
    }
    if (!disableLayoutAnimation.current)
      runOnUI(animateModalOpen)(
        Math.abs(snapPoints.value[0]?.offset || e.nativeEvent.layout.height)
      );
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
