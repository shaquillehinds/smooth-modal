import type {
  AnimateComponentAnimationConfig,
  AnimateComponentRef,
} from '@shaquillehinds/react-native-essentials';
import {
  isAndroid,
  radiusSizes,
  useDeviceOrientation,
} from '@shaquillehinds/react-native-essentials';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Animated, LayoutChangeEvent, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import type { DropDownModalProps } from './DropDownModal.types';

export function DropDownModalController<T>(props: DropDownModalProps<T>) {
  const [showItems, setShowItems] = useState(false);
  const [hasPageY, setHasPageY] = useState(false);

  const { screenHeight, relativeY } = useDeviceOrientation();

  const pageYRef = useRef<number | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const canRenderDownRef = useRef<boolean | null>(null);
  const animateChevronRef = useRef<AnimateComponentRef<number>>(null);
  const animateComponentRef = useRef<AnimateComponentRef<number>>(null);
  const animateAndroidShadowRef = useRef<AnimateComponentRef<number>>(null);

  const maxHeight = useMemo(
    () => props.expandDistance || relativeY(30),
    [relativeY, props.expandDistance]
  );
  const label = useMemo(
    () => props.items.find((item) => item.value === props.selectedItem)?.label,
    [props.items, props.selectedItem]
  );
  const canRenderDown = useMemo(() => {
    if (props.expandDirection === 'up') return false;
    if (props.expandDirection === 'down') return true;
    if (!pageYRef.current) return null;
    if (!showItems && canRenderDownRef.current !== null)
      return canRenderDownRef.current;
    const distanceToBottom = screenHeight - pageYRef.current;
    if (distanceToBottom < maxHeight) canRenderDownRef.current = false;
    else canRenderDownRef.current = true;
    return canRenderDownRef.current;
  }, [showItems, screenHeight, maxHeight, hasPageY]);
  const androidShadowAnimationConfig = useMemo<AnimateComponentAnimationConfig>(
    () => ({
      toValue: 1,
      type: 'timing',
      useNativeDriver: true,
      duration: canRenderDown ? (showItems ? 400 : 200) : showItems ? 800 : 100,
    }),
    [canRenderDown, showItems]
  );
  const scrollViewStyle = useMemo<ViewStyle>(
    () => ({
      overflow: 'hidden',
      maxHeight: maxHeight,
      minHeight: relativeY(5),
      borderRadius: radiusSizes.soft,
      transform: [
        { translateY: canRenderDown ? 0 : -maxHeight + relativeY(4) },
      ],
    }),
    [canRenderDown, maxHeight, relativeY]
  );
  const chevronAnimationConfig = useMemo<AnimateComponentAnimationConfig>(
    () => ({
      toValue: canRenderDown ? 1 : -1,
      type: 'spring',
      speed: 1,
      bounciness: 1,
      useNativeDriver: true,
    }),
    [canRenderDown]
  );
  const selectionItemsListAnimationConfig =
    useMemo<AnimateComponentAnimationConfig>(
      () => ({
        toValue: 0,
        type: 'spring',
        speed: 1,
        bounciness: 1,
        useNativeDriver: true,
      }),
      []
    );
  const chevronAnimatedStyle = useCallback(
    (scaleY: Animated.Value): ViewStyle => ({
      transform: [{ scaleY }],
    }),
    []
  );

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      e.currentTarget.measure((_x, _y, _width, _height, _pageX, pageY) => {
        pageYRef.current = pageY || screenHeight / 2;
        setHasPageY(true);
      });
      props.containerProps?.onLayout?.(e);
    },
    [props.containerProps?.onLayout]
  );
  const androidShadowAnimatedStyle = useCallback(
    (opacity: Animated.Value): ViewStyle => ({
      opacity,
      right: 0,
      left: 0,
      top: 0,
      bottom: 0,
      position: 'absolute',
      boxShadow: canRenderDown
        ? '5px 18px 25px 0px rgba(0,0,0,0.15)'
        : '5px -18px 25px 0px rgba(0,0,0,0.15)',
      borderRadius: radiusSizes.soft,
      transform: [
        {
          translateY: canRenderDown ? 0 : -maxHeight + relativeY(4),
        },
      ],
    }),
    [canRenderDown, maxHeight, relativeY]
  );

  const selectionItemsListAnimatedStyle = useCallback(
    (translateY: Animated.Value): ViewStyle => ({
      transform: [{ translateY }],
    }),
    []
  );

  useEffect(() => {
    if (animateComponentRef.current && !showItems)
      animateComponentRef.current.reverse();
    if (animateChevronRef.current) {
      if (showItems) animateChevronRef.current.start();
      else {
        animateChevronRef.current.reverse();
      }
    }
    if (isAndroid && !showItems) animateAndroidShadowRef.current?.reverse();
  }, [showItems]);

  return {
    showItems,
    setShowItems,
    label,
    canRenderDown,
    relativeY,
    scrollViewRef,
    animateComponentRef,
    animateChevronRef,
    animateAndroidShadowRef,
    pageYRef,
    canRenderDownRef,
    maxHeight,
    handleLayout,
    androidShadowAnimatedStyle,
    androidShadowAnimationConfig,
    scrollViewStyle,
    selectionItemsListAnimatedStyle,
    selectionItemsListAnimationConfig,
    chevronAnimationConfig,
    chevronAnimatedStyle,
  };
}
