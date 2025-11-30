import type { AnimateComponentRef } from '@shaquillehinds/react-native-essentials';
import {
  AnimateComponent,
  BaseText,
  isAndroid,
  Layout,
  radiusSizes,
  shadowStyles,
  TouchableLayout,
  useDeviceOrientation,
} from '@shaquillehinds/react-native-essentials';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ComponentMounter,
  ModalForegroundWrapper,
  ModalWrapper,
} from '../components';
import { zIndex } from '../styles/styles.const';
import { ChevronUp } from '../svgs/ChevronUp';
import type { DropDownItem, DropDownValue } from './DropDownModal.types';

export type DropDownModalProps<T extends DropDownValue = DropDownValue> = {
  title: string;
  items: DropDownItem<T>[];
  selectedItem: T;
  onSelect: (item: T) => void;
  placeholder: string;
  isDisabled?: boolean;
};
export function DropDownModal<T extends DropDownValue = DropDownValue>(
  props: DropDownModalProps<T>
) {
  const [showItems, setShowItems] = useState(false);
  const [hasPageY, setHasPageY] = useState(false);

  const { screenHeight, relativeY } = useDeviceOrientation();
  const animateComponentRef = useRef<AnimateComponentRef<number>>(null);
  const animateChevronRef = useRef<AnimateComponentRef<number>>(null);
  const animateAndroidShadowRef = useRef<AnimateComponentRef<number>>(null);
  const pageYRef = useRef<number | null>(null);
  const viewRef = useRef<View | null>(null);
  const canRenderDownRef = useRef<boolean | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const maxHeight = useMemo(() => relativeY(30), [relativeY]);
  const handleLayout = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.measure((_x, _y, _width, _height, _pageX, pageY) => {
      pageYRef.current = pageY || screenHeight / 2;
      setHasPageY(true);
    });
  }, []);

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

  return (
    <>
      <View
        collapsable={false}
        ref={viewRef}
        style={{ height: 1, width: 1 }}
        onLayout={handleLayout}
      />

      <Layout style={{ zIndex }}>
        <ComponentMounter
          showComponent={showItems}
          setShowComponent={setShowItems}
          unMountDelayInMilliSeconds={300}
          component={
            <ModalWrapper enableBackgroundContentPress>
              <ModalForegroundWrapper>
                <View style={{ ...shadowStyles({ shadowOpacity: 0.15 }) }}>
                  {isAndroid && (
                    <AnimateComponent
                      ref={animateAndroidShadowRef}
                      initialPosition={0}
                      style={(opacity) => ({
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
                            translateY: canRenderDown
                              ? 0
                              : -maxHeight + relativeY(5),
                          },
                        ],
                      })}
                      autoStart
                      toPosition={{
                        toValue: 1,
                        type: 'timing',
                        useNativeDriver: true,
                        duration: canRenderDown
                          ? showItems
                            ? 400
                            : 200
                          : showItems
                            ? 600
                            : 100,
                      }}
                    />
                  )}

                  <ScrollView
                    ref={scrollViewRef}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    style={{
                      overflow: 'hidden',
                      maxHeight,
                      minHeight: relativeY(5),
                      borderRadius: radiusSizes.soft,
                      transform: [
                        {
                          translateY: canRenderDown
                            ? 0
                            : -maxHeight + relativeY(5),
                        },
                      ],
                    }}
                  >
                    <AnimateComponent
                      ref={animateComponentRef}
                      style={(translateY) => ({
                        transform: [{ translateY }],
                      })}
                      initialPosition={
                        canRenderDown ? -relativeY(110) : relativeY(110)
                      }
                      autoStart
                      toPosition={{
                        toValue: 0,
                        type: 'spring',
                        speed: 1,
                        bounciness: 1,
                        useNativeDriver: true,
                      }}
                    >
                      <Layout
                        borderRadius="soft"
                        backgroundColor={'#FAFAFA'}
                        padding={canRenderDown ? [6, 0, 0, 0] : [0, 0, 6, 0]}
                      >
                        {props.items.map((item) => (
                          <TouchableLayout
                            flexDirection="row"
                            center
                            spaceBetween
                            padding={[1, 5]}
                            onPress={() => {
                              props.onSelect(item.value);
                              setShowItems(false);
                            }}
                          >
                            <Layout width={'85%'}>
                              <BaseText numberOfLines={1}>
                                {item.label}{' '}
                              </BaseText>
                            </Layout>
                            {item.value === props.selectedItem && (
                              <Layout
                                square={2}
                                center
                                centerX
                                borderRadius="full"
                                borderWidth="medium"
                                borderColor={'#4A87F2'}
                              >
                                <Layout
                                  square={0.8}
                                  borderRadius="full"
                                  backgroundColor={'#4A87F2'}
                                />
                              </Layout>
                            )}
                          </TouchableLayout>
                        ))}
                      </Layout>
                    </AnimateComponent>
                  </ScrollView>
                </View>
              </ModalForegroundWrapper>
            </ModalWrapper>
          }
        />
        <TouchableLayout
          disabled={props.isDisabled}
          activeOpacity={1}
          flexDirection="row"
          backgroundColor={'white'}
          borderRadius="soft"
          borderColor={'gray'}
          style={{
            zIndex: zIndex + 3,
            ...shadowStyles({ shadowOpacity: 0.1 }),
          }}
          onPress={(e) => {
            pageYRef.current = e.nativeEvent.pageY;
            setShowItems((prev) => !prev);
          }}
          padding={[1.5, 5]}
          spaceBetween
          center
        >
          <BaseText numberOfLines={1}>
            {label || props.placeholder || 'Select an item'}
          </BaseText>
          {canRenderDown === null ? undefined : (
            <AnimateComponent
              ref={animateChevronRef}
              initialPosition={canRenderDown ? -1 : 1}
              toPosition={{
                toValue: canRenderDown ? 1 : -1,
                type: 'spring',
                speed: 1,
                bounciness: 1,
                useNativeDriver: true,
              }}
              style={(scaleY) => ({ transform: [{ scaleY }] })}
            >
              <ChevronUp color={'black'} />
            </AnimateComponent>
          )}
        </TouchableLayout>
      </Layout>
    </>
  );
}
