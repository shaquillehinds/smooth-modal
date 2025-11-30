import type { AnimateComponentRef } from '@shaquillehinds/react-native-essentials';
import {
  AnimateComponent,
  BaseText,
  Layout,
  normalize,
  radiusSizes,
  shadowStyles,
  TouchableLayout,
  useDeviceOrientation,
} from '@shaquillehinds/react-native-essentials';
import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import {
  ComponentMounter,
  ModalForegroundWrapper,
  ModalWrapper,
} from '../components';
import { zIndex } from '../styles/styles.const';
import type { DropDownItem, DropDownValue } from './DropDownModal.types';

export function ChevronUp({ size, color }: { size?: number; color?: string }) {
  return (
    <Svg
      width={normalize(size || 24)}
      height={normalize(size || 24)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M19.9195 15.8001C19.7295 15.8001 19.5395 15.7301 19.3895 15.5801L12.8695 9.06008C12.3895 8.58008 11.6095 8.58008 11.1295 9.06008L4.60953 15.5801C4.31953 15.8701 3.83953 15.8701 3.54953 15.5801C3.25953 15.2901 3.25953 14.8101 3.54953 14.5201L10.0695 8.00008C11.1295 6.94008 12.8595 6.94008 13.9295 8.00008L20.4495 14.5201C20.7395 14.8101 20.7395 15.2901 20.4495 15.5801C20.2995 15.7201 20.1095 15.8001 19.9195 15.8001Z"
        fill={color || '#292D32'}
      />
    </Svg>
  );
}

export type DropDownModalProps<T extends DropDownValue = DropDownValue> = {
  title: string;
  items: DropDownItem<T>[];
  selectedItem: T;
  onSelect: (item: T) => void;
  placeholder: string;
};
export function DropDownModal<T extends DropDownValue = DropDownValue>(
  props: DropDownModalProps<T>
) {
  const [showItems, setShowItems] = useState(false);
  const label = useMemo(
    () => props.items.find((item) => item.value === props.selectedItem)?.label,
    [props.items, props.selectedItem]
  );
  const { relativeY } = useDeviceOrientation();
  const animateComponentRef = useRef<AnimateComponentRef<number>>(null);
  const animateChevronRef = useRef<AnimateComponentRef<number>>(null);

  useEffect(() => {
    if (animateComponentRef.current && !showItems)
      animateComponentRef.current.reverse();
    if (animateChevronRef.current) {
      if (showItems) animateChevronRef.current.start();
      else {
        animateChevronRef.current.reverse();
        setTimeout(() => {
          animateChevronRef.current?.reset();
        }, 500);
      }
    }
  }, [showItems]);
  return (
    <Layout style={{ zIndex }}>
      <ComponentMounter
        showComponent={showItems}
        setShowComponent={setShowItems}
        unMountDelayInMilliSeconds={300}
        component={
          <ModalWrapper enableBackgroundContentPress>
            <ModalForegroundWrapper>
              <View style={{ ...shadowStyles({ shadowOpacity: 0.15 }) }}>
                <ScrollView
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  style={{
                    overflow: 'hidden',
                    maxHeight: relativeY(30),
                    minHeight: relativeY(5),
                    borderRadius: radiusSizes.soft,
                  }}
                >
                  <AnimateComponent
                    ref={animateComponentRef}
                    style={(translateY) => ({
                      transform: [{ translateY }],
                    })}
                    initialPosition={-relativeY(110)}
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
                      backgroundColor={'white'}
                      padding={[5, 0, 0, 0]}
                    >
                      {props.items.map((item) => (
                        <TouchableLayout
                          flexDirection="row"
                          spaceBetween
                          padding={[1, 5]}
                          onPress={() => {
                            props.onSelect(item.value);
                            setShowItems(false);
                          }}
                        >
                          <Layout width={'85%'}>
                            <BaseText numberOfLines={1}>{item.label} </BaseText>
                          </Layout>
                          {item.value === props.selectedItem && (
                            <Layout
                              square={3}
                              center
                              centerX
                              borderRadius="full"
                              borderWidth="large"
                              borderColor={'#4A87F2'}
                            >
                              <Layout
                                square={1.25}
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
        activeOpacity={0.8}
        flexDirection="row"
        backgroundColor={'white'}
        borderRadius="soft"
        // borderWidth={'thin'}
        borderColor={'gray'}
        style={{
          zIndex: zIndex + 3,
          ...shadowStyles({ shadowOpacity: 0.1 }),
        }}
        onPress={() => {
          setShowItems((prev) => !prev);
        }}
        padding={[1.5, 5]}
        centerX
      >
        <Layout width={'85%'}>
          <BaseText numberOfLines={1}>
            {label || props.placeholder || 'Select an item'}
          </BaseText>
        </Layout>
        <AnimateComponent
          ref={animateChevronRef}
          initialPosition={-1}
          toPosition={{
            toValue: 1,
            type: 'spring',
            speed: 1,
            bounciness: 1,
            useNativeDriver: true,
          }}
          style={(scaleY) => ({ transform: [{ scaleY }] })}
        >
          <ChevronUp color={'black'} />
        </AnimateComponent>
      </TouchableLayout>
    </Layout>
  );
}
