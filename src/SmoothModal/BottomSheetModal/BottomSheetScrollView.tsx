import Animated, {
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';
import { DragGesture } from '../gestures/Drag.gesture';
import type { ReanimatedScrollEvent } from 'react-native-reanimated/lib/typescript/hook/commonTypes';
import { useContext } from 'react';
import { BottomSheetContext } from './BottomSheet';
import type { BottomSheetScrollViewProps } from './bottomSheetModal.types';

export function BottomSheetScrollView(props: BottomSheetScrollViewProps) {
  const { onScroll, ...rest } = props;

  const userScrollHandler = (e: ReanimatedScrollEvent) => {
    onScroll && onScroll(e);
  };

  const context = useContext(BottomSheetContext);

  const scrollY = context!.scrollY;

  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
      onScroll && runOnJS(userScrollHandler)(event);
    },
  });

  if (context)
    return (
      <DragGesture
        enableContentScroll
        onDragStart={context.onBeginScroll}
        onDrag={context.onUpdateScroll}
        onDragEnd={context.onEndScroll}>
        <Animated.ScrollView
          {...rest}
          bounces={false}
          onScroll={animatedScrollHandler}>
          {rest.children}
        </Animated.ScrollView>
      </DragGesture>
    );
  return <></>;
}
