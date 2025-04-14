import { type PropsWithChildren } from 'react';
import {
  GestureDetector,
  Gesture,
  Directions,
  type GestureStateChangeEvent,
  type FlingGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

type SwipeProps = {
  onActivation: (
    e: GestureStateChangeEvent<FlingGestureHandlerEventPayload>,
  ) => void;
  direction: keyof typeof Directions;
};

export function SwipeGesture({
  direction,
  onActivation,
  children,
}: PropsWithChildren<SwipeProps>) {
  // Define a fling gesture in the right direction
  const swipe = Gesture.Fling()
    .runOnJS(true)
    .direction(Directions[direction])
    .numberOfPointers(1)
    .onEnd(onActivation);

  return <GestureDetector gesture={swipe}>{children}</GestureDetector>;
}
