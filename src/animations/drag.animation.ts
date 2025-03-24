import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { useCallback } from 'react';

function clamp(val: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(val, min), max);
}

const { width, height } = Dimensions.get('screen');

type OnMoveAnimationProps = {
  posX: number;
  posY: number;
  minPosX?: number;
  maxPosX?: number;
  minPosY?: number;
  maxPosY?: number;
};

export function useDragAnimation() {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

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
  const onDrag = useCallback((props: OnMoveAnimationProps) => {
    'worklet';
    const maxTranslateX = width / 2;
    const maxTranslateY = height / 2;

    translationX.value = clamp(
      prevTranslationX.value + props.posX,
      props.minPosX || -maxTranslateX,
      props.maxPosX || maxTranslateX
    );
    translationY.value = clamp(
      prevTranslationY.value + props.posY,
      props.minPosY || -maxTranslateY,
      props.maxPosY || maxTranslateY
    );
  }, []);
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
