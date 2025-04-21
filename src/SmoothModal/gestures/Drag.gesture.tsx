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
  enableContentScroll?: boolean;
  onDrag: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  onDragStart: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
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
  enableContentScroll,
  children,
}: PropsWithChildren<DragGestureProps>) {
  const drag = Gesture.Pan()
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

  disable && drag.enabled(!disable);

  const scrollableContentGesture = Gesture.Native();
  const gesture = enableContentScroll
    ? Gesture.Simultaneous(drag, scrollableContentGesture)
    : drag;

  return <GestureDetector gesture={gesture}>{children}</GestureDetector>;
}
