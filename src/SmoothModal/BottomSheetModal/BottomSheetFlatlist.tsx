//$lf-ignore
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { DragGesture } from '../gestures/Drag.gesture';
import { useContext, useRef } from 'react';
import { BottomSheetContext } from './BottomSheet';
import type {
  BottomSheetFlatlistProps,
  DefaultOnScroll,
  ReanimatedOnScroll,
} from './bottomSheetModal.types';
import type {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

export function BottomSheetFlatlist<T>(props: BottomSheetFlatlistProps<T>) {
  let { onScroll, refFlatlist, ...rest } = props;
  const inverted = rest.inverted;

  const context = useContext(BottomSheetContext);
  const contentSize = useRef(0);
  const layoutHeight = useRef(0);

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
      <Animated.FlatList
        {...rest}
        ref={refFlatlist}
        onScroll={onScroll as DefaultOnScroll}
      />
    );

  if (refFlatlist) context.scrollableComponentRef.current = refFlatlist.current;

  const onScrollBegin = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!context) {
      if (typeof rest.onScrollBeginDrag === 'function')
        rest.onScrollBeginDrag && rest.onScrollBeginDrag(event);
      return;
    }
    if (context.inverted.value !== inverted)
      context!.inverted.value = !!inverted;
    const maxScrollOffset = contentSize.current - layoutHeight.current;
    if (context.maxScrollOffset.value !== maxScrollOffset)
      context.maxScrollOffset.value = maxScrollOffset;
    if (!context.scrollableComponentRef.current && refFlatlist)
      context.scrollableComponentRef.current = refFlatlist.current;
  };

  const onLayout = (e: LayoutChangeEvent) => {
    layoutHeight.current = e.nativeEvent.layout.height;
    inverted && (context!.inverted.value = true);
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
}
