//$lf-ignore
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { DragGesture } from '../gestures/Drag.gesture';
import type { ReanimatedScrollEvent } from 'react-native-reanimated/lib/typescript/hook/commonTypes';
import { useContext } from 'react';
import { BottomSheetContext } from './BottomSheet';
import type { BottomSheetFlatlistProps } from './bottomSheetModal.types';
import type { FlatList } from 'react-native';

export function BottomSheetFlatlist<T>(props: BottomSheetFlatlistProps<T>) {
  const { onScroll, refFlatlist, ...rest } = props;

  const userScrollHandler = (e: ReanimatedScrollEvent) => {
    onScroll && onScroll(e);
  };

  const context = useContext(BottomSheetContext);

  const scrollY = context!.scrollY;

  if (refFlatlist && context) {
    context.scrollableComponentRef.current = refFlatlist.current;
  }

  const assignRef = () => {
    if (!context) return;
    if (!context.scrollableComponentRef.current && refFlatlist)
      context.scrollableComponentRef.current = refFlatlist.current;
  };

  const animatedScrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      runOnJS(assignRef)();
    },
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
          ref={
            refFlatlist ||
            (context.scrollableComponentRef as React.RefObject<FlatList>)
          }
          bounces={false}
          onScroll={animatedScrollHandler}
        />
      </DragGesture>
    );
  return <></>;
}
