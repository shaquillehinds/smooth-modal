import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { DragGesture } from '../gestures/Drag.gesture';
import type { ReanimatedScrollEvent } from 'react-native-reanimated/lib/typescript/hook/commonTypes';
import { useContext } from 'react';
import { BottomSheetContext } from './BottomSheet';
import type { BottomSheetFlatlistProps } from './bottomSheetModal.types';

export function BottomSheetFlatlist<T>(props: BottomSheetFlatlistProps<T>) {
  const { onScroll, ...rest } = props;

  const userScrollHandler = (e: ReanimatedScrollEvent) => {
    onScroll && onScroll(e);
  };

  const context = useContext(BottomSheetContext);

  const scrollY = context!.scrollY;

  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
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
        onDragEnd={context.onEndScroll}
      >
        <Animated.FlatList
          {...rest}
          bounces={false}
          onScroll={animatedScrollHandler}
        />
      </DragGesture>
    );
  return <></>;
}
