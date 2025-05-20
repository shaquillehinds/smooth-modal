//$lf-ignore
import {
  runOnJS,
  runOnUI,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useCallback } from 'react';
import {
  modalContentMaxHeight,
  animateOpenTimingConfig,
  animateCloseTimingConfig,
  modalTransitionTimingConfig,
} from '../config/bottomSheetModal.constants';
import { type LayoutChangeEvent } from 'react-native';
import {
  ModalState,
  type AnimateCloseModalProps,
  type SnapPoint,
} from '../config/bottomSheetModal.types';
import {
  getMaxMinSnapPointsWorklet,
  percentageToSnapPointWorklet,
} from '../config/bottomSheetModal.utils';

type CallbackControllerProps = {
  unMounter?: () => void;

  snapPoints: SharedValue<SnapPoint[]>;
  modalState: React.MutableRefObject<ModalState>;
  translationX: SharedValue<number>;
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  closedYPosition: SharedValue<number>;
  fullyOpenYPosition: SharedValue<number>;
  disableLayoutAnimation: React.MutableRefObject<boolean>;
  setDisableLayoutAnimation: (bool: boolean) => void;
  disableCloseOnBackdropPress?: boolean;
  onBackDropPress?: (animateModalClose?: () => void) => void;
  setShowModal?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((bool: boolean) => void);
};

export function callbackController(props: CallbackControllerProps) {
  const {
    unMounter,
    snapPoints,
    modalState,
    backdropOpacity,
    translationX,
    translationY,
    onBackDropPress,
    closedYPosition,
    prevTranslationY,
    fullyOpenYPosition,
    disableLayoutAnimation,
    disableCloseOnBackdropPress,
  } = props;
  const setModalState = useCallback((state: ModalState) => {
    modalState.current = state;
  }, []);
  const animateModalOpen = useCallback((height: number) => {
    'worklet';
    if (height > modalContentMaxHeight) height = modalContentMaxHeight;
    const translateYHeight = -height;
    translationY.value = withTiming(
      translateYHeight,
      animateOpenTimingConfig,
      () => {
        prevTranslationY.value = translateYHeight;
        runOnJS(setModalState)(ModalState.OPEN);
      }
    );
    if (snapPoints.value.length) {
      let maxOpenPosition = fullyOpenYPosition.value;
      if (!maxOpenPosition)
        maxOpenPosition = getMaxMinSnapPointsWorklet(snapPoints).maxSnapPoint;
      backdropOpacity.value = withTiming(
        translateYHeight / maxOpenPosition,
        animateOpenTimingConfig
      );
    } else backdropOpacity.value = withTiming(1, animateOpenTimingConfig);
  }, []);

  const animateModalClose = useCallback((prop?: AnimateCloseModalProps) => {
    'worklet';
    const timing = {
      duration: prop?.duration || animateCloseTimingConfig.duration,
      easing: prop?.easing || animateCloseTimingConfig.easing,
    };
    translationY.value = withTiming(closedYPosition.value, timing);
    backdropOpacity.value = withTiming(0, timing);
  }, []);

  const onPlatformViewLayout = useCallback((e: LayoutChangeEvent) => {
    translationX.value = -e.nativeEvent.layout.x;
  }, []);

  const animateToSnapPoint = useCallback((snapPoint?: SnapPoint) => {
    'worklet';
    if (!snapPoint) return;
    translationY.value = withTiming(
      snapPoint.offset,
      modalTransitionTimingConfig
    );
    backdropOpacity.value = withTiming(
      snapPoint.offset / fullyOpenYPosition.value,
      modalTransitionTimingConfig
    );
  }, []);

  const animateToSnapPointIndex = useCallback((snapPointIndex: number) => {
    'worklet';
    const snapPoint = snapPoints.value[snapPointIndex];
    animateToSnapPoint(snapPoint);
  }, []);

  const animateToPercentage = useCallback((percentage: string | number) => {
    'worklet';
    const snapPoint = percentageToSnapPointWorklet(percentage);
    animateToSnapPoint(snapPoint);
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

  const closeModal = useCallback(
    (delayMS?: number) => {
      delayMS
        ? setTimeout(
            () =>
              props.setShowModal ? props.setShowModal(false) : unMounter?.(),
            delayMS
          )
        : props.setShowModal
          ? props.setShowModal(false)
          : unMounter?.();
      props.setDisableLayoutAnimation(true);
    },
    [unMounter]
  );

  const onModalBackdropPress = useCallback(() => {
    onBackDropPress?.();
    if (disableCloseOnBackdropPress) return;
    closeModal();
    runOnUI(animateModalClose)();
  }, []);

  const onRequestClose = useCallback(() => {
    disableLayoutAnimation.current = true;
    runOnUI(animateModalClose)();
    props.unMounter?.();
  }, []);

  return {
    closeModal,

    animateModalOpen,
    animateModalClose,
    animateToPercentage,
    animateToSnapPointIndex,

    onRequestClose,
    onPlatformViewLayout,
    onModalContentLayout,
    onModalBackdropPress,
  };
}
