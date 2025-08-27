//$lf-ignore
import {
  runOnJS,
  runOnUI,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useCallback } from 'react';
import {
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
import type { UseBottomModalUtilsReturn } from './hooks/useBottomModalUtils';

type CallbackControllerProps = {
  unMounter?: () => void;

  snapPoints: SharedValue<SnapPoint[]>;
  modalState: React.MutableRefObject<ModalState>;
  translationX: SharedValue<number>;
  translationY: SharedValue<number>;
  currentSnapPoint: SharedValue<SnapPoint>;
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
  utils: UseBottomModalUtilsReturn;
  onSnapPointReach?: (snapPointIndex: number) => Promise<void> | void;
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
    currentSnapPoint,
    prevTranslationY,
    onSnapPointReach,
    fullyOpenYPosition,
    disableLayoutAnimation,
    disableCloseOnBackdropPress,
  } = props;
  const {
    orientation,
    getMaxMinSnapPointsWorklet,
    percentageToSnapPointWorklet,
  } = props.utils;
  const setModalState = useCallback((state: ModalState) => {
    if (
      modalState.current === ModalState.CLOSING &&
      state !== ModalState.CLOSED
    )
      return;
    modalState.current = state;
  }, []);
  const animateModalOpen = useCallback(
    (height: number, modalHeight: number) => {
      'worklet';
      if (height > modalHeight) height = modalHeight;
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
    },
    [orientation]
  );

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

  const animateToSnapPoint = useCallback(
    (snapPoint?: SnapPoint, index?: number) => {
      'worklet';
      if (!snapPoint) return;
      currentSnapPoint.value = { offset: snapPoint.offset };
      translationY.value = withTiming(
        snapPoint.offset,
        modalTransitionTimingConfig,
        () => {
          typeof index === 'number' &&
            onSnapPointReach &&
            runOnJS(onSnapPointReach)(index);
        }
      );
      backdropOpacity.value = withTiming(
        snapPoint.offset / fullyOpenYPosition.value,
        modalTransitionTimingConfig
      );
    },
    []
  );

  const animateToSnapPointIndex = useCallback((snapPointIndex: number) => {
    'worklet';
    const snapPoint = snapPoints.value[snapPointIndex];
    animateToSnapPoint(snapPoint, snapPointIndex);
  }, []);

  const animateToPercentage = useCallback(
    (percentage: string | number, screenHeight: number) => {
      'worklet';
      const snapPoint = percentageToSnapPointWorklet(percentage, screenHeight);
      animateToSnapPoint(snapPoint);
    },
    [orientation]
  );

  const onModalContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (modalState.current === ModalState.OPENING) return;
      if (!modalState.current) setModalState(ModalState.OPENING);
      if (snapPoints.value.length && modalState.current === ModalState.OPEN)
        return;
      if (!snapPoints.value.length) {
        if (e.nativeEvent.layout.height > props.utils.modalHeight)
          fullyOpenYPosition.value = -props.utils.modalHeight;
        else fullyOpenYPosition.value = -e.nativeEvent.layout.height;
      }
      if (!disableLayoutAnimation.current)
        runOnUI(animateModalOpen)(
          Math.abs(snapPoints.value[0]?.offset || e.nativeEvent.layout.height),
          props.utils.modalHeight
        );
    },
    [orientation]
  );

  const closeModal = useCallback(
    (delayMS?: number) => {
      setModalState(ModalState.CLOSING);
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
      setTimeout(() => {
        setModalState(ModalState.CLOSED);
      }, delayMS || animateCloseTimingConfig.duration);
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
    if (props.setShowModal) {
      props.setShowModal(false);
    } else {
      props.unMounter?.();
    }
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
