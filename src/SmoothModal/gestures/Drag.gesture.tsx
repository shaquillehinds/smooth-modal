import { type PropsWithChildren } from 'react';
import {
  Gesture,
  GestureDetector,
  type GestureStateChangeEvent,
  type PanGestureHandlerEventPayload,
  type GestureUpdateEvent,
} from 'react-native-gesture-handler';

export type DragGestureProps = {
  disable?: boolean;
  minDistance?: number;
  onDragStart: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
  onDrag: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  onDragEnd?: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
};

export function DragGesture({
  disable,
  minDistance,
  onDrag,
  onDragStart,
  onDragEnd,
  children,
}: PropsWithChildren<DragGestureProps>) {
  const move = Gesture.Pan()
    .minDistance(minDistance || 1)
    .onStart(e => {
      'worklet';
      onDragStart(e);
    })
    .onUpdate(e => {
      'worklet';
      onDrag(e);
    })
    .onEnd(e => {
      'worklet';
      onDragEnd?.(e);
    });

  disable && move.enabled(!disable);

  return <GestureDetector gesture={move}>{children}</GestureDetector>;
}
