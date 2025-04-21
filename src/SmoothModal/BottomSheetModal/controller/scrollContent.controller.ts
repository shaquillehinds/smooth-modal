//$lf-ignore
import type { FlatList } from 'react-native';
import { runOnJS, type SharedValue, withTiming } from 'react-native-reanimated';
import { halfCloseTimingConfig } from '../bottomSheetModal.constants';
import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import type { DragGestureProps } from '../../gestures/Drag.gesture';

type ScrollContentControllerType = {
  scrollY: SharedValue<number>;
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  scrollActive: SharedValue<boolean>;
  onDragEndGesture: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onDragGesture: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  scrollComponentRef?: React.RefObject<FlatList<any>>;
};

export function scrollContentController({
  scrollActive,
  scrollComponentRef,
  scrollY,
  translationY,
  prevTranslationY,
  backdropOpacity,
  onDragEndGesture,
  onDragGesture,
}: ScrollContentControllerType) {
  const enableScroll = (scrollEnabled: boolean) => {
    scrollComponentRef?.current?.setNativeProps({ scrollEnabled });
  };

  const onBeginScroll = () => {
    'worklet';
    if (scrollY.value > 15) {
      scrollActive.set(true);
    }
  };
  const onUpdateScroll: DragGestureProps['onDrag'] = (e) => {
    'worklet';
    if (scrollActive.value) return;
    if (e.translationY > 0 && scrollY.value <= 15) {
      runOnJS(enableScroll)(false);
      onDragGesture(e);
    } else if (scrollY.value > 0) {
      scrollActive.set(true);
    }
  };
  const onEndScroll: DragGestureProps['onDragEnd'] = (e) => {
    'worklet';
    if (!scrollActive.value) {
      onDragEndGesture(e);
    } else {
      translationY.value = withTiming(
        prevTranslationY.value,
        halfCloseTimingConfig
      );
      backdropOpacity.value = withTiming(1, halfCloseTimingConfig);
    }
    scrollActive.set(false);
    runOnJS(enableScroll)(true);
  };

  return { onBeginScroll, onUpdateScroll, onEndScroll };
}
