//$lf-ignore
import Animated, {
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';
import { DragGesture } from '../gestures/Drag.gesture';
import type { ReanimatedScrollEvent } from 'react-native-reanimated/lib/typescript/hook/commonTypes';
import { useContext } from 'react';
import { BottomSheetContext } from './BottomSheet';
import type { BottomSheetScrollViewProps } from './bottomSheetModal.types';
import { AnimatedScrollView } from 'react-native-reanimated/lib/typescript/component/ScrollView';

export function BottomSheetScrollView(props: BottomSheetScrollViewProps) {
  const { onScroll, refScrollView, ...rest } = props;

  const userScrollHandler = (e: ReanimatedScrollEvent) => {
    onScroll && onScroll(e);
  };

  const context = useContext(BottomSheetContext);

  const scrollY = context!.scrollY;

  if (refScrollView && context) {
    context.scrollableComponentRef.current = refScrollView.current;
  }

  const assignRef = () => {
    if (!context) return;
    if (!context.scrollableComponentRef.current && refScrollView)
      context.scrollableComponentRef.current = refScrollView.current;
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
        <Animated.ScrollView
          {...rest}
          ref={
            refScrollView ||
            (context.scrollableComponentRef as React.RefObject<AnimatedScrollView>)
          }
          bounces={false}
          onScroll={animatedScrollHandler}
        >
          {rest.children}
        </Animated.ScrollView>
      </DragGesture>
    );
  return <></>;
}
