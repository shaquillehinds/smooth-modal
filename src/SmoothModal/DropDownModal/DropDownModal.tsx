import { useEffect, useMemo, useRef, useState } from 'react';
import type { DropDownItem, DropDownValue } from './DropDownModal.types';
import {
  AnimateComponent,
  BaseText,
  Layout,
  PressableLayout,
  shadowStyles,
  TouchableLayout,
  useDeviceOrientation,
} from '@shaquillehinds/react-native-essentials';
import type { AnimateComponentRef } from '@shaquillehinds/react-native-essentials';
import {
  ComponentMounter,
  ModalForegroundWrapper,
  ModalWrapper,
} from '../components';
import { View } from 'react-native';
import { zIndex } from '../styles/styles.const';

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

  useEffect(() => {
    if (animateComponentRef.current && !showItems)
      animateComponentRef.current.reverse();
  }, [showItems]);
  return (
    <Layout style={{ zIndex }}>
      <ComponentMounter
        showComponent={showItems}
        setShowComponent={setShowItems}
        unMountDelayInMilliSeconds={300}
        component={
          <ModalWrapper enableBackgroundContentPress>
            <View style={{ ...shadowStyles({ shadowOpacity: 0.15 }) }}>
              <ModalForegroundWrapper>
                <Layout
                  scrollable
                  showsVerticalScrollIndicator={false}
                  borderRadius="soft"
                  style={{
                    overflow: 'hidden',
                    maxHeight: relativeY(30),
                    minHeight: relativeY(5),
                  }}
                  margin={[5, 0, 0, 0]}
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
                    <Layout borderRadius="soft" backgroundColor={'white'}>
                      {props.items.map((item) => (
                        <PressableLayout
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
                        </PressableLayout>
                      ))}
                    </Layout>
                  </AnimateComponent>
                </Layout>
              </ModalForegroundWrapper>
            </View>
          </ModalWrapper>
        }
      />
      <TouchableLayout
        backgroundColor={'white'}
        borderRadius="soft"
        borderWidth={'medium'}
        borderColor={'gray'}
        style={{
          zIndex: 1000 + 1,
          ...shadowStyles({ shadowOpacity: 0.15 }),
        }}
        onPress={() => setShowItems((prev) => !prev)}
        padding={[1, 5]}
        centerX
      >
        <Layout width={'85%'}>
          <BaseText numberOfLines={1}>
            {label || props.placeholder || 'Select an item'}
          </BaseText>
        </Layout>
      </TouchableLayout>
    </Layout>
  );
}
