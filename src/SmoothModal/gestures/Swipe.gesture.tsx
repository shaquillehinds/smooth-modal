import { type PropsWithChildren } from 'react';
import {
  GestureDetector,
  Gesture,
  Directions,
  type GestureStateChangeEvent,
  type TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

type SwipeProps = {
  onActivation: (
    e: GestureStateChangeEvent<TapGestureHandlerEventPayload>
  ) => void | Promise<void>;
  direction: keyof typeof Directions;
};

export function SwipeGesture(props: PropsWithChildren<SwipeProps>) {
  // Define a fling gesture in the right direction
  const swipe = Gesture.Fling()
    .direction(Directions[props.direction])
    .numberOfPointers(1)
    .onEnd((e) => {
      props.onActivation(e);
    });

  return <GestureDetector gesture={swipe}>{props.children}</GestureDetector>;
}
