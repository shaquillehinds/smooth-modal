//$lf-ignore
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { DragGesture } from '../gestures/Drag.gesture';
import { useContext } from 'react';
import { BottomSheetContext } from './BottomSheet';
import type {
  BottomSheetScrollViewProps,
  DefaultOnScroll,
  ReanimatedOnScroll,
} from './bottomSheetModal.types';
import { AnimatedScrollView } from 'react-native-reanimated/lib/typescript/component/ScrollView';

export function BottomSheetScrollView(props: BottomSheetScrollViewProps) {
  let { onScroll, refScrollView, ...rest } = props;

  const context = useContext(BottomSheetContext);

  const scrollY = context?.scrollY;

  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (scrollY) scrollY.value = event.contentOffset.y;
      if (onScroll) {
        onScroll = onScroll as ReanimatedOnScroll;
        onScroll(event);
      }
    },
  });

  if (!context)
    return (
      <Animated.ScrollView
        {...rest}
        ref={refScrollView}
        onScroll={onScroll as DefaultOnScroll}
      />
    );

  if (refScrollView)
    context.scrollableComponentRef.current = refScrollView.current;

  const assignRef = () => {
    if (!context) return;
    if (!context.scrollableComponentRef.current && refScrollView)
      context.scrollableComponentRef.current = refScrollView.current;
  };

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
        onScrollBeginDrag={assignRef}
        bounces={false}
        onScroll={animatedScrollHandler}
      >
        {rest.children}
      </Animated.ScrollView>
    </DragGesture>
  );
}
