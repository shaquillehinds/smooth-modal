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
    e: GestureStateChangeEvent<FlingGestureHandlerEventPayload>
  ) => void;
  direction: keyof typeof Directions;
};

export function SwipeGesture(props: PropsWithChildren<SwipeProps>) {
  // Define a fling gesture in the right direction
  const swipe = Gesture.Fling()
    .direction(Directions[props.direction])
    .numberOfPointers(1)
    .onEnd(props.onActivation);

  return <GestureDetector gesture={swipe}>{props.children}</GestureDetector>;
}
