import { useContext } from 'react';
import { useAnimatedScrollHandler } from 'react-native-reanimated';
import type {
  BottomSheetScrollViewProps,
  ReanimatedOnScroll,
} from '../config/bottomSheetModal.types';
import { BottomSheetContext } from '../components/BottomSheet';

export function bottomScrollViewController(props: BottomSheetScrollViewProps) {
  let { onScroll, refScrollView, ...scrollViewProps } = props;

  const context = useContext(BottomSheetContext);

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

  if (context && refScrollView)
    context.scrollableComponentRef.current = refScrollView.current;

  const assignRef = () => {
    if (!context) return;
    if (!context.scrollableComponentRef.current && refScrollView)
      context.scrollableComponentRef.current = refScrollView.current;
  };

  return {
    context,
    onScroll,
    assignRef,
    refScrollView,
    scrollViewProps,
    animatedScrollHandler,
  };
}
