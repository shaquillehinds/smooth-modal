//$lf-ignore
import Animated from 'react-native-reanimated';
import { DragGesture } from '../../gestures/Drag.gesture';
import type {
  BottomSheetScrollViewProps,
  DefaultOnScroll,
} from '../config/bottomSheetModal.types';
import { AnimatedScrollView } from 'react-native-reanimated/lib/typescript/component/ScrollView';
import { bottomScrollViewController } from '../controller/bottomScrollView.controller';

export function BottomSheetScrollView(props: BottomSheetScrollViewProps) {
  const controller = bottomScrollViewController(props);

  if (!controller.context)
    return (
      <Animated.ScrollView
        {...controller.scrollViewProps}
        ref={controller.refScrollView}
        onScroll={controller.onScroll as DefaultOnScroll}
      />
    );

  return (
    <DragGesture
      enableContentScroll
      onDragStart={controller.context.onBeginScroll}
      onDrag={controller.context.onUpdateScroll}
      onDragEnd={controller.context.onEndScroll}>
      <Animated.ScrollView
        {...controller.scrollViewProps}
        ref={
          controller.refScrollView ||
          (controller.context
            .scrollableComponentRef as React.RefObject<AnimatedScrollView>)
        }
        onScrollBeginDrag={controller.assignRef}
        bounces={false}
        onScroll={controller.animatedScrollHandler}>
        {controller.scrollViewProps.children}
      </Animated.ScrollView>
    </DragGesture>
  );
}
