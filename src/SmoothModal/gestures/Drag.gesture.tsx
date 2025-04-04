import { type PropsWithChildren } from 'react';
import {
  Gesture,
  GestureDetector,
  type GestureStateChangeEvent,
  type PanGestureHandlerEventPayload,
  type GestureUpdateEvent,
} from 'react-native-gesture-handler';

export type DragGestureProps = {
  minDistance?: number;
  onDragStart: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onDrag: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  onDragEnd?: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
};

export function DragGesture(props: PropsWithChildren<DragGestureProps>) {
  const move = Gesture.Pan()
    .minDistance(props.minDistance || 1)
    .onStart((e) => {
      props.onDragStart(e);
    })
    .onUpdate((e) => {
      props.onDrag(e);
    })
    .onEnd((e) => {
      props.onDragEnd && props.onDragEnd(e);
    });

  return <GestureDetector gesture={move}>{props.children}</GestureDetector>;
}
