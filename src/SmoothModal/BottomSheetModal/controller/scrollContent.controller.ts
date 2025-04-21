//$lf-ignore
import { runOnJS, type SharedValue, withTiming } from 'react-native-reanimated';
import { halfCloseTimingConfig } from '../bottomSheetModal.constants';
import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import type { DragGestureProps } from '../../gestures/Drag.gesture';
import type { ScrollComponentRef } from '../bottomSheetModal.types';
import { useCallback } from 'react';

type ScrollContentControllerType = {
  scrollY: SharedValue<number>;
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  scrollActive: SharedValue<boolean>;
  onDragEndGesture: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
  onDragGesture: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  scrollableComponentRef?: ScrollComponentRef;
};

export function scrollContentController({
  scrollActive,
  scrollY,
  translationY,
  prevTranslationY,
  backdropOpacity,
  onDragEndGesture,
  onDragGesture,
  scrollableComponentRef,
}: ScrollContentControllerType) {
  const enableScroll = (scrollEnabled: boolean) => {
    scrollableComponentRef?.current?.setNativeProps({ scrollEnabled });
  };

  const onBeginScroll = useCallback(() => {
    'worklet';
    if (scrollY.value > 15) {
      scrollActive.set(true);
    }
  }, []);
  const onUpdateScroll: DragGestureProps['onDrag'] = useCallback(
    e => {
      'worklet';
      if (scrollActive.value) return;
      if (e.translationY > 0 && scrollY.value <= 15) {
        runOnJS(enableScroll)(false);
        onDragGesture(e);
      } else if (scrollY.value > 0) {
        scrollActive.set(true);
      }
    },
    [enableScroll],
  );
  const onEndScroll: NonNullable<DragGestureProps['onDragEnd']> = useCallback(
    e => {
      'worklet';
      if (!scrollActive.value) {
        onDragEndGesture(e);
      } else {
        translationY.value = withTiming(
          prevTranslationY.value,
          halfCloseTimingConfig,
        );
        backdropOpacity.value = withTiming(1, halfCloseTimingConfig);
      }
      scrollActive.set(false);
      runOnJS(enableScroll)(true);
    },
    [enableScroll],
  );

  return { onBeginScroll, onUpdateScroll, onEndScroll };
}
