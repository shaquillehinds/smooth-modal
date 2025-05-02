//$lf-ignore
import {
  useSharedValue,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useCallback } from 'react';

// function clamp(val: number, min: number, max: number) {
//   'worklet';
//   return Math.min(Math.max(val, min), max);
// }

//prettier-ignore
// function stretch(val: number,min: number,max: number,maxStretch: number,stretchOn: 'min' | 'max') {
//   'worklet';
//   const isMax = stretchOn === 'max';
//   const limit = isMax ? max : min;
//   const direction = isMax ? 1 : -1;
//   const inBounds = isMax ? val <= max : val >= min;
//   if (inBounds) return val;
//   const overshoot = Math.abs(val - limit);
//   const resistance = maxStretch * (1 - 1 / (overshoot / maxStretch + 1));
//   return limit + resistance * direction;
// }

// function maxStretch(val:number, max: number, stretch: number){
//   'worklet';
//   return val <= max ? val : max - stretch + stretch / ((val - max) / stretch + 1);
// }
function minStretch(val: number, min: number, stretch: number) {
  'worklet';
  //prettier-ignore
  return val >= min ? val : min - stretch + stretch / ((min - val) / stretch + 1);
}

export type OnMoveAnimationProps = {
  posX: number;
  posY: number;
  minPosY: number;
  maxPosY: number;
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
  const onDrag = useCallback((dragProps: OnMoveAnimationProps) => {
    'worklet';
    translationY.value = minStretch(
      prevTranslationY.value + dragProps.posY,
      dragProps.minPosY,
      100
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
