//$lf-ignore
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { DragGesture } from '../gestures/Drag.gesture';
import { useContext, useRef } from 'react';
import { BottomSheetContext } from './BottomSheet';
import type { BottomSheetFlatlistProps } from './bottomSheetModal.types';
import type {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

export function BottomSheetFlatlist<T>(props: BottomSheetFlatlistProps<T>) {
  const { onScroll, refFlatlist, ...rest } = props;
  const inverted = rest.inverted;

  const context = useContext(BottomSheetContext);
  const contentSize = useRef(0);
  const layoutHeight = useRef(0);

  const scrollY = context!.scrollY;

  if (context) {
    if (refFlatlist)
      context.scrollableComponentRef.current = refFlatlist.current;
  }

  const onScrollBegin = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!context) {
      if (typeof rest.onScrollBeginDrag === 'function')
        rest.onScrollBeginDrag && rest.onScrollBeginDrag(event);
      return;
    }
    if (context.inverted.value !== inverted) context!.inverted.set(!!inverted);
    const maxScrollOffset = contentSize.current - layoutHeight.current;
    if (context.maxScrollOffset.value !== maxScrollOffset)
      context.maxScrollOffset.set(maxScrollOffset);
    if (!context.scrollableComponentRef.current && refFlatlist)
      context.scrollableComponentRef.current = refFlatlist.current;
  };

  const onLayout = (e: LayoutChangeEvent) => {
    layoutHeight.current = e.nativeEvent.layout.height;
    inverted && context!.inverted.set(true);
    if (contentSize.current) {
      context!.maxScrollOffset.value =
        contentSize.current - e.nativeEvent.layout.height;
    }
    if (typeof rest.onLayout === 'function') rest.onLayout && rest.onLayout(e);
  };

  const onContentSizeChange = (w: number, h: number) => {
    contentSize.current = h;
    if (layoutHeight.current) {
      context!.maxScrollOffset.value = h - layoutHeight.current;
    }
    if (typeof rest.onContentSizeChange === 'function')
      rest.onContentSizeChange && rest.onContentSizeChange(w, h);
  };

  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      onScroll && onScroll(event);
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
          onScrollBeginDrag={onScrollBegin}
          onLayout={onLayout}
          onContentSizeChange={onContentSizeChange}
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
