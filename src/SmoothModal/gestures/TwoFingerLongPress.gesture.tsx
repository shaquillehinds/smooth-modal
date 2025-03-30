import { type PropsWithChildren } from 'react';
import {
  GestureDetector,
  Gesture,
  type GestureStateChangeEvent,
  type TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

type TwoFingerLongPressProps = {
  onActivation: (
    e: GestureStateChangeEvent<TapGestureHandlerEventPayload>
  ) => void | Promise<void>;
};

export function TwoFingerLongPressGesture(
  props: PropsWithChildren<TwoFingerLongPressProps>
) {
  const twoFingerLongPress = Gesture.LongPress()
    .runOnJS(true)
    .numberOfPointers(2)
    .minDuration(1000)
    .onStart((e) => {
      props.onActivation(e);
    });
  return (
    <GestureDetector gesture={twoFingerLongPress}>
      {props.children}
    </GestureDetector>
  );
}
