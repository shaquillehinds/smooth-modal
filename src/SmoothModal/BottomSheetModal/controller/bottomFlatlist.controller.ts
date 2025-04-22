//$lf-ignore
import { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useContext, useRef } from 'react';
import { BottomSheetContext } from '../components/BottomSheet';
import type {
  BottomSheetFlatlistProps,
  ReanimatedOnScroll,
} from '../config/bottomSheetModal.types';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

export function bottomFlatlistController<T>(
  props: BottomSheetFlatlistProps<T>,
) {
  let { onScroll, refFlatlist, ...flatlistProps } = props;
  const inverted = flatlistProps.inverted;

  const context = useContext(BottomSheetContext);
  const contentSize = useRef(0);
  const layoutHeight = useRef(0);

  const scrollY = context?.scrollY;

  const animatedScrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      if (scrollY) scrollY.value = event.contentOffset.y;
      if (onScroll) {
        onScroll = onScroll as ReanimatedOnScroll;
        onScroll(event);
      }
    },
  });

  if (context && refFlatlist)
    context.scrollableComponentRef.current = refFlatlist.current;

  const onScrollBegin = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!context) {
      if (typeof flatlistProps.onScrollBeginDrag === 'function')
        flatlistProps.onScrollBeginDrag &&
          flatlistProps.onScrollBeginDrag(event);
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
    if (typeof flatlistProps.onLayout === 'function')
      flatlistProps.onLayout && flatlistProps.onLayout(e);
  };

  const onContentSizeChange = (w: number, h: number) => {
    contentSize.current = h;
    if (layoutHeight.current) {
      context!.maxScrollOffset.value = h - layoutHeight.current;
    }
    if (typeof flatlistProps.onContentSizeChange === 'function')
      flatlistProps.onContentSizeChange &&
        flatlistProps.onContentSizeChange(w, h);
  };

  return {
    refFlatlist,
    flatlistProps,
    context,
    onScroll,
    onLayout,
    onScrollBegin,
    onContentSizeChange,
    animatedScrollHandler,
  };
}
