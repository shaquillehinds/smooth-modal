import {
  useSharedValue,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { useCallback } from 'react';

function clamp(val: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(val, min), max);
}

const { width, height } = Dimensions.get('screen');

export type OnMoveAnimationProps = {
  posX: number;
  posY: number;
  minPosX?: number;
  maxPosX?: number;
  minPosY?: number;
  maxPosY?: number;
};

export type OnDragAnimationProps = {
  translationX?: SharedValue<number>;
  translationY?: SharedValue<number>;
  prevTranslationX?: SharedValue<number>;
  prevTranslationY?: SharedValue<number>;
};

export function useDragAnimation(props?: OnDragAnimationProps) {
  const translationX = props?.translationX || useSharedValue(0);
  const translationY = props?.translationY || useSharedValue(0);
  const prevTranslationX = props?.prevTranslationX || useSharedValue(0);
  const prevTranslationY = props?.prevTranslationY || useSharedValue(0);

  const dragAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  const onDragStart = useCallback(() => {
    'worklet';
    prevTranslationX.value = translationX.value;
    prevTranslationY.value = translationY.value;
  }, []);
  const onDrag = useCallback(
    ({
      minPosY,
      maxPosY,
      minPosX,
      maxPosX,
      posX,
      posY,
    }: OnMoveAnimationProps) => {
      'worklet';
      const maxTranslateX = width / 2;
      const maxTranslateY = height / 2;

      translationX.value = clamp(
        prevTranslationX.value + posX,
        minPosX || -maxTranslateX,
        maxPosX || maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + posY,
        minPosY || -maxTranslateY,
        maxPosY || maxTranslateY
      );
    },
    []
  );
  return {
    onDrag,
    onDragStart,
    dragAnimatedStyle,
    translationX,
    translationY,
    prevTranslationX,
    prevTranslationY,
  };
}
