import {
  isAndroid,
  radiusSizes,
} from '@shaquillehinds/react-native-essentials';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDeviceOrientation } from '@shaquillehinds/react-native-essentials';
import { useRef } from 'react';
import type {
  AnimateComponentAnimationConfig,
  AnimateComponentRef,
} from '@shaquillehinds/react-native-essentials';
import { ScrollView } from 'react-native-gesture-handler';
import type { Animated, LayoutChangeEvent, ViewStyle } from 'react-native';
import type { DropDownModalProps, DropDownValue } from './DropDownModal.types';

export function DropDownModalController<
  T extends DropDownValue = DropDownValue,
>(props: DropDownModalProps<T>) {
  const [showItems, setShowItems] = useState(false);
  const [hasPageY, setHasPageY] = useState(false);
  const { screenHeight, relativeY } = useDeviceOrientation();
  const animateComponentRef = useRef<AnimateComponentRef<number>>(null);
  const animateChevronRef = useRef<AnimateComponentRef<number>>(null);
  const animateAndroidShadowRef = useRef<AnimateComponentRef<number>>(null);
  const pageYRef = useRef<number | null>(null);
  const canRenderDownRef = useRef<boolean | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const maxHeight = useMemo(() => relativeY(30), [relativeY]);

  const label = useMemo(
    () => props.items.find((item) => item.value === props.selectedItem)?.label,
    [props.items, props.selectedItem]
  );
  const canRenderDown = useMemo(() => {
    if (!pageYRef.current) return null;
    if (!showItems && canRenderDownRef.current !== null)
      return canRenderDownRef.current;
    const distanceToBottom = screenHeight - pageYRef.current;

    if (distanceToBottom < maxHeight) canRenderDownRef.current = false;
    else canRenderDownRef.current = true;
    return canRenderDownRef.current;
  }, [showItems, hasPageY]);

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

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    e.currentTarget.measure((_x, _y, _width, _height, _pageX, pageY) => {
      pageYRef.current = pageY || screenHeight / 2;
      setHasPageY(true);
    });
  }, []);

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
  const androidShadowAnimationConfig = useMemo<AnimateComponentAnimationConfig>(
    () => ({
      toValue: 1,
      type: 'timing',
      useNativeDriver: true,
      duration: canRenderDown ? (showItems ? 400 : 200) : showItems ? 600 : 100,
    }),
    [canRenderDown]
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

  const selectionItemsListAnimatedStyle = useCallback(
    (translateY: Animated.Value): ViewStyle => ({
      transform: [{ translateY }],
    }),
    []
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
